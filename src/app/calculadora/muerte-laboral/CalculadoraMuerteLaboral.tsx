'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

export default function CalculadoraMuerteLaboral() {
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [numBeneficiarios, setNumBeneficiarios] = useState('3')
    const [tieneConyuge, setTieneConyuge] = useState(true)
    const [numHijos, setNumHijos] = useState('2')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sm = parseFloat(salarioMensual) || 0
        if (sm <= 0) return null
        const sd = sm / 30

        // Art. 502 LFT: 730 días de salario diario integrado
        const indemnizacion730 = sd * 730
        // Art. 501 LFT: gastos funerarios = 60 días SMG
        const gastosFunerarios = smg.general * 60
        // Pensión IMSS por viudez: 40% del SDI
        const pensionViudezMensual = sd * 30 * 0.40
        // Pensión IMSS por orfandad: 20% por cada hijo menor de 16 (o hasta 25 si estudia)
        const hijos = Math.max(parseInt(numHijos) || 0, 0)
        const pensionOrfandadMensual = sd * 30 * 0.20 * hijos
        const total = indemnizacion730 + gastosFunerarios

        return { sd, indemnizacion730, gastosFunerarios, pensionViudezMensual, pensionOrfandadMensual, total, hijos }
    }, [salarioMensual, numBeneficiarios, tieneConyuge, numHijos, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚰️</span><span>Muerte Laboral · Art. 502 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Indemnización por Muerte Laboral</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando un trabajador fallece por <strong className="text-white">riesgo de trabajo</strong>, sus beneficiarios
                    tienen derecho a <strong className="text-[var(--color-accent)]">730 días de salario</strong> + gastos funerarios
                    + pensiones IMSS (Art. 502 LFT).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos del caso</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual del trabajador ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de hijos menores</label>
                        <input type="number" value={numHijos} onChange={e => setNumHijos(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Menores 16 años o hasta 25 si estudian</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año de cálculo</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — SMG ${fmtMXN(getSMG(a).general)}/día</option>
                            ))}
                        </select>
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={tieneConyuge} onChange={e => setTieneConyuge(e.target.checked)}
                        className="w-4 h-4 rounded border border-white/20" />
                    <span className="text-sm text-white/80">Hay cónyuge o concubina(o) sobreviviente</span>
                </label>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="text-center"><p className="text-[10px] text-blue-400">SMG {smg.anio}</p><p className="text-xs text-white font-mono font-bold">${fmtMXN(smg.general)}/día</p></div>
                    <div className="text-center"><p className="text-[10px] text-blue-400">Gastos fun. (60 SMG)</p><p className="text-xs text-white font-mono font-bold">${fmtMXN(smg.general * 60)}</p></div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Derechos de los beneficiarios</h2>

                        {/* Indemnización inmediata */}
                        <div className="mb-4 p-4 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                            <p className="text-xs text-[var(--color-accent)] mb-1">Art. 502 LFT — Indemnización inmediata a beneficiarios</p>
                            <p className="text-3xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.total)}</p>
                            <p className="text-xs text-white/50 mt-1">= ${fmtMXN(resultado.indemnizacion730)} (730 días) + ${fmtMXN(resultado.gastosFunerarios)} (gastos funerarios)</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-xs text-[var(--color-text-muted)] mb-2 font-bold">INDEMNIZACIÓN (Pago único)</p>
                                {[
                                    { label: '730 días de SDI (Art. 502 LFT)', val: resultado.indemnizacion730 },
                                    { label: `Gastos funerarios 60 × SMG (${smg.anio})`, val: resultado.gastosFunerarios },
                                ].map((r, i) => (
                                    <div key={i} className="flex justify-between py-1.5 border-b border-white/5 text-xs">
                                        <span className="text-white/60">{r.label}</span>
                                        <span className="text-white font-mono">${fmtMXN(r.val)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-2 font-bold">PENSIONES IMSS (Mensuales, de por vida)</p>
                                {[
                                    { label: tieneConyuge ? 'Pensión viudez (40% SDI)' : 'Sin cónyuge', val: tieneConyuge ? resultado.pensionViudezMensual : 0 },
                                    { label: `Pensión orfandad (${resultado.hijos || 0} hijos × 20%)`, val: resultado.pensionOrfandadMensual },
                                ].map((r, i) => (
                                    <div key={i} className="flex justify-between py-1.5 border-b border-blue-500/10 text-xs">
                                        <span className="text-blue-300/70">{r.label}</span>
                                        <span className="text-blue-400 font-mono font-bold">${fmtMXN(r.val)}/mes</span>
                                    </div>
                                ))}
                                <p className="text-[10px] text-blue-400/50 mt-2">Arts. 64-65 LSS. Sujeto a calificación del IMSS.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                        <h3 className="text-orange-400 font-bold mb-3">⚠️ ¿Quiénes son beneficiarios (Art. 501 LFT)?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {[
                                { orden: '1°', quien: 'Viuda(o) o concubina(o)', req: 'Sin límite de edad. Concubina: mínimo 2 años o hijo en común' },
                                { orden: '2°', quien: 'Hijos menores de 16 años', req: 'O hasta 25 años si estudian. Incapacitados: sin límite de edad' },
                                { orden: '3°', quien: 'Ascendientes (padres)', req: 'Solo si eran dependientes económicos del trabajador' },
                            ].map(b => (
                                <div key={b.orden} className="flex gap-2 p-2 rounded-lg bg-white/5">
                                    <span className="text-orange-400 font-bold text-sm w-6">{b.orden}</span>
                                    <div><p className="text-white font-bold">{b.quien}</p><p className="text-white/50 text-[10px]">{b.req}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cuánto reciben los familiares si el trabajador muere en un accidente laboral?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El <strong>Art. 502 LFT</strong> establece que si un trabajador muere por riesgo de trabajo, sus beneficiarios
                    reciben <strong className="text-[var(--color-accent)]">730 días de salario diario integrado</strong> como indemnización.
                    Adicionalmente, el IMSS otorga pensiones de viudez (40% SDI/mes) y orfandad (20% por hijo).
                    Los gastos funerarios son hasta 60 días de SMG, pagados por el IMSS (Art. 104 LSS).
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora Accidente de Trabajo', href: '/calculadora/accidente-trabajo', desc: 'Incapacidad temporal o permanente' },
                        { title: 'Calculadora Pensión Alimenticia', href: '/calculadora/pension-alimenticia', desc: 'Manutención de hijos' },
                        { title: 'Cuotas IMSS (Prima RT)', href: '/calculadora/cuotas-imss', desc: 'Aportaciones patronales' },
                        { title: 'Calculadora Liquidación', href: '/calculadora-laboral', desc: 'Finiquito por otras causas' },
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
                * Art. 502 LFT (730 días). Art. 501 LFT (gastos funerarios). Arts. 64-65 LSS (pensiones). SMG {smg.anio}: ${fmtMXN(smg.general)}/día. No sustituye asesoría laboral.
            </p>
        </main>
    )
}
