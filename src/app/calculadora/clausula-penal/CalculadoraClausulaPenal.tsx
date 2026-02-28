'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

type TipoPena = 'porcentaje' | 'diasMora' | 'montoFijo'

export default function CalculadoraClausulaPenal() {
    const [montoContrato, setMontoContrato] = useState('500000')
    const [pctPena, setPctPena] = useState('20')
    const [montoFijo, setMontoFijo] = useState('100000')
    const [diasMora, setDiasMora] = useState('45')
    const [pctMoraDiaria, setPctMoraDiaria] = useState('0.5')
    const [pctCumplido, setPctCumplido] = useState('0')
    const [tipoPena, setTipoPena] = useState<TipoPena>('porcentaje')
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const contrato = parseFloat(montoContrato) || 0
        const pct = parseFloat(pctPena) / 100
        const fijo = parseFloat(montoFijo) || 0
        const dias = parseInt(diasMora) || 0
        const pctMora = parseFloat(pctMoraDiaria) / 100
        const cumplido = Math.min(parseFloat(pctCumplido) / 100, 1)

        if (contrato <= 0) return null

        let penaBruta = 0
        if (tipoPena === 'porcentaje') penaBruta = contrato * pct
        if (tipoPena === 'montoFijo') penaBruta = fijo
        if (tipoPena === 'diasMora') penaBruta = contrato * pctMora * dias

        // Reducción proporcional si hubo cumplimiento parcial (Art. 1843 CCF)
        const reduccion = cumplido > 0 ? penaBruta * cumplido : 0
        const penaFinal = Math.max(penaBruta - reduccion, 0)

        // Validación: la pena no puede exceder el valor total del contrato (SCJN)
        const excedeLimite = penaFinal > contrato
        const penaAjustada = excedeLimite ? contrato : penaFinal

        return { penaBruta, reduccion, penaFinal, penaAjustada, excedeLimite, contrato, pctCumplido: cumplido * 100 }
    }, [montoContrato, pctPena, montoFijo, diasMora, pctMoraDiaria, pctCumplido, tipoPena])

    const tipos = [
        { v: 'porcentaje' as TipoPena, icon: '%', label: '% del contrato', desc: 'Ej: 20% del valor total' },
        { v: 'diasMora' as TipoPena, icon: '📅', label: 'Por día de mora', desc: 'Ej: 0.5% diario × días de retraso' },
        { v: 'montoFijo' as TipoPena, icon: '$', label: 'Monto fijo', desc: 'Cantidad determinada en el contrato' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📋</span><span>Cláusula Penal · Arts. 1840-1847 CCF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Cláusula Penal</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La <strong className="text-white">pena convencional</strong> (Art. 1840 CCF) sustituye a la indemnización
                    ordinaria de daños y perjuicios. Calcula cuánto cobrar si tu cliente incumple el contrato.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {tipos.map(t => (
                    <button key={t.v} onClick={() => setTipoPena(t.v)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${tipoPena === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{t.desc}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor del contrato ($)</label>
                        <input type="number" value={montoContrato} onChange={e => setMontoContrato(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>

                    {tipoPena === 'porcentaje' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Porcentaje de pena pactada (%)</label>
                            <input type="number" value={pctPena} onChange={e => setPctPena(e.target.value)} step="5"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    )}
                    {tipoPena === 'montoFijo' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Pena convencional fija ($)</label>
                            <input type="number" value={montoFijo} onChange={e => setMontoFijo(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    )}
                    {tipoPena === 'diasMora' && (
                        <>
                            <div>
                                <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">% diario de mora pactado (%)</label>
                                <input type="number" value={pctMoraDiaria} onChange={e => setPctMoraDiaria(e.target.value)} step="0.1"
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días de mora / retraso</label>
                                <input type="number" value={diasMora} onChange={e => setDiasMora(e.target.value)} min="1"
                                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                            </div>
                        </>
                    )}
                </div>

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">% del contrato ya cumplido (Art. 1843 CCF — reducción proporcional)</label>
                    <div className="flex gap-3 items-center">
                        <input type="range" min="0" max="100" step="5" value={pctCumplido} onChange={e => setPctCumplido(e.target.value)} className="flex-1" />
                        <span className="text-white font-mono w-12 text-right text-sm">{pctCumplido}%</span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Si se cumplió parcialmente, la pena se reduce en esa proporción.</p>
                </div>

                <button onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cuándo procede la cláusula penal? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
                        <h4 className="text-white font-bold">📋 Arts. 1840-1847 CCF — Cláusula penal</h4>
                        {[
                            ['Art. 1840', 'La pena convencional reemplaza la indemnización por daños y perjuicios.'],
                            ['Art. 1841', 'Solo se exige si hay incumplimiento total o parcial.'],
                            ['Art. 1843', 'Si hay cumplimiento parcial, la pena se reduce proporcionalmente.'],
                            ['Art. 1844', 'El acreedor puede exigir la pena O el cumplimiento del contrato, pero no ambos.'],
                            ['Jurisprudencia SCJN', 'La pena no puede exceder el valor total de la obligación (usura en contratos civiles).'],
                        ].map(([art, desc]) => (
                            <div key={art} className="flex gap-2">
                                <span className="text-[var(--color-accent)] font-bold whitespace-nowrap w-36">{art}</span>
                                <span className="text-white/60">{desc}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Cláusula penal a cobrar</h2>

                    {resultado.excedeLimite && (
                        <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                            <p className="text-orange-400 font-bold">⚠️ La pena excede el valor del contrato</p>
                            <p className="text-white/60 mt-1">Por jurisprudencia SCJN, la pena no puede ser mayor al monto total de la obligación. Se ajusta a ${fmtMXN(resultado.contrato)}.</p>
                        </div>
                    )}

                    <div className="space-y-2 text-sm mb-4">
                        {[
                            { l: 'Pena bruta pactada', v: resultado.penaBruta, c: 'text-white' },
                            ...(resultado.reduccion > 0 ? [{ l: `Reducción por cumplimiento parcial (${resultado.pctCumplido.toFixed(0)}% Art. 1843)`, v: -resultado.reduccion, c: 'text-blue-400' }] : []),
                            { l: '= Pena final exigible', v: resultado.excedeLimite ? resultado.penaAjustada : resultado.penaFinal, c: 'text-[var(--color-accent)]' },
                        ].map((r, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${i === (resultado.reduccion > 0 ? 2 : 1) ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={i === (resultado.reduccion > 0 ? 2 : 1) ? 'text-[var(--color-accent)] font-bold' : 'text-white/60 text-xs'}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.c} ${i === (resultado.reduccion > 0 ? 2 : 1) ? 'text-lg' : ''}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 1840-1847 CCF. Reducción proporcional Art. 1843. Límite SCJN: no mayor al valor contractual. No sustituye revisión del contrato por abogado.
            </p>
        </main>
    )
}
