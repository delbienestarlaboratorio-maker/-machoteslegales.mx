'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

export default function CalculadoraHorasExtra() {
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [horasSemana, setHorasSemana] = useState('3')
    const [semanas, setSemanas] = useState('4')
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const sm = parseFloat(salarioMensual) || 0
        if (sm <= 0) return null
        const sd = sm / 30
        const valorHoraNormal = sd / 8
        const hxSemana = parseFloat(horasSemana) || 0
        const numSemanas = parseInt(semanas) || 1

        // Primeras 9 horas/semana → doble (Art. 67 LFT)
        const hxDoble = Math.min(hxSemana, 9)
        const hxTriple = Math.max(hxSemana - 9, 0)

        const pagoDobleHora = valorHoraNormal * 2
        const pagoTripleHora = valorHoraNormal * 3

        const totalDobleSemanal = hxDoble * pagoDobleHora
        const totalTripleSemanal = hxTriple * pagoTripleHora
        const totalSemanal = totalDobleSemanal + totalTripleSemanal
        const totalPeriodo = totalSemanal * numSemanas

        // Si excede 9h/semana → día de descanso obligatorio (Art. 68 LFT)
        const excede = hxSemana > 9
        const diasDescansoExtra = excede ? Math.ceil(hxTriple / 3) : 0

        return {
            sd, valorHoraNormal, hxDoble, hxTriple, pagoDobleHora, pagoTripleHora,
            totalDobleSemanal, totalTripleSemanal, totalSemanal, totalPeriodo,
            excede, diasDescansoExtra, numSemanas
        }
    }, [salarioMensual, horasSemana, semanas])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⏰</span><span>Calculadora Horas Extra · Arts. 66-68 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Horas Extra</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula cuánto deben pagarte por trabajo en <strong className="text-white">tiempo extraordinario</strong>.
                    Las primeras 9 horas semanales se pagan al <strong className="text-emerald-400">doble</strong>,
                    las excedentes al <strong className="text-red-400">triple</strong>.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Horas extra por semana</label>
                        <input type="number" value={horasSemana} onChange={e => setHorasSemana(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Semanas a calcular</label>
                        <input type="number" value={semanas} onChange={e => setSemanas(e.target.value)} min="1"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo se calculan las horas extra según la LFT? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <h5 className="text-emerald-400 font-bold mb-1">✅ Primeras 9 horas/semana → DOBLE</h5>
                                <p className="text-white/60"><strong>Art. 67 LFT</strong>: Las horas de trabajo extraordinario se pagarán con un 100% más del salario que corresponda a las horas de la jornada.</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <h5 className="text-red-400 font-bold mb-1">🔴 Más de 9 horas/semana → TRIPLE</h5>
                                <p className="text-white/60"><strong>Art. 68 LFT</strong>: Si se exceden 9 horas a la semana, el patrón deberá pagar al trabajador el tiempo excedente con un 200% más del salario normal.</p>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                            <p className="text-white/70"><strong className="text-blue-400">Art. 66 LFT</strong>: Podrá prolongarse la jornada por circunstancias extraordinarias, sin exceder nunca de 3 horas diarias ni de 3 veces en una semana.</p>
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Pago de horas extra</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Valor hora normal</p>
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.valorHoraNormal)}</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1">Hora al doble</p>
                                <p className="text-lg font-bold text-emerald-400 font-mono">${fmt(resultado.pagoDobleHora)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Hora al triple</p>
                                <p className="text-lg font-bold text-red-400 font-mono">${fmt(resultado.pagoTripleHora)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Total ({resultado.numSemanas} sem.)</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.totalPeriodo)}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 text-sm">
                                <span className="text-white">{resultado.hxDoble}h al doble × {resultado.numSemanas} semanas</span>
                                <span className="text-emerald-400 font-mono font-bold">${fmt(resultado.totalDobleSemanal * resultado.numSemanas)}</span>
                            </div>
                            {resultado.hxTriple > 0 && (
                                <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 text-sm border border-red-500/20">
                                    <span className="text-white">{resultado.hxTriple}h al triple × {resultado.numSemanas} semanas</span>
                                    <span className="text-red-400 font-mono font-bold">${fmt(resultado.totalTripleSemanal * resultado.numSemanas)}</span>
                                </div>
                            )}
                        </div>

                        {resultado.excede && (
                            <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                                <p className="text-orange-400 font-bold">⚠️ Excedes el límite de 9 horas extra semanales</p>
                                <p className="text-white/60 mt-1">
                                    Según el Art. 68 LFT, {resultado.hxTriple} horas se pagan al triple.
                                    Además, el patrón debe otorgarte {resultado.diasDescansoExtra} día(s) de descanso compensatorio.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo se pagan las horas extra en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La Ley Federal del Trabajo regula el tiempo extraordinario en los Arts. 66-68. La jornada puede prolongarse
                    hasta 3 horas diarias y no más de 3 veces por semana (9 horas máximo). Estas se pagan al <strong>200%</strong> (doble).
                    Si se exceden las 9 horas semanales, cada hora adicional se paga al <strong>300%</strong> (triple),
                    y el patrón debe otorgar un día de descanso por cada grupo de 3 horas excedentes.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Incluye horas extra en la liquidación' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'Monto neto después de impuestos' },
                        { title: 'Demanda por Horas Extra No Pagadas', href: '/plantillas/laboral', desc: 'Plantillas laborales' },
                        { title: 'Calculadora SDI', href: '/calculadora/salario-diario-integrado', desc: 'Salario Diario Integrado' },
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
                * Cálculo basado en Arts. 66-68 LFT. No sustituye asesoría legal profesional.
            </p>
        </main>
    )
}
