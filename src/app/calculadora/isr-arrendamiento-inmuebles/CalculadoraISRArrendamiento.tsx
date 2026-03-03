'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tarifa Mensual 2026 (Art. 96 LISR)
const TARIFA_MENSUAL_2026 = [
    { limiteInf: 0, limiteSup: 746.04, cuotaFija: 0, tasa: 0.0192 },
    { limiteInf: 746.05, limiteSup: 6332.05, cuotaFija: 14.32, tasa: 0.0640 },
    { limiteInf: 6332.06, limiteSup: 11128.01, cuotaFija: 371.83, tasa: 0.1088 },
    { limiteInf: 11128.02, limiteSup: 12935.82, cuotaFija: 893.63, tasa: 0.1600 },
    { limiteInf: 12935.83, limiteSup: 15487.71, cuotaFija: 1182.88, tasa: 0.1792 },
    { limiteInf: 15487.72, limiteSup: 31236.49, cuotaFija: 1640.18, tasa: 0.2136 },
    { limiteInf: 31236.50, limiteSup: 49233.00, cuotaFija: 5004.12, tasa: 0.2352 },
    { limiteInf: 49233.01, limiteSup: 93993.90, cuotaFija: 9236.89, tasa: 0.3000 },
    { limiteInf: 93993.91, limiteSup: 125325.20, cuotaFija: 22665.17, tasa: 0.3200 },
    { limiteInf: 125325.21, limiteSup: 375975.61, cuotaFija: 32691.18, tasa: 0.3400 },
    { limiteInf: 375975.62, limiteSup: Infinity, cuotaFija: 117912.32, tasa: 0.3500 },
]

function calcularISRMensual(base: number): number {
    const tramo = TARIFA_MENSUAL_2026.find(t => base >= t.limiteInf && base <= t.limiteSup)
    if (!tramo) return 0
    return tramo.cuotaFija + (base - tramo.limiteInf) * tramo.tasa
}

export default function CalculadoraISRArrendamiento() {
    const [ingresoRenta, setIngresoRenta] = useState('20000')
    const [rentaAPM, setRentaAPM] = useState(false)
    const [deduccionesComprobadas, setDeduccionesComprobadas] = useState('3000') // Predial, mantenimiento real
    const [predial, setPredial] = useState('500') // El predial mensualizado

    const resultado = useMemo(() => {
        const ingresos = parseFloat(ingresoRenta) || 0
        const deduccFull = parseFloat(deduccionesComprobadas) || 0
        const predialVal = parseFloat(predial) || 0

        if (ingresos <= 0) return null

        // Opción 1: Deducción Ciega 35% (Adicional sí permite deducir impuesto predial, Art. 115 LISR)
        const deduccionCiega = ingresos * 0.35
        const totalDeduccionOpcionCiega = deduccionCiega + predialVal
        const baseGravableCiega = Math.max(ingresos - totalDeduccionOpcionCiega, 0)
        const isrCausadoCiega = calcularISRMensual(baseGravableCiega)

        // Opción 2: Deducción Comprobada Real (Incluye predial, mantenimiento, depreciación 5%)
        const totalDeduccionOpcionReal = deduccFull + predialVal
        const baseGravableReal = Math.max(ingresos - totalDeduccionOpcionReal, 0)
        const isrCausadoReal = calcularISRMensual(baseGravableReal)

        // Retenciones: Si se renta a Persona Moral (local/oficina por ej), hay retención de 10% de ISR
        const retencionISR = rentaAPM ? ingresos * 0.10 : 0

        const isrPagarCiega = Math.max(isrCausadoCiega - retencionISR, 0)
        const isrPagarReal = Math.max(isrCausadoReal - retencionISR, 0)

        // Que conviene más
        const mejorOpcion = isrPagarCiega <= isrPagarReal ? 'ciega' : 'real'
        const ahorro = Math.abs(isrPagarCiega - isrPagarReal)

        return {
            ingresos, deduccionCiega, predialVal, deduccFull,
            baseGravableCiega, baseGravableReal,
            isrCausadoCiega, isrCausadoReal,
            retencionISR,
            isrPagarCiega, isrPagarReal, mejorOpcion, ahorro
        }
    }, [ingresoRenta, rentaAPM, deduccionesComprobadas, predial])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏠</span><span>Arrendamiento Inmuebles · Art. 115 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Deducción Ciega vs Comprobantes</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si rentas tu casa o local, la ley te permite deducir el <strong className="text-white">35% de ingresos sin facturas</strong> (Deducción Ciega) + predial. Compara qué te conviene más mes a mes.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tus ingresos por renta mensual ($)</label>
                        <input type="number" value={ingresoRenta} onChange={e => setIngresoRenta(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Impuesto Predial pagado en el mes</label>
                        <input type="number" value={predial} onChange={e => setPredial(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Deducciones reales (Mto. c/factura)</label>
                        <input type="number" value={deduccionesComprobadas} onChange={e => setDeduccionesComprobadas(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[9px] text-white/40 mt-1">Intereses, mejoras, depreciación.</p>
                    </div>
                    <div className="flex items-center">
                        <label className="flex gap-2 p-3 rounded-xl bg-[var(--color-accent)]/10 cursor-pointer border border-[var(--color-accent)]/30 w-full justify-center">
                            <input type="checkbox" checked={rentaAPM} onChange={e => setRentaAPM(e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs font-bold text-[var(--color-accent)]">Arriendo a Persona Moral</span>
                        </label>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold text-sm">
                        ✨ ¡Te conviene más usar la opción de {resultado.mejorOpcion === 'ciega' ? 'Deducción Ciega (35%)' : 'Deducciones Reales'}! Ahorras ${fmtMXN(resultado.ahorro)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Ciega */}
                        <div className={`glass-card p-6 rounded-2xl ${resultado.mejorOpcion === 'ciega' ? 'border-[var(--color-accent)]/50' : 'opacity-60 grayscale'}`}>
                            <h2 className="text-white font-bold text-md mb-4 text-center">🛡️ Opción: Deducción Ciega (35%)</h2>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Ingresos</span><span>${fmtMXN(resultado.ingresos)}</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1 text-emerald-400"><span>(-) Deducción Ciega (35% sin cfdi)</span><span>-${fmtMXN(resultado.deduccionCiega)}</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1 text-emerald-400"><span>(-) Impuesto predial</span><span>-${fmtMXN(resultado.predialVal)}</span></div>
                                <div className="flex justify-between font-bold pt-1"><span>Base Gravable</span><span>${fmtMXN(resultado.baseGravableCiega)}</span></div>
                                <div className="flex justify-between text-yellow-300"><span>ISR Causado</span><span>${fmtMXN(resultado.isrCausadoCiega)}</span></div>
                                {resultado.retencionISR > 0 && <div className="flex justify-between text-orange-400"><span>(-) Retención ISR PM (10%)</span><span>-${fmtMXN(resultado.retencionISR)}</span></div>}
                                <div className="flex justify-between p-3 bg-white/10 rounded-lg mt-3 text-sm font-bold text-white">
                                    <span>ISR Mensual A Pagar:</span>
                                    <span>${fmtMXN(resultado.isrPagarCiega)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Real */}
                        <div className={`glass-card p-6 rounded-2xl ${resultado.mejorOpcion === 'real' ? 'border-[var(--color-accent)]/50' : 'opacity-60 grayscale'}`}>
                            <h2 className="text-white font-bold text-md mb-4 text-center">🧾 Opción: Deducciones Autorizadas</h2>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Ingresos</span><span>${fmtMXN(resultado.ingresos)}</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1 text-emerald-400"><span>(-) Gastos facturados</span><span>-${fmtMXN(resultado.deduccFull)}</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1 text-emerald-400"><span>(-) Impuesto predial</span><span>-${fmtMXN(resultado.predialVal)}</span></div>
                                <div className="flex justify-between font-bold pt-1"><span>Base Gravable</span><span>${fmtMXN(resultado.baseGravableReal)}</span></div>
                                <div className="flex justify-between text-yellow-300"><span>ISR Causado</span><span>${fmtMXN(resultado.isrCausadoReal)}</span></div>
                                {resultado.retencionISR > 0 && <div className="flex justify-between text-orange-400"><span>(-) Retención ISR PM (10%)</span><span>-${fmtMXN(resultado.retencionISR)}</span></div>}
                                <div className="flex justify-between p-3 bg-white/10 rounded-lg mt-3 text-sm font-bold text-white">
                                    <span>ISR Mensual A Pagar:</span>
                                    <span>${fmtMXN(resultado.isrPagarReal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
