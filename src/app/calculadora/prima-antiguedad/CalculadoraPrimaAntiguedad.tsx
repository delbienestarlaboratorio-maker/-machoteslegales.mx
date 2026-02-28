'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

type CausaTerminacion = 'renuncia' | 'despido' | 'rescision' | 'muerte' | 'incapacidad'

export default function CalculadoraPrimaAntiguedad() {
    const [salarioDiario, setSalarioDiario] = useState('500')
    const [aniosTrabajados, setAniosTrabajados] = useState('8')
    const [mesesExtra, setMesesExtra] = useState('6')
    const [causa, setCausa] = useState<CausaTerminacion>('renuncia')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sd = parseFloat(salarioDiario) || 0
        const anios = parseFloat(aniosTrabajados) || 0
        const meses = parseFloat(mesesExtra) || 0
        if (sd <= 0 || anios < 0) return null

        const totalAnios = anios + (meses / 12)
        const topeSDI = smg.general * 2 // Tope: 2 × SMG diario Art. 162 LFT
        const sdParaCalculo = Math.min(sd, topeSDI)
        const primaTotal = sdParaCalculo * 12 * totalAnios

        // Prima proporcional si < 1 año (solo en renuncia no aplica; sí en muerte/incapacidad)
        const aplicaCompleta = causa !== 'renuncia' || anios >= 15 ? true : anios >= 1
        const primaAplicable = aplicaCompleta ? primaTotal : 0

        return {
            sd, sdParaCalculo, topeSDI, totalAnios, primaTotal,
            primaAplicable, aplicaCompleta,
            topado: sd > topeSDI,
            causaNombre: { renuncia: 'Renuncia voluntaria', despido: 'Despido justificado/injustificado', rescision: 'Rescisión por patrón', muerte: 'Fallecimiento', incapacidad: 'Incapacidad permanente' }[causa]
        }
    }, [salarioDiario, aniosTrabajados, mesesExtra, causa, anioCalculo])

    const causas: { value: CausaTerminacion; icon: string; label: string; req: string }[] = [
        { value: 'renuncia', icon: '🙋', label: 'Renuncia', req: 'Mínimo 15 años de servicio' },
        { value: 'despido', icon: '❌', label: 'Despido', req: 'Siempre aplica Art. 162 Fr. II' },
        { value: 'rescision', icon: '📃', label: 'Rescisión sin causa', req: 'Siempre aplica' },
        { value: 'muerte', icon: '⚰️', label: 'Fallecimiento', req: 'Beneficiarios Art. 162 Fr. III' },
        { value: 'incapacidad', icon: '♿', label: 'Incapacidad total', req: 'Siempre aplica' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⭐</span><span>Prima de Antigüedad · Art. 162 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Prima de Antigüedad</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El <strong className="text-white">Art. 162 LFT</strong> establece una prima de
                    <strong className="text-[var(--color-accent)]"> 12 días de salario por año trabajado</strong>.
                    Tope: 2 × SMG ({smg.anio}: ${fmtMXN(smg.general * 2)}/día).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
                {causas.map(c => (
                    <button key={c.value} onClick={() => setCausa(c.value)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${causa === c.value ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{c.icon}</p>
                        <p className="text-xs font-bold">{c.label}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{c.req}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos del trabajador</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario diario ($)</label>
                        <input type="number" value={salarioDiario} onChange={e => setSalarioDiario(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años trabajados</label>
                        <input type="number" value={aniosTrabajados} onChange={e => setAniosTrabajados(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses adicionales</label>
                        <input type="number" value={mesesExtra} onChange={e => setMesesExtra(e.target.value)} min="0" max="11"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año de cálculo</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — Tope ${fmtMXN(getSMG(a).general * 2)}/día</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Prima de antigüedad — {resultado.causaNombre}</h2>

                    {!resultado.aplicaCompleta && (
                        <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                            <p className="text-orange-400 font-bold">⚠️ Por renuncia voluntaria, la prima solo aplica con 15+ años de servicio (Art. 162 Fr. I LFT)</p>
                            <p className="text-white/60 mt-1">Con {parseFloat(aniosTrabajados).toFixed(0)} años, no aplica prima de antigüedad por renuncia. Considera si aplica otra causa.</p>
                        </div>
                    )}

                    {resultado.topado && (
                        <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
                            <p className="text-blue-400 font-bold">💡 Salario topado para el cálculo</p>
                            <p className="text-white/60">Tu salario (${fmtMXN(resultado.sd)}) excede el tope de 2 SMG (${fmtMXN(resultado.topeSDI)}). Se usa ${fmtMXN(resultado.sdParaCalculo)} para el cálculo.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-xs text-[var(--color-text-muted)] mb-1">Antigüedad total</p>
                            <p className="text-lg font-bold text-white">{resultado.totalAnios.toFixed(2)} años</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-xs text-[var(--color-text-muted)] mb-1">SD para cálculo</p>
                            <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.sdParaCalculo)}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-xs text-[var(--color-text-muted)] mb-1">12 días × {resultado.totalAnios.toFixed(2)} años</p>
                            <p className="text-lg font-bold text-white font-mono">{(12 * resultado.totalAnios).toFixed(1)} días</p>
                        </div>
                        <div className={`rounded-xl p-4 text-center ${resultado.aplicaCompleta ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <p className={`text-xs mb-1 ${resultado.aplicaCompleta ? 'text-[var(--color-accent)]' : 'text-red-400'}`}>Prima total</p>
                            <p className={`text-2xl font-bold font-mono ${resultado.aplicaCompleta ? 'text-[var(--color-accent)]' : 'text-red-400'}`}>
                                ${fmtMXN(resultado.primaAplicable)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                        {[
                            { l: 'SD real del trabajador', v: resultado.sd },
                            { l: `Tope 2 SMG (${smg.anio})`, v: resultado.topeSDI },
                            { l: 'SD para cálculo (el menor)', v: resultado.sdParaCalculo },
                            { l: '× 12 días × antigüedad', v: 12 * resultado.totalAnios },
                            { l: '= Prima de antigüedad', v: resultado.primaAplicable },
                        ].map((r, i) => (
                            <div key={i} className={`flex justify-between p-2.5 rounded-lg ${i === 4 ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20' : 'bg-white/5'}`}>
                                <span className={i === 4 ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}>{r.l}</span>
                                <span className={`font-mono ${i === 4 ? 'text-[var(--color-accent)] font-bold' : 'text-white'}`}>
                                    {i === 3 ? `${r.v.toFixed(1)} días` : `$${fmtMXN(r.v)}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es la prima de antigüedad y cuándo me corresponde?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La <strong>prima de antigüedad</strong> (Art. 162 LFT) es un derecho que reconoce los años de servicio
                    del trabajador: <strong>12 días de salario por año trabajado</strong>, con un tope de 2 veces el SMG.
                    No aplica en renuncia voluntaria con menos de 15 años. Sí aplica siempre en: despido, incapacidad permanente,
                    rescisión sin causa justificada, y al fallecimiento del trabajador.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Finiquito + 3 meses + prima' },
                        { title: 'Calculadora Vacaciones', href: '/calculadora/vacaciones-antiguedad', desc: 'Días de vacaciones LFT' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'ISR que paga tu liquidación' },
                        { title: 'Plantillas Laborales', href: '/plantillas/laboral', desc: 'Demandas y convenios' },
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
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 162 LFT. Tope 2 × SMG. SMG {smg.anio}: ${fmtMXN(smg.general)}/día. No aplica renuncia &lt; 15 años (Art. 162 Fr. I). No sustituye asesoría laboral.
            </p>
        </main>
    )
}
