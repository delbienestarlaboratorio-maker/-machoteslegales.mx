'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const UMA_2026 = 113.14

export default function CalculadoraPTU() {
    const [utilidadEmpresa, setUtilidadEmpresa] = useState('1000000')
    const [totalTrabajadores, setTotalTrabajadores] = useState('20')
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [diasTrabajados, setDiasTrabajados] = useState('365')
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const utilidad = parseFloat(utilidadEmpresa) || 0
        const numTrabajadores = parseInt(totalTrabajadores) || 1
        const sm = parseFloat(salarioMensual) || 0
        const dt = parseInt(diasTrabajados) || 365
        if (utilidad <= 0 || sm <= 0) return null

        const ptu10pct = utilidad * 0.10 // 10% de la utilidad
        const mitad = ptu10pct / 2

        // Primera mitad: por días trabajados (se divide entre total de días de todos los trabajadores)
        // Simplificación: asumimos todos trabajaron los mismos días
        const totalDiasTodos = numTrabajadores * 365
        const parteA = (mitad / totalDiasTodos) * dt

        // Segunda mitad: por salarios devengados
        const salarioAnual = sm * 12
        // Simplificación: asumimos salario promedio igual al del trabajador
        const totalSalariosTodos = salarioAnual * numTrabajadores
        const parteB = (mitad / totalSalariosTodos) * salarioAnual

        const ptuBruto = parteA + parteB

        // Tope: 3 meses de salario o promedio PTU últimos 3 años (el mayor)
        const tope3meses = sm * 3
        const ptuFinal = Math.min(ptuBruto, tope3meses)
        const topado = ptuBruto > tope3meses

        // ISR: PTU exento hasta 15 UMAs
        const exento = Math.min(ptuFinal, UMA_2026 * 15)
        const gravado = Math.max(ptuFinal - exento, 0)

        return {
            ptu10pct, mitad, parteA, parteB, ptuBruto, tope3meses, ptuFinal,
            topado, exento, gravado, dt
        }
    }, [utilidadEmpresa, totalTrabajadores, salarioMensual, diasTrabajados])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💰</span><span>Calculadora PTU · Arts. 117-131 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">PTU — Reparto de Utilidades</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula cuánto te corresponde del <strong className="text-white">reparto de utilidades</strong> de tu empresa.
                    El 10% de la utilidad fiscal se reparte entre todos los trabajadores. <strong className="text-[var(--color-accent)]">Tope: 3 meses de salario</strong>.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos de la empresa y del trabajador</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Utilidad fiscal de la empresa ($)</label>
                        <input type="number" value={utilidadEmpresa} onChange={e => setUtilidadEmpresa(e.target.value)} placeholder="1000000"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Total de trabajadores</label>
                        <input type="number" value={totalTrabajadores} onChange={e => setTotalTrabajadores(e.target.value)} min="1"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tu salario mensual ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días trabajados en el año</label>
                        <input type="number" value={diasTrabajados} onChange={e => setDiasTrabajados(e.target.value)} max="366"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo se reparten las utilidades? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div>
                            <h4 className="text-white font-bold text-sm mb-1">📌 El PTU se divide en dos mitades iguales</h4>
                            <p className="text-white/80">Del 10% de la utilidad fiscal de la empresa:</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <h5 className="text-blue-400 font-bold mb-1">📅 50% por días trabajados</h5>
                                <p className="text-white/60">Se divide entre el total de días trabajados por TODOS los trabajadores. A más días, más recibes.</p>
                            </div>
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                <h5 className="text-purple-400 font-bold mb-1">💵 50% por salarios</h5>
                                <p className="text-white/60">Se divide proporcionalmente según tu salario vs. la suma de todos los salarios. A mayor sueldo, más recibes.</p>
                            </div>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                            <h5 className="text-orange-400 font-bold mb-1">⚠️ Tope (reforma 2021)</h5>
                            <p className="text-white/60">El PTU tiene un <strong>tope máximo de 3 meses de salario</strong> del trabajador, o el promedio del PTU recibido en los últimos 3 años — lo que resulte más benéfico. Art. 127 Fr. VIII LFT.</p>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                            <p className="text-white/70"><strong className="text-blue-400">Fecha límite</strong>: Personas morales: 30 de mayo. Personas físicas: 29 de junio.</p>
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu PTU estimado</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-1">Por días ({resultado.dt}d)</p>
                                <p className="text-lg font-bold text-blue-400 font-mono">${fmt(resultado.parteA)}</p>
                            </div>
                            <div className="bg-purple-500/10 rounded-xl p-4 text-center border border-purple-500/20">
                                <p className="text-xs text-purple-400 mb-1">Por salario</p>
                                <p className="text-lg font-bold text-purple-400 font-mono">${fmt(resultado.parteB)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30 col-span-2 md:col-span-1">
                                <p className="text-xs text-[var(--color-accent)] mb-1">PTU TOTAL</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.ptuFinal)}</p>
                            </div>
                        </div>

                        {resultado.topado && (
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs mb-4">
                                <p className="text-orange-400 font-bold">⚠️ Tu PTU fue topado</p>
                                <p className="text-white/60 mt-1">
                                    El cálculo arrojó ${fmt(resultado.ptuBruto)}, pero el tope de 3 meses de salario es ${fmt(resultado.tope3meses)}.
                                    Se aplica el tope (Art. 127 Fr. VIII LFT).
                                </p>
                            </div>
                        )}

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/60">10% utilidad fiscal</span>
                                <span className="text-white font-mono">${fmt(resultado.ptu10pct)}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-emerald-400">Exento de ISR (15 UMAs)</span>
                                <span className="text-emerald-400 font-mono">${fmt(resultado.exento)}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <span className="text-red-400">Gravado (paga ISR)</span>
                                <span className="text-red-400 font-mono">${fmt(resultado.gravado)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es el PTU y cuándo se paga?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La <strong>Participación de los Trabajadores en las Utilidades (PTU)</strong> es un derecho constitucional
                    (Art. 123, Apartado A, Fr. IX) que obliga a las empresas a repartir el 10% de su utilidad fiscal entre todos
                    sus trabajadores. Se paga antes del 30 de mayo (personas morales) o 29 de junio (personas físicas).
                    Con la reforma de 2021, se estableció un tope de 3 meses de salario o el promedio de los últimos 3 años.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Calcula tu liquidación completa' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'ISR de tu finiquito' },
                        { title: 'Calculadora Aguinaldo Neto', href: '/calculadora/aguinaldo-neto', desc: 'Cuánto recibes de aguinaldo' },
                        { title: 'Plantillas Laborales', href: '/plantillas/laboral', desc: 'Demandas y convenios' },
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
                * Cálculo estimado. Arts. 117-131 LFT. Tope 3 meses (reforma 2021). PTU exento hasta 15 UMAs (Art. 93 Fr. XIV LISR). No sustituye asesoría profesional.
            </p>
        </main>
    )
}
