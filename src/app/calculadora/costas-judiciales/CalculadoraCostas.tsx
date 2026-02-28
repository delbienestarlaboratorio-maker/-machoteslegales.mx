'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMXN } from '@/data/legal-constants'

type MateriaCostas = 'civil' | 'mercantil' | 'laboral' | 'familiar'

export default function CalculadoraCostas() {
    const [valorLitigio, setValorLitigio] = useState('500000')
    const [materia, setMateria] = useState<MateriaCostas>('civil')
    const [instancias, setInstancias] = useState('1')
    const [gano, setGano] = useState(true)

    const tasasCostas: { [k in MateriaCostas]: { min: number; max: number; art: string } } = {
        civil: { min: 0.10, max: 0.25, art: 'Art. 139 CFPC / Arancel local' },
        mercantil: { min: 0.08, max: 0.20, art: 'Art. 1084 C.Com' },
        laboral: { min: 0, max: 0, art: 'Art. 57 LFT — No hay costas en laboral' },
        familiar: { min: 0, max: 0, art: 'Arts. 940-941 CFPC — Exentas regularmente' },
    }

    const resultado = useMemo(() => {
        const v = parseFloat(valorLitigio) || 0
        if (v <= 0) return null
        const inst = parseInt(instancias) || 1
        const t = tasasCostas[materia]
        if (t.max === 0) return { sinCostas: true, motivo: t.art }

        const costasMin = v * t.min * inst
        const costasMax = v * t.max * inst
        const costasEstimado = v * ((t.min + t.max) / 2) * inst

        return { sinCostas: false, costasMin, costasMax, costasEstimado, tasa: t, inst }
    }, [valorLitigio, materia, instancias])

    const materias = [
        { v: 'civil' as MateriaCostas, icon: '⚖️', label: 'Civil', art: 'Art. 139 CFPC' },
        { v: 'mercantil' as MateriaCostas, icon: '🏢', label: 'Mercantil', art: 'Art. 1084 C.Com' },
        { v: 'laboral' as MateriaCostas, icon: '👷', label: 'Laboral', art: 'Art. 57 LFT' },
        { v: 'familiar' as MateriaCostas, icon: '👨‍👩‍👧', label: 'Familiar', art: 'Arts. 940-941 CFPC' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Costas Judiciales · Art. 139 CFPC + Art. 1084 C.Com</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Costas Judiciales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Las <strong className="text-white">costas procesales</strong> son los honorarios que paga la parte perdedora
                    al abogado ganador. Calcula el rango estimado según la materia y el valor del litigio.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {materias.map(m => (
                    <button key={m.v} onClick={() => setMateria(m.v)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${materia === m.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{m.icon}</p>
                        <p className="text-xs font-bold">{m.label}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{m.art}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor del litigio / monto reclamado ($)</label>
                        <input type="number" value={valorLitigio} onChange={e => setValorLitigio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Instancias del juicio</label>
                        <select value={instancias} onChange={e => setInstancias(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="1">1 instancia (juzgado)</option>
                            <option value="2">2 instancias (+ apelación)</option>
                            <option value="3">3 instancias (+ amparo)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setGano(true)}
                        className={`p-3 rounded-xl border font-bold text-sm transition-all cursor-pointer ${gano ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        ✅ Gané el juicio
                        <p className="text-xs font-normal mt-0.5 opacity-70">¿Cuánto me paga la contraparte?</p>
                    </button>
                    <button onClick={() => setGano(false)}
                        className={`p-3 rounded-xl border font-bold text-sm transition-all cursor-pointer ${!gano ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        ❌ Perdí el juicio
                        <p className="text-xs font-normal mt-0.5 opacity-70">¿Cuánto me cobrarán?</p>
                    </button>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    {resultado.sinCostas ? (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <p className="text-emerald-400 font-bold text-lg">✅ No hay costas en materia {materia}</p>
                            <p className="text-white/60 text-sm mt-1">{resultado.motivo}</p>
                            <p className="text-white/40 text-xs mt-2">
                                {materia === 'laboral' ? 'En materia laboral, el trabajador nunca paga costas (Art. 57 LFT).' : 'En asuntos familiares, el juez generalmente no condena en costas para proteger a la familia.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-white font-bold text-lg mb-4">
                                💰 {gano ? '¿Cuánto te pagarán?' : '¿Cuánto pagarás?'} — Costas en materia {materia}
                            </h2>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Mínimo ({(tasasCostas[materia].min * 100).toFixed(0)}%)</p>
                                    <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.costasMin)}</p>
                                </div>
                                <div className={`rounded-xl p-4 text-center ${gano ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                    <p className={`text-xs mb-1 ${gano ? 'text-emerald-400' : 'text-red-400'}`}>Estimado promedio</p>
                                    <p className={`text-2xl font-bold font-mono ${gano ? 'text-emerald-400' : 'text-red-400'}`}>${fmtMXN(resultado.costasEstimado)}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Máximo ({(tasasCostas[materia].max * 100).toFixed(0)}%)</p>
                                    <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.costasMax)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] p-3 rounded-lg bg-white/5">
                                <strong>{resultado.tasa.art}</strong>. El juez fija el monto exacto. Se multiplica por {resultado.inst} instancia{resultado.inst > 1 ? 's' : ''}.
                                El arancel local puede diferir al federal.
                            </p>
                        </>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué son las costas judiciales?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Las <strong>costas procesales</strong> son los honorarios que paga la parte que pierde el juicio al
                    abogado de la parte ganadora. En materia civil, el Art. 139 CFPC establece entre 10% y 25% del valor
                    del litigio. En mercantil, el Art. 1084 C.Com define cuándo procede la condena en costas.
                    <strong className="text-white"> En materia laboral, nunca se condenan costas al trabajador.</strong>
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 139 CFPC (civil). Art. 1084 C.Com (mercantil). Art. 57 LFT (laboral sin costas). El monto exacto lo fija el juez. No sustituye asesoría legal.
            </p>
        </main>
    )
}
