'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraIntereses() {
    const [capital, setCapital] = useState('100000')
    const [tasaAnual, setTasaAnual] = useState('9')
    const [plazoMeses, setPlazoMeses] = useState('12')
    const [tipo, setTipo] = useState<'simple' | 'compuesto'>('simple')
    const [usarTasaLegal, setUsarTasaLegal] = useState(false)

    // Tasa legal Art. 2395 CCDF = 9% anual
    const TASA_LEGAL = 9

    const tasa = usarTasaLegal ? TASA_LEGAL : (parseFloat(tasaAnual) || 0)
    const tasaMensual = tasa / 100 / 12

    const resultado = useMemo(() => {
        const cap = parseFloat(capital) || 0
        const meses = parseInt(plazoMeses) || 0
        if (cap <= 0 || meses <= 0 || tasa <= 0) return null

        // Tabla mes a mes
        type FilaMes = { mes: number; saldo: number; interesMes: number; totalPagado: number }
        const tabla: FilaMes[] = []

        let saldoActual = cap
        let acumulado = 0

        for (let m = 1; m <= Math.min(meses, 120); m++) {
            const interesMes = tipo === 'simple'
                ? cap * tasaMensual
                : saldoActual * tasaMensual

            acumulado += interesMes
            if (tipo === 'compuesto') saldoActual += interesMes

            tabla.push({
                mes: m,
                saldo: tipo === 'simple' ? cap : saldoActual,
                interesMes,
                totalPagado: acumulado,
            })
        }

        const interesTotal = acumulado
        const montoFinal = cap + interesTotal
        const interesAnual = tipo === 'simple'
            ? cap * (tasa / 100)
            : cap * Math.pow(1 + tasa / 100, meses / 12) - cap

        return { tabla, interesTotal, montoFinal, interesAnual, cap, meses }
    }, [capital, tasaAnual, plazoMeses, tipo, usarTasaLegal])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📊</span><span>Intereses · Arts. 2395-2397 CC Federal</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Interés Simple y Compuesto</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula intereses sobre un capital: <strong className="text-white">simple</strong> (solo sobre el capital) o
                    <strong className="text-[var(--color-accent)]"> compuesto</strong> (sobre el saldo acumulado).
                    Incluye la <strong className="text-white">tasa legal del 9% anual</strong> (Art. 2395 CCDF).
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                    { v: 'simple' as const, icon: '📐', label: 'Interés Simple', sub: 'I = C × r × t' },
                    { v: 'compuesto' as const, icon: '📈', label: 'Interés Compuesto', sub: 'M = C(1+r)ⁿ' },
                ] as const).map(t => (
                    <button key={t.v} onClick={() => setTipo(t.v)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${tipo === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                        <p className="text-xl mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="text-[10px] opacity-70 font-mono mt-0.5">{t.sub}</p>
                    </button>
                ))}
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Capital ($)</label>
                        <input type="number" value={capital} onChange={e => setCapital(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tasa anual (%)</label>
                        <input type="number" value={tasaAnual} onChange={e => setTasaAnual(e.target.value)} disabled={usarTasaLegal}
                            className={`w-full p-3 rounded-xl border text-sm focus:outline-none transition-colors ${usarTasaLegal ? 'bg-white/[0.02] border-white/5 text-white/30' : 'bg-white/5 border-white/10 text-white focus:border-[var(--color-accent)]'}`} />
                        <label className="flex gap-1.5 items-center mt-1.5 cursor-pointer" onClick={() => setUsarTasaLegal(!usarTasaLegal)}>
                            <input type="checkbox" checked={usarTasaLegal} onChange={() => { }} className="w-3.5 h-3.5" />
                            <span className="text-[10px] text-[var(--color-accent)]">Usar tasa legal 9% (Art. 2395 CCDF)</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Plazo (meses)</label>
                        <input type="number" value={plazoMeses} onChange={e => setPlazoMeses(e.target.value)} min="1" max="120"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Interés total', val: resultado.interesTotal, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' },
                            { label: 'Capital + intereses', val: resultado.montoFinal, color: 'text-white', bg: 'bg-white/10 border border-white/20' },
                            { label: 'Interés mensual (prom.)', val: resultado.interesTotal / resultado.meses, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20' },
                        ].map((s, i) => (
                            <div key={i} className={`p-4 rounded-xl text-center ${s.bg}`}>
                                <p className="text-[10px] text-white/50 mb-1">{s.label}</p>
                                <p className={`text-lg font-bold font-mono ${s.color}`}>${fmtMXN(s.val)}</p>
                            </div>
                        ))}
                    </div>

                    {resultado.tabla.length > 0 && (
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="p-3 border-b border-white/10 flex justify-between text-[10px] text-white/40 font-bold">
                                <span>Mes</span><span>Saldo</span><span>Interés mes</span><span>Total acumulado</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {resultado.tabla.map((f, i) => (
                                    <div key={i} className={`flex justify-between p-2.5 text-xs border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                        <span className="text-white/40 w-8">M{f.mes}</span>
                                        <span className="font-mono text-white/70">${fmtMXN(f.saldo)}</span>
                                        <span className="font-mono text-[var(--color-accent)]">${fmtMXN(f.interesMes)}</span>
                                        <span className="font-mono text-white">${fmtMXN(f.totalPagado)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 2395 CCDF: tasa legal 9% anual. Art. 2397: interés compuesto solo si se pacta expresamente. Art. 1946 CCF sobre obligaciones pecuniarias.
            </p>
        </main>
    )
}
