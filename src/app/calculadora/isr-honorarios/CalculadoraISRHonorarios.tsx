'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, calcularISR, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

export default function CalculadoraISRHonorarios() {
    const [ingresosMensual, setIngresosMensual] = useState('50000')
    const [gastosMensual, setGastosMensual] = useState('15000')
    const [acumuladoAnio, setAcumuladoAnio] = useState('200000')
    const [isrPagado, setIsrPagado] = useState('18000')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [showDeducibles, setShowDeducibles] = useState(false)

    const resultado = useMemo(() => {
        const ing = parseFloat(ingresosMensual) || 0
        const gas = parseFloat(gastosMensual) || 0
        const acum = parseFloat(acumuladoAnio) || 0
        const pagado = parseFloat(isrPagado) || 0
        if (ing <= 0) return null

        // Pago provisional Art. 106 LISR: 20% sobre ingresos brutos o tabla Art. 96 si es menor
        const baseGravable = Math.max(ing - gas, 0)
        const isrPPTabla = calcularISR(baseGravable) // tasa tabla
        const isrPP20Pct = ing * 0.20 // tasa fija 20%

        // Art. 106 LISR: el pago provisional es el mayor de los dos menos pagos anteriores
        const isrPPBruto = Math.max(isrPPTabla, 0)
        const isrAPagar = Math.max(isrPPBruto - pagado, 0)

        // ISR anual estimado (proyección 12 meses)
        const ingAnualEstimado = ing * 12
        const gasAnualEstimado = gas * 12
        const baseAnual = Math.max(ingAnualEstimado - gasAnualEstimado, 0)
        const isrAnualEstimado = calcularISR(baseAnual) * 12

        // Retención del cliente (si aplica para personas morales)
        const retencionCliente = ing * 0.10 // Art. 106 LISR: 10% retención PM

        const tasaEfectiva = ing > 0 ? (isrPPBruto / ing) * 100 : 0

        return { ing, gas, baseGravable, isrPPTabla, isrPP20Pct, isrPPBruto, isrAPagar, ingAnualEstimado, isrAnualEstimado, retencionCliente, tasaEfectiva }
    }, [ingresosMensual, gastosMensual, acumuladoAnio, isrPagado, anioCalculo])

    const deducibles = [
        { cat: '🏠 Renta de oficina', desc: 'Si usas parte de tu casa como oficina (proporcional)' },
        { cat: '💻 Equipo de cómputo', desc: 'Depreciación anual (hasta 25% si es nuevo)' },
        { cat: '📚 Libros y revistas', desc: 'Acervos jurídicos, suscripciones profesionales' },
        { cat: '🚗 Automóvil', desc: 'Cuando se usa para trabajo, proporcional al uso' },
        { cat: '📱 Teléfono y comunicaciones', desc: 'Parte laboral del celular y internet' },
        { cat: '👔 Honorarios de contador', desc: 'Tu propio contador también es deducible' },
        { cat: '⚕️ Gastos médicos (personales)', desc: 'Deducciones personales Art. 151 LISR' },
        { cat: '💰 Donativos', desc: 'A donatarias autorizadas hasta 7% de ingresos anuales' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧾</span><span>ISR Honorarios · Arts. 100-106 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR para Honorarios Profesionales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula tu <strong className="text-white">pago provisional mensual de ISR</strong> como abogado, médico,
                    contador u otro profesionista independiente. Persona física con actividad profesional
                    (Art. 100 LISR).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">📋 Datos del mes</h2>
                    <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                        {getAniosDisponibles().map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos del mes ($) — total honorarios cobrados</label>
                        <input type="number" value={ingresosMensual} onChange={e => setIngresosMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Gastos deducibles del mes ($)</label>
                        <input type="number" value={gastosMensual} onChange={e => setGastosMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Renta, cómputo, teléfono, materiales, etc. (con CFDI)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">ISR ya pagado / retenido este año ($)</label>
                        <input type="number" value={isrPagado} onChange={e => setIsrPagado(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Pagos provisionales anteriores + retenciones de clientes</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos acumulados en el año ($)</label>
                        <input type="number" value={acumuladoAnio} onChange={e => setAcumuladoAnio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <button onClick={() => setShowDeducibles(!showDeducibles)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Qué puedo deducir como profesionista? <span className={`transition-transform ${showDeducibles ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showDeducibles && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {deducibles.map((d, i) => (
                            <div key={i} className="flex gap-2 p-3 rounded-lg bg-white/5 text-xs">
                                <span className="text-lg flex-shrink-0">{d.cat.split(' ')[0]}</span>
                                <div><p className="text-white font-bold">{d.cat.split(' ').slice(1).join(' ')}</p><p className="text-white/50 text-[10px] mt-0.5">{d.desc}</p></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu pago provisional ISR</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Ingresos brutos</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.ing)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Gastos deducibles</p>
                                <p className="text-lg font-bold text-white font-mono">-${fmtMXN(resultado.gas)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Base gravable</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.baseGravable)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">ISR a pagar este mes</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.isrAPagar)}</p>
                                <p className="text-[10px] text-[var(--color-accent)]/60">Tasa efectiva: {resultado.tasaEfectiva.toFixed(1)}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                                <h4 className="text-blue-400 font-bold mb-2">🔒 Retención de persona moral (Art. 106 LISR)</h4>
                                <p className="text-white/70">Si tu cliente es persona moral, te retiene el <strong className="text-blue-400">10%</strong> = <strong className="text-white font-mono">${fmtMXN(resultado.retencionCliente)}</strong>. Esa retención la acreditas en tu pago provisional.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                                <h4 className="text-orange-400 font-bold mb-2">📅 Vence el 17 de cada mes</h4>
                                <p className="text-white/70">El pago provisional se presenta ante el SAT mediante declaración mensual en el portal. Usa la herramienta <strong className="text-orange-400">DeclaraSAT</strong>.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-white/5 text-xs">
                            <p className="text-white/60">Proyección anual estimada: ingresos <strong className="text-white font-mono">${fmtMXN(resultado.ingAnualEstimado)}</strong> → ISR anual estimado <strong className="text-[var(--color-accent)] font-mono">${fmtMXN(resultado.isrAnualEstimado)}</strong></p>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo funciona el ISR para honorarios profesionales?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Como persona física con <strong>actividad profesional</strong> (Arts. 100-109 LISR), debes presentar pagos
                    provisionales mensuales al SAT. La base gravable es: <em>ingresos − deducciones autorizadas</em>.
                    Si tu cliente es persona moral, te retiene el 10% y lo cubre directamente al SAT. Al año siguiente
                    presentas la declaración anual donde acreditas todo lo pagado.
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 100-106 LISR. Tablas ISR Art. 96. Retención 10% Art. 106 Fr. II. Cálculo estimado; no sustituye asesoría fiscal ni plataforma SAT.
            </p>
        </main>
    )
}
