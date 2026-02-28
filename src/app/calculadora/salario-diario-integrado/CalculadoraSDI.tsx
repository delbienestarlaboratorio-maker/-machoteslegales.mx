'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const UMA_2026 = 113.14
const SMG_2026 = 278.80

/* Días de vacaciones según antigüedad Art. 76 LFT reforma 2023 */
function diasVacLFT(anios: number): number {
    if (anios < 1) return 12
    const tabla = [0, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 30, 30, 30, 30, 30, 32, 32, 32, 32, 32, 34]
    return anios < tabla.length ? tabla[anios] : 34
}

export default function CalculadoraSDI() {
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [anios, setAnios] = useState('3')
    const [diasAguinaldo, setDiasAguinaldo] = useState('15')
    const [primaVacPct, setPrimaVacPct] = useState('25')
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const sm = parseFloat(salarioMensual) || 0
        if (sm <= 0) return null
        const sd = sm / 30
        const a = parseInt(anios) || 0
        const diasAg = parseInt(diasAguinaldo) || 15
        const pvPct = parseFloat(primaVacPct) || 25
        const diasVac = diasVacLFT(a)

        // Factor de integración = 1 + (aguinaldo/365) + (vacaciones × prima vac % / 365)
        const factorAguinaldo = diasAg / 365
        const factorVacaciones = (diasVac * (pvPct / 100)) / 365
        const factor = 1 + factorAguinaldo + factorVacaciones

        const sdi = sd * factor
        const sdiMensual = sdi * 30
        const salarioBC = Math.min(sdi, UMA_2026 * 25) // Tope 25 UMAs

        return { sd, sdi, sdiMensual, factor, factorAguinaldo, factorVacaciones, diasVac, salarioBC, diasAg, pvPct }
    }, [salarioMensual, anios, diasAguinaldo, primaVacPct])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧮</span><span>Calculadora SDI · Art. 84 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Salario Diario Integrado</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El SDI se usa para calcular <strong className="text-white">cuotas IMSS</strong>, <strong className="text-white">aportaciones Infonavit</strong> e <strong className="text-white">indemnizaciones laborales</strong>.
                    Incluye salario + aguinaldo + prima vacacional proporcionalmente.
                </p>
            </div>

            {/* Ad */}
            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Form */}
            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos del trabajador</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)} placeholder="15000"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de antigüedad</label>
                        <input type="number" value={anios} onChange={e => setAnios(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días de aguinaldo</label>
                        <input type="number" value={diasAguinaldo} onChange={e => setDiasAguinaldo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">% Prima vacacional</label>
                        <input type="number" value={primaVacPct} onChange={e => setPrimaVacPct(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                {/* Tooltip */}
                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Qué es el SDI y para qué sirve? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div>
                            <h4 className="text-white font-bold text-sm mb-1">📌 ¿Qué es el SDI?</h4>
                            <p className="text-white/80">
                                El <strong className="text-[var(--color-accent)]">Salario Diario Integrado (SDI)</strong> es tu salario diario
                                más las prestaciones que recibes en proporción diaria: aguinaldo y prima vacacional.
                                Es la base para calcular las cuotas del IMSS, aportaciones de Infonavit y las indemnizaciones laborales.
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <h5 className="text-white font-bold mb-1">📐 Fórmula</h5>
                            <p className="text-[var(--color-accent)] font-mono text-sm">
                                SDI = Salario Diario × Factor de Integración
                            </p>
                            <p className="text-white/60 mt-1">
                                Factor = 1 + (Días aguinaldo ÷ 365) + (Días vacaciones × % Prima vac. ÷ 365)
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-3">
                            <p className="text-white/70">
                                <strong className="text-blue-400">Art. 84 LFT</strong>: El salario se integra con los pagos hechos
                                en efectivo por cuota diaria, gratificaciones, percepciones, habitación, primas, comisiones,
                                prestaciones en especie y cualquiera otra cantidad o prestación que se entregue al trabajador.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Resultados */}
            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu Salario Diario Integrado</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Salario diario</p>
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.sd)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">SDI</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.sdi)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">SDI mensual</p>
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.sdiMensual)}</p>
                            </div>
                            <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-1">Factor integración</p>
                                <p className="text-lg font-bold text-blue-400 font-mono">{resultado.factor.toFixed(6)}</p>
                            </div>
                        </div>

                        {/* Desglose del factor */}
                        <div className="space-y-3">
                            <h3 className="text-white font-bold text-sm">📊 Desglose del Factor de Integración</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-xs text-[var(--color-text-muted)]">Base</p>
                                    <p className="text-white font-mono font-bold">1.000000</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">Salario diario</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-xs text-[var(--color-text-muted)]">+ Aguinaldo ({resultado.diasAg} días ÷ 365)</p>
                                    <p className="text-[var(--color-accent)] font-mono font-bold">+ {resultado.factorAguinaldo.toFixed(6)}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">Art. 87 LFT</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-xs text-[var(--color-text-muted)]">+ Prima vac. ({resultado.diasVac}d × {resultado.pvPct}% ÷ 365)</p>
                                    <p className="text-[var(--color-accent)] font-mono font-bold">+ {resultado.factorVacaciones.toFixed(6)}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">Arts. 76, 80 LFT</p>
                                </div>
                            </div>
                        </div>

                        {/* Tope IMSS */}
                        <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                            <p className="text-orange-400 font-bold">⚠️ Tope IMSS: 25 UMAs = ${fmt(UMA_2026 * 25)} diarios</p>
                            <p className="text-white/60 mt-1">
                                {resultado.sdi > UMA_2026 * 25
                                    ? `Tu SDI ($${fmt(resultado.sdi)}) EXCEDE el tope. El IMSS cotizará sobre $${fmt(UMA_2026 * 25)}.`
                                    : `Tu SDI ($${fmt(resultado.sdi)}) está dentro del tope. El IMSS cotizará sobre tu SDI completo.`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Tabla de vacaciones */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-3">📋 Tabla de Vacaciones por Antigüedad (Art. 76 LFT, reforma 2023)</h3>
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                            {Array.from({ length: 20 }, (_, i) => i + 1).map(a => (
                                <div key={a} className={`text-center p-2 rounded-lg text-xs ${a === (parseInt(anios) || 0) ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-white/5 text-white/60'}`}>
                                    <p className="font-bold">{a}a</p>
                                    <p className="font-mono">{diasVacLFT(a)}d</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* SEO */}
            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es el Salario Diario Integrado (SDI) en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El Salario Diario Integrado es la base para calcular las cuotas obrero-patronales del IMSS (Art. 27 LSS),
                    las aportaciones al Infonavit (Art. 29 Ley Infonavit) y las indemnizaciones laborales (Art. 84 LFT).
                    Se calcula multiplicando tu salario diario por un <strong>factor de integración</strong> que incluye
                    la proporción diaria de aguinaldo (Art. 87 LFT) y prima vacacional (Arts. 76, 80 LFT).
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Con la <strong>reforma de vacaciones de 2023</strong> (Art. 76 LFT), los días de vacaciones aumentaron
                    significativamente, lo que también incrementa el factor de integración y por ende el SDI.
                    El tope máximo para cotización al IMSS es de 25 UMAs (${fmt(UMA_2026 * 25)} diarios en 2026).
                </p>
            </section>

            {/* Links */}
            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Calculadoras Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación Laboral', href: '/calculadora-laboral', desc: 'Calcula indemnización completa' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'Cuánto te quitan de impuestos' },
                        { title: 'Plantillas de Derecho Laboral', href: '/plantillas/laboral', desc: 'Demandas, renuncias, convenios' },
                        { title: 'Demanda por Despido Injustificado', href: '/plantillas/laboral/demanda-despido-injustificado', desc: 'Demanda laboral lista para usar' },
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

            {/* Ad */}
            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Cálculo basado en Art. 84 LFT, Art. 27 LSS y reforma vacaciones 2023. UMA 2026: ${UMA_2026}. No sustituye asesoría profesional.
            </p>
        </main>
    )
}
