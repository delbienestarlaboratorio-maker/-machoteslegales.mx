'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraHipotecario() {
    const [monto, setMonto] = useState('1500000')
    const [tasaAnual, setTasaAnual] = useState('10.5')
    const [plazoAnios, setPlazoAnios] = useState('20')
    const [tipoCredito, setTipoCredito] = useState<'bancario' | 'infonavit' | 'fovissste'>('bancario')
    const [mostrarTabla, setMostrarTabla] = useState(false)

    const tasasPredefinidas = {
        bancario: { tasa: '10.5', label: 'Crédito bancario (~10.5%)' },
        infonavit: { tasa: '10.45', label: 'INFONAVIT (~10.45% tradicional)' },
        fovissste: { tasa: '4.0', label: 'FOVISSSTE (~4% sobre VSM)' },
    }

    const resultado = useMemo(() => {
        const P = parseFloat(monto) || 0
        const tasa = parseFloat(tasaAnual) || 0
        const anios = parseInt(plazoAnios) || 1
        if (P <= 0 || tasa <= 0 || anios <= 0) return null

        const n = anios * 12 // meses totales
        const r = tasa / 100 / 12 // tasa mensual

        // Fórmula mensualidad (sistema francés)
        const mensualidad = r === 0 ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        const totalPagado = mensualidad * n
        const totalIntereses = totalPagado - P
        const relacionMensualidad = totalPagado / P

        // Tabla de amortización (primeros 12 meses)
        const tabla: { mes: number; mensualidad: number; interes: number; capital: number; saldo: number }[] = []
        let saldo = P
        for (let mes = 1; mes <= Math.min(n, 12); mes++) {
            const interes = saldo * r
            const capital = mensualidad - interes
            saldo = saldo - capital
            tabla.push({ mes, mensualidad, interes, capital, saldo: Math.max(saldo, 0) })
        }

        return { mensualidad, totalPagado, totalIntereses, relacionMensualidad, tabla, n, P }
    }, [monto, tasaAnual, plazoAnios])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏠</span><span>Crédito Hipotecario · Sim. de Amortización</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Crédito Hipotecario</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula tu <strong className="text-white">mensualidad exacta</strong> y el
                    <strong className="text-[var(--color-accent)]"> total de intereses</strong> que pagarás en toda la vida del crédito.
                    Compatible con INFONAVIT, FOVISSSTE y crédito bancario.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {(Object.entries(tasasPredefinidas) as [keyof typeof tasasPredefinidas, { tasa: string; label: string }][]).map(([k, v]) => (
                    <button key={k} onClick={() => { setTipoCredito(k); setTasaAnual(v.tasa) }}
                        className={`p-3 rounded-xl border text-xs text-center font-bold transition-all cursor-pointer ${tipoCredito === k ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        {v.label}
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Monto del crédito ($)</label>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tasa anual (%)</label>
                        <input type="number" value={tasaAnual} onChange={e => setTasaAnual(e.target.value)} step="0.1"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Plazo (años)</label>
                        <select value={plazoAnios} onChange={e => setPlazoAnios(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {[5, 10, 15, 20, 25, 30].map(a => <option key={a} value={a}>{a} años ({a * 12} pagos)</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu crédito hipotecario</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30 md:col-span-2">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Mensualidad</p>
                                <p className="text-4xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.mensualidad)}</p>
                                <p className="text-[10px] text-[var(--color-accent)]/60 mt-1">{resultado.n} pagos · {(parseFloat(tasaAnual)).toFixed(2)}% anual</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Capital prestado</p>
                                <p className="text-xl font-bold text-white font-mono">${fmtMXN(resultado.P)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Intereses totales</p>
                                <p className="text-xl font-bold text-red-400 font-mono">${fmtMXN(resultado.totalIntereses)}</p>
                            </div>
                        </div>

                        {/* Barra de composición capital vs intereses */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-white/50 mb-1">
                                <span>Capital: {((resultado.P / resultado.totalPagado) * 100).toFixed(0)}%</span>
                                <span>Intereses: {((resultado.totalIntereses / resultado.totalPagado) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-4 rounded-full overflow-hidden bg-white/5 flex">
                                <div className="bg-[var(--color-accent)] h-full transition-all" style={{ width: `${(resultado.P / resultado.totalPagado) * 100}%` }} />
                                <div className="bg-red-500 h-full flex-1" />
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 text-xs">
                            <p className="text-white/60">Total pagado en {plazoAnios} años: <strong className="text-white font-mono">${fmtMXN(resultado.totalPagado)}</strong> — pagas <strong className="text-red-400">{(resultado.relacionMensualidad).toFixed(2)}x</strong> el valor original del crédito</p>
                        </div>
                    </div>

                    <button onClick={() => setMostrarTabla(!mostrarTabla)}
                        className="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white text-sm font-bold cursor-pointer transition-all">
                        {mostrarTabla ? '▲ Ocultar' : '▼ Ver'} tabla de amortización (primeros 12 meses)
                    </button>

                    {mostrarTabla && (
                        <div className="glass-card p-4 rounded-2xl overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-white/50 border-b border-white/10">
                                        <th className="py-2 text-left">Mes</th>
                                        <th className="py-2 text-right">Mensualidad</th>
                                        <th className="py-2 text-right">Interés</th>
                                        <th className="py-2 text-right">Capital</th>
                                        <th className="py-2 text-right">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.tabla.map(r => (
                                        <tr key={r.mes} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-2 text-white/60">{r.mes}</td>
                                            <td className="py-2 text-right font-mono text-white">${fmtMXN(r.mensualidad)}</td>
                                            <td className="py-2 text-right font-mono text-red-400">${fmtMXN(r.interes)}</td>
                                            <td className="py-2 text-right font-mono text-emerald-400">${fmtMXN(r.capital)}</td>
                                            <td className="py-2 text-right font-mono text-white/60">${fmtMXN(r.saldo)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo se calcula la mensualidad de una hipoteca?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La mensualidad se calcula con el <strong>sistema francés de amortización</strong>: cuota fija mensual
                    que cubre intereses sobre el saldo pendiente + una parte del capital. Al inicio la mayoría del pago
                    son intereses; al final del plazo, casi todo es capital. La fórmula es:
                    <em> M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]</em>
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Cálculo con sistema francés (cuota fija). INFONAVIT y FOVISSSTE pueden usar otros esquemas. No incluye seguros, comisiones ni gastos de escrituración.
            </p>
        </main>
    )
}
