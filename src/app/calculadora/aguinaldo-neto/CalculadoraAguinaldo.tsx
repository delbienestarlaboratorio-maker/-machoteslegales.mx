'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    EXENCIONES_ISR, ANIO_ACTUAL, getUMA,
    calcularISR, fmtMXN, getAniosDisponibles,
} from '@/data/legal-constants'

export default function CalculadoraAguinaldo() {
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [diasAguinaldo, setDiasAguinaldo] = useState('15')
    const [mesesTrabajados, setMesesTrabajados] = useState('12')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [showInfo, setShowInfo] = useState(false)

    const uma = getUMA(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sm = parseFloat(salarioMensual) || 0
        if (sm <= 0) return null
        const sd = sm / 30
        const diasAg = parseInt(diasAguinaldo) || 15
        const mt = parseInt(mesesTrabajados) || 12
        const proporcion = Math.min(mt, 12) / 12

        const aguinaldoBruto = sd * diasAg * proporcion
        const montoExento = Math.min(aguinaldoBruto, uma.diaria * EXENCIONES_ISR.aguinaldo)
        const gravado = Math.max(aguinaldoBruto - montoExento, 0)
        const isr = calcularISR(gravado)
        const neto = aguinaldoBruto - isr
        const porcentajeRetenido = aguinaldoBruto > 0 ? (isr / aguinaldoBruto) * 100 : 0

        return { sd, diasAg, mt, proporcion, aguinaldoBruto, montoExento, gravado, isr, neto, porcentajeRetenido }
    }, [salarioMensual, diasAguinaldo, mesesTrabajados, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🎄</span><span>Calculadora Aguinaldo · Art. 87 LFT · {anioCalculo}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Aguinaldo Neto</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Cuánto te queda <strong className="text-white">después de impuestos</strong>?
                    Exento hasta {EXENCIONES_ISR.aguinaldo} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)} en {uma.anio}).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Tus datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días de aguinaldo</label>
                        <input type="number" value={diasAguinaldo} onChange={e => setDiasAguinaldo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Mínimo legal: 15 días (Art. 87 LFT)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses trabajados</label>
                        <input type="number" value={mesesTrabajados} onChange={e => setMesesTrabajados(e.target.value)} min="1" max="12"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año de cálculo</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-emerald-400 mt-1">UMA se ajusta al año seleccionado</p>
                    </div>
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo se calcula el ISR del aguinaldo? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <p className="text-white/80">
                            <strong className="text-blue-400">Art. 93, Fr. XIV LISR</strong>: exento hasta {EXENCIONES_ISR.aguinaldo} × UMA diaria.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <p className="text-emerald-400 font-bold">✅ Exento: hasta {EXENCIONES_ISR.aguinaldo} × UMA</p>
                                <p className="text-white/60">= {EXENCIONES_ISR.aguinaldo} × ${fmtMXN(uma.diaria)} = <strong>${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)}</strong></p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 font-bold">❌ Gravado: lo que exceda</p>
                                <p className="text-white/60">Se aplica tabla ISR mensual Art. 96 LISR</p>
                            </div>
                        </div>
                        <p className="text-white/60 text-[10px]"><strong>Fecha límite:</strong> 20 de diciembre. Incumplimiento = demanda laboral.</p>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">🎁 Tu aguinaldo {anioCalculo}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Bruto</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.aguinaldoBruto)}</p>
                                <p className="text-[10px] text-[var(--color-text-muted)]">{resultado.diasAg}d × ${fmtMXN(resultado.sd)} × {(resultado.proporcion * 100).toFixed(0)}%</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1">Exento ISR</p>
                                <p className="text-lg font-bold text-emerald-400 font-mono">${fmtMXN(resultado.montoExento)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">ISR retenido</p>
                                <p className="text-lg font-bold text-red-400 font-mono">-${fmtMXN(resultado.isr)}</p>
                                <p className="text-[10px] text-red-400/60">{resultado.porcentajeRetenido.toFixed(1)}%</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">NETO</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.neto)}</p>
                            </div>
                        </div>

                        <div className="relative h-8 rounded-full overflow-hidden bg-white/5">
                            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-[var(--color-accent)] rounded-full transition-all"
                                style={{ width: `${resultado.aguinaldoBruto > 0 ? (resultado.neto / resultado.aguinaldoBruto) * 100 : 0}%` }} />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                Recibes {resultado.aguinaldoBruto > 0 ? ((resultado.neto / resultado.aguinaldoBruto) * 100).toFixed(1) : '0'}%
                            </div>
                        </div>

                        {resultado.isr === 0 && (
                            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                                <p className="text-emerald-400 font-bold">🎉 ¡Tu aguinaldo es 100% exento!</p>
                                <p className="text-white/60 mt-1">No excede {EXENCIONES_ISR.aguinaldo} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)}).</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cuánto es el aguinaldo en México y cuándo se paga?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El <strong>Art. 87 LFT</strong> establece mínimo 15 días de salario, antes del <strong>20 de diciembre</strong>.
                    Exento de ISR hasta {EXENCIONES_ISR.aguinaldo} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)} en {uma.anio}).
                    Selecciona el año para calcular con los valores de UMA de cualquier periodo.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Incluye aguinaldo proporcional' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'ISR de todo el finiquito' },
                        { title: 'Calculadora PTU', href: '/calculadora/ptu-utilidades', desc: 'Reparto de utilidades' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Convierte UMAs de cualquier año' },
                    ].map(t => (
                        <Link key={t.href} href={t.href}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--color-accent)]/30 transition-all group">
                            <span className="text-lg flex-shrink-0">📄</span>
                            <div>
                                <p className="text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">{t.title}</p>
                                <p className="text-xs text-white/50 mt-0.5">{t.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 87 LFT (mín. 15 días). ISR: exento hasta {EXENCIONES_ISR.aguinaldo} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)}), Art. 93 Fr. XIV LISR. Año seleccionado: {anioCalculo}.
            </p>
        </main>
    )
}
