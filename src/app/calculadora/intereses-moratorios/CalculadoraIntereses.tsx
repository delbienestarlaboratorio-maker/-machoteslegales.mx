'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

type TipoTasa = 'legal' | 'tiie' | 'convencional'

export default function CalculadoraIntereses() {
    const [capital, setCapital] = useState('100000')
    const [tipoTasa, setTipoTasa] = useState<TipoTasa>('legal')
    const [tasaConvencional, setTasaConvencional] = useState('36')
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

        // Tasa anual según tipo
        let tasaAnual: number
        let nombreTasa: string
        if (tipoTasa === 'legal') {
            tasaAnual = 6 // Art. 362 C.Com: interés legal mercantil 6%
            nombreTasa = 'Legal mercantil (6% anual, Art. 362 C.Com)'
        } else if (tipoTasa === 'tiie') {
            tasaAnual = 10.00 // TIIE 28 días aproximada feb 2026
            nombreTasa = 'TIIE 28 días (~10.00% anual, Banxico Feb 2026)'
        } else {
            tasaAnual = parseFloat(tasaConvencional) || 0
            nombreTasa = `Convencional (${tasaAnual}% anual, pactada en el contrato)`
        }

        // Interés simple: I = C × t × r
        const interesSimple = cap * anios * (tasaAnual / 100)

        // Interés diario
        const interesDiario = (cap * (tasaAnual / 100)) / 365

        // Monto total a cobrar
        const totalConIntereses = cap + interesSimple

        // Tasa mensual equivalente
        const tasaMensual = tasaAnual / 12

        return {
            cap, dias, meses, anios, tasaAnual, nombreTasa,
            interesSimple, interesDiario, totalConIntereses, tasaMensual
        }
    }, [capital, tipoTasa, tasaConvencional, fechaInicio, fechaFin])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📈</span><span>Calculadora Intereses · Art. 362 C.Com</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Intereses Moratorios</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula los intereses moratorios de un <strong className="text-white">pagaré</strong>,
                    <strong className="text-white"> deuda mercantil</strong> o <strong className="text-white">juicio</strong>.
                    Elige entre tasa legal (6%), TIIE o la tasa pactada en el contrato.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos del crédito</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Capital adeudado ($)</label>
                        <input type="number" value={capital} onChange={e => setCapital(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tipo de tasa</label>
                        <select value={tipoTasa} onChange={e => setTipoTasa(e.target.value as TipoTasa)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="legal">Legal mercantil — 6% anual</option>
                            <option value="tiie">TIIE 28 días — ~10% anual</option>
                            <option value="convencional">Convencional (pactada)</option>
                        </select>
                    </div>
                </div>

                {tipoTasa === 'convencional' && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tasa anual pactada (%)</label>
                        <input type="number" value={tasaConvencional} onChange={e => setTasaConvencional(e.target.value)} step="0.01"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha inicio de mora</label>
                        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de corte / hoy</label>
                        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cuál tasa aplica a mi caso? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <h5 className="text-blue-400 font-bold mb-1">📜 Legal (6%)</h5>
                                <p className="text-white/60"><strong>Art. 362 C.Com</strong>: Cuando no se pacta interés, se aplica el 6% anual. También se usa cuando se declara usuraria la tasa pactada.</p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <h5 className="text-emerald-400 font-bold mb-1">🏦 TIIE</h5>
                                <p className="text-white/60">Tasa del Banco de México. Se usa en contratos bancarios e hipotecas. Varía según las condiciones del mercado.</p>
                            </div>
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                <h5 className="text-orange-400 font-bold mb-1">📄 Convencional</h5>
                                <p className="text-white/60">La pactada en el pagaré o contrato. Pero ojo: si es excesiva, el juez puede reducirla por usura (tesis SCJN).</p>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                            <p className="text-white/70">
                                <strong className="text-red-400">¡Cuidado con la usura!</strong> La SCJN ha establecido que tasas superiores al
                                doble del promedio de CAT bancario pueden ser declaradas usurarias (Contradicción Tesis 350/2013).
                            </p>
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
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.cap)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Intereses ({resultado.dias} días)</p>
                                <p className="text-lg font-bold text-red-400 font-mono">${fmt(resultado.interesSimple)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30 col-span-2 md:col-span-1">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Total a cobrar</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.totalConIntereses)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Tasa aplicada</p>
                                <p className="text-lg font-bold text-white font-mono">{resultado.tasaAnual}%</p>
                                <p className="text-[10px] text-[var(--color-text-muted)]">anual</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/60">Tasa</span>
                                <span className="text-white text-xs">{resultado.nombreTasa}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/60">Período</span>
                                <span className="text-white font-mono">{resultado.dias} días ({resultado.meses.toFixed(1)} meses)</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/60">Interés diario</span>
                                <span className="text-[var(--color-accent)] font-mono">${fmt(resultado.interesDiario)}/día</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/60">Tasa mensual equivalente</span>
                                <span className="text-white font-mono">{resultado.tasaMensual.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué son los intereses moratorios?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Los intereses moratorios son la compensación económica que se genera cuando un deudor no paga una
                    deuda en la fecha acordada. En materia mercantil, el <strong>Art. 362 del Código de Comercio</strong> establece
                    que si no se pactó interés, se aplica el 6% anual. Los intereses se calculan con la fórmula de
                    <strong> interés simple: I = Capital × Tiempo × Tasa</strong>. El juez puede reducir tasas usurarias
                    conforme a la jurisprudencia de la SCJN.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Plantillas Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Modelo de Pagaré', href: '/plantillas/mercantil', desc: 'Pagaré con intereses moratorios pactados' },
                        { title: 'Demanda Ejecutiva Mercantil', href: '/plantillas/mercantil', desc: 'Cobro judicial de pagarés' },
                        { title: 'Calculadora UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Convierte multas y montos en UMAs' },
                        { title: 'Plantillas Civiles', href: '/plantillas/civil', desc: 'Demandas y contratos civiles' },
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
                * Interés simple. Art. 362 C.Com (tasa legal 6%). TIIE referencial Banxico. Tasas usurarias pueden ser reducidas judicialmente. No sustituye asesoría legal.
            </p>
        </main>
    )
}
