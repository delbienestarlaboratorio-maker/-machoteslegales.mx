'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const SMG_2026 = 278.80

export default function CalculadoraPension() {
    const [ingresoMensual, setIngresoMensual] = useState('20000')
    const [numHijos, setNumHijos] = useState('2')
    const [hijosDiscapacidad, setHijosDiscapacidad] = useState('0')
    const [tieneOtrasCargasFamiliares, setTieneOtrasCargasFamiliares] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [showEstados, setShowEstados] = useState(false)

    const resultado = useMemo(() => {
        const ingreso = parseFloat(ingresoMensual) || 0
        if (ingreso <= 0) return null
        const hijos = parseInt(numHijos) || 0
        const hijosDisc = parseInt(hijosDiscapacidad) || 0

        // Porcentajes base por hijo según criterio judicial común
        // 1 hijo: 15-20%, 2 hijos: 25-30%, 3+: 35-50%
        // Se usa un rango y se da mínimo y máximo
        let pctMin: number, pctMax: number

        if (hijos === 0) { pctMin = 0; pctMax = 0 }
        else if (hijos === 1) { pctMin = 15; pctMax = 20 }
        else if (hijos === 2) { pctMin = 25; pctMax = 30 }
        else if (hijos === 3) { pctMin = 35; pctMax = 40 }
        else if (hijos === 4) { pctMin = 40; pctMax = 50 }
        else { pctMin = 45; pctMax = 60 }

        // Ajuste por discapacidad (+5% por cada hijo)
        pctMin += hijosDisc * 5
        pctMax += hijosDisc * 5

        // Ajuste por otras cargas familiares
        if (tieneOtrasCargasFamiliares) {
            pctMin += 5
            pctMax += 5
        }

        // Tope: no puede exceder 60%
        pctMax = Math.min(pctMax, 60)
        pctMin = Math.min(pctMin, pctMax)

        const montoMin = ingreso * (pctMin / 100)
        const montoMax = ingreso * (pctMax / 100)
        const montoMedio = (montoMin + montoMax) / 2

        // Monto por hijo
        const porHijoMin = hijos > 0 ? montoMin / hijos : 0
        const porHijoMax = hijos > 0 ? montoMax / hijos : 0

        // Monto mínimo vital (SMG)
        const minimoVital = SMG_2026 * 30 // salario mínimo mensual

        return {
            ingreso, hijos, hijosDisc, pctMin, pctMax,
            montoMin, montoMax, montoMedio,
            porHijoMin, porHijoMax, minimoVital,
            anual: montoMedio * 12
        }
    }, [ingresoMensual, numHijos, hijosDiscapacidad, tieneOtrasCargasFamiliares])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>👨‍👩‍👧</span><span>Calculadora Pensión · Arts. 308-323 CC</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Pensión Alimenticia</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima el rango de pensión alimenticia según tus ingresos y número de hijos.
                    El monto final lo determina un <strong className="text-white">juez familiar</strong> considerando
                    las necesidades del acreedor y las posibilidades del deudor.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingreso mensual del deudor ($)</label>
                        <input type="number" value={ingresoMensual} onChange={e => setIngresoMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Incluye sueldo, comisiones, propinas, etc.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de hijos</label>
                        <input type="number" value={numHijos} onChange={e => setNumHijos(e.target.value)} min="0" max="10"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Hijos con discapacidad</label>
                        <input type="number" value={hijosDiscapacidad} onChange={e => setHijosDiscapacidad(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={tieneOtrasCargasFamiliares} onChange={e => setTieneOtrasCargasFamiliares(e.target.checked)}
                        className="w-4 h-4 rounded border border-white/20" />
                    <span className="text-sm text-white/80">¿Tiene cónyuge u otras cargas familiares?</span>
                </label>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo determina un juez el monto de la pensión? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <p className="text-white/80">
                            El juez familiar determina el porcentaje considerando el <strong className="text-[var(--color-accent)]">principio de proporcionalidad</strong>
                            (Art. 311 CC Federal): las posibilidades del deudor vs. las necesidades del acreedor.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3">
                                <h5 className="text-white font-bold mb-1">📊 Factores que AUMENTAN la pensión</h5>
                                <ul className="text-white/60 space-y-0.5 list-disc pl-4">
                                    <li>Hijos con discapacidad o necesidades especiales</li>
                                    <li>Gastos médicos, escolares elevados</li>
                                    <li>El deudor tiene ingresos altos</li>
                                    <li>El acreedor no puede trabajar</li>
                                    <li>Zona de residencia cara</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <h5 className="text-white font-bold mb-1">📉 Factores que REDUCEN la pensión</h5>
                                <ul className="text-white/60 space-y-0.5 list-disc pl-4">
                                    <li>El deudor tiene bajos ingresos</li>
                                    <li>Otras obligaciones alimentarias</li>
                                    <li>El acreedor tiene ingresos propios</li>
                                    <li>Los hijos son mayores de edad (excepción: estudiantes)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-2">
                            <p className="text-white/70">
                                <strong className="text-blue-400">Arts. 308-323 CC Federal</strong>: La pensión incluye comida, vestido, habitación,
                                atención médica, gastos escolares y, en caso de menores, los gastos necesarios para su esparcimiento.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {resultado && resultado.hijos > 0 && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Rango estimado de pensión alimenticia</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-1">Mínimo ({resultado.pctMin}%)</p>
                                <p className="text-xl font-bold text-blue-400 font-mono">${fmt(resultado.montoMin)}</p>
                                <p className="text-[10px] text-blue-400/60">/mes</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Promedio</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.montoMedio)}</p>
                                <p className="text-[10px] text-[var(--color-accent)]/60">/mes · ${fmt(resultado.anual)} /año</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Máximo ({resultado.pctMax}%)</p>
                                <p className="text-xl font-bold text-red-400 font-mono">${fmt(resultado.montoMax)}</p>
                                <p className="text-[10px] text-red-400/60">/mes</p>
                            </div>
                        </div>

                        {/* Barra de rango */}
                        <div className="relative h-8 rounded-full overflow-hidden bg-white/5 mb-4">
                            <div className="absolute top-0 h-full bg-gradient-to-r from-blue-500/40 to-red-500/40 rounded-full"
                                style={{ left: `${resultado.pctMin}%`, width: `${resultado.pctMax - resultado.pctMin}%` }} />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                {resultado.pctMin}% — {resultado.pctMax}% del ingreso
                            </div>
                        </div>

                        {/* Por hijo */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-xs text-[var(--color-text-muted)]">Por hijo (mín.)</p>
                                <p className="text-white font-mono font-bold">${fmt(resultado.porHijoMin)}/mes</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-xs text-[var(--color-text-muted)]">Por hijo (máx.)</p>
                                <p className="text-white font-mono font-bold">${fmt(resultado.porHijoMax)}/mes</p>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                            <p className="text-orange-400 font-bold">⚖️ Importante</p>
                            <p className="text-white/60 mt-1">
                                El monto mínimo vital es el salario mínimo mensual: <strong>${fmt(resultado.minimoVital)}</strong> (2026).
                                Un juez no puede fijar una pensión menor a las necesidades básicas del acreedor
                                (Art. 311 CC Federal). Este cálculo es estimativo — el monto exacto lo determina el juez.
                            </p>
                        </div>
                    </div>

                    {/* Tabla referencia */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-3">📋 Tabla de referencia: porcentaje por número de hijos</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 text-[var(--color-text-muted)] text-xs">Hijos</th>
                                        <th className="text-center py-2 text-blue-400 text-xs">% Mínimo</th>
                                        <th className="text-center py-2 text-red-400 text-xs">% Máximo</th>
                                        <th className="text-right py-2 text-[var(--color-accent)] text-xs">Rango mensual (tu caso)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5].map(h => {
                                        const min = h === 1 ? 15 : h === 2 ? 25 : h === 3 ? 35 : h === 4 ? 40 : 45
                                        const max = h === 1 ? 20 : h === 2 ? 30 : h === 3 ? 40 : h === 4 ? 50 : 60
                                        const ingreso = parseFloat(ingresoMensual) || 0
                                        return (
                                            <tr key={h} className={`border-b border-white/5 ${h === resultado.hijos ? 'bg-[var(--color-accent)]/10' : 'hover:bg-white/5'} transition-colors`}>
                                                <td className="py-2 text-white">{h} {h === 1 ? 'hijo' : 'hijos'}</td>
                                                <td className="text-center py-2 text-blue-400 font-mono">{min}%</td>
                                                <td className="text-center py-2 text-red-400 font-mono">{max}%</td>
                                                <td className="text-right py-2 text-[var(--color-accent)] font-mono text-xs">
                                                    ${fmt(ingreso * min / 100)} — ${fmt(ingreso * max / 100)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-2">
                            * Los porcentajes son criterios judiciales generales. El juez puede ajustarlos según el caso.
                        </p>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo funciona la pensión alimenticia en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La <strong>pensión alimenticia</strong> es un derecho constitucional (Art. 4° Constitución) regulado por los
                    <strong> Arts. 308-323 del Código Civil Federal</strong>. Incluye comida, vestido, habitación, atención médica,
                    gastos de educación y esparcimiento. El monto se fija según el principio de proporcionalidad:
                    las necesidades del acreedor alimentario vs. las posibilidades del deudor alimentario.
                    Generalmente oscila entre el <strong>15% y 30% del ingreso por cada hijo</strong>.
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El <strong>incumplimiento de la pensión alimenticia es delito</strong> tipificado como abandono de persona
                    (Art. 336 del Código Penal Federal), con pena de 1 mes a 5 años de prisión.
                </p>
            </section>

            <button type="button" onClick={() => setShowEstados(!showEstados)}
                className="mt-6 text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer mx-auto">
                📍 Ver variaciones por estado <span className={`transition-transform ${showEstados ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showEstados && (
                <div className="mt-3 glass-card p-6 rounded-2xl">
                    <h3 className="text-white font-bold mb-3 text-sm">Porcentajes sugeridos por estado (criterios judiciales)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {[
                            { estado: 'CDMX', rango: '15-33%' },
                            { estado: 'Estado de México', rango: '15-30%' },
                            { estado: 'Jalisco', rango: '15-30%' },
                            { estado: 'Nuevo León', rango: '15-25%' },
                            { estado: 'Puebla', rango: '20-30%' },
                            { estado: 'Guanajuato', rango: '15-30%' },
                            { estado: 'Veracruz', rango: '15-33%' },
                            { estado: 'Chihuahua', rango: '15-30%' },
                            { estado: 'Sonora', rango: '15-25%' },
                            { estado: 'Hidalgo', rango: '20-30%' },
                            { estado: 'Yucatán', rango: '15-30%' },
                            { estado: 'Tabasco', rango: '20-35%' },
                        ].map(e => (
                            <div key={e.estado} className="bg-white/5 rounded-lg p-2 text-center">
                                <p className="text-white/60">{e.estado}</p>
                                <p className="text-[var(--color-accent)] font-mono font-bold">{e.rango}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-2">
                        * Estos son rangos generales por hijo. El porcentaje varía según el código civil de cada estado.
                    </p>
                </div>
            )}

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Plantillas y Calculadoras Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Demanda de Pensión Alimenticia', href: '/plantillas/familiar', desc: 'Demanda ante juzgado familiar' },
                        { title: 'Convenio de Divorcio', href: '/plantillas/familiar', desc: 'Incluye cláusula de pensión' },
                        { title: 'Calculadora Herencia', href: '/calculadora/herencia-legitima', desc: 'División de bienes hereditarios' },
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Tu liquidación laboral' },
                    ].map(t => (
                        <Link key={t.href + t.title} href={t.href}
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
                * Cálculo estimativo. El monto final es determinado por el juez familiar. Arts. 308-323 CC Federal. No sustituye asesoría legal.
            </p>
        </main>
    )
}
