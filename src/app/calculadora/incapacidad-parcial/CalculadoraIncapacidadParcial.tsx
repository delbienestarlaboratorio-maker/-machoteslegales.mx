'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getSMG, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

// Tabla parcial Art. 514 LFT — incapacidades permanentes parciales más comunes
const TABLA_INCAPACIDADES = [
    { parte: 'Pérdida total de un ojo', pct: 50, art: '514 Fr. 1' },
    { parte: 'Pérdida de agudeza visual un ojo (50%)', pct: 20, art: '514 Fr. 2' },
    { parte: 'Pérdida del pabellón de la oreja', pct: 15, art: '514 Fr. 13' },
    { parte: 'Pérdida de la mano dominante', pct: 70, art: '514 Fr. 51' },
    { parte: 'Pérdida de la mano no dominante', pct: 60, art: '514 Fr. 52' },
    { parte: 'Pérdida del pulgar (mano dominante)', pct: 30, art: '514 Fr. 54' },
    { parte: 'Pérdida del índice (mano dominante)', pct: 20, art: '514 Fr. 58' },
    { parte: 'Pérdida de pie (desarticulación)', pct: 60, art: '514 Fr. 110' },
    { parte: 'Pérdida de función de una rodilla (artrodesis)', pct: 40, art: '514 Fr. 120' },
    { parte: 'Sordera total unilateral', pct: 20, art: '514 Fr. 27' },
    { parte: 'Sordera total bilateral', pct: 60, art: '514 Fr. 26' },
    { parte: 'Pérdida del brazo (arriba del codo)', pct: 70, art: '514 Fr. 47' },
    { parte: 'Hernia inguinal operada con recidiva', pct: 15, art: '514 Fr. 170' },
    { parte: 'Fractura de columna vertebral (sin paraplejia)', pct: 40, art: '514 Fr. 185' },
    { parte: 'Paraplejia completa', pct: 100, art: '514 Fr. 190' },
    { parte: 'Pérdida de función de hombro', pct: 25, art: '514 Fr. 43' },
    { parte: 'Epicondilitis crónica resistente a tratamiento', pct: 10, art: '514 Fr. 89' },
    { parte: 'Trastorno depresivo crónico por trabajo', pct: 30, art: 'Criterio médico' },
]

export default function CalculadoraIncapacidadParcial() {
    const [sdActual, setSdActual] = useState('600')
    const [pctIncapacidad, setPctIncapacidad] = useState('50')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [busqueda, setBusqueda] = useState('')

    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sd = parseFloat(sdActual) || 0
        const pct = parseFloat(pctIncapacidad) || 0
        if (sd <= 0 || pct <= 0) return null

        // Art. 495 LFT: Incapacidad permanente PARCIAL = % × 1095 días de salario
        // 1095 = 3 × 365 (tres años)
        const diasIndemnizacion = 1095
        const montoIndemnizacion = sd * diasIndemnizacion * (pct / 100)

        // IMSS cubre 70% del SDI durante incapacidad temporal, la diferencia la paga el patrón
        // Para permanente: pensión vitalicia proporcional
        const pensionMensualIMSS = sd * 0.70 * 30 * (pct / 100) // estimado mensual
        const montoIMSS = pensionMensualIMSS * 12 * 10 // 10 años de pensión estimados

        return { sd, pct, montoIndemnizacion, diasIndemnizacion, pensionMensualIMSS }
    }, [sdActual, pctIncapacidad, anioCalculo])

    const tablaFiltrada = busqueda.trim()
        ? TABLA_INCAPACIDADES.filter(t => t.parte.toLowerCase().includes(busqueda.toLowerCase()))
        : TABLA_INCAPACIDADES

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🦺</span><span>Incapacidad Parcial · Art. 495 y 514 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Incapacidad Permanente Parcial</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La ley fija el porcentaje de inhabilidad según la lesión (Art. 514 LFT).
                    La indemnización es: <strong className="text-[var(--color-accent)]">% × 1,095 días de salario</strong> (Art. 495 LFT).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold">📋 Datos</h2>
                    <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none">
                        {getAniosDisponibles().map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario Diario Integrado ($)</label>
                        <input type="number" value={sdActual} onChange={e => setSdActual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">SMG {anioCalculo}: ${fmtMXN(smg.diario)}/día</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Porcentaje de incapacidad (%)</label>
                        <input type="number" value={pctIncapacidad} onChange={e => setPctIncapacidad(e.target.value)} min="1" max="100"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Consulta la tabla abajo o usa el % del dictamen IMSS</p>
                    </div>
                </div>

                {resultado && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                            <p className="text-xs text-[var(--color-accent)] mb-1">Indemnización Art. 495 LFT</p>
                            <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.montoIndemnizacion)}</p>
                            <p className="text-[10px] text-[var(--color-accent)]/60">{resultado.pct}% × {resultado.diasIndemnizacion} días × ${fmtMXN(resultado.sd)}</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                            <p className="text-xs text-blue-400 mb-1">Pensión IMSS estimada/mes</p>
                            <p className="text-2xl font-bold text-blue-400 font-mono">${fmtMXN(resultado.pensionMensualIMSS)}</p>
                            <p className="text-[10px] text-blue-400/60">70% SDI × {resultado.pct}% × 30 días (estimado)</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-white font-bold text-sm flex-1">📋 Tabla de incapacidades Art. 514 LFT</h3>
                    <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar lesión..."
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs w-40 focus:border-[var(--color-accent)] focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                    {tablaFiltrada.map((item, i) => (
                        <button key={i} onClick={() => setPctIncapacidad(String(item.pct))}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 text-left transition-all cursor-pointer">
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white">{item.parte}</p>
                                <p className="text-[10px] text-white/40">{item.art}</p>
                            </div>
                            <span className="text-[var(--color-accent)] font-bold text-sm">{item.pct}%</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 495 LFT: % × 1,095 días salario. Art. 514 tabla de valuación de incapacidades. Pensión IMSS aproximada, el IMSS calcula el monto exacto. No sustituye dictamen médico.
            </p>
        </main>
    )
}
