'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

export default function CalculadoraDanosVehiculo() {
    const [valorVehiculo, setValorVehiculo] = useState('350000')
    const [pctDanio, setPctDanio] = useState('40')
    const [tieneSeguro, setTieneSeguro] = useState(true)
    const [deducible, setDeducible] = useState('10000')
    const [diasIncapacidad, setDiasIncapacidad] = useState('15')
    const [gastosMedicos, setGastosMedicos] = useState('25000')
    const [lucrosCesantes, setLucrosCesantes] = useState('500')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const uma = getUMA(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const veh = parseFloat(valorVehiculo) || 0
        const pct = (parseFloat(pctDanio) || 0) / 100
        const ded = parseFloat(deducible) || 0
        const dias = parseInt(diasIncapacidad) || 0
        const med = parseFloat(gastosMedicos) || 0
        const lucros = parseFloat(lucrosCesantes) || 0

        if (veh <= 0) return null

        const danioVehiculo = veh * pct
        const deducibleEfectivo = tieneSeguro ? ded : 0
        const danioNeto = Math.max(danioVehiculo - deducibleEfectivo, 0)

        // Incapacidad laboral Art. 1915 CCF: 3 veces UMA diaria × días de incapacidad
        const indemnIncapacidad = uma.diaria * 3 * dias

        const totalDanios = danioNeto + med + indemnIncapacidad + (lucros * dias)

        return { danioVehiculo, deducibleEfectivo, danioNeto, indemnIncapacidad, med, lucros, dias, totalDanios }
    }, [valorVehiculo, pctDanio, tieneSeguro, deducible, diasIncapacidad, gastosMedicos, lucrosCesantes, anioCalculo])

    const escenarios = [
        { label: 'Golpe leve (rayón)', pct: 10 },
        { label: 'Daño moderado (puerta)', pct: 25 },
        { label: 'Daño grave (colisión)', pct: 50 },
        { label: 'Pérdida total', pct: 100 },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🚗</span><span>Daños · Art. 1915 CCF + Ley de Seguros</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Daños por Accidente Vehicular</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima la indemnización total: daños al vehículo, gastos médicos y
                    <strong className="text-[var(--color-accent)]"> incapacidad laboral 3 UMAs/día</strong> (Art. 1915 CCF).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
                {escenarios.map(e => (
                    <button key={e.pct} onClick={() => setPctDanio(String(e.pct))}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${parseInt(pctDanio) === e.pct ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        {e.label} ({e.pct}%)
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor del vehículo ($)</label>
                        <input type="number" value={valorVehiculo} onChange={e => setValorVehiculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">% de daño al vehículo: {pctDanio}%</label>
                        <input type="range" min="0" max="100" step="5" value={pctDanio} onChange={e => setPctDanio(e.target.value)} className="w-full mt-3" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Gastos médicos ($)</label>
                        <input type="number" value={gastosMedicos} onChange={e => setGastosMedicos(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días de incapacidad laboral</label>
                        <input type="number" value={diasIncapacidad} onChange={e => setDiasIncapacidad(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Art. 1915 CCF: 3 × UMA diaria ({uma.anio}: ${fmtMXN(uma.diaria * 3)}/día)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Lucro cesante diario ($) — ingreso que dejaste de percibir</label>
                        <input type="number" value={lucrosCesantes} onChange={e => setLucrosCesantes(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año UMA</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}/día</option>)}
                        </select>
                    </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={tieneSeguro} onChange={e => setTieneSeguro(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm text-white/80">El responsable tiene seguro de autos</span>
                </label>
                {tieneSeguro && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Deducible del seguro ($)</label>
                        <input type="number" value={deducible} onChange={e => setDeducible(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">El deducible lo paga el asegurado, no se indemniza</p>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Indemnización total estimada</h2>
                    <div className="space-y-2 text-sm mb-4">
                        {[
                            { l: `Daño al vehículo (${pctDanio}% de $${fmtMXN(parseFloat(valorVehiculo))})`, v: resultado.danioVehiculo, c: 'text-white' },
                            ...(resultado.deducibleEfectivo > 0 ? [{ l: 'Menos deducible del seguro', v: -resultado.deducibleEfectivo, c: 'text-red-400' }] : []),
                            { l: '= Daño vehículo neto', v: resultado.danioNeto, c: 'text-white' },
                            { l: 'Gastos médicos', v: resultado.med, c: 'text-blue-400' },
                            { l: `Incapacidad laboral ${resultado.dias}d × 3 UMAs ($${fmtMXN(uma.diaria * 3)}/d)`, v: resultado.indemnIncapacidad, c: 'text-purple-400' },
                            ...(resultado.lucros > 0 ? [{ l: `Lucro cesante ${resultado.dias}d × $${resultado.lucros}/d`, v: resultado.lucros * resultado.dias, c: 'text-orange-400' }] : []),
                            { l: 'TOTAL a reclamar', v: resultado.totalDanios, c: 'text-[var(--color-accent)]' },
                        ].map((r, i, arr) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${i === arr.length - 1 ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${i === arr.length - 1 ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.c} ${i === arr.length - 1 ? 'text-lg' : 'text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 1915 CCF: 3 × UMA diaria por día de incapacidad. Lucro cesante Art. 2110 CCF. No sustituye peritaje o asesoría legal.
            </p>
        </main>
    )
}
