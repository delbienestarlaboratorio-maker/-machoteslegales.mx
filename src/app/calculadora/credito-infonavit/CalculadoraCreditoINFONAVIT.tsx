'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getSMG, fmtMXN } from '@/data/legal-constants'

// Tabla de crédito INFONAVIT 2026 simplificada (basada en VSMDF y puntos)
// Fuente: simulador INFONAVIT.org.mx
const SMG_VSMDF_2026 = 278.80  // SMG diario CDMX 2026

export default function CalculadoraCreditoINFONAVIT() {
    const [salarioMensual, setSalarioMensual] = useState('18000')
    const [puntos, setPuntos] = useState('116')
    const [saldoSubcuenta, setSaldoSubcuenta] = useState('80000')
    const [plazoAnios, setPlazoAnios] = useState('20')
    const [tasaInteres, setTasaInteres] = useState('10.45')  // Tasa promedio INFONAVIT
    const anioCalculo = ANIO_ACTUAL

    const smg = getSMG(anioCalculo)

    const resultado = useMemo(() => {
        const salario = parseFloat(salarioMensual) || 0
        const pts = parseInt(puntos) || 0
        const subcuenta = parseFloat(saldoSubcuenta) || 0
        const plazo = parseInt(plazoAnios) || 20
        const tasa = parseFloat(tasaInteres) || 10.45
        if (salario <= 0) return null

        // VSM (veces de salario mínimo) — base para cálculo INFONAVIT
        const smgMensual = SMG_VSMDF_2026 * 30.4
        const veces = salario / smgMensual

        // Monto máximo de crédito INFONAVIT 2026
        // La fórmula real es compleja; usamos tabla aproximada por VSM
        let montoMaximoUMAs = 0
        if (veces <= 1.0) montoMaximoUMAs = 79395
        else if (veces <= 2.0) montoMaximoUMAs = 109395
        else if (veces <= 3.0) montoMaximoUMAs = 144395
        else if (veces <= 4.0) montoMaximoUMAs = 179395
        else if (veces <= 5.0) montoMaximoUMAs = 214395
        else if (veces <= 6.0) montoMaximoUMAs = 244350
        else if (veces <= 7.0) montoMaximoUMAs = 268785
        else if (veces <= 8.0) montoMaximoUMAs = 293220
        else if (veces <= 9.0) montoMaximoUMAs = 317655
        else montoMaximoUMAs = 342090  // Tope máximo ~342,090 UMAs

        // Conversión UMAs a pesos (UMA 2026 diaria = 113.14)
        const umasDiarias = 113.14
        const montoMaximoMXN = montoMaximoUMAs * umasDiarias

        // El crédito total puede incluir subcuenta de vivienda
        const creditoTotal = montoMaximoMXN + subcuenta

        // Mensualidad (amortización con tasa anual fija)
        const tasaMensual = tasa / 100 / 12
        const meses = plazo * 12
        const mensualidad = creditoTotal * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1)

        // Descuento máximo permitido: 30% del salario + 5% INFONAVIT (se descuenta aparte)
        const descuentoMaximo = salario * 0.30
        const porcentajeSalario = (mensualidad / salario) * 100

        const puedeAcceder = pts >= 116  // Mínimo 116 puntos INFONAVIT

        return {
            salario, veces, montoMaximoMXN, subcuenta, creditoTotal,
            mensualidad, descuentoMaximo, porcentajeSalario,
            puedeAcceder, meses, tasa, smgMensual, montoMaximoUMAs,
            capacidadPago: descuentoMaximo >= mensualidad
        }
    }, [salarioMensual, puntos, saldoSubcuenta, plazoAnios, tasaInteres])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏡</span><span>Crédito INFONAVIT · Ley del INFONAVIT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Crédito INFONAVIT 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima el <strong className="text-[var(--color-accent)]">monto máximo</strong> de crédito INFONAVIT según tu salario y
                    <strong className="text-white"> subcuenta de vivienda</strong>. Requisito mínimo: 116 puntos acumulados.
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
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Puntos INFONAVIT acumulados</label>
                        <input type="number" value={puntos} onChange={e => setPuntos(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Mínimo 116 puntos para ejercer el crédito</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Saldo subcuenta vivienda AFORE ($)</label>
                        <input type="number" value={saldoSubcuenta} onChange={e => setSaldoSubcuenta(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Plazo del crédito (años)</label>
                        <select value={plazoAnios} onChange={e => setPlazoAnios(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {[10, 15, 20, 25, 30].map(a => <option key={a} value={a}>{a} años</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    {!resultado.puedeAcceder && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                            <p className="text-red-400 font-bold">⚠️ Aún no cumples los 116 puntos mínimos requeridos por INFONAVIT para ejercer el crédito.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Monto máx. crédito', val: resultado.montoMaximoMXN, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' },
                            { label: 'Crédito + subcuenta', val: resultado.creditoTotal, color: 'text-white', bg: 'bg-white/10 border border-white/20' },
                            { label: 'Mensualidad est.', val: resultado.mensualidad, color: resultado.capacidadPago ? 'text-emerald-400' : 'text-red-400', bg: resultado.capacidadPago ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20' },
                            { label: '% del salario', val: resultado.porcentajeSalario, color: resultado.capacidadPago ? 'text-emerald-400' : 'text-red-400', bg: 'bg-white/5', isPct: true },
                        ].map((s, i) => (
                            <div key={i} className={`p-4 rounded-xl text-center ${s.bg}`}>
                                <p className="text-[10px] text-white/50 mb-1">{s.label}</p>
                                <p className={`text-lg font-bold font-mono ${s.color}`}>
                                    {s.isPct ? `${(s.val).toFixed(1)}%` : `$${fmtMXN(s.val)}`}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="glass-card p-5 rounded-2xl text-xs">
                        <p className="text-white font-bold mb-3">📊 Desglose del crédito</p>
                        <div className="space-y-2">
                            {[
                                { l: `Salario mensual`, v: `$${fmtMXN(resultado.salario)}` },
                                { l: `Equivale a`, v: `${resultado.veces.toFixed(2)} VSM (veces salario mínimo)` },
                                { l: `Monto máximo crédito INFONAVIT`, v: `${resultado.montoMaximoUMAs.toLocaleString()} UMAs = $${fmtMXN(resultado.montoMaximoMXN)}` },
                                { l: `+ Subcuenta de vivienda`, v: `$${fmtMXN(resultado.subcuenta)}` },
                                { l: `= Poder de compra total`, v: `$${fmtMXN(resultado.creditoTotal)}` },
                                { l: `Tasa de interés`, v: `${resultado.tasa}% anual (${resultado.meses} meses)` },
                                { l: `Descuento máximo en salario (30%)`, v: `$${fmtMXN(resultado.descuentoMaximo)}/mes` },
                            ].map((r, i) => (
                                <div key={i} className="flex justify-between border-b border-white/5 pb-1.5">
                                    <span className="text-white/60">{r.l}</span>
                                    <span className="text-white font-mono font-semibold">{r.v}</span>
                                </div>
                            ))}
                        </div>
                        {!resultado.capacidadPago && (
                            <p className="text-red-400 mt-3">⚠️ La mensualidad estimada supera el 30% de tu salario. Considera reducir el monto o ampliar el plazo.</p>
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
                * Estimador basado en tablas INFONAVIT 2026. El monto real lo determina el simulador oficial de INFONAVIT. Tasa y monto pueden variar. Mínimo 116 puntos para ejercer el crédito.
            </p>
        </main>
    )
}
