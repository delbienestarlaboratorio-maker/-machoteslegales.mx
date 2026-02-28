'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMXN } from '@/data/legal-constants'

const UDI_2026 = 8.25 // Valor aprox UDI febrero 2026
const EXENCION_UDIS = 700000
const ISR_VENTA_TABLA = [
    { limInf: 0.01, limSup: 8952.49, cuota: 0, pct: 1.92 },
    { limInf: 8952.50, limSup: 75984.55, cuota: 171.88, pct: 6.40 },
    { limInf: 75984.56, limSup: 133536.07, cuota: 4461.94, pct: 10.88 },
    { limInf: 133536.08, limSup: 155229.80, cuota: 10723.55, pct: 16.00 },
    { limInf: 155229.81, limSup: 185852.57, cuota: 13994.52, pct: 17.92 },
    { limInf: 185852.58, limSup: 374837.88, cuota: 19682.13, pct: 21.36 },
    { limInf: 374837.89, limSup: 590795.99, cuota: 60049.40, pct: 23.52 },
    { limInf: 590796.00, limSup: 1127926.84, cuota: 110842.74, pct: 30.00 },
    { limInf: 1127926.85, limSup: 1503902.46, cuota: 271981.99, pct: 32.00 },
    { limInf: 1503902.47, limSup: 4511707.37, cuota: 392294.17, pct: 34.00 },
    { limInf: 4511707.38, limSup: Infinity, cuota: 1414947.85, pct: 35.00 },
]

function calcISRAnual(base: number): number {
    if (base <= 0) return 0
    for (const r of ISR_VENTA_TABLA) {
        if (base >= r.limInf && base <= r.limSup) {
            return r.cuota + ((base - r.limInf) * r.pct / 100)
        }
    }
    const u = ISR_VENTA_TABLA[ISR_VENTA_TABLA.length - 1]
    return u.cuota + ((base - u.limInf) * u.pct / 100)
}

export default function CalculadoraPlusvaliaISR() {
    const [precioVenta, setPrecioVenta] = useState('3000000')
    const [precioCompra, setPrecioCompra] = useState('1500000')
    const [aniosTenencia, setAniosTenencia] = useState('5')
    const [esViviendaHabitual, setEsViviendaHabitual] = useState(true)
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const venta = parseFloat(precioVenta) || 0
        const compra = parseFloat(precioCompra) || 0
        const anios = parseInt(aniosTenencia) || 1
        if (venta <= 0) return null

        // Exención vivienda habitual: hasta 700,000 UDIS
        const montoExencion = esViviendaHabitual ? EXENCION_UDIS * UDI_2026 : 0
        const gananciaTotal = venta - compra
        const gananciaGravable = esViviendaHabitual ? Math.max(gananciaTotal - montoExencion, 0) : gananciaTotal

        // Ganancia acumulable (dividida entre años de tenencia, máx 20)
        const aniosTope = Math.min(Math.max(anios, 1), 20)
        const gananciaAnual = gananciaGravable / aniosTope

        // ISR sobre la ganancia anual
        const isrAnual = calcISRAnual(gananciaAnual)

        // Tasa efectiva
        const tasaEfectiva = gananciaAnual > 0 ? (isrAnual / gananciaAnual) * 100 : 0

        // ISR total = tasa efectiva × ganancia total gravable
        const isrTotal = gananciaGravable * (tasaEfectiva / 100)

        const netoVenta = venta - isrTotal

        return {
            venta, compra, gananciaTotal, montoExencion,
            gananciaGravable, aniosTope, gananciaAnual,
            isrAnual, tasaEfectiva, isrTotal, netoVenta,
            esExenta: gananciaGravable === 0
        }
    }, [precioVenta, precioCompra, aniosTenencia, esViviendaHabitual])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏠</span><span>ISR Plusvalía · Arts. 119-128 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora ISR por <span className="gradient-gold">Venta de Inmueble</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula el ISR que pagarás al vender tu casa, departamento o terreno. Si es tu
                    <strong className="text-emerald-400"> vivienda habitual</strong>, puedes estar exento hasta
                    700,000 UDIS (${fmtMXN(EXENCION_UDIS * UDI_2026)}).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos de la operación</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Precio de venta ($)</label>
                        <input type="number" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Precio de compra original ($)</label>
                        <input type="number" value={precioCompra} onChange={e => setPrecioCompra(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de tenencia</label>
                        <input type="number" value={aniosTenencia} onChange={e => setAniosTenencia(e.target.value)} min="1" max="30"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={esViviendaHabitual} onChange={e => setEsViviendaHabitual(e.target.checked)}
                        className="w-4 h-4 rounded border border-white/20" />
                    <div>
                        <span className="text-sm text-white/80">Es mi vivienda habitual</span>
                        <p className="text-[10px] text-emerald-400">Exenta hasta 700,000 UDIS (${fmtMXN(EXENCION_UDIS * UDI_2026)}). Art. 93 Fr. XIX LISR</p>
                    </div>
                </label>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo funciona el ISR por venta de inmueble? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <h4 className="text-white font-bold text-sm">Procedimiento Art. 120 LISR</h4>
                        <ol className="text-white/60 space-y-1 list-decimal pl-4">
                            <li>Se calcula la <strong className="text-white">ganancia</strong> (venta − compra actualizada)</li>
                            <li>Si es vivienda habitual, se exentan hasta 700K UDIS</li>
                            <li>Ganancia gravable ÷ años de tenencia (máx 20) = <strong className="text-white">ganancia anual</strong></li>
                            <li>Se aplica tabla ISR anual sobre la ganancia anual → <strong className="text-white">tasa efectiva</strong></li>
                            <li>Tasa efectiva × ganancia total gravable = <strong className="text-red-400">ISR a pagar</strong></li>
                        </ol>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                            <p className="text-emerald-400 font-bold">✅ Exención vivienda habitual (Art. 93 Fr. XIX LISR)</p>
                            <p className="text-white/60">Aplica UNA vez cada 3 años. Máximo 700,000 UDIS ≈ ${fmtMXN(EXENCION_UDIS * UDI_2026)} (UDI {UDI_2026})</p>
                        </div>
                        <p className="text-white/60">El notario retiene el ISR al momento de la escrituración. Si no aplica exención, el notario calcula y paga por ti.</p>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 ISR por tu venta</h2>

                        {resultado.esExenta && (
                            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                                <p className="text-emerald-400 font-bold">🎉 ¡Tu venta está EXENTA de ISR!</p>
                                <p className="text-white/60 mt-1">La ganancia (${fmtMXN(resultado.gananciaTotal)}) no excede la exención de 700K UDIS (${fmtMXN(resultado.montoExencion)}).</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Ganancia</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.gananciaTotal)}</p>
                            </div>
                            {resultado.montoExencion > 0 && (
                                <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                    <p className="text-xs text-emerald-400 mb-1">Exención</p>
                                    <p className="text-lg font-bold text-emerald-400 font-mono">-${fmtMXN(Math.min(resultado.gananciaTotal, resultado.montoExencion))}</p>
                                </div>
                            )}
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">ISR a pagar</p>
                                <p className="text-xl font-bold text-red-400 font-mono">${fmtMXN(resultado.isrTotal)}</p>
                                <p className="text-[10px] text-red-400/60">{resultado.tasaEfectiva.toFixed(1)}% efectiva</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Recibes neto</p>
                                <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.netoVenta)}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            {[
                                { label: 'Precio de venta', valor: resultado.venta },
                                { label: '(−) Costo de adquisición', valor: -resultado.compra },
                                { label: '(=) Ganancia total', valor: resultado.gananciaTotal },
                                ...(resultado.montoExencion > 0 ? [{ label: '(−) Exención 700K UDIS', valor: -Math.min(resultado.gananciaTotal, resultado.montoExencion) }] : []),
                                { label: '(=) Ganancia gravable', valor: resultado.gananciaGravable },
                                { label: `(÷) Años de tenencia (${resultado.aniosTope})`, valor: resultado.gananciaAnual },
                                { label: `(×) Tasa efectiva ISR`, valor: resultado.tasaEfectiva },
                                { label: '(=) ISR a pagar', valor: resultado.isrTotal },
                            ].map((r, i) => (
                                <div key={i} className={`flex justify-between p-3 rounded-lg ${r.label.includes('ISR a pagar') ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5'}`}>
                                    <span className="text-white/60 text-xs">{r.label}</span>
                                    <span className={`font-mono text-xs ${r.label.includes('ISR a pagar') ? 'text-red-400 font-bold' : r.label.includes('Tasa') ? 'text-[var(--color-accent)]' : 'text-white'}`}>
                                        {r.label.includes('Tasa') ? `${(r.valor as number).toFixed(2)}%` : `$${fmtMXN(r.valor as number)}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cuánto ISR pago al vender mi casa en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Al vender un inmueble, debes pagar ISR sobre la <strong>ganancia</strong> (plusvalía). Si es tu
                    <strong className="text-emerald-400"> vivienda habitual</strong>, puedes estar exento hasta 700,000 UDIS
                    (~${fmtMXN(EXENCION_UDIS * UDI_2026)} en 2026). El notario público calcula y retiene el ISR al escriturar.
                    La ganancia se divide entre los años de tenencia para determinar una tasa efectiva más baja.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Contrato de Compraventa', href: '/plantillas/inmobiliario', desc: 'Contrato de compraventa de inmueble' },
                        { title: 'Calculadora ISR Renta', href: '/calculadora/isr-arrendamiento', desc: 'ISR por renta de inmueble' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Costos notariales en UMAs' },
                        { title: 'Calculadora Intereses Moratorios', href: '/calculadora/intereses-moratorios', desc: 'Intereses por pagos tardíos' },
                    ].map(t => (
                        <Link key={t.href + t.title} href={t.href}
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
                * Arts. 119-128 LISR. Exención Art. 93 Fr. XIX (700K UDIS, UDI=${UDI_2026}). Tabla ISR anual Art. 152 LISR. El notario retiene el ISR. No sustituye asesoría fiscal.
            </p>
        </main>
    )
}
