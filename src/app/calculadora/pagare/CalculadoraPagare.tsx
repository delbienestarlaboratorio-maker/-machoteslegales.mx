'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getTIIE, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

export default function CalculadoraPagare() {
    const [capital, setCapital] = useState('50000')
    const [tasaAnual, setTasaAnual] = useState('18')
    const [moratorio, setMoratorio] = useState('2')
    const [fechaEmision, setFechaEmision] = useState('2025-01-15')
    const [fechaVencimiento, setFechaVencimiento] = useState('2025-07-15')
    const [fechaCalculo, setFechaCalculo] = useState('2026-02-27')
    const [usarTIIE, setUsarTIIE] = useState(true)
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const tiie = getTIIE(parseInt(anioCalculo))
    const tasaBase = usarTIIE ? tiie.tasa28 : (parseFloat(tasaAnual) || 0)

    const resultado = useMemo(() => {
        const cap = parseFloat(capital) || 0
        if (cap <= 0) return null
        const emision = new Date(fechaEmision)
        const vencimiento = new Date(fechaVencimiento)
        const corte = new Date(fechaCalculo)
        if (isNaN(emision.getTime()) || isNaN(vencimiento.getTime()) || isNaN(corte.getTime())) return null

        const diasVigencia = Math.max(Math.ceil((vencimiento.getTime() - emision.getTime()) / 86400000), 0)
        const diasMora = corte > vencimiento ? Math.ceil((corte.getTime() - vencimiento.getTime()) / 86400000) : 0
        const interesOrd = cap * (tasaBase / 100) * (diasVigencia / 365)
        const tasaMoratoria = tasaBase * (parseFloat(moratorio) || 2)
        const interesMora = cap * (tasaMoratoria / 100) * (diasMora / 365)
        const total = cap + interesOrd + interesMora
        return { cap, diasVigencia, diasMora, interesOrd, interesMora, total, tasaBase, tasaMoratoria }
    }, [capital, tasaAnual, moratorio, fechaEmision, fechaVencimiento, fechaCalculo, usarTIIE, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📄</span><span>Pagaré · Arts. 170-174 LGTOC</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Pagaré con Intereses</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula el monto total de un pagaré con <strong className="text-white">intereses ordinarios</strong> y
                    <strong className="text-[var(--color-accent)]"> moratorios</strong>.
                    Usa TIIE {tiie.anio} ({tiie.tasa28}%) o la tasa que pactaste.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos del pagaré</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Capital del pagaré ($)</label>
                        <input type="number" value={capital} onChange={e => setCapital(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de emisión</label>
                        <input type="date" value={fechaEmision} onChange={e => setFechaEmision(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de vencimiento</label>
                        <input type="date" value={fechaVencimiento} onChange={e => setFechaVencimiento(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de cálculo</label>
                        <input type="date" value={fechaCalculo} onChange={e => setFechaCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Factor moratorio (× tasa)</label>
                        <input type="number" value={moratorio} onChange={e => setMoratorio(e.target.value)} min="1" step="0.5"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Ej: 2 = doble tasa ordinaria</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año TIIE</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().filter(a => a >= 2019).map(a => (
                                <option key={a} value={a}>{a} — TIIE {getTIIE(a).tasa28}%</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setUsarTIIE(true)}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${usarTIIE ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        📊 TIIE {tiie.anio}: {tiie.tasa28}% anual
                        <p className="text-xs font-normal mt-1 opacity-70">Tasa de mercado referencial</p>
                    </button>
                    <button onClick={() => setUsarTIIE(false)}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${!usarTIIE ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        ✏️ Tasa pactada en el pagaré
                        {!usarTIIE && (
                            <input type="number" value={tasaAnual} onClick={e => e.stopPropagation()}
                                onChange={e => setTasaAnual(e.target.value)} placeholder="% anual"
                                className="mt-2 w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center" />
                        )}
                    </button>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Total del pagaré</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-xs text-[var(--color-text-muted)] mb-1">Capital</p>
                            <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.cap)}</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                            <p className="text-xs text-blue-400 mb-1">Interés ordinario ({resultado.diasVigencia}d)</p>
                            <p className="text-lg font-bold text-blue-400 font-mono">${fmtMXN(resultado.interesOrd)}</p>
                            <p className="text-[10px] text-blue-400/60">{resultado.tasaBase.toFixed(2)}% anual</p>
                        </div>
                        <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                            <p className="text-xs text-red-400 mb-1">Moratorio ({resultado.diasMora}d)</p>
                            <p className="text-lg font-bold text-red-400 font-mono">${fmtMXN(resultado.interesMora)}</p>
                            <p className="text-[10px] text-red-400/60">{resultado.tasaMoratoria.toFixed(2)}% anual</p>
                        </div>
                        <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                            <p className="text-xs text-[var(--color-accent)] mb-1">TOTAL a cobrar</p>
                            <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.total)}</p>
                        </div>
                    </div>
                    {resultado.diasMora === 0 && (
                        <p className="text-xs text-emerald-400 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">✅ El pagaré no está vencido. No hay intereses moratorios aún.</p>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo se calculan los intereses de un pagaré vencido?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Un <strong>pagaré</strong> (Arts. 170-174 LGTOC) genera <strong>intereses ordinarios</strong> durante su vigencia
                    y <strong>moratorios</strong> desde el día del vencimiento. La TIIE es la referencia bancaria estándar.
                    La SCJN ha establecido que las tasas moratorias usurarias que excedan el doble de la ordinaria pueden reducirse judicialmente.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Intereses Moratorios', href: '/calculadora/intereses-moratorios', desc: 'Deudas civiles y mercantiles' },
                        { title: 'Interés Legal Civil (9%)', href: '/calculadora/interes-legal-civil', desc: 'Art. 2395 CCF' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Montos en UMAs' },
                        { title: 'Plantillas Mercantiles', href: '/plantillas/mercantil', desc: 'Contratos y pagarés' },
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
                * Arts. 170-174 LGTOC. TIIE: Banxico. Interés simple. Jurisprudencia SCJN sobre usura. No sustituye asesoría legal.
            </p>
        </main>
    )
}
