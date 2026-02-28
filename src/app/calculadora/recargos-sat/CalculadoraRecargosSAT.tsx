'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tasas de recargos SAT — Art. 21 CFF (históricas)
// La tasa mensual vigente la publica el SAT en el DOF cada año
const TASAS_RECARGOS: { anio: number; mensual: number; moratoria: number }[] = [
    { anio: 2026, mensual: 1.47, moratoria: 1.13 },
    { anio: 2025, mensual: 1.47, moratoria: 1.13 },
    { anio: 2024, mensual: 1.47, moratoria: 1.13 },
    { anio: 2023, mensual: 1.47, moratoria: 1.13 },
    { anio: 2022, mensual: 1.47, moratoria: 1.13 },
    { anio: 2021, mensual: 1.47, moratoria: 1.13 },
    { anio: 2020, mensual: 1.47, moratoria: 1.13 },
]

// INPC para actualización (Art. 17-A CFF) — meses recientes
const INPC_INDICES: Record<string, number> = {
    '2026-01': 140.850, '2025-12': 140.200, '2025-11': 139.600,
    '2025-10': 138.900, '2025-09': 138.200, '2025-08': 137.500,
    '2025-07': 137.100, '2025-06': 136.800, '2025-05': 136.400,
    '2025-04': 136.000, '2025-03': 135.500, '2025-02': 135.100,
    '2025-01': 134.800, '2024-12': 134.200, '2024-11': 133.600,
    '2024-10': 133.000, '2024-09': 132.400, '2024-06': 131.000,
    '2024-01': 128.500, '2023-01': 120.000, '2022-01': 109.000,
}

export default function CalculadoraRecargosSAT() {
    const [monto, setMonto] = useState('50000')
    const [fechaOmision, setFechaOmision] = useState('2024-06')
    const [fechaPago, setFechaPago] = useState('2026-01')
    const [incluirActualizacion, setIncluirActualizacion] = useState(true)
    const [anioRecargos, setAnioRecargos] = useState('2026')
    const [modalidad, setModalidad] = useState<'normal' | 'moratoria'>('normal')

    const tasaData = TASAS_RECARGOS.find(t => t.anio === parseInt(anioRecargos)) || TASAS_RECARGOS[0]

    const resultado = useMemo(() => {
        const contrib = parseFloat(monto) || 0
        if (contrib <= 0) return null

        // Calcular meses transcurridos
        const [yanioOmision, mesOmision] = fechaOmision.split('-').map(Number)
        const [anioPago, mesPago] = fechaPago.split('-').map(Number)
        const mesesTotal = (anioPago - yanioOmision) * 12 + (mesPago - mesOmision)
        if (mesesTotal <= 0) return null

        // Tasa mensual
        const tasaMensual = modalidad === 'moratoria' ? tasaData.moratoria : tasaData.mensual
        const recargos = contrib * (tasaMensual / 100) * mesesTotal

        // Actualización Art. 17-A CFF (factor de actualización)
        let actualizacion = 0
        let factorActualizacion = 1
        if (incluirActualizacion) {
            const inpcPago = INPC_INDICES[fechaPago] || INPC_INDICES['2026-01']
            const inpcOmision = INPC_INDICES[fechaOmision] || INPC_INDICES['2024-01']
            factorActualizacion = inpcPago / inpcOmision
            actualizacion = contrib * (factorActualizacion - 1)
        }

        const contribActualizada = contrib * factorActualizacion
        const total = contribActualizada + recargos

        return {
            contrib, mesesTotal, tasaMensual, recargos,
            actualizacion, factorActualizacion, contribActualizada, total
        }
    }, [monto, fechaOmision, fechaPago, incluirActualizacion, anioRecargos, modalidad])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💸</span><span>Recargos SAT · Art. 21 CFF + Actualización Art. 17-A</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Recargos SAT 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula los recargos por pago extemporáneo al SAT:
                    <strong className="text-[var(--color-accent)]"> tasa mensual Art. 21 CFF</strong> sobre la contribución
                    actualizada por INPC (Art. 17-A CFF).
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                    { v: 'normal' as const, icon: '📋', label: 'Recargos normales', sub: `${tasaData.mensual}%/mes` },
                    { v: 'moratoria' as const, icon: '📉', label: 'Convenio / moratoria', sub: `${tasaData.moratoria}%/mes` },
                ] as const).map(t => (
                    <button key={t.v} onClick={() => setModalidad(t.v)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${modalidad === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">{t.sub}</p>
                    </button>
                ))}
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Contribución omitida ($)</label>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año de referencia (tasas)</label>
                        <select value={anioRecargos} onChange={e => setAnioRecargos(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {TASAS_RECARGOS.map(t => <option key={t.anio} value={t.anio}>{t.anio} — {t.mensual}%/mes</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Mes de la omisión (AAAA-MM)</label>
                        <input type="month" value={fechaOmision} onChange={e => setFechaOmision(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Mes de pago (AAAA-MM)</label>
                        <input type="month" value={fechaPago} onChange={e => setFechaPago(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>
                <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                    <input type="checkbox" checked={incluirActualizacion} onChange={e => setIncluirActualizacion(e.target.checked)} className="w-4 h-4 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-white">Incluir actualización Art. 17-A CFF (factor INPC)</p>
                        <p className="text-[10px] text-white/40">Recomendado: el SAT siempre cobra la actualización sobre la contribución</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💸 Adeudo total al SAT</h2>
                    <div className="space-y-2 text-sm">
                        {[
                            { l: 'Contribución original', v: resultado.contrib },
                            ...(resultado.actualizacion > 0 ? [
                                { l: `Factor actualización (${resultado.factorActualizacion.toFixed(4)})`, v: resultado.actualizacion },
                                { l: 'Contribución actualizada', v: resultado.contribActualizada },
                            ] : []),
                            { l: `Recargos (${resultado.tasaMensual}% × ${resultado.mesesTotal} meses)`, v: resultado.recargos },
                            { l: 'TOTAL A PAGAR AL SAT', v: resultado.total, accent: true },
                        ].map((r, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>${fmtMXN(r.v)}</span>
                            </div>
                        ))}
                        <p className="text-[10px] text-white/30 text-right">{resultado.mesesTotal} meses de retraso</p>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 21 CFF recargos. Art. 17-A CFF factor de actualización INPC. Tasas y factores estimados. El SAT puede usar índices distintos. Consulta con contador.
            </p>
        </main>
    )
}
