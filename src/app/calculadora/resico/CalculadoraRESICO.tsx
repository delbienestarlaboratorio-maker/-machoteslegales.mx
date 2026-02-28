'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tabla RESICO PF Art. 113-E LISR (2024-2026)
const TABLA_RESICO_PF = [
    { limite: 25000, tasa: 0.01 },
    { limite: 50000, tasa: 0.011 },
    { limite: 83333.33, tasa: 0.013 },
    { limite: 208333.33, tasa: 0.015 },
    { limite: 3500000 / 12, tasa: 0.02 },
    { limite: Infinity, tasa: 0.025 },
]

// RESICO PM Art. 113-G LISR — tasa plana 1% a 30%
const TABLA_RESICO_PM = [
    { tope: 300000, tasa: 0.01 },
    { tope: 2000000, tasa: 0.015 },
    { tope: 3500000, tasa: 0.02 },
    { tope: Infinity, tasa: 0.03 },
]

function calcularRESICO_PF(ingMensual: number): number {
    for (const nivel of TABLA_RESICO_PF) {
        if (ingMensual <= nivel.limite) return ingMensual * nivel.tasa
    }
    return ingMensual * 0.025
}

function calcularRESICO_PM(ingMensual: number): number {
    for (const nivel of TABLA_RESICO_PM) {
        if (ingMensual <= nivel.tope) return ingMensual * nivel.tasa
    }
    return ingMensual * 0.03
}

export default function CalculadoraRESICO() {
    const [tipo, setTipo] = useState<'pf' | 'pm'>('pf')
    const [ingresosMensual, setIngresosMensual] = useState('60000')
    const [ingresosAnual, setIngresosAnual] = useState('720000')
    const [modoAnual, setModoAnual] = useState(false)

    const resultado = useMemo(() => {
        const ingMens = modoAnual ? (parseFloat(ingresosAnual) || 0) / 12 : (parseFloat(ingresosMensual) || 0)
        if (ingMens <= 0) return null

        const isrMensual = tipo === 'pf' ? calcularRESICO_PF(ingMens) : calcularRESICO_PM(ingMens)
        const isrAnual = isrMensual * 12
        const tasaEfectiva = (isrMensual / ingMens) * 100
        const netoMensual = ingMens - isrMensual

        // Buscar nivel en tabla
        const tabla = tipo === 'pf' ? TABLA_RESICO_PF : TABLA_RESICO_PM
        const nivelActual = tipo === 'pf'
            ? TABLA_RESICO_PF.find(n => ingMens <= n.limite) || TABLA_RESICO_PF[TABLA_RESICO_PF.length - 1]
            : TABLA_RESICO_PM.find(n => ingMens <= n.tope) || TABLA_RESICO_PM[TABLA_RESICO_PM.length - 1]

        // Tope anual RESICO: PF $3.5M, PM $35M
        const topeAnual = tipo === 'pf' ? 3500000 : 35000000
        const ingAnualEstimado = ingMens * 12
        const excedeTope = ingAnualEstimado > topeAnual

        return { ingMens, isrMensual, isrAnual, tasaEfectiva, netoMensual, nivelActual, excedeTope, topeAnual, ingAnualEstimado }
    }, [tipo, ingresosMensual, ingresosAnual, modoAnual])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💼</span><span>RESICO · Arts. 113-E y 113-G LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">RESICO 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El <strong className="text-white">Régimen Simplificado de Confianza</strong> aplica tasas
                    preferentes del <strong className="text-[var(--color-accent)]">1% al 2.5%</strong> sobre ingresos brutos.
                    Sin necesidad de llevar contabilidad compleja.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                    { v: 'pf' as const, icon: '👤', label: 'Persona Física', label2: 'Art. 113-E LISR — hasta $3.5M/año' },
                    { v: 'pm' as const, icon: '🏢', label: 'Persona Moral', label2: 'Art. 113-G LISR — hasta $35M/año' },
                ].map(t => (
                    <button key={t.v} onClick={() => setTipo(t.v)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${tipo === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-2xl mb-1">{t.icon}</p>
                        <p className="text-sm font-bold">{t.label}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{t.label2}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <button onClick={() => setModoAnual(false)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${!modoAnual ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                        Ingreso mensual
                    </button>
                    <button onClick={() => setModoAnual(true)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${modoAnual ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                        Ingreso anual
                    </button>
                </div>
                {!modoAnual ? (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos brutos mensuales ($)</label>
                        <input type="number" value={ingresosMensual} onChange={e => setIngresosMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                ) : (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos brutos anuales ($)</label>
                        <input type="number" value={ingresosAnual} onChange={e => setIngresosAnual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    {resultado.excedeTope && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
                            <p className="text-red-400 font-bold">⚠️ Ingresos anuales estimados (${fmtMXN(resultado.ingAnualEstimado)}) exceden el tope RESICO {tipo === 'pf' ? 'PF' : 'PM'} (${fmtMXN(resultado.topeAnual)})</p>
                            <p className="text-white/60 mt-1">Si superas el tope, debes cambiarte a Régimen General de Ley (Art. 26 LIVA). Consulta a tu contador.</p>
                        </div>
                    )}

                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu ISR en RESICO {tipo.toUpperCase()}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Ingreso mensual</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.ingMens)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">ISR mensual ({resultado.tasaEfectiva.toFixed(2)}%)</p>
                                <p className="text-xl font-bold text-red-400 font-mono">${fmtMXN(resultado.isrMensual)}</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1">Neto mensual</p>
                                <p className="text-xl font-bold text-emerald-400 font-mono">${fmtMXN(resultado.netoMensual)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">ISR anual estimado</p>
                                <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.isrAnual)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de tasas */}
                    <div className="glass-card p-4 rounded-2xl">
                        <h3 className="text-white font-bold text-sm mb-3">📊 Tabla RESICO {tipo === 'pf' ? 'PF — Art. 113-E' : 'PM — Art. 113-G'} LISR</h3>
                        <div className="space-y-1.5">
                            {(tipo === 'pf' ? TABLA_RESICO_PF : TABLA_RESICO_PM).map((nivel, i) => {
                                const isActual = tipo === 'pf'
                                    ? resultado.ingMens <= nivel.limite
                                    : resultado.ingMens <= (('tope' in nivel) ? nivel.tope : Infinity)
                                const firstActual = (tipo === 'pf' ? TABLA_RESICO_PF : TABLA_RESICO_PM).findIndex(n =>
                                    tipo === 'pf' ? resultado.ingMens <= n.limite : resultado.ingMens <= (('tope' in n) ? n.tope : Infinity)
                                ) === i
                                return (
                                    <div key={i} className={`flex justify-between p-2.5 rounded-lg text-xs ${firstActual ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                        <span className={firstActual ? 'text-[var(--color-accent)] font-bold' : 'text-white/50'}>
                                            {firstActual ? '▶ ' : ''}Hasta ${fmtMXN(tipo === 'pf' ? (nivel as { limite: number; tasa: number }).limite : (nivel as { tope: number; tasa: number }).tope === Infinity ? 99999999 : (nivel as { tope: number; tasa: number }).tope)}/mes
                                        </span>
                                        <span className={`font-mono font-bold ${firstActual ? 'text-[var(--color-accent)]' : 'text-white/60'}`}>
                                            {(nivel.tasa * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                )
                            })}
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
                * Arts. 113-E (PF) y 113-G (PM) LISR. Tasas sobre ingresos brutos sin deducciones. Tope anual PF $3.5M, PM $35M. No sustituye asesoría fiscal.
            </p>
        </main>
    )
}
