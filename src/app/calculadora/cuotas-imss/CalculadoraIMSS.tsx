'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

interface RamoIMSS {
    nombre: string
    patronPct: number
    obreroPct: number
    base: string
    fundamento: string
}

const RAMOS_IMSS: RamoIMSS[] = [
    { nombre: 'Enfermedades y Maternidad (cuota fija)', patronPct: 20.40, obreroPct: 0, base: 'UMA', fundamento: 'Art. 106 Fr. I LSS' },
    { nombre: 'Enfermedades y Maternidad (excedente 3 UMAs)', patronPct: 1.10, obreroPct: 0.40, base: 'Excedente', fundamento: 'Art. 106 Fr. II LSS' },
    { nombre: 'Prestaciones en dinero', patronPct: 0.70, obreroPct: 0.25, base: 'SDI', fundamento: 'Art. 107 LSS' },
    { nombre: 'Gastos médicos pensionados', patronPct: 1.05, obreroPct: 0.375, base: 'SDI', fundamento: 'Art. 25 LSS' },
    { nombre: 'Invalidez y Vida', patronPct: 1.75, obreroPct: 0.625, base: 'SDI', fundamento: 'Art. 147 LSS' },
    { nombre: 'CEAV (Cesantía y Vejez)', patronPct: 3.150, obreroPct: 1.125, base: 'SDI', fundamento: 'Art. 168 LSS (2026)' },
    { nombre: 'Guarderías y PS', patronPct: 1.00, obreroPct: 0, base: 'SDI', fundamento: 'Art. 211 LSS' },
    { nombre: 'Retiro (SAR)', patronPct: 2.00, obreroPct: 0, base: 'SDI', fundamento: 'Art. 168 LSS' },
    { nombre: 'Infonavit', patronPct: 5.00, obreroPct: 0, base: 'SDI', fundamento: 'Art. 29 Fr. II Ley Infonavit' },
]

export default function CalculadoraIMSS() {
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [primaRT, setPrimaRT] = useState('0.54355')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sm = parseFloat(salarioMensual) || 0
        if (sm <= 0) return null

        const sdi = sm / 30 // Simplificado (sin factor integración)
        const topeSDI = uma.diaria * 25
        const sdiTopado = Math.min(sdi, topeSDI)
        const superaTope = sdi > topeSDI
        const rt = parseFloat(primaRT) || 0.54355

        // Calcular cada ramo
        const desglose = RAMOS_IMSS.map(ramo => {
            let baseCalculo = sdiTopado
            let patronMensual = 0
            let obreroMensual = 0

            if (ramo.base === 'UMA') {
                // Cuota fija sobre UMA
                patronMensual = uma.diaria * 30 * (ramo.patronPct / 100)
                obreroMensual = uma.diaria * 30 * (ramo.obreroPct / 100)
            } else if (ramo.base === 'Excedente') {
                // Solo sobre el excedente de 3 UMAs
                const excedente = Math.max(sdiTopado - (uma.diaria * 3), 0)
                baseCalculo = excedente
                patronMensual = excedente * 30 * (ramo.patronPct / 100)
                obreroMensual = excedente * 30 * (ramo.obreroPct / 100)
            } else {
                patronMensual = sdiTopado * 30 * (ramo.patronPct / 100)
                obreroMensual = sdiTopado * 30 * (ramo.obreroPct / 100)
            }

            return { ...ramo, baseCalculo, patronMensual, obreroMensual, totalMensual: patronMensual + obreroMensual }
        })

        // Riesgo de trabajo
        const rtPatron = sdiTopado * 30 * (rt / 100)
        desglose.splice(4, 0, {
            nombre: 'Riesgos de Trabajo', patronPct: rt, obreroPct: 0,
            base: 'SDI', fundamento: 'Art. 71 LSS',
            baseCalculo: sdiTopado, patronMensual: rtPatron, obreroMensual: 0, totalMensual: rtPatron
        })

        const totalPatronMes = desglose.reduce((s, d) => s + d.patronMensual, 0)
        const totalObreroMes = desglose.reduce((s, d) => s + d.obreroMensual, 0)
        const totalMes = totalPatronMes + totalObreroMes

        return { desglose, totalPatronMes, totalObreroMes, totalMes, sdi, sdiTopado, topeSDI, superaTope }
    }, [salarioMensual, primaRT, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏥</span><span>Calculadora IMSS · LSS {anioCalculo}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Cuotas IMSS</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Desglose completo de cuotas <strong className="text-white">obrero-patronales</strong> por ramo de seguro.
                    Tope SDI: 25 UMAs (${fmtMXN(uma.diaria * 25)}/día en {uma.anio}).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Prima de RT (%)</label>
                        <input type="number" value={primaRT} onChange={e => setPrimaRT(e.target.value)} step="0.001"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Media: 0.54355% (Clase II)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año de cálculo</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Resumen mensual</h2>

                        {resultado.superaTope && (
                            <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                                <p className="text-orange-400 font-bold">⚠️ SDI excede tope de 25 UMAs</p>
                                <p className="text-white/60">SDI real: ${fmtMXN(resultado.sdi)} → Topado: ${fmtMXN(resultado.topeSDI)} (Art. 28 LSS)</p>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Patrón paga</p>
                                <p className="text-xl font-bold text-red-400 font-mono">${fmtMXN(resultado.totalPatronMes)}</p>
                                <p className="text-[10px] text-red-400/60">/mes</p>
                            </div>
                            <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-1">Trabajador paga</p>
                                <p className="text-xl font-bold text-blue-400 font-mono">${fmtMXN(resultado.totalObreroMes)}</p>
                                <p className="text-[10px] text-blue-400/60">/mes</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Total mensual</p>
                                <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.totalMes)}</p>
                                <p className="text-[10px] text-[var(--color-accent)]/60">${fmtMXN(resultado.totalMes * 12)}/año</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 text-[var(--color-text-muted)]">Ramo</th>
                                        <th className="text-right py-2 text-red-400">Patrón</th>
                                        <th className="text-right py-2 text-blue-400">Obrero</th>
                                        <th className="text-right py-2 text-[var(--color-accent)]">Total</th>
                                        <th className="text-left py-2 text-[var(--color-text-muted)]">Fund.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.desglose.map((d, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-2 text-white text-[11px] max-w-[200px]">{d.nombre}</td>
                                            <td className="text-right py-2 text-red-400 font-mono">${fmtMXN(d.patronMensual)}</td>
                                            <td className="text-right py-2 text-blue-400 font-mono">${fmtMXN(d.obreroMensual)}</td>
                                            <td className="text-right py-2 text-[var(--color-accent)] font-mono font-bold">${fmtMXN(d.totalMensual)}</td>
                                            <td className="py-2 text-[var(--color-text-muted)] text-[10px]">{d.fundamento}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5">
                                        <td className="py-2 text-white font-bold">TOTAL MENSUAL</td>
                                        <td className="text-right py-2 text-red-400 font-mono font-bold">${fmtMXN(resultado.totalPatronMes)}</td>
                                        <td className="text-right py-2 text-blue-400 font-mono font-bold">${fmtMXN(resultado.totalObreroMes)}</td>
                                        <td className="text-right py-2 text-[var(--color-accent)] font-mono font-bold">${fmtMXN(resultado.totalMes)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo funcionan las cuotas IMSS?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Las <strong>cuotas obrero-patronales</strong> se calculan sobre el Salario Diario Integrado (SDI) del trabajador,
                    con un tope de <strong>25 UMAs diarias</strong> (${fmtMXN(uma.diaria * 25)}/día en {uma.anio}). La Ley del Seguro Social establece
                    porcentajes específicos por ramo: Enfermedades y Maternidad, Invalidez y Vida, Riesgos de Trabajo,
                    CEAV (Cesantía en Edad Avanzada y Vejez), Guarderías, Retiro (SAR) e Infonavit.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora SDI', href: '/calculadora/salario-diario-integrado', desc: 'Factor de integración' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Tope SDI en UMAs' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'ISR de tu liquidación' },
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Liquidación laboral completa' },
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
                * Ley del Seguro Social. Tope 25 UMAs (Art. 28 LSS). CEAV: cuotas reforma 2020 (transición 2023-2030). UMA {uma.anio}: ${fmtMXN(uma.diaria)}.
            </p>
        </main>
    )
}
