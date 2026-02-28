'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getSMG, fmtMXN } from '@/data/legal-constants'

export default function CalculadoraSubsidioIncapacidad() {
    const [sdActual, setSdActual] = useState('600')
    const [diasIncapacidad, setDiasIncapacidad] = useState('30')
    const [tipoIncapacidad, setTipoIncapacidad] = useState<'general' | 'maternidad' | 'riesgo'>('general')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const smg = getSMG(parseInt(anioCalculo))

    // Porcentajes Art. 98-101 LSS
    const PCTS = {
        general: { dias4a26: 60, diasMas26: 70, espera: 3 },
        maternidad: { dias4a26: 100, diasMas26: 100, espera: 0 },  // Art. 101 LSS: 100%
        riesgo: { dias4a26: 100, diasMas26: 100, espera: 0 },  // Art. 58 LSS: 100%
    }

    const resultado = useMemo(() => {
        const sd = parseFloat(sdActual) || 0
        const dias = parseInt(diasIncapacidad) || 0
        if (sd <= 0 || dias <= 0) return null

        const config = PCTS[tipoIncapacidad]

        // Días de espera (patrón cubre los primeros 3 días en enfermedad general)
        const diasEspera = config.espera
        const diasIMSS = Math.max(dias - diasEspera, 0)

        // Cálculo por tramos
        const diasPrimerTramo = Math.min(diasIMSS, 23)  // días 4-26 (23 días)
        const diasSegundoTramo = Math.max(diasIMSS - 23, 0)

        const pct1 = config.dias4a26 / 100
        const pct2 = config.diasMas26 / 100

        const subsidio1 = sd * pct1 * diasPrimerTramo
        const subsidio2 = sd * pct2 * diasSegundoTramo
        const subsidioTotal = subsidio1 + subsidio2

        // Patrón cubre días de espera
        const patronCubreDias = config.espera
        const patronCubremonto = sd * diasEspera

        // Salario que pierde vs subsidio
        const salarioNormal = sd * dias
        const diferencia = salarioNormal - subsidioTotal - patronCubremonto

        return {
            sd, diasIMSS, diasEspera, diasPrimerTramo, diasSegundoTramo,
            subsidio1, subsidio2, subsidioTotal, patronCubremonto,
            salarioNormal, diferencia, config, dias,
            pct1, pct2
        }
    }, [sdActual, diasIncapacidad, tipoIncapacidad, anioCalculo])

    const tipos = [
        { v: 'general' as const, icon: '🏥', label: 'Enfermedad General', sub: '60% días 4-26, 70% día 27+' },
        { v: 'maternidad' as const, icon: '🤰', label: 'Maternidad', sub: '100% SDI (Art. 101 LSS)' },
        { v: 'riesgo' as const, icon: '⚠️', label: 'Riesgo de Trabajo', sub: '100% SDI (Art. 58 LSS)' },
    ] as const

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏥</span><span>Subsidio Incapacidad · Arts. 58, 98-101 LSS</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Subsidio por Incapacidad IMSS</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Enfermedad general: el IMSS paga
                    <strong className="text-[var(--color-accent)]"> 60% del SDI del día 4 al 26</strong> y
                    <strong className="text-white"> 70% del día 27 en adelante</strong>. Los primeros 3 días corren a cargo del patrón (Art. 98 LSS).
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                {tipos.map(t => (
                    <button key={t.v} onClick={() => setTipoIncapacidad(t.v)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${tipoIncapacidad === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="text-[9px] opacity-70 mt-0.5">{t.sub}</p>
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
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario Diario Integrado ($)</label>
                        <input type="number" value={sdActual} onChange={e => setSdActual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">SDI mínimo {anioCalculo}: ${fmtMXN(smg.general)}/día</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días de incapacidad</label>
                        <input type="number" value={diasIncapacidad} onChange={e => setDiasIncapacidad(e.target.value)} min="1" max="52"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Mín. 4 días para activar subsidio IMSS (general)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {[2026, 2025, 2024].map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    {tipoIncapacidad === 'general' && resultado.diasEspera > 0 && (
                        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                            <p className="text-orange-400 font-bold">📋 Días de espera (Art. 98 Fr. I LSS)</p>
                            <p className="text-white/60">Los primeros 3 días de incapacidad corren a cargo del <strong className="text-white">patrón</strong> ({resultado.config.espera} días × ${fmtMXN(resultado.sd)} = <strong className="text-white">${fmtMXN(resultado.patronCubremonto)}</strong>). El IMSS comienza a pagar desde el 4° día.</p>
                        </div>
                    )}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Subsidio por incapacidad</h2>
                        <div className="space-y-2 text-sm">
                            {[
                                ...(resultado.diasEspera > 0 ? [{ l: `Días de espera (patrón cubre ${resultado.diasEspera} días)`, v: resultado.patronCubremonto, muted: true }] : []),
                                ...(resultado.diasPrimerTramo > 0 ? [{ l: `Días 4-26 (${resultado.diasPrimerTramo} días × ${(resultado.pct1 * 100).toFixed(0)}% SDI)`, v: resultado.subsidio1 }] : []),
                                ...(resultado.diasSegundoTramo > 0 ? [{ l: `Días 27+ (${resultado.diasSegundoTramo} días × ${(resultado.pct2 * 100).toFixed(0)}% SDI)`, v: resultado.subsidio2 }] : []),
                                { l: `TOTAL SUBSIDIO IMSS (${resultado.diasIMSS} días)`, v: resultado.subsidioTotal, accent: true },
                            ].map((r: { l: string; v: number; accent?: boolean; muted?: boolean }, i) => (
                                <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : r.muted ? 'bg-orange-500/5 border border-orange-500/10' : 'bg-white/5'}`}>
                                    <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : r.muted ? 'text-orange-400' : 'text-white/60'}`}>{r.l}</span>
                                    <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>${fmtMXN(r.v)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between p-2 rounded text-xs text-white/30">
                                <span>Salario normal ({resultado.dias} días)</span>
                                <span className="font-mono">${fmtMXN(resultado.salarioNormal)}</span>
                            </div>
                            {resultado.diferencia > 0 && (
                                <p className="text-[10px] text-red-400 text-right">
                                    ⬇ Pérdida neta vs salario normal: ${fmtMXN(resultado.diferencia)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 98 LSS: 60% días 4-26, 70% día 27+. Art. 101 LSS: maternidad 100%. Art. 58 LSS: riesgo trabajo 100%. Días de espera: 3 días patrón (Art. 98 Fr. I).
            </p>
        </main>
    )
}
