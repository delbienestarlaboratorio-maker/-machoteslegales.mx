'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tabla subsidio para el empleo 2024-2026 (Art. 113 LISR - Tabla del artículo décimo transitorio)
const TABLA_SUBSIDIO = [
    { limiteInf: 0.01, limiteSup: 1768.96, subsidio: 407.02 },
    { limiteInf: 1768.97, limiteSup: 2653.38, subsidio: 406.83 },
    { limiteInf: 2653.39, limiteSup: 3472.84, subsidio: 406.62 },
    { limiteInf: 3472.85, limiteSup: 3537.87, subsidio: 392.77 },
    { limiteInf: 3537.88, limiteSup: 4446.15, subsidio: 382.46 },
    { limiteInf: 4446.16, limiteSup: 4717.18, subsidio: 354.23 },
    { limiteInf: 4717.19, limiteSup: 5335.42, subsidio: 324.87 },
    { limiteInf: 5335.43, limiteSup: 6224.67, subsidio: 294.63 },
    { limiteInf: 6224.68, limiteSup: 7113.90, subsidio: 253.54 },
    { limiteInf: 7113.91, limiteSup: 7382.33, subsidio: 217.61 },
    { limiteInf: 7382.34, limiteSup: Infinity, subsidio: 0 },
]

// Tabla ISR mensual 2026 (Art. 96 LISR) — versión simplificada
const TABLA_ISR_MSG = [
    { limiteInf: 0.01, limiteSup: 746.04, ci: 0, pct: 1.92 },
    { limiteInf: 746.05, limiteSup: 6332.05, ci: 14.32, pct: 6.4 },
    { limiteInf: 6332.06, limiteSup: 11128.01, ci: 371.83, pct: 10.88 },
    { limiteInf: 11128.02, limiteSup: 12935.82, ci: 893.63, pct: 16.0 },
    { limiteInf: 12935.83, limiteSup: 15487.71, ci: 1182.88, pct: 17.92 },
    { limiteInf: 15487.72, limiteSup: 31236.49, ci: 1640.18, pct: 21.36 },
    { limiteInf: 31236.50, limiteSup: 49233.00, ci: 5004.12, pct: 23.52 },
    { limiteInf: 49233.01, limiteSup: 93993.90, ci: 9236.89, pct: 30.0 },
    { limiteInf: 93993.91, limiteSup: 125325.20, ci: 22665.17, pct: 32.0 },
    { limiteInf: 125325.21, limiteSup: 375975.61, ci: 32691.18, pct: 34.0 },
    { limiteInf: 375975.62, limiteSup: Infinity, ci: 117912.32, pct: 35.0 },
]

function calcularISR(ingresoMens: number): number {
    for (const nivel of TABLA_ISR_MSG) {
        if (ingresoMens <= nivel.limiteSup) {
            const excedente = ingresoMens - nivel.limiteInf
            return nivel.ci + (excedente * nivel.pct / 100)
        }
    }
    return 0
}

function calcularSubsidio(ingresoMens: number): number {
    for (const nivel of TABLA_SUBSIDIO) {
        if (ingresoMens <= nivel.limiteSup) return nivel.subsidio
    }
    return 0
}

export default function CalculadoraSubsidioEmpleo() {
    const [salarioBruto, setSalarioBruto] = useState('8000')
    const [periodicidad, setPeriodicidad] = useState<'mensual' | 'quincenal' | 'semanal'>('mensual')

    const resultado = useMemo(() => {
        const salario = parseFloat(salarioBruto) || 0
        if (salario <= 0) return null

        // Normalizar a mensual para cálculos
        const factores = { mensual: 1, quincenal: 2, semanal: 4.33 }
        const salarioMens = salario * factores[periodicidad]

        const isr = calcularISR(salarioMens)
        const subsidio = calcularSubsidio(salarioMens)

        // Caso A: ISR > Subsidio → patrón retiene la diferencia
        // Caso B: ISR < Subsidio → patrón paga la diferencia al trabajador
        // Caso C: ISR === 0 → patrón paga el subsidio completo
        const diferencia = isr - subsidio
        const patron_retiene = diferencia > 0
        const isrNeto = patron_retiene ? diferencia : 0
        const pagoPatron = patron_retiene ? 0 : Math.abs(diferencia)

        const salarioNeto = salarioMens - isrNeto + pagoPatron
        const pct_descuento = (isrNeto / salarioMens) * 100
        const nivel = TABLA_SUBSIDIO.findIndex(n => salarioMens <= n.limiteSup)

        return { salarioMens, isr, subsidio, diferencia, patron_retiene, isrNeto, pagoPatron, salarioNeto, pct_descuento, nivel }
    }, [salarioBruto, periodicidad])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💵</span><span>Subsidio Empleo · Art. 113 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Subsidio para el Empleo</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Para trabajadores de bajos ingresos: si el <strong className="text-white">subsidio supera el ISR</strong>,
                    el patrón <strong className="text-[var(--color-accent)]">paga la diferencia al trabajador</strong>
                    (Art. Décimo Transitorio LISR).
                </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6 text-xs text-center">
                <span className="text-blue-400 font-bold">ℹ️ Cómo funciona:</span>
                <span className="text-white/60"> Si ISR &gt; Subsidio → el patrón retiene solo la diferencia. Si ISR &lt; Subsidio → el patrón entrega la diferencia al empleado en nómina.</span>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario bruto del trabajador ($)</label>
                        <input type="number" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Periodicidad del pago</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['mensual', 'quincenal', 'semanal'] as const).map(p => (
                                <button key={p} onClick={() => setPeriodicidad(p)}
                                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${periodicidad === p ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Resultado Subsidio vs ISR</h2>
                    <div className="space-y-2 mb-4">
                        {[
                            { l: 'Salario mensual base', v: resultado.salarioMens, c: 'text-white' },
                            { l: `ISR retenible (Art. 96 LISR)`, v: resultado.isr, c: 'text-red-400' },
                            { l: `Subsidio para el empleo (Art. 113 LISR)`, v: resultado.subsidio, c: 'text-emerald-400' },
                        ].map((r, i) => (
                            <div key={i} className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-xs text-white/60">{r.l}</span>
                                <span className={`font-mono font-bold text-xs ${r.c}`}>${fmtMXN(r.v)}</span>
                            </div>
                        ))}

                        <div className={`p-4 rounded-xl border ${resultado.patron_retiene ? 'bg-orange-500/10 border-orange-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                            {resultado.patron_retiene ? (
                                <>
                                    <p className="text-xs font-bold text-orange-400 mb-2">📊 ISR &gt; Subsidio — El patrón retiene la diferencia</p>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-white/60">ISR a retener (diferencia)</span>
                                        <span className="font-mono font-bold text-orange-400">${fmtMXN(resultado.isrNeto)}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-bold text-emerald-400 mb-2">✅ Subsidio &gt; ISR — El patrón paga la diferencia al trabajador</p>
                                    <div className="flex justify-between">
                                        <span className="text-xs text-white/60">Monto a pagar al empleado</span>
                                        <span className="font-mono font-bold text-emerald-400">+${fmtMXN(resultado.pagoPatron)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                            <span className="text-[var(--color-accent)] font-bold text-xs">Salario neto mensual</span>
                            <span className="font-mono font-bold text-[var(--color-accent)] text-xl">${fmtMXN(resultado.salarioNeto)}</span>
                        </div>
                    </div>

                    {/* Mini tabla subsidio */}
                    <div className="mt-4">
                        <h3 className="text-white/60 text-xs font-bold mb-2">Tabla subsidio Art. 113 — tu nivel marcado ▶</h3>
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                            {TABLA_SUBSIDIO.map((n, i) => (
                                <div key={i} className={`flex justify-between p-2 rounded-lg text-[10px] ${resultado.nivel === i ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                    <span className={resultado.nivel === i ? 'text-[var(--color-accent)] font-bold' : 'text-white/40'}>
                                        {resultado.nivel === i ? '▶ ' : ''}${fmtMXN(n.limiteInf)} – {n.limiteSup === Infinity ? 'Más' : `$${fmtMXN(n.limiteSup)}`}
                                    </span>
                                    <span className={`font-mono font-bold ${resultado.nivel === i ? 'text-[var(--color-accent)]' : 'text-white/50'}`}>
                                        ${fmtMXN(n.subsidio)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 113 LISR. Tabla Art. Décimo Transitorio. El patrón debe acreditar el subsidio pagado al SAT. Aplica solo a trabajadores asalariados.
            </p>
        </main>
    )
}
