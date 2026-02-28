'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

export default function CalculadoraDescuentoNomina() {
    const [salarioDiario, setSalarioDiario] = useState('500')
    const [diasTrabajados, setDiasTrabajados] = useState('30')
    const [pensionAlimenticia, setPensionAlimenticia] = useState('20')
    const [prestamoPct, setPrestamoPct] = useState('10')
    const [cuotaIMSSOb, setCuotaIMSSOb] = useState('3.0')
    const [cuotaInfonavit, setCuotaInfonavit] = useState('5.0')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [showInfo, setShowInfo] = useState(false)

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sd = parseFloat(salarioDiario) || 0
        const dias = parseInt(diasTrabajados) || 30
        const salarioNominal = sd * dias
        if (salarioNominal <= 0) return null

        // Descuentos permitidos (Art. 110 LFT)
        const imssOb = salarioNominal * (parseFloat(cuotaIMSSOb) / 100)
        const isrEstimado = salarioNominal * 0.064 // tasa efectiva promedio estimada
        const infonavit = salarioNominal * (parseFloat(cuotaInfonavit) / 100)
        const pension = salarioNominal * (parseFloat(pensionAlimenticia) / 100)
        const prestamo = salarioNominal * (parseFloat(prestamoPct) / 100)

        const totalDescuentos = imssOb + isrEstimado + infonavit + pension + prestamo
        const neto = salarioNominal - totalDescuentos
        const salidaMinimaLegal = smg.general * dias // salario no puede quedar por debajo del SMG

        return {
            salarioNominal, imssOb, isrEstimado, infonavit, pension, prestamo,
            totalDescuentos, neto, salidaMinimaLegal,
            violaSMG: neto < salidaMinimaLegal
        }
    }, [salarioDiario, diasTrabajados, pensionAlimenticia, prestamoPct, cuotaIMSSOb, cuotaInfonavit, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💰</span><span>Descuentos Nómina · Art. 110 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Descuentos de Nómina</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Qué pueden descontarte legalmente de tu salario?
                    El <strong className="text-white">Art. 110 LFT</strong> limita los descuentos permitidos.
                    Calcula tu nómina neto real.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Tu nómina</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario diario ($)</label>
                        <input type="number" value={salarioDiario} onChange={e => setSalarioDiario(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días del período</label>
                        <input type="number" value={diasTrabajados} onChange={e => setDiasTrabajados(e.target.value)} min="1" max="30"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — SMG ${fmtMXN(getSMG(a).general)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <h3 className="text-white font-bold text-sm pt-2 border-t border-white/10">Descuentos aplicables (%)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Cuota IMSS obrero', val: cuotaIMSSOb, set: setCuotaIMSSOb, hint: 'Art. 110 Fr. I' },
                        { label: 'ISR (estimado)', val: '6.4', set: () => { }, hint: 'Art. 96 LISR — auto', disabled: true },
                        { label: 'Pensión alim. (%)', val: pensionAlimenticia, set: setPensionAlimenticia, hint: 'Art. 110 Fr. V LFT' },
                        { label: 'Préstamo patrón (%)', val: prestamoPct, set: setPrestamoPct, hint: 'Máx 30% diario Art. 110 Fr. III' },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">{f.label}</label>
                            <input type="number" value={f.val} onChange={e => !f.disabled && f.set(e.target.value)}
                                disabled={f.disabled}
                                className={`w-full p-3 rounded-xl border text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors ${f.disabled ? 'bg-white/3 border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`} />
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{f.hint}</p>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Qué no pueden descontarme? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                                <h5 className="text-emerald-400 font-bold mb-1">✅ Descuentos PERMITIDOS (Art. 110 LFT)</h5>
                                <ul className="text-white/60 space-y-0.5 list-disc pl-3">
                                    <li>IMSS (deuda del trabajador)</li>
                                    <li>ISR (retención Art. 96 LISR)</li>
                                    <li>Préstamos del patrón (máx 30%/día)</li>
                                    <li>Renta habitación (máx 15%)</li>
                                    <li>Pensión alimenticia (resolución judicial)</li>
                                    <li>Cuotas sindicales</li>
                                    <li>INFONAVIT (crédito vivienda)</li>
                                </ul>
                            </div>
                            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                <h5 className="text-red-400 font-bold mb-1">🚫 Descuentos PROHIBIDOS</h5>
                                <ul className="text-white/60 space-y-0.5 list-disc pl-3">
                                    <li>Multas (Art. 107 LFT)</li>
                                    <li>Daños a equipo sin sentencia</li>
                                    <li>Por pérdidas de caja sin comprobación</li>
                                    <li>Por herramientas o ropa de trabajo</li>
                                    <li>Descuentos que dejen salario debajo del SMG</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Tu nómina neta</h2>

                    {resultado.violaSMG && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                            <p className="text-red-400 font-bold">⚠️ Los descuentos dejan el salario por debajo del SMG</p>
                            <p className="text-white/60 mt-1">SMG {smg.anio} × {diasTrabajados} días = ${fmtMXN(resultado.salidaMinimaLegal)} mínimo. Art. 90 LFT: el salario no puede ser menor al mínimo.</p>
                        </div>
                    )}

                    <div className="space-y-2 text-sm mb-4">
                        {[
                            { label: 'Salario bruto', valor: resultado.salarioNominal, color: 'text-white' },
                            { label: 'IMSS obrero', valor: -resultado.imssOb, color: 'text-blue-400' },
                            { label: 'ISR estimado (6.4%)', valor: -resultado.isrEstimado, color: 'text-orange-400' },
                            { label: 'Pensión alimenticia', valor: -resultado.pension, color: 'text-purple-400' },
                            { label: 'Préstamo patrón', valor: -resultado.prestamo, color: 'text-yellow-400' },
                        ].map((r, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg bg-white/5`}>
                                <span className="text-white/60 text-xs">{r.label}</span>
                                <span className={`font-mono text-xs font-bold ${r.color}`}>{r.valor >= 0 ? '' : '-'}${fmtMXN(Math.abs(r.valor))}</span>
                            </div>
                        ))}
                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                            <span className="text-[var(--color-accent)] font-bold">NETO A RECIBIR</span>
                            <span className="font-mono font-bold text-[var(--color-accent)] text-lg">${fmtMXN(resultado.neto)}</span>
                        </div>
                    </div>

                    <div className="relative h-8 rounded-full overflow-hidden bg-white/5">
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-[var(--color-accent)] rounded-full transition-all"
                            style={{ width: `${(resultado.neto / resultado.salarioNominal) * 100}%` }} />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            Recibes {((resultado.neto / resultado.salarioNominal) * 100).toFixed(1)}% del bruto
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cuánto pueden descontarte legalmente de tu salario?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El <strong>Art. 110 LFT</strong> regula los descuentos permitidos en nómina. Algunos son obligatorios
                    (IMSS, ISR, INFONAVIT con crédito), otros son voluntarios (préstamos del patrón, sindicato).
                    En ningún caso el salario neto puede quedar por debajo del <strong>salario mínimo</strong>.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Cuotas IMSS', href: '/calculadora/cuotas-imss', desc: 'Desglose completo por ramo' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'ISR de tu liquidación' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Valores en UMAs' },
                        { title: 'Calculadora Liquidación', href: '/calculadora-laboral', desc: 'Finiquito y liquidación' },
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
                * Art. 110 LFT (descuentos). Art. 107 LFT (multas prohibidas). SMG {smg.anio}: ${fmtMXN(smg.general)}/día. ISR estimado; el real depende de deducciones personales.
            </p>
        </main>
    )
}
