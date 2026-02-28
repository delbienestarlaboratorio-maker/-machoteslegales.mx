'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN } from '@/data/legal-constants'

// UMA diaria 2026 para calcular exención
const UMA_LIMIT_EXENCION = 700000  // UMAs diarias Art. 93 XIX LISR

export default function CalculadoraISRCasaHabitacion() {
    const [precioVenta, setPrecioVenta] = useState('2500000')
    const [costoAdquisicion, setCostoAdquisicion] = useState('1200000')
    const [mejoras, setMejoras] = useState('300000')
    const [gastosNotariales, setGastosNotariales] = useState('80000')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [esExenta, setEsExenta] = useState(true)   // si cumple los 2 años viviendo ahí
    const [usoFParcial, setUsoFParcial] = useState(false) // si parte del inmueble fue negocio

    const uma = getUMA(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const venta = parseFloat(precioVenta) || 0
        const costo = parseFloat(costoAdquisicion) || 0
        const mejora = parseFloat(mejoras) || 0
        const gastos = parseFloat(gastosNotariales) || 0
        if (venta <= 0) return null

        // Exención Art. 93 XIX: monto máximo en UMAs diarias
        const montoExentoMax = uma.diaria * UMA_LIMIT_EXENCION
        const totalCostoDeducible = costo + mejora + gastos
        const gananciaTotal = venta - totalCostoDeducible

        // Si está exenta (cumple 2 años habitando y 1 vez cada 3 años)
        const gananciaExenta = esExenta ? Math.min(gananciaTotal, montoExentoMax) : 0
        const gananciaGravable = Math.max(gananciaTotal - gananciaExenta, 0)

        // ISR: tabla general para PF (ganancia acumulada al ejercicio)
        // Tasa aproximada progresiva — usamos 30% para ganancia en venta de inmuebles
        // (en la declaración anual se acumula y ajusta)
        const isrCausado = gananciaGravable > 0 ? gananciaGravable * 0.30 : 0

        // Retención notarial: 5% sobre la ganancia bruta (varía por estado)
        const retencionNotario = (gananciaTotal > 0 ? gananciaTotal * 0.05 : 0)
        const isrFinalEstimado = Math.max(isrCausado - retencionNotario, 0)

        const exentaPorcentaje = gananciaTotal > 0 ? (gananciaExenta / gananciaTotal) * 100 : 0
        const utilidadNeta = venta - totalCostoDeducible - isrCausado

        return {
            venta, totalCostoDeducible, gananciaTotal,
            montoExentoMax, gananciaExenta, gananciaGravable,
            isrCausado, retencionNotario, isrFinalEstimado,
            exentaPorcentaje, utilidadNeta,
            estaExentaTotal: gananciaGravable === 0 && esExenta
        }
    }, [precioVenta, costoAdquisicion, mejoras, gastosNotariales, anioCalculo, esExenta])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏠</span><span>ISR Casa Habitación · Art. 93 XIX LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR Venta Casa Habitación</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La ganancia por vender tu casa puede estar
                    <strong className="text-[var(--color-accent)]"> exenta hasta 700,000 UMAs</strong> (~${fmtMXN(getUMA(parseInt(anioCalculo)).diaria * 700000)}) si fue tu
                    <strong className="text-white"> casa habitación los últimos 2 años</strong> y no la has usado antes en 3 años.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                    {[
                        { v: String(ANIO_ACTUAL), label: '2026' },
                        { v: '2025', label: '2025' },
                        { v: '2024', label: '2024' },
                    ].map(y => (
                        <button key={y.v} onClick={() => setAnioCalculo(y.v)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${anioCalculo === y.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                            {y.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Precio de venta ($)</label>
                        <input type="number" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Costo de adquisición (escritura) ($)</label>
                        <input type="number" value={costoAdquisicion} onChange={e => setCostoAdquisicion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Mejoras y remodelaciones ($)</label>
                        <input type="number" value={mejoras} onChange={e => setMejoras(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Deben estar comprobadas con facturas</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Gastos notariales de compra ($)</label>
                        <input type="number" value={gastosNotariales} onChange={e => setGastosNotariales(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>

                <label className="flex gap-2 p-3 rounded-xl bg-emerald-500/10 cursor-pointer border border-emerald-500/20">
                    <input type="checkbox" checked={esExenta} onChange={e => setEsExenta(e.target.checked)} className="w-4 h-4 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-emerald-400">✅ Aplica exención Art. 93 XIX LISR</p>
                        <p className="text-[10px] text-white/50">Fue casa habitación los últimos 2 años + no has vendido otra en los últimos 3 años + comprobante CURP/credencial</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">🏠 ISR Venta Casa Habitación</h2>
                    {resultado.estaExentaTotal && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-4 text-center">
                            <p className="text-emerald-400 font-bold">🎉 Sin ISR — La ganancia está dentro del límite de exención</p>
                            <p className="text-[10px] text-white/50 mt-1">Monto exento máximo: ${fmtMXN(resultado.montoExentoMax)} (700,000 UMAs × ${fmtMXN(uma.diaria)})</p>
                        </div>
                    )}
                    <div className="space-y-2 text-sm">
                        {[
                            { l: 'Precio de venta', v: resultado.venta },
                            { l: 'Costo deducible total (adquisición + mejoras + gastos)', v: -resultado.totalCostoDeducible },
                            { l: 'Ganancia total en venta', v: resultado.gananciaTotal },
                            ...(esExenta ? [{ l: `Ganancia exenta (máx. 700k UMAs = $${fmtMXN(resultado.montoExentoMax)})`, v: -resultado.gananciaExenta }] : []),
                            { l: 'Ganancia gravable', v: resultado.gananciaGravable },
                            { l: 'ISR estimado (30% sobre ganancia gravable)', v: resultado.isrCausado, accent: true },
                            { l: 'Retención notarial estimada (5%)', v: resultado.retencionNotario },
                        ].map((r: { l: string; v: number; accent?: boolean }, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                        <p className="text-[10px] text-white/30 text-right">
                            Ganancia exenta: {resultado.exentaPorcentaje.toFixed(1)}% | 700k UMAs = ${fmtMXN(resultado.montoExentoMax)}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 93 Fr. XIX LISR. Exención 700,000 UMAs diarias. Requiere: habitarla 2 años, no haberla usado en 3 años, acreditar CURP. El notario retiene 5% provisional. Consulta SAT o notario.
            </p>
        </main>
    )
}
