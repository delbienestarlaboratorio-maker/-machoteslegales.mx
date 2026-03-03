'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraPlataformasDigitales() {
    const [ingresoBruto, setIngresoBruto] = useState('10000')
    const [actividad, setActividad] = useState<'transporte' | 'alojamiento' | 'enajenacion'>('transporte')
    const [rfc, setRfc] = useState(true) // Si ha proporcionado RFC a la plataforma

    const PLATAFORMAS = {
        transporte: { label: 'Transporte / Entrega (Uber, DiDi, Rappi)', isr: 0.021 }, // 2.1%
        alojamiento: { label: 'Alojamiento (Airbnb, Booking)', isr: 0.04 },    // 4.0%
        enajenacion: { label: 'Venta bienes (MercadoLibre, Amazon)', isr: 0.01 },     // 1.0%
    }

    const resultado = useMemo(() => {
        const bruto = parseFloat(ingresoBruto) || 0
        if (bruto <= 0) return null

        // Penalización por no dar RFC (Art 113-C LISR: 20% ISR, 16% IVA retenido)
        const tasaISR = rfc ? PLATAFORMAS[actividad].isr : 0.20
        const isrRetenido = bruto * tasaISR

        // IVA es 8% retenido (50% de 16%) si dio RFC, si no, es 16%
        const ivaTotalCobrado = bruto * 0.16
        const tasaIVARetencion = rfc ? 0.08 : 0.16
        const ivaRetenido = bruto * tasaIVARetencion

        const totalRetenciones = isrRetenido + ivaRetenido
        const pagoNetoDepositado = (bruto + ivaTotalCobrado) - totalRetenciones

        // Comisión de la plataforma (Típico 20% estimado para mostrar al usuario la realidad financiera, es opcional en leyes pero vital en finanzas)
        const comisionEstimada = bruto * 0.20
        const gananciaReal = pagoNetoDepositado - comisionEstimada

        return {
            bruto, isrRetenido, tasaISR,
            ivaTotalCobrado, ivaRetenido, tasaIVARetencion,
            totalRetenciones, pagoNetoDepositado, comisionEstimada, gananciaReal
        }
    }, [ingresoBruto, actividad, rfc])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📱</span><span>Plataformas Digitales · Art. 113-A LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Retenciones ISR e IVA (Apps)</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula cuánto te retienen las plataformas (Uber, Airbnb, Amazon) de tus ingresos brutos. Las tasas aplicables según la <strong className="text-white">LISR vigente</strong>.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingreso Cobrado (Sin IVA) mensual $</label>
                        <input type="number" value={ingresoBruto} onChange={e => setIngresoBruto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tipo de Plataforma Digital</label>
                        <select value={actividad} onChange={e => setActividad(e.target.value as any)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {Object.entries(PLATAFORMAS).map(([k, v]) => <option key={k} value={k}>{v.label} (ISR: {v.isr * 100}%)</option>)}
                        </select>
                    </div>
                </div>
                <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5 items-center mt-2">
                    <input type="checkbox" checked={rfc} onChange={e => setRfc(e.target.checked)} className="w-5 h-5 text-[var(--color-accent)]" />
                    <div>
                        <span className="text-sm font-bold text-white">Proporcioné mi RFC a la plataforma</span>
                        <p className="text-[10px] text-white/50">Si no proporcionas RFC, la retención sube a 20% ISR y 16% IVA por penalización.</p>
                    </div>
                </label>
            </div>

            {!rfc && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold text-center">
                    🚨 Estás pagando la retención máxima punitiva (20% ISR y 16% IVA) por no registrar tu RFC.
                </div>
            )}

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">Desglose Fiscal</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">Servicio Cobrado Bruto</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.bruto)}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">+ IVA Cobrado al cliente (16%)</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.ivaTotalCobrado)}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <span className="text-xs text-orange-400 font-bold">- ISR Retenido ({(resultado.tasaISR * 100).toFixed(1)}%)</span>
                            <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.isrRetenido)}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <span className="text-xs text-orange-400 font-bold">- IVA Retenido ({(resultado.tasaIVARetencion * 100).toFixed(1)}%)</span>
                            <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.ivaRetenido)}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 mt-2">
                            <span className="text-sm text-[var(--color-accent)] font-bold">Depósito de Plataforma (Lo que te depositan)</span>
                            <span className="font-mono text-[var(--color-accent)] font-bold text-xl">${fmtMXN(resultado.pagoNetoDepositado)}</span>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4 opacity-70">
                        <p className="text-white text-xs font-bold mb-2">Estimación Financiera Real</p>
                        <div className="flex justify-between p-2 rounded-lg bg-white/5 text-xs">
                            <span className="text-gray-400">- Comisión Est. Plataforma (20% de venta)* no fiscal</span>
                            <span className="font-mono text-gray-400">-${fmtMXN(resultado.comisionEstimada)}</span>
                        </div>
                        <div className="flex justify-between p-2 mt-1 font-bold text-sm text-white">
                            <span>Bolsillo Real Estimado Libre</span>
                            <span className="font-mono text-emerald-400">${fmtMXN(resultado.gananciaReal)}</span>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
