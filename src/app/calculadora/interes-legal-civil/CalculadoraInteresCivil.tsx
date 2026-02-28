'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMXN } from '@/data/legal-constants'

const TASA_LEGAL_CIVIL = 9 // Art. 2395 CCF: 9% anual

export default function CalculadoraInteresCivil() {
    const [capital, setCapital] = useState('100000')
    const [fechaInicio, setFechaInicio] = useState('2025-01-15')
    const [fechaFin, setFechaFin] = useState('2026-02-27')
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const cap = parseFloat(capital) || 0
        if (cap <= 0) return null

        const inicio = new Date(fechaInicio)
        const fin = new Date(fechaFin)
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin <= inicio) return null

        const diffMs = fin.getTime() - inicio.getTime()
        const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        const meses = dias / 30.4375
        const anios = dias / 365.25

        const interesSimple = cap * anios * (TASA_LEGAL_CIVIL / 100)
        const interesDiario = (cap * (TASA_LEGAL_CIVIL / 100)) / 365
        const totalConIntereses = cap + interesSimple

        return { cap, dias, meses, anios, interesSimple, interesDiario, totalConIntereses }
    }, [capital, fechaInicio, fechaFin])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Interés Legal Civil · Art. 2395 CCF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Interés Legal Civil</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El <strong className="text-white">Art. 2395 del CCF</strong> establece un interés legal del
                    <strong className="text-[var(--color-accent)]"> 9% anual</strong> para préstamos civiles cuando no se pacta tasa.
                    Diferente al 6% mercantil (Art. 362 C.Com).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos de la deuda</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Capital adeudado ($)</label>
                        <input type="number" value={capital} onChange={e => setCapital(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha inicio mora</label>
                        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de corte</label>
                        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-xs">
                    <p className="text-[var(--color-accent)] font-bold">Tasa aplicada: {TASA_LEGAL_CIVIL}% anual (Art. 2395 CCF)</p>
                    <p className="text-white/60 mt-1">Interés legal civil. Para tasa mercantil (6%) usa la calculadora de intereses moratorios.</p>
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cuál es la diferencia entre interés civil y mercantil? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-lg p-3">
                                <h5 className="text-[var(--color-accent)] font-bold mb-1">⚖️ Civil: 9% anual</h5>
                                <p className="text-white/60"><strong>Art. 2395 CCF</strong>: Aplica a préstamos entre particulares, sentencias civiles, y cualquier crédito no mercantil cuando no se pacta interés.</p>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <h5 className="text-blue-400 font-bold mb-1">🏢 Mercantil: 6% anual</h5>
                                <p className="text-white/60"><strong>Art. 362 C.Com</strong>: Aplica a pagarés, deudas comerciales, contratos entre empresas/comerciantes. Tasa más baja que la civil.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Resultado</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Capital</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.cap)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Intereses ({resultado.dias} días)</p>
                                <p className="text-lg font-bold text-red-400 font-mono">${fmtMXN(resultado.interesSimple)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Total a cobrar</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.totalConIntereses)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Interés diario</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.interesDiario)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es el interés legal civil?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El <strong>Art. 2395 del Código Civil Federal</strong> establece que cuando no se pacta tasa de interés en un
                    préstamo civil, se aplica el <strong className="text-[var(--color-accent)]">9% anual</strong>. Es 50% más alto que
                    el interés mercantil (6%). Aplica a: préstamos entre particulares, sentencias civiles, contratos de mutuo
                    (préstamo de dinero) y cualquier obligación civil con intereses no pactados.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Intereses Moratorios (Mercantil)', href: '/calculadora/intereses-moratorios', desc: 'Tasa legal 6% o TIIE' },
                        { title: 'Plantillas Civiles', href: '/plantillas/civil', desc: 'Demandas y contratos civiles' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Multas y costas en UMAs' },
                        { title: 'Calculadora Herencia', href: '/calculadora/herencia-legitima', desc: 'Sucesión intestamentaria' },
                    ].map(t => (
                        <Link key={t.href + t.title} href={t.href}
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
                * Art. 2395 CCF (interés legal civil 9%). Interés simple. Para materia mercantil usar 6% (Art. 362 C.Com). No sustituye asesoría legal.
            </p>
        </main>
    )
}
