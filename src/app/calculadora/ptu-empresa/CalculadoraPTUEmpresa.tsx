'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraPTUEmpresa() {
    const [utilidadFiscal, setUtilidadFiscal] = useState('800000')
    const [trabajadores, setTrabajadores] = useState([
        { nombre: 'Trabajador 1', dias: 365, salarioDiario: 500 },
        { nombre: 'Trabajador 2', dias: 200, salarioDiario: 350 },
        { nombre: 'Trabajador 3', dias: 365, salarioDiario: 280 },
    ])
    const [showAgregar, setShowAgregar] = useState(false)
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [nuevoDias, setNuevoDias] = useState('365')
    const [nuevoSalario, setNuevoSalario] = useState('400')

    const resultado = useMemo(() => {
        const utilidad = parseFloat(utilidadFiscal) || 0
        if (utilidad <= 0 || trabajadores.length === 0) return null

        const ptuTotal = utilidad * 0.10 // 10% de utilidad fiscal = PTU total

        // Factor A: 50% dividido en días trabajados
        const factorA = ptuTotal * 0.50
        const totalDias = trabajadores.reduce((s, t) => s + t.dias, 0)

        // Factor B: 50% dividido en salarios
        const factorB = ptuTotal * 0.50
        const totalSalarios = trabajadores.reduce((s, t) => s + (t.dias * t.salarioDiario), 0)

        const trabajadoresCalculo = trabajadores.map(t => {
            const salariosT = t.dias * t.salarioDiario
            const porDias = totalDias > 0 ? factorA * (t.dias / totalDias) : 0
            const porSalarios = totalSalarios > 0 ? factorB * (salariosT / totalSalarios) : 0
            const totalT = porDias + porSalarios
            return { ...t, salariosT, porDias, porSalarios, total: totalT }
        })

        return { ptuTotal, factorA, factorB, totalDias, totalSalarios, trabajadoresCalculo }
    }, [utilidadFiscal, trabajadores])

    const agregarTrabajador = () => {
        if (!nuevoNombre) return
        setTrabajadores(prev => [...prev, { nombre: nuevoNombre, dias: parseInt(nuevoDias) || 365, salarioDiario: parseFloat(nuevoSalario) || 400 }])
        setNuevoNombre(''); setNuevoDias('365'); setNuevoSalario('400'); setShowAgregar(false)
    }

    const eliminarTrabajador = (i: number) => setTrabajadores(prev => prev.filter((_, idx) => idx !== i))

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💼</span><span>PTU Empresa · Arts. 120-131 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">PTU para Empresa</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El <strong className="text-white">10% de la utilidad fiscal</strong> se distribuye entre todos los
                    trabajadores usando dos factores: <strong className="text-[var(--color-accent)]">días trabajados (50%)</strong> y
                    <strong className="text-white"> salarios percibidos (50%)</strong>. Arts. 120-131 LFT.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Utilidad fiscal del ejercicio ($) — del aviso SAT</label>
                    <input type="number" value={utilidadFiscal} onChange={e => setUtilidadFiscal(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">10% = PTU total a repartir. Aparece en tu declaración anual SAT. Vence el 31 de mayo (patrón).</p>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold text-sm">👷 Trabajadores</h3>
                        <button onClick={() => setShowAgregar(true)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/30 transition-all cursor-pointer font-bold">
                            + Agregar
                        </button>
                    </div>

                    <div className="space-y-2">
                        {trabajadores.map((t, i) => (
                            <div key={i} className="flex gap-2 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-white/60 text-xs w-28 truncate font-bold">{t.nombre}</span>
                                <input type="number" value={t.dias} onChange={e => setTrabajadores(prev => prev.map((x, j) => j === i ? { ...x, dias: parseInt(e.target.value) || 0 } : x))}
                                    className="w-20 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:border-[var(--color-accent)] focus:outline-none" placeholder="Días" />
                                <span className="text-white/30 text-xs">días</span>
                                <input type="number" value={t.salarioDiario} onChange={e => setTrabajadores(prev => prev.map((x, j) => j === i ? { ...x, salarioDiario: parseFloat(e.target.value) || 0 } : x))}
                                    className="w-24 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:border-[var(--color-accent)] focus:outline-none" placeholder="SD $" />
                                <span className="text-white/30 text-xs flex-1">$/día</span>
                                <button onClick={() => eliminarTrabajador(i)} className="text-red-400/50 hover:text-red-400 text-xs cursor-pointer">✕</button>
                            </div>
                        ))}
                    </div>

                    {showAgregar && (
                        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-[var(--color-accent)]/20 space-y-3">
                            <div className="grid grid-cols-3 gap-2">
                                <input placeholder="Nombre" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)}
                                    className="col-span-3 p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                                <input type="number" placeholder="Días trab." value={nuevoDias} onChange={e => setNuevoDias(e.target.value)}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                                <input type="number" placeholder="Salario $/día" value={nuevoSalario} onChange={e => setNuevoSalario(e.target.value)}
                                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                                <button onClick={agregarTrabajador}
                                    className="p-2 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold cursor-pointer hover:bg-[var(--color-accent)]/30 transition-all">
                                    ✓ Agregar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Distribución de PTU</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">PTU total (10%)</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.ptuTotal)}</p>
                            </div>
                            <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-1">Factor A — Días (50%)</p>
                                <p className="text-xl font-bold text-blue-400 font-mono">${fmtMXN(resultado.factorA)}</p>
                            </div>
                            <div className="bg-purple-500/10 rounded-xl p-4 text-center border border-purple-500/20">
                                <p className="text-xs text-purple-400 mb-1">Factor B — Salarios (50%)</p>
                                <p className="text-xl font-bold text-purple-400 font-mono">${fmtMXN(resultado.factorB)}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-white/50 border-b border-white/10">
                                        <th className="py-2 text-left">Trabajador</th>
                                        <th className="py-2 text-right">Días</th>
                                        <th className="py-2 text-right">Salarios</th>
                                        <th className="py-2 text-right">Por días</th>
                                        <th className="py-2 text-right">Por salarios</th>
                                        <th className="py-2 text-right font-bold text-[var(--color-accent)]">Total PTU</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.trabajadoresCalculo.map((t, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-2 text-white font-bold">{t.nombre}</td>
                                            <td className="py-2 text-right text-white/60">{t.dias}</td>
                                            <td className="py-2 text-right font-mono text-white/60">${fmtMXN(t.salariosT)}</td>
                                            <td className="py-2 text-right font-mono text-blue-400">${fmtMXN(t.porDias)}</td>
                                            <td className="py-2 text-right font-mono text-purple-400">${fmtMXN(t.porSalarios)}</td>
                                            <td className="py-2 text-right font-mono text-[var(--color-accent)] font-bold">${fmtMXN(t.total)}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t border-white/20 bg-white/5">
                                        <td className="py-2 text-white font-bold" colSpan={5}>TOTAL</td>
                                        <td className="py-2 text-right font-mono text-[var(--color-accent)] font-bold text-sm">${fmtMXN(resultado.ptuTotal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                                <p className="text-orange-400 font-bold mb-1">📅 Plazos de pago</p>
                                <p className="text-white/60">Persona moral: <strong>31 de mayo</strong>. Persona física: <strong>30 de junio</strong>. Art. 122 LFT.</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                                <p className="text-blue-400 font-bold mb-1">🚫 Trabajadores Excluidos (Art. 127 LFT)</p>
                                <p className="text-white/60">Directores, gerentes generales y socios no participan en PTU.</p>
                            </div>
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
                * Arts. 120-131 LFT. 10% utilidad fiscal. Factor A: días trabajados 50%. Factor B: Salarios percibidos 50%. Art. 122 plazos. Art. 127 Exclusiones.
            </p>
        </main>
    )
}
