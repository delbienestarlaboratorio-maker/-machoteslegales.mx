'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const UMA_DATA = [
    { anio: 2026, diaria: 113.14, mensual: 3439.46, anual: 41273.52 },
    { anio: 2025, diaria: 108.57, mensual: 3300.53, anual: 39606.36 },
    { anio: 2024, diaria: 103.74, mensual: 3153.70, anual: 37844.40 },
    { anio: 2023, diaria: 96.22, mensual: 2925.09, anual: 35101.08 },
    { anio: 2022, diaria: 96.22, mensual: 2925.09, anual: 35101.08 },
    { anio: 2021, diaria: 89.62, mensual: 2724.45, anual: 32693.40 },
    { anio: 2020, diaria: 86.88, mensual: 2641.15, anual: 31693.80 },
    { anio: 2019, diaria: 84.49, mensual: 2568.50, anual: 30822.00 },
    { anio: 2018, diaria: 80.60, mensual: 2450.24, anual: 29402.88 },
    { anio: 2017, diaria: 75.49, mensual: 2294.90, anual: 27538.80 },
    { anio: 2016, diaria: 73.04, mensual: 2220.42, anual: 26649.60 },
]

const UMA_2026 = UMA_DATA[0]

export default function CalculadoraUMA() {
    const [umas, setUmas] = useState('90')
    const [tipo, setTipo] = useState<'diaria' | 'mensual' | 'anual'>('diaria')
    const [anioSeleccionado, setAnioSeleccionado] = useState('2026')

    const resultado = useMemo(() => {
        const n = parseFloat(umas) || 0
        const anioData = UMA_DATA.find(u => u.anio === parseInt(anioSeleccionado)) || UMA_2026
        const valorUMA = tipo === 'diaria' ? anioData.diaria : tipo === 'mensual' ? anioData.mensual : anioData.anual
        const total = n * valorUMA

        return { n, valorUMA, total, anioData, tipo }
    }, [umas, tipo, anioSeleccionado])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    // Ejemplos comunes
    const ejemplos = [
        { nombre: 'Exención aguinaldo ISR', umas: 30, tipo: 'diaria' as const, desc: 'Art. 93 Fr. XIV LISR' },
        { nombre: 'Exención indemnización ISR', umas: 90, tipo: 'diaria' as const, desc: 'Art. 93 Fr. XIII LISR' },
        { nombre: 'Tope SDI (IMSS)', umas: 25, tipo: 'diaria' as const, desc: 'Art. 28 LSS' },
        { nombre: 'Deducible seguro auto (básico)', umas: 50, tipo: 'diaria' as const, desc: 'Contrato póliza' },
        { nombre: 'Multa tránsito CDMX (leve)', umas: 10, tipo: 'diaria' as const, desc: 'Reglamento tránsito' },
        { nombre: 'Fianza penal delito menor', umas: 100, tipo: 'diaria' as const, desc: 'Art. 166 CNPP' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💱</span><span>Convertidor UMA 2026</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Convertidor <span className="gradient-gold">UMA a Pesos</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Convierte multas, fianzas, exenciones fiscales y montos legales expresados en
                    <strong className="text-white"> UMAs</strong> (Unidad de Medida y Actualización) a pesos mexicanos.
                </p>
            </div>

            {/* Valores UMA 2026 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card p-4 rounded-xl text-center">
                    <p className="text-xs text-[var(--color-text-muted)]">UMA Diaria 2026</p>
                    <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmt(UMA_2026.diaria)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                    <p className="text-xs text-[var(--color-text-muted)]">UMA Mensual 2026</p>
                    <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmt(UMA_2026.mensual)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                    <p className="text-xs text-[var(--color-text-muted)]">UMA Anual 2026</p>
                    <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmt(UMA_2026.anual)}</p>
                </div>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">💱 Convertir</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Cantidad de UMAs</label>
                        <input type="number" value={umas} onChange={e => setUmas(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tipo de UMA</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value as typeof tipo)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="diaria">UMA Diaria</option>
                            <option value="mensual">UMA Mensual</option>
                            <option value="anual">UMA Anual</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año</label>
                        <select value={anioSeleccionado} onChange={e => setAnioSeleccionado(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {UMA_DATA.map(u => (
                                <option key={u.anio} value={u.anio}>{u.anio}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {resultado && (
                    <div className="bg-[var(--color-accent)]/10 rounded-xl p-6 text-center border border-[var(--color-accent)]/30 mt-4">
                        <p className="text-sm text-[var(--color-accent)] mb-1">
                            {resultado.n} × UMA {resultado.tipo} ({resultado.anioData.anio}) = ${fmt(resultado.valorUMA)}
                        </p>
                        <p className="text-3xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.total)}</p>
                        <p className="text-xs text-[var(--color-accent)]/60 mt-1">pesos mexicanos</p>
                    </div>
                )}
            </div>

            {/* Ejemplos comunes */}
            <div className="mt-8 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📋 Ejemplos comunes de montos en UMAs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ejemplos.map(ej => (
                        <button key={ej.nombre} type="button"
                            onClick={() => { setUmas(String(ej.umas)); setTipo(ej.tipo); setAnioSeleccionado('2026') }}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--color-accent)]/30 transition-all text-left cursor-pointer group">
                            <div>
                                <p className="text-sm text-white group-hover:text-[var(--color-accent)] font-semibold transition-colors">{ej.nombre}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{ej.desc}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[var(--color-text-muted)]">{ej.umas} UMAs</p>
                                <p className="text-sm text-[var(--color-accent)] font-mono font-bold">${fmt(ej.umas * UMA_2026.diaria)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla histórica */}
            <div className="mt-8 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-3">📊 Valor histórico de la UMA (2016-2026)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-2 text-[var(--color-text-muted)]">Año</th>
                                <th className="text-right py-2 text-[var(--color-text-muted)]">Diaria</th>
                                <th className="text-right py-2 text-[var(--color-text-muted)]">Mensual</th>
                                <th className="text-right py-2 text-[var(--color-text-muted)]">Anual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {UMA_DATA.map(u => (
                                <tr key={u.anio} className={`border-b border-white/5 ${u.anio === 2026 ? 'bg-[var(--color-accent)]/10' : 'hover:bg-white/5'} transition-colors`}>
                                    <td className="py-1.5 text-white font-bold">{u.anio}</td>
                                    <td className="text-right py-1.5 text-[var(--color-accent)] font-mono">${fmt(u.diaria)}</td>
                                    <td className="text-right py-1.5 text-white font-mono">${fmt(u.mensual)}</td>
                                    <td className="text-right py-1.5 text-white font-mono">${fmt(u.anual)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es la UMA y para qué se usa?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La <strong>Unidad de Medida y Actualización (UMA)</strong> reemplazó al salario mínimo como referencia para
                    el cálculo de multas, fianzas, exenciones fiscales, cuotas IMSS, créditos Infonavit, pensiones
                    y todos los montos legales en México desde 2016. Se actualiza anualmente conforme al INPC.
                    En 2026, el valor es de ${fmt(UMA_2026.diaria)} por día.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Calculadoras Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'Exenciones en UMAs' },
                        { title: 'Calculadora Intereses Moratorios', href: '/calculadora/intereses-moratorios', desc: 'Intereses de deudas' },
                        { title: 'Calculadora Aguinaldo Neto', href: '/calculadora/aguinaldo-neto', desc: 'Exención 30 UMAs' },
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Liquidación laboral completa' },
                    ].map(t => (
                        <Link key={t.href} href={t.href}
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
                * Valores UMA conforme a publicación DOF del INEGI. UMA 2026: ${UMA_2026.diaria}/día.
            </p>
        </main>
    )
}
