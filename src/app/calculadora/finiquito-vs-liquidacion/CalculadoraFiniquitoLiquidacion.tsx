'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles, diasVacacionesLFT } from '@/data/legal-constants'

export default function CalculadoraFiniquitoLiquidacion() {
    const [sd, setSd] = useState('800')
    const [anios, setAnios] = useState('5')
    const [meses, setMeses] = useState('3')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [modo, setModo] = useState<'ambos' | 'finiquito' | 'liquidacion'>('ambos')

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    type Resultado = {
        salarioDiario: number
        aniosTrabajados: number
        // Finiquito
        diasVac: number
        vacaciones: number
        primaVac: number
        aguinaldo: number
        totalFiniquito: number
        // Liquidación (todo lo de finiquito + extras)
        veinteDiasPorAnio: number
        tresMeses: number
        primaAntiguedad: number
        totalLiquidacion: number
    }

    const resultado: Resultado | null = useMemo(() => {
        const salarioDiario = parseFloat(sd) || 0
        const aniosTrabajados = parseFloat(anios) || 0
        if (salarioDiario <= 0 || aniosTrabajados <= 0) return null

        // ─── Finiquito (aplica SIEMPRE: renuncia o despido) ───────────────
        const diasVac = diasVacacionesLFT(Math.floor(aniosTrabajados))
        const fraccion = aniosTrabajados % 1
        const vacaciones = salarioDiario * diasVac * (fraccion > 0 ? fraccion : 1)
        const primaVac = vacaciones * 0.25
        const aguinaldo = salarioDiario * 15 * (fraccion > 0 ? fraccion : 1)
        const totalFiniquito = vacaciones + primaVac + aguinaldo

        // ─── Liquidación (solo despido injustificado — Art. 48/50 LFT) ────
        const veinteDiasPorAnio = salarioDiario * 20 * aniosTrabajados
        const tresMeses = salarioDiario * 30 * (parseInt(meses) || 3)
        const sdParaPrima = Math.min(salarioDiario, smg.general * 2)
        const primaAntiguedad = sdParaPrima * 12 * aniosTrabajados
        const totalLiquidacion = totalFiniquito + veinteDiasPorAnio + tresMeses + primaAntiguedad

        return { salarioDiario, aniosTrabajados, diasVac, vacaciones, primaVac, aguinaldo, totalFiniquito, veinteDiasPorAnio, tresMeses, primaAntiguedad, totalLiquidacion }
    }, [sd, anios, meses, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Finiquito vs Liquidación · Arts. 46-52 y 87 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Comparador <span className="gradient-gold">Finiquito vs Liquidación</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    <strong className="text-white">Finiquito</strong> = lo que te pagan siempre (renuncia o despido).
                    <strong className="text-[var(--color-accent)]"> Liquidación</strong> = finiquito + 3 meses + 20 días/año, solo si te despiden sin causa.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                {([
                    { v: 'ambos' as const, label: 'Ver ambos' },
                    { v: 'finiquito' as const, label: 'Solo Finiquito' },
                    { v: 'liquidacion' as const, label: 'Solo Liquidación' },
                ] as const).map(t => (
                    <button key={t.v} onClick={() => setModo(t.v)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${modo === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold">📋 Datos</h2>
                    <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none">
                        {getAniosDisponibles().map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario Diario Integrado ($)</label>
                        <input type="number" value={sd} onChange={e => setSd(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años trabajados (puede ser decimal)</label>
                        <input type="number" value={anios} onChange={e => setAnios(e.target.value)} step="0.25"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses (3 meses Art. 50 LFT)</label>
                        <select value={meses} onChange={e => setMeses(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {[1, 2, 3, 6].map(m => <option key={m} value={m}>{m} mes{m > 1 ? 'es' : ''}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className={`grid gap-4 ${modo === 'ambos' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {(modo === 'ambos' || modo === 'finiquito') && (
                        <div className="glass-card p-5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">📄</span>
                                <div>
                                    <h3 className="text-white font-bold">Finiquito</h3>
                                    <p className="text-[10px] text-white/50">Aplica en RENUNCIA y DESPIDO</p>
                                </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                {[
                                    { l: `Vacaciones prop. (${resultado.diasVac} días)`, v: resultado.vacaciones },
                                    { l: 'Prima vacacional (25%)', v: resultado.primaVac },
                                    { l: 'Aguinaldo proporcional (15 días)', v: resultado.aguinaldo },
                                ].map((r, i) => (
                                    <div key={i} className="flex justify-between p-2 rounded-lg bg-white/5">
                                        <span className="text-white/60">{r.l}</span>
                                        <span className="font-mono text-white">${fmtMXN(r.v)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between p-3 rounded-lg bg-white/10 border border-white/20 mt-2">
                                    <span className="text-white font-bold">TOTAL Finiquito</span>
                                    <span className="font-mono font-bold text-white text-lg">${fmtMXN(resultado.totalFiniquito)}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/30 mt-3">Arts. 76-80 vacaciones, Art. 80 prima vac., Art. 87 aguinaldo.</p>
                        </div>
                    )}
                    {(modo === 'ambos' || modo === 'liquidacion') && (
                        <div className="glass-card p-5 rounded-2xl border border-[var(--color-accent)]/30">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">💰</span>
                                <div>
                                    <h3 className="text-[var(--color-accent)] font-bold">Liquidación</h3>
                                    <p className="text-[10px] text-[var(--color-accent)]/60">Solo en DESPIDO INJUSTIFICADO</p>
                                </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                {[
                                    { l: `Vacaciones prop.`, v: resultado.vacaciones, muted: true },
                                    { l: 'Prima vacacional', v: resultado.primaVac, muted: true },
                                    { l: 'Aguinaldo prop.', v: resultado.aguinaldo, muted: true },
                                    { l: `20 días × ${resultado.aniosTrabajados} años`, v: resultado.veinteDiasPorAnio },
                                    { l: `${meses} mes(es) constitucional`, v: resultado.tresMeses },
                                    { l: `Prima antigüedad (12d × ${resultado.aniosTrabajados} años)`, v: resultado.primaAntiguedad },
                                ].map((r, i) => (
                                    <div key={i} className={`flex justify-between p-2 rounded-lg ${r.muted ? 'bg-white/5' : 'bg-[var(--color-accent)]/5'}`}>
                                        <span className={r.muted ? 'text-white/40' : 'text-white/60'}>{r.l}</span>
                                        <span className={`font-mono ${r.muted ? 'text-white/40' : 'text-white'}`}>${fmtMXN(r.v)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 mt-2">
                                    <span className="text-[var(--color-accent)] font-bold">TOTAL Liquidación</span>
                                    <span className="font-mono font-bold text-[var(--color-accent)] text-lg">${fmtMXN(resultado.totalLiquidacion)}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--color-accent)]/30 mt-3">Arts. 48, 50 y 162 LFT. Diferencia vs finiquito: ${fmtMXN(resultado.totalLiquidacion - resultado.totalFiniquito)}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                <p className="text-blue-400 font-bold mb-2">📌 Cuadro comparativo rápido</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div /><div className="text-white/60">Finiquito</div><div className="text-[var(--color-accent)]">Liquidación</div>
                    {[
                        { concepto: 'Vacaciones + prima', f: '✅', l: '✅' },
                        { concepto: 'Aguinaldo prop.', f: '✅', l: '✅' },
                        { concepto: '20 días × año', f: '❌', l: '✅' },
                        { concepto: '3 meses constitutional', f: '❌', l: '✅' },
                        { concepto: 'Prima antigüedad', f: '❌', l: '✅' },
                        { concepto: 'Solo si te despiden', f: '❌', l: '✅' },
                    ].map((r, i) => (
                        <>
                            <div key={`c${i}`} className="text-white/60 text-left">{r.concepto}</div>
                            <div key={`f${i}`} className="text-center">{r.f}</div>
                            <div key={`l${i}`} className="text-center">{r.l}</div>
                        </>
                    ))}
                </div>
            </div>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 46-52 LFT. Finiquito aplica siempre. Liquidación solo despido sin causa (Art. 48/50). No sustituye asesoría laboral.
            </p>
        </main>
    )
}
