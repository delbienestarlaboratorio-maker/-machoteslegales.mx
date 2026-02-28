'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tasas INPC promedio anual históricas México
const INPC_ANUAL: Record<string, number> = {
    '2020': 3.15, '2021': 7.36, '2022': 7.82, '2023': 4.66, '2024': 4.21, '2025': 3.50, '2026': 3.50
}

export default function CalculadoraArrendamientoComercial() {
    const [rentaMensual, setRentaMensual] = useState('25000')
    const [mesesGracia, setMesesGracia] = useState('1')
    const [mesesGarantia, setMesesGarantia] = useState('2')
    const [plazoAnios, setPlazoAnios] = useState('3')
    const [ajusteAnual, setAjusteAnual] = useState('inpc')
    const [ajustePct, setAjustePct] = useState('5')
    const [incluyeIVA, setIncluyeIVA] = useState(true)
    const [incluyeMantenimiento, setIncluyeMantenimiento] = useState(false)
    const [montoMant, setMontoMant] = useState('2000')

    const resultado = useMemo(() => {
        const renta = parseFloat(rentaMensual) || 0
        const gracia = parseInt(mesesGracia) || 0
        const garantia = parseInt(mesesGarantia) || 2
        const anios = parseInt(plazoAnios) || 1
        const mant = incluyeMantenimiento ? (parseFloat(montoMant) || 0) : 0
        if (renta <= 0) return null

        const iva = incluyeIVA ? renta * 0.16 : 0
        const rentalTotal = renta + iva + mant
        const deposito = renta * garantia
        const rentaGracia = renta * gracia

        // Proyección por años con ajuste
        const proyeccion: { anio: number; rentaBase: number; rentaConIVA: number; total: number }[] = []
        let rentaActual = renta
        const inpcUsado = ajusteAnual === 'inpc' ? 3.5 : parseFloat(ajustePct) / 100

        for (let a = 1; a <= anios; a++) {
            if (a > 1) rentaActual = rentaActual * (1 + (ajusteAnual === 'fijo' ? parseFloat(ajustePct) / 100 : inpcUsado / 100))
            const ivaA = incluyeIVA ? rentaActual * 0.16 : 0
            proyeccion.push({
                anio: a,
                rentaBase: rentaActual,
                rentaConIVA: rentaActual + ivaA,
                total: (rentaActual + ivaA + mant) * 12
            })
        }

        const totalContrato = proyeccion.reduce((s, p) => s + p.total, 0) - (rentaGracia + incluyeIVA ? rentaGracia * 0.16 : 0)
        const gastoInicial = deposito + rentalTotal // primer mes + depósito

        return { renta, iva, rentalTotal, deposito, rentaGracia, proyeccion, totalContrato, gastoInicial, mant }
    }, [rentaMensual, mesesGracia, mesesGarantia, plazoAnios, ajusteAnual, ajustePct, incluyeIVA, incluyeMantenimiento, montoMant])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏢</span><span>Arrendamiento Comercial · Art. 2398 CCF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Arrendamiento Comercial</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula el costo total de tu local comercial: renta mensual + IVA +
                    <strong className="text-[var(--color-accent)]"> depósito en garantía</strong> + ajuste anual INPC
                    y proyección a 3-5 años.
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
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Renta mensual base ($) — sin IVA</label>
                        <input type="number" value={rentaMensual} onChange={e => setRentaMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Depósito en garantía (meses de renta)</label>
                        <select value={mesesGarantia} onChange={e => setMesesGarantia(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {[1, 2, 3, 4, 6].map(m => <option key={m} value={m}>{m} mes{m > 1 ? 'es' : ''}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses de gracia (sin pago)</label>
                        <select value={mesesGracia} onChange={e => setMesesGracia(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {[0, 1, 2, 3, 6].map(m => <option key={m} value={m}>{m === 0 ? 'Sin meses de gracia' : `${m} mes${m > 1 ? 'es' : ''}`}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Plazo del contrato</label>
                        <select value={plazoAnios} onChange={e => setPlazoAnios(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {[1, 2, 3, 5, 10].map(a => <option key={a} value={a}>{a} año{a > 1 ? 's' : ''}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ajuste anual de renta</label>
                        <select value={ajusteAnual} onChange={e => setAjusteAnual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="inpc">INPC estimado (~3.5%)</option>
                            <option value="fijo">Porcentaje fijo</option>
                            <option value="ninguno">Sin ajuste</option>
                        </select>
                    </div>
                    {ajusteAnual === 'fijo' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Porcentaje de ajuste fijo (%)</label>
                            <input type="number" value={ajustePct} onChange={e => setAjustePct(e.target.value)} step="0.5"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                        <input type="checkbox" checked={incluyeIVA} onChange={e => setIncluyeIVA(e.target.checked)} className="w-4 h-4 mt-0.5" />
                        <div><p className="text-xs font-bold text-white">IVA 16% sobre renta</p><p className="text-[10px] text-white/40">Para arrendamiento de locales comerciales</p></div>
                    </label>
                    <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                        <input type="checkbox" checked={incluyeMantenimiento} onChange={e => setIncluyeMantenimiento(e.target.checked)} className="w-4 h-4 mt-0.5" />
                        <div><p className="text-xs font-bold text-white">Cuota mantenimiento / administración</p>
                            {incluyeMantenimiento && <input type="number" value={montoMant} onChange={e => setMontoMant(e.target.value)} onClick={e => e.stopPropagation()}
                                className="mt-1 p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs w-full focus:outline-none" placeholder="Monto mensual" />}
                        </div>
                    </label>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Resumen del arrendamiento</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Renta base</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.renta)}</p>
                            </div>
                            {incluyeIVA && <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">IVA 16%</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.iva)}</p>
                            </div>}
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Pago mensual total</p>
                                <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.rentalTotal)}</p>
                            </div>
                            <div className="bg-orange-500/10 rounded-xl p-4 text-center border border-orange-500/20">
                                <p className="text-xs text-orange-400 mb-1">Depósito inicial</p>
                                <p className="text-xl font-bold text-orange-400 font-mono">${fmtMXN(resultado.deposito)}</p>
                            </div>
                        </div>
                        {resultado.rentaGracia > 0 && (
                            <p className="text-xs text-emerald-400 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-3">
                                ✅ Meses de gracia: ahorro de ${fmtMXN(resultado.rentaGracia + resultado.iva * parseInt(mesesGracia))} en los primeros {mesesGracia} mes(es)
                            </p>
                        )}
                    </div>

                    <div className="glass-card p-4 rounded-2xl">
                        <h3 className="text-white font-bold text-sm mb-3">📊 Proyección anual con ajuste</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-white/50 border-b border-white/10">
                                        <th className="py-2 text-left">Año</th>
                                        <th className="py-2 text-right">Renta base/mes</th>
                                        <th className="py-2 text-right">Pago mensual</th>
                                        <th className="py-2 text-right">Total del año</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.proyeccion.map(p => (
                                        <tr key={p.anio} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-2 text-white/60">Año {p.anio}</td>
                                            <td className="py-2 text-right font-mono text-white">${fmtMXN(p.rentaBase)}</td>
                                            <td className="py-2 text-right font-mono text-[var(--color-accent)]">${fmtMXN(p.rentaConIVA + resultado.mant)}</td>
                                            <td className="py-2 text-right font-mono text-white/60">${fmtMXN(p.total)}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t border-white/20">
                                        <td colSpan={3} className="py-2 text-white font-bold text-xs">TOTAL contrato</td>
                                        <td className="py-2 text-right font-mono text-[var(--color-accent)] font-bold">${fmtMXN(resultado.totalContrato)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 2398 CCF. IVA 16% sobre arrendamiento comercial. Ajuste INPC estimado. Depósito en garantía es devoluble. No sustituye revisión del contrato.
            </p>
        </main>
    )
}
