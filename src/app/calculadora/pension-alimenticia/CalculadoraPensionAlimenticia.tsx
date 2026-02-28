'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN } from '@/data/legal-constants'

// Tabla de porcentajes sugeridos según criterios judiciales (SCJN y Tribunales)
// Se aplica sobre el ingreso neto (descontadas cuotas IMSS, ISR, etc.)
const TABLA_PORCENTAJES: { hijos: number; pct: number; notas: string }[] = [
    { hijos: 1, pct: 20, notas: '20% ingreso neto (referencia mínima judicial)' },
    { hijos: 2, pct: 30, notas: '15% por cada hijo (30% total)' },
    { hijos: 3, pct: 40, notas: 'Aprox. 13% por hijo (40% total)' },
    { hijos: 4, pct: 45, notas: 'Aprox. 11% por hijo (45% total)' },
    { hijos: 5, pct: 50, notas: 'Máx. sugerido: 50% ingreso neto' },
]

export default function CalculadoraPensionAlimenticia() {
    const [ingresosBrutos, setIngresosBrutos] = useState('25000')
    const [numHijos, setNumHijos] = useState(1)
    const [tipoIngreso, setTipoIngreso] = useState<'asalariado' | 'honorarios' | 'empresario'>('asalariado')
    const [incluirGastosMedicos, setIncluirGastosMedicos] = useState(false)
    const [gastosMedicos, setGastosMedicos] = useState('2000')
    const [incluirColegiaturas, setIncluirColegiaturas] = useState(false)
    const [colegiaturas, setColegiaturas] = useState('3000')
    const [pctPersonalizado, setPctPersonalizado] = useState(false)
    const [pctManual, setPctManual] = useState(20)
    const anioCalculo = ANIO_ACTUAL
    const uma = getUMA(anioCalculo)

    const resultado = useMemo(() => {
        const brutos = parseFloat(ingresosBrutos) || 0
        if (brutos <= 0) return null

        // Estimación de deducciones para calcular ingreso neto
        const descuentos = {
            asalariado: 0.20,  // aprox IMSS + ISR trabajador
            honorarios: 0.25,  // ISR + IVA acreditable
            empresario: 0.30,  // ISR + IMSS + otros
        }
        const descuento = descuentos[tipoIngreso]
        const ingresoNeto = brutos * (1 - descuento)

        // Porcentaje aplicable
        const entrada = TABLA_PORCENTAJES.find(t => t.hijos === numHijos) || TABLA_PORCENTAJES[TABLA_PORCENTAJES.length - 1]
        const pct = pctPersonalizado ? pctManual : entrada.pct

        // Pensión base
        const pensionBase = ingresoNeto * (pct / 100)

        // Gastos adicionales (se suman a la pensión base)
        const extraGastos = incluirGastosMedicos ? (parseFloat(gastosMedicos) || 0) : 0
        const extraColeg = incluirColegiaturas ? (parseFloat(colegiaturas) || 0) : 0
        const pensionTotal = pensionBase + extraGastos + extraColeg

        // En UMAs mensuales
        const umasMensuales = pensionTotal / uma.mensual

        // Por hijo (si más de 1)
        const porHijo = pensionTotal / numHijos

        // Mínimo legal: 1 UMA mensual por alimentista
        const minimoLegal = uma.mensual * numHijos

        return {
            brutos, ingresoNeto, pct, pensionBase,
            extraGastos, extraColeg, pensionTotal, umasMensuales, porHijo,
            minimoLegal, bajaminimo: pensionTotal < minimoLegal, descuento
        }
    }, [ingresosBrutos, numHijos, tipoIngreso, incluirGastosMedicos, gastosMedicos, incluirColegiaturas, colegiaturas, pctPersonalizado, pctManual])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>👨‍👩‍👧</span><span>Pensión Alimenticia · Arts. 308-323 CC Federal</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Pensión Alimenticia 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Basada en criterios de la SCJN y Tribunales: la pensión se calcula sobre el
                    <strong className="text-[var(--color-accent)]"> ingreso neto</strong> del deudor.
                    El juez determina el monto final considerando necesidades reales.
                </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 text-xs text-center">
                <span className="text-amber-400 font-bold">⚠️ Estimador referencial:</span>
                <span className="text-white/60"> Los porcentajes son valores de referencia según criterios judiciales. El juez analiza capacidad económica del deudor y necesidades del acreedor (Art. 311 CC).</span>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos brutos mensuales del deudor ($)</label>
                        <input type="number" value={ingresosBrutos} onChange={e => setIngresosBrutos(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tipo de ingreso (para estimar neto)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {([
                                { v: 'asalariado' as const, label: 'Asalariado', pct: '20%' },
                                { v: 'honorarios' as const, label: 'Honorarios', pct: '25%' },
                                { v: 'empresario' as const, label: 'Empresa', pct: '30%' },
                            ] as const).map(t => (
                                <button key={t.v} onClick={() => setTipoIngreso(t.v)}
                                    className={`p-2 rounded-xl border text-center text-[10px] transition-all cursor-pointer ${tipoIngreso === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                    <p className="font-bold">{t.label}</p>
                                    <p className="opacity-60">desc. est. {t.pct}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-3 font-semibold">Número de hijos (alimentistas)</label>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} onClick={() => setNumHijos(n)}
                                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${numHijos === n ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                <p className="text-lg font-bold">{n}</p>
                                <p className="text-[10px] opacity-60">{TABLA_PORCENTAJES[n - 1]?.pct}%</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                        <input type="checkbox" checked={incluirGastosMedicos} onChange={e => setIncluirGastosMedicos(e.target.checked)} className="w-4 h-4 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">Gastos médicos recurrentes</p>
                            {incluirGastosMedicos && <input type="number" value={gastosMedicos} onChange={e => setGastosMedicos(e.target.value)} onClick={e => e.stopPropagation()}
                                className="mt-1.5 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs w-full focus:outline-none" />}
                        </div>
                    </label>
                    <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                        <input type="checkbox" checked={incluirColegiaturas} onChange={e => setIncluirColegiaturas(e.target.checked)} className="w-4 h-4 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">Colegiaturas / educación</p>
                            {incluirColegiaturas && <input type="number" value={colegiaturas} onChange={e => setColegiaturas(e.target.value)} onClick={e => e.stopPropagation()}
                                className="mt-1.5 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs w-full focus:outline-none" />}
                        </div>
                    </label>
                </div>

                <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                    <input type="checkbox" checked={pctPersonalizado} onChange={e => setPctPersonalizado(e.target.checked)} className="w-4 h-4 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs font-bold text-white">Porcentaje personalizado (si tienes un específico)</p>
                        {pctPersonalizado && (
                            <div className="flex items-center gap-2 mt-1.5">
                                <input type="range" min="5" max="80" value={pctManual} onChange={e => setPctManual(parseInt(e.target.value))} onClick={e => e.stopPropagation()} className="flex-1" />
                                <span className="text-[var(--color-accent)] font-bold text-sm">{pctManual}%</span>
                            </div>
                        )}
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Pensión alimenticia estimada</h2>
                    <div className="space-y-2 text-sm mb-4">
                        {[
                            { l: 'Ingresos brutos mensuales', v: resultado.brutos },
                            { l: `Deducciones estimadas (${(resultado.descuento * 100).toFixed(0)}% — IMSS + ISR)`, v: -resultado.brutos * resultado.descuento },
                            { l: 'Ingreso neto estimado', v: resultado.ingresoNeto },
                            { l: `Porcentaje aplicable (${resultado.pct}% — ${numHijos} hijo${numHijos > 1 ? 's' : ''})`, v: resultado.pensionBase },
                            ...(resultado.extraGastos > 0 ? [{ l: 'Gastos médicos adicionales', v: resultado.extraGastos }] : []),
                            ...(resultado.extraColeg > 0 ? [{ l: 'Colegiaturas adicionales', v: resultado.extraColeg }] : []),
                            { l: 'PENSIÓN ALIMENTICIA MENSUAL', v: resultado.pensionTotal, accent: true },
                        ].map((r: { l: string; v: number; accent?: boolean }, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        {numHijos > 1 && (
                            <div className="bg-white/5 rounded-xl p-3 text-center">
                                <p className="text-white/50 mb-1">Por hijo</p>
                                <p className="text-white font-bold font-mono">${fmtMXN(resultado.porHijo)}/mes</p>
                            </div>
                        )}
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-white/50 mb-1">En UMAs mensuales</p>
                            <p className="text-white font-bold font-mono">{resultado.umasMensuales.toFixed(2)} UMAs</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-white/50 mb-1">Mínimo legal estimado</p>
                            <p className={`font-bold font-mono ${resultado.bajaminimo ? 'text-red-400' : 'text-emerald-400'}`}>${fmtMXN(resultado.minimoLegal)}/mes</p>
                        </div>
                    </div>
                    {resultado.bajaminimo && (
                        <p className="text-[10px] text-red-400 mt-3">⚠️ El monto calculado está por debajo del mínimo sugerido de 1 UMA mensual por alimentista.</p>
                    )}
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 308-323 CCDF. Porcentajes de referencia judicial SCJN. El juez determina el monto real considerando necesidades y posibilidad económica. No sustituye dictamen judicial.
            </p>
        </main>
    )
}
