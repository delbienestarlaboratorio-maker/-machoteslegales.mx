'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMXN } from '@/data/legal-constants'

type ModoIVA = 'agregar' | 'desglosar' | 'retencion'

export default function CalculadoraIVA() {
    const [monto, setMonto] = useState('1000')
    const [modo, setModo] = useState<ModoIVA>('agregar')
    const [esFrontera, setEsFrontera] = useState(false)
    const [pctRetencion, setPctRetencion] = useState('10.67')

    const tasa = esFrontera ? 0.08 : 0.16

    const resultado = useMemo(() => {
        const m = parseFloat(monto) || 0
        if (m <= 0) return null

        if (modo === 'agregar') {
            const iva = m * tasa
            return { base: m, iva, total: m + iva, tasa }
        }
        if (modo === 'desglosar') {
            const base = m / (1 + tasa)
            const iva = m - base
            return { base, iva, total: m, tasa }
        }
        // Retención
        const base = m / (1 + tasa)
        const ivaTotal = m - base
        const retencion = ivaTotal * (parseFloat(pctRetencion) / 100)
        const ivaPorPagar = ivaTotal - retencion
        return { base, ivaTotal, retencion, ivaPorPagar, tasa }
    }, [monto, modo, esFrontera, pctRetencion])

    const modos = [
        { value: 'agregar' as ModoIVA, icon: '➕', label: 'Agregar IVA', desc: 'Precio s/IVA → con IVA' },
        { value: 'desglosar' as ModoIVA, icon: '🔍', label: 'Desglosar IVA', desc: 'Precio con IVA → separa base' },
        { value: 'retencion' as ModoIVA, icon: '🏦', label: 'Retención IVA', desc: 'Para servicios profesionales' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧾</span><span>IVA · Arts. 1-6 LIVA — {esFrontera ? '8%' : '16%'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">IVA México</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Agrega el IVA, desglosalo o calcula la retención.
                    Tasa general <strong className="text-[var(--color-accent)]">16%</strong> · Frontera norte <strong className="text-blue-400">8%</strong> (Art. 2-A LIVA).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {modos.map(m => (
                    <button key={m.value} onClick={() => setModo(m.value)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${modo === m.value ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-2xl mb-1">{m.icon}</p>
                        <p className="text-sm font-bold">{m.label}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{m.desc}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            {modo === 'agregar' ? 'Monto sin IVA ($)' : modo === 'desglosar' ? 'Monto con IVA ($)' : 'Monto con IVA ($)'}
                        </label>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    {modo === 'retencion' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">% de retención</label>
                            <select value={pctRetencion} onChange={e => setPctRetencion(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                                <option value="10.67">10.67% — Personas físicas servicios</option>
                                <option value="100">100% — Personas morales (retienen todo)</option>
                                <option value="4">4% — Transportistas</option>
                            </select>
                        </div>
                    )}
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={esFrontera} onChange={e => setEsFrontera(e.target.checked)} className="w-4 h-4" />
                    <div>
                        <span className="text-sm text-white/80">Zona frontera norte (8%)</span>
                        <p className="text-[10px] text-blue-400">Tijuana, Juárez, Nuevo Laredo, Matamoros, etc. Art. 2-A LIVA</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">🧮 Resultado IVA {(tasa * 100).toFixed(0)}%</h2>

                    {modo !== 'retencion' ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">{modo === 'agregar' ? 'Base (sin IVA)' : 'Base desglosada'}</p>
                                    <p className="text-xl font-bold text-white font-mono">${fmtMXN('base' in resultado ? resultado.base : 0)}</p>
                                </div>
                                <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                    <p className="text-xs text-blue-400 mb-1">IVA ({(tasa * 100).toFixed(0)}%)</p>
                                    <p className="text-xl font-bold text-blue-400 font-mono">${fmtMXN('iva' in resultado ? resultado.iva : 0)}</p>
                                </div>
                                <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                    <p className="text-xs text-[var(--color-accent)] mb-1">{modo === 'agregar' ? 'Total con IVA' : 'Total (verificación)'}</p>
                                    <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.total ?? 0)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { l: 'Base s/IVA', v: 'base' in resultado ? resultado.base : 0, c: 'text-white' },
                                    { l: `IVA total ${(tasa * 100).toFixed(0)}%`, v: 'ivaTotal' in resultado ? resultado.ivaTotal : 0, c: 'text-blue-400' },
                                    { l: `Retención (${pctRetencion}%)`, v: 'retencion' in resultado ? resultado.retencion : 0, c: 'text-orange-400' },
                                    { l: 'IVA que pagas al SAT', v: 'ivaPorPagar' in resultado ? resultado.ivaPorPagar : 0, c: 'text-[var(--color-accent)]' },
                                ].map((r, i) => (
                                    <div key={i} className={`rounded-xl p-4 text-center ${i === 3 ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                        <p className={`text-xs mb-1 ${r.c}`}>{r.l}</p>
                                        <p className={`text-xl font-bold font-mono ${r.c}`}>${fmtMXN(r.v)}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] p-3 rounded-lg bg-white/5">
                                Art. 1-A LIVA: quien recibe el servicio retiene el {pctRetencion}% del IVA y lo entera directamente al SAT. Tú solo recibes el IVA restante.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">IVA en México: tasas y retención</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La <strong>Ley del IVA</strong> establece una tasa general del <strong className="text-[var(--color-accent)]">16%</strong> (Art. 1 LIVA).
                    En la franja fronteriza norte aplica el <strong>8%</strong> (Art. 2-A LIVA). Algunas personas morales deben retener
                    el IVA al pagar servicios y enterarlo directamente al SAT (Art. 1-A LIVA): el prestador recibe su factura y el IVA neto.
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 1-6 LIVA. Tasa general 16%, frontera norte 8% (Art. 2-A). Retención Art. 1-A. No sustituye asesoría fiscal.
            </p>
        </main>
    )
}
