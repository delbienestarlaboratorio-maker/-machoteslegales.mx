'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

function diasVacLFT(anios: number): number {
    if (anios < 1) return 0
    const tabla: Record<number, number> = {
        1: 12, 2: 14, 3: 16, 4: 18, 5: 20,
        6: 22, 7: 24, 8: 26, 9: 28, 10: 30,
        11: 30, 12: 30, 13: 30, 14: 30, 15: 30,
        16: 32, 17: 32, 18: 32, 19: 32, 20: 32,
        21: 34, 22: 34, 23: 34, 24: 34, 25: 34,
        26: 36, 27: 36, 28: 36, 29: 36, 30: 36,
    }
    if (anios <= 30) return tabla[anios]
    // Después de 30 años: por cada 5 años se añaden 2 días
    return 36 + Math.floor((anios - 25) / 5) * 2
}

function diasVacAnterior(anios: number): number {
    if (anios < 1) return 0
    const tabla: Record<number, number> = {
        1: 6, 2: 8, 3: 10, 4: 12, 5: 14, 6: 14, 7: 14, 8: 14, 9: 14, 10: 16,
        11: 16, 12: 16, 13: 16, 14: 16, 15: 18, 16: 18, 17: 18, 18: 18, 19: 18, 20: 20,
    }
    return tabla[anios] ?? 20 + Math.floor((anios - 20) / 5) * 2
}

export default function CalculadoraVacaciones() {
    const [anios, setAnios] = useState('3')
    const [salarioMensual, setSalarioMensual] = useState('15000')

    const resultado = useMemo(() => {
        const a = parseInt(anios) || 0
        const sm = parseFloat(salarioMensual) || 0
        const sd = sm / 30

        const diasActual = diasVacLFT(a)
        const diasAntes = diasVacAnterior(a)
        const diferencia = diasActual - diasAntes

        const prima25 = sd * diasActual * 0.25
        const valorVacaciones = sd * diasActual
        const total = valorVacaciones + prima25

        return { a, sd, diasActual, diasAntes, diferencia, prima25, valorVacaciones, total }
    }, [anios, salarioMensual])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏖️</span><span>Calculadora Vacaciones · Art. 76 LFT Reforma 2023</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Vacaciones por Antigüedad</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Con la <strong className="text-emerald-400">reforma de enero 2023</strong>, los días de vacaciones se
                    <strong className="text-white"> duplicaron</strong>. Ahora empiezas con 12 días en tu primer año.
                    Consulta la tabla completa y calcula tu prima vacacional.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de antigüedad</label>
                        <input type="number" value={anios} onChange={e => setAnios(e.target.value)} min="0" max="50"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual ($) — para prima vac.</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>
            </div>

            {resultado && resultado.a > 0 && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">🏖️ Tus vacaciones</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Días de vacaciones</p>
                                <p className="text-3xl font-bold text-[var(--color-accent)] font-mono">{resultado.diasActual}</p>
                                <p className="text-[10px] text-[var(--color-accent)]/60">Reforma 2023</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Antes era</p>
                                <p className="text-lg font-bold text-white/50 font-mono line-through">{resultado.diasAntes}</p>
                                <p className="text-[10px] text-emerald-400">+{resultado.diferencia} días ganados</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Prima vacacional 25%</p>
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.prima25)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Valor total vacaciones</p>
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.total)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabla comparativa completa */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-3">📋 Tabla Completa: Reforma 2023 vs. Antes</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 text-[var(--color-text-muted)]">Años</th>
                                        <th className="text-center py-2 text-[var(--color-accent)]">Días (2023+)</th>
                                        <th className="text-center py-2 text-white/50">Antes</th>
                                        <th className="text-center py-2 text-emerald-400">Ganaste</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 30 }, (_, i) => i + 1).map(a => (
                                        <tr key={a} className={`border-b border-white/5 ${a === resultado.a ? 'bg-[var(--color-accent)]/10' : 'hover:bg-white/5'} transition-colors`}>
                                            <td className="py-1.5 text-white font-mono">{a} {a === 1 ? 'año' : 'años'}</td>
                                            <td className="text-center py-1.5 text-[var(--color-accent)] font-mono font-bold">{diasVacLFT(a)}</td>
                                            <td className="text-center py-1.5 text-white/50 font-mono">{diasVacAnterior(a)}</td>
                                            <td className="text-center py-1.5 text-emerald-400 font-mono">+{diasVacLFT(a) - diasVacAnterior(a)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">Reforma de vacaciones 2023 — ¿Qué cambió?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El 1 de enero de 2023 entró en vigor la reforma al <strong>Art. 76 de la LFT</strong> que duplicó los días
                    de vacaciones. Antes tenías 6 días en tu primer año; ahora tienes <strong>12 días</strong>. Los días
                    aumentan 2 por cada año hasta llegar a 20, y luego 2 más por cada 5 años adicionales. Además, el <strong>Art. 80 LFT</strong> te
                    garantiza una <strong>prima vacacional de al menos 25%</strong> sobre el salario de tus vacaciones.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Incluye vacaciones proporcionales' },
                        { title: 'Calculadora Aguinaldo Neto', href: '/calculadora/aguinaldo-neto', desc: 'Tu aguinaldo después de ISR' },
                        { title: 'Calculadora SDI', href: '/calculadora/salario-diario-integrado', desc: 'Factor incluye vacaciones' },
                        { title: 'Plantillas Laborales', href: '/plantillas/laboral', desc: 'Demandas y solicitudes' },
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
                * Art. 76 LFT (reforma enero 2023). Prima vacacional Art. 80 LFT (mínimo 25%). No sustituye asesoría profesional.
            </p>
        </main>
    )
}
