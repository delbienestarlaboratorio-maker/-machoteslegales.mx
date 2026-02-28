'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// INPC para actualización del costo de adquisición (Art. 121 LISR)
const INPC_POR_ANIO: Record<number, number> = {
    2026: 140.85, 2025: 134.80, 2024: 128.50, 2023: 120.00,
    2022: 109.00, 2021: 97.00, 2020: 90.00, 2019: 84.50,
    2018: 79.00, 2017: 74.00, 2016: 69.00, 2015: 65.00,
    2010: 48.00, 2005: 38.00, 2000: 28.00,
}

const ANIOS = Object.keys(INPC_POR_ANIO).map(Number).sort((a, b) => b - a)

export default function CalculadoraISRAcciones() {
    const [precioVenta, setPrecioVenta] = useState('500000')
    const [costoAdquisicion, setCostoAdquisicion] = useState('200000')
    const [anioAdquisicion, setAnioAdquisicion] = useState(2020)
    const [anioVenta, setAnioVenta] = useState(2026)
    const [gastosMediacion, setGastosMediacion] = useState('5000')
    const [retenciones, setRetenciones] = useState('0')
    const [actualizarCosto, setActualizarCosto] = useState(true)

    const resultado = useMemo(() => {
        const venta = parseFloat(precioVenta) || 0
        const costo = parseFloat(costoAdquisicion) || 0
        const gastos = parseFloat(gastosMediacion) || 0
        const retenidas = parseFloat(retenciones) || 0
        if (venta <= 0 || costo <= 0) return null

        // Factor de actualización (Art. 121 LISR)
        const inpcVenta = INPC_POR_ANIO[anioVenta] || INPC_POR_ANIO[2026]
        const inpcAdquisicion = INPC_POR_ANIO[anioAdquisicion] || INPC_POR_ANIO[2020]
        const factorActualizacion = actualizarCosto ? inpcVenta / inpcAdquisicion : 1
        const costoActualizado = costo * factorActualizacion
        const actualizacion = costoActualizado - costo

        // Ganancia (pérdida) — Art. 120 LISR
        const ganancia = venta - costoActualizado - gastos
        if (ganancia <= 0) {
            return { ganancia, perdida: Math.abs(ganancia), isrCausado: 0, isrNeto: 0, costoActualizado, factorActualizacion, actualizacion, venta, gastos, retenidas, esGanancia: false }
        }

        // Tasa 10% Art. 129 LISR (enajenación de acciones PF)
        const isrCausado = ganancia * 0.10
        const isrNeto = Math.max(isrCausado - retenidas, 0)
        const gananciaEfectiva = venta - costo - gastos - isrNeto

        return {
            ganancia, isrCausado, isrNeto, costoActualizado,
            factorActualizacion, actualizacion, venta, gastos, retenidas,
            gananciaEfectiva, esGanancia: true, perdida: 0
        }
    }, [precioVenta, costoAdquisicion, anioAdquisicion, anioVenta, gastosMediacion, retenciones, actualizarCosto])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📈</span><span>ISR Acciones · Art. 120 y 129 LISR — Tasa 10%</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR Enajenación de Acciones</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Persona física: la ganancia por venta de acciones se grava al
                    <strong className="text-[var(--color-accent)]"> 10%</strong> (Art. 129 LISR).
                    El costo se puede <strong className="text-white">actualizar por INPC</strong> (Art. 121 LISR).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Precio de venta ($)</label>
                        <input type="number" value={precioVenta} onChange={e => setPrecioVenta(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Costo de adquisición original ($)</label>
                        <input type="number" value={costoAdquisicion} onChange={e => setCostoAdquisicion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año de adquisición</label>
                        <select value={anioAdquisicion} onChange={e => setAnioAdquisicion(parseInt(e.target.value))}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {ANIOS.filter(a => a <= 2025).map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año de venta</label>
                        <select value={anioVenta} onChange={e => setAnioVenta(parseInt(e.target.value))}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Gastos de intermediación / comisiones ($)</label>
                        <input type="number" value={gastosMediacion} onChange={e => setGastosMediacion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Retenciones ya pagadas ($)</label>
                        <input type="number" value={retenciones} onChange={e => setRetenciones(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Casa de bolsa puede retener el 10% como pago provisional</p>
                    </div>
                </div>
                <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                    <input type="checkbox" checked={actualizarCosto} onChange={e => setActualizarCosto(e.target.checked)} className="w-4 h-4 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-white">Actualizar costo por INPC (Art. 121 LISR)</p>
                        <p className="text-[10px] text-white/40">Reduce la base gravable ajustando el costo por inflación</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">📊 Cálculo ISR — Art. 129 LISR</h2>
                    <div className="space-y-2 text-sm">
                        {[
                            { l: 'Precio de venta', v: resultado.venta },
                            ...(resultado.actualizacion > 0 ? [
                                { l: `Factor actualización INPC (${resultado.factorActualizacion.toFixed(4)})`, v: resultado.actualizacion },
                                { l: 'Costo actualizado', v: resultado.costoActualizado },
                            ] : [
                                { l: 'Costo de adquisición (sin actualizar)', v: resultado.costoActualizado },
                            ]),
                            ...(resultado.gastos > 0 ? [{ l: 'Gastos deducibles', v: -resultado.gastos }] : []),
                            { l: resultado.esGanancia ? 'Ganancia (base gravable)' : 'Pérdida fiscal', v: resultado.ganancia, esPerdida: !resultado.esGanancia },
                            ...(resultado.esGanancia ? [
                                { l: 'ISR causado (10%)', v: resultado.isrCausado },
                                ...(resultado.retenidas > 0 ? [{ l: 'Retenciones previas', v: -resultado.retenidas }] : []),
                                { l: 'ISR a pagar (complementario)', v: resultado.isrNeto, accent: true },
                            ] : []),
                        ].map((r: { l: string; v: number; accent?: boolean; esPerdida?: boolean }, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : r.esPerdida ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : r.esPerdida ? 'text-emerald-400 font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : r.esPerdida ? 'text-emerald-400' : 'text-white text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                        {!resultado.esGanancia && (
                            <p className="text-xs text-emerald-400 p-3 rounded-lg bg-emerald-500/10 mt-2">
                                ✅ No hay ISR a pagar — la operación generó una pérdida fiscal de ${fmtMXN(resultado.perdida)} que puede acreditarse en el ejercicio.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 120-131 LISR. Tasa 10% acciones por PF. Factor INPC Art. 121. Pérdidas acreditables mismo ejercicio Art. 130. No sustituye declaración anual SAT.
            </p>
        </main>
    )
}
