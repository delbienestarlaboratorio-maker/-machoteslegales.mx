'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, fmtMXN, calcularISR, getAniosDisponibles } from '@/data/legal-constants'

export default function CalculadoraNomina() {
    const [salarioBruto, setSalarioBruto] = useState('20000')
    const [periodo, setPeriodo] = useState<'mensual' | 'quincenal' | 'semanal'>('mensual')
    const [tieneInfonavit, setTieneInfonavit] = useState(false)
    const [descuentoInfonavit, setDescuentoInfonavit] = useState('5')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const uma = getUMA(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const bruto = parseFloat(salarioBruto) || 0
        if (bruto <= 0) return null

        // Normalizar a mensual
        const brutoMensual = periodo === 'quincenal' ? bruto * 2 : periodo === 'semanal' ? bruto * 4.33 : bruto

        // Cuotas IMSS obrero (simplificadas)
        const imssEnfMatBase = uma.mensual * 0.204 / brutoMensual > 1 ? brutoMensual * 0.003 : 0
        const excd = Math.max(brutoMensual - uma.mensual * 3, 0)
        const imssEnfMatExc = excd * 0.004
        const imssPrestDinero = brutoMensual * 0.0025
        const imssGastosMed = brutoMensual * 0.00375
        const imssInvalidez = brutoMensual * 0.00625
        const imssCEAV = brutoMensual * 0.01125
        const imssTotal = imssEnfMatExc + imssPrestDinero + imssGastosMed + imssInvalidez + imssCEAV

        // ISR mensual (tabla Art. 96 LISR)
        const isrMensual = calcularISR(brutoMensual)

        // INFONAVIT (si aplica)
        const descInfonavit = tieneInfonavit ? brutoMensual * (parseFloat(descuentoInfonavit) / 100) : 0

        const totalDeducciones = imssTotal + isrMensual + descInfonavit
        const netoMensual = brutoMensual - totalDeducciones

        // Por período
        const divisor = periodo === 'quincenal' ? 2 : periodo === 'semanal' ? 4.33 : 1
        const netoPeriodo = netoMensual / divisor

        const tasaEfectivaISR = brutoMensual > 0 ? (isrMensual / brutoMensual) * 100 : 0
        const pctNeto = brutoMensual > 0 ? (netoMensual / brutoMensual) * 100 : 0

        return {
            brutoMensual, imssTotal, isrMensual, descInfonavit,
            totalDeducciones, netoMensual, netoPeriodo, tasaEfectivaISR, pctNeto,
            desglose: [
                { label: 'IMSS obrero (cuotas)', val: -imssTotal, art: 'LSS' },
                { label: `ISR (tasa efectiva ${tasaEfectivaISR.toFixed(1)}%)`, val: -isrMensual, art: 'Art. 96 LISR' },
                ...(tieneInfonavit ? [{ label: `INFONAVIT (${descuentoInfonavit}% crédito)`, val: -descInfonavit, art: 'Ley Infonavit' }] : []),
            ]
        }
    }, [salarioBruto, periodo, tieneInfonavit, descuentoInfonavit, anioCalculo])

    const periodos = [
        { v: 'mensual' as const, label: 'Mensual' },
        { v: 'quincenal' as const, label: 'Quincenal' },
        { v: 'semanal' as const, label: 'Semanal' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💼</span><span>Nómina · Art. 96 LISR + LSS {anioCalculo}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Nómina Completa</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    De tu <strong className="text-white">salario bruto</strong> a lo que realmente recibes.
                    ISR progresivo Art. 96 LISR + cuotas IMSS obrero + INFONAVIT (si tienes crédito).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Tu salario</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario bruto ({periodo})</label>
                        <input type="number" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {periodos.map(p => (
                        <button key={p.v} onClick={() => setPeriodo(p.v)}
                            className={`p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${periodo === p.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                            {p.label}
                        </button>
                    ))}
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={tieneInfonavit} onChange={e => setTieneInfonavit(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm text-white/80">Tengo crédito INFONAVIT activo</span>
                </label>
                {tieneInfonavit && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Descuento INFONAVIT (%)</label>
                        <input type="number" value={descuentoInfonavit} onChange={e => setDescuentoInfonavit(e.target.value)} min="1" max="30"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    {/* Resultado principal */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu nómina neta</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Bruto mensual</p>
                                <p className="text-xl font-bold text-white font-mono">${fmtMXN(resultado.brutoMensual)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Total deducciones</p>
                                <p className="text-xl font-bold text-red-400 font-mono">-${fmtMXN(resultado.totalDeducciones)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30 md:col-span-1 col-span-2">
                                <p className="text-xs text-[var(--color-accent)] mb-1">NETO {periodo.toUpperCase()}</p>
                                <p className="text-3xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.netoPeriodo)}</p>
                                <p className="text-[10px] text-[var(--color-accent)]/60">{resultado.pctNeto.toFixed(1)}% del bruto mensual</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/60">Salario bruto mensual</span>
                                <span className="text-white font-mono">${fmtMXN(resultado.brutoMensual)}</span>
                            </div>
                            {resultado.desglose.map((d, i) => (
                                <div key={i} className="flex justify-between p-3 rounded-lg bg-white/5">
                                    <span className="text-white/60 text-xs">{d.label} <span className="text-[var(--color-text-muted)]">({d.art})</span></span>
                                    <span className="text-red-400 font-mono text-xs font-bold">-${fmtMXN(Math.abs(d.val))}</span>
                                </div>
                            ))}
                            <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                                <span className="text-[var(--color-accent)] font-bold">= NETO MENSUAL</span>
                                <span className="font-mono font-bold text-[var(--color-accent)] text-lg">${fmtMXN(resultado.netoMensual)}</span>
                            </div>
                        </div>

                        {/* Barra visual */}
                        <div className="relative h-8 rounded-full overflow-hidden bg-white/5">
                            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-[var(--color-accent)] transition-all rounded-full"
                                style={{ width: `${resultado.pctNeto}%` }} />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                Recibes {resultado.pctNeto.toFixed(1)}% de lo que te pagan en bruto
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Por qué mi neto es menor a mi salario bruto?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Tu salario bruto sufre tres deducciones obligatorias: <strong>ISR</strong> (impuesto sobre la renta progresivo,
                    Art. 96 LISR), <strong>cuotas IMSS obrero</strong> (seguridad social) y, si tienes crédito,
                    <strong> INFONAVIT</strong>. El ISR se calcula sobre el salario total y es la deducción más grande
                    para salarios altos.
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * ISR Art. 96 LISR. IMSS cuotas obrero LSS. UMA {uma.anio}: ${fmtMXN(uma.diaria)} diaria. Cálculo simplificado sin subsidio al empleo. No sustituye recibo de nómina del patrón.
            </p>
        </main>
    )
}
