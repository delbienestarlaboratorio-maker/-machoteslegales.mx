'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN } from '@/data/legal-constants'

export default function CalculadoraModalidad40() {
    const [salarioCotizacion, setSalarioCotizacion] = useState('25')
    const [tipoIngreso, setTipoIngreso] = useState<'umas' | 'pesos'>('umas')
    const [aniosInversion, setAniosInversion] = useState('5')
    const anioCalculo = ANIO_ACTUAL
    const uma = getUMA(anioCalculo)

    const resultado = useMemo(() => {
        let sd = 0
        if (tipoIngreso === 'umas') {
            const umas = Math.min(parseFloat(salarioCotizacion) || 0, 25)
            sd = umas * uma.diaria
        } else {
            sd = parseFloat(salarioCotizacion) || 0
        }

        // Tope máximo legal 25 UMAs
        const tope25UMAs = uma.diaria * 25
        const sdTopado = Math.min(sd, tope25UMAs)

        // Porcentaje progresivo Modalidad 40 (Reforma Pensiones: sube cada año)
        // 2023 = 11.166%, 2024 = 12.256%, 2025 = 13.347%, 2026 = 14.438%
        const cuotaPorcentaje2026 = 14.438 / 100

        // Costo mensual estimado (30.4 días)
        const salarioMensualBase = sdTopado * 30.4
        const costoMensual = salarioMensualBase * cuotaPorcentaje2026

        // Proyección de inversión
        const anios = parseInt(aniosInversion) || 5
        const meses = anios * 12
        const inversionTotal = costoMensual * meses

        return {
            sdOriginal: sd, sdTopado, tope25UMAs,
            cuotaPct: 14.438, costoMensual, salarioMensualBase,
            anios, meses, inversionTotal
        }
    }, [salarioCotizacion, tipoIngreso, aniosInversion, uma])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📈</span><span>Modalidad 40 · Art. 218 LSS</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Modalidad 40 IMSS 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula el costo mensual de la <strong className="text-white">Continuación Voluntaria al Régimen Obligatorio</strong>.
                    Por reforma de pensiones, el costo en 2026 sube al <strong className="text-[var(--color-accent)]">14.438%</strong> del salario registrado.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs text-[var(--color-text-muted)] font-semibold">Salario de registro</label>
                            <select value={tipoIngreso} onChange={e => setTipoIngreso(e.target.value as any)} className="bg-transparent text-[var(--color-accent)] text-xs focus:outline-none">
                                <option value="umas" className="bg-[#1a1c23]">En UMAs (Máx. 25)</option>
                                <option value="pesos" className="bg-[#1a1c23]">En Pesos $/día</option>
                            </select>
                        </div>
                        <input type="number" value={salarioCotizacion} onChange={e => setSalarioCotizacion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Tope máximo IMSS: 25 UMAs (${fmtMXN(uma.diaria * 25)}/día)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de inversión proyectada</label>
                        <select value={aniosInversion} onChange={e => setAniosInversion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {[1, 2, 3, 4, 5].map(a => <option key={a} value={a}>{a} año{a > 1 ? 's' : ''}</option>)}
                        </select>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Para promediar últimas 250 semanas (Ley 73)</p>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Salario Base (Mes)', val: resultado.salarioMensualBase, color: 'text-white', bg: 'bg-white/5' },
                            { label: 'Costo Modalidad 40 / mes', val: resultado.costoMensual, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' },
                            { label: `Inversión total (${resultado.anios} años)`, val: resultado.inversionTotal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
                        ].map((s, i) => (
                            <div key={i} className={`p-4 rounded-xl text-center ${s.bg}`}>
                                <p className="text-[10px] text-white/50 mb-1">{s.label}</p>
                                <p className={`text-xl font-bold font-mono ${s.color}`}>${fmtMXN(s.val)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card p-6 rounded-2xl text-sm">
                        <h2 className="text-white font-bold mb-4">Desglose de cálculo (Año 2026)</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60">Sueldo diario registrado</span>
                                <span className="font-mono text-white">${fmtMXN(resultado.sdTopado)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60">Tasa cuota patronal + obrera (Mod. 40)</span>
                                <span className="font-mono text-white">{resultado.cuotaPct}%</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-[var(--color-accent)] font-bold">Pago mensual al IMSS</span>
                                <span className="font-mono text-[var(--color-accent)] font-bold">${fmtMXN(resultado.costoMensual)}</span>
                            </div>
                        </div>
                        {resultado.sdOriginal > resultado.tope25UMAs && (
                            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-400">
                                ⚠️ El salario ingresado topaba límite legal de 25 UMAs. Se ajustó a ${fmtMXN(resultado.tope25UMAs)} diarios para el cálculo.
                            </div>
                        )}
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-white/70">
                            <strong>Nota sobre aumentos:</strong> La cuota de Mod. 40 incrementa 1.091% anualmente hasta llegar al 18.80% en 2030. Cifra mostrada es para 2026 (14.438%). Tu inversión variará año con año.
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
