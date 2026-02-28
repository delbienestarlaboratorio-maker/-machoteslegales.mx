'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    UMA_HISTORICO, SMG_HISTORICO, TABLA_ISR_MENSUAL,
    EXENCIONES_ISR, ANIO_ACTUAL, getUMA, getSMG,
    calcularISR, fmtMXN, diasVacacionesLFT, getAniosDisponibles,
} from '@/data/legal-constants'

type Motivo = 'despido' | 'renuncia'

interface Desglose {
    concepto: string
    bruto: number
    exento: number
    gravado: number
    isr: number
    neto: number
    base: string
}

export default function CalculadoraISRFiniquito() {
    const [motivo, setMotivo] = useState<Motivo>('despido')
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [anios, setAnios] = useState('3')
    const [meses, setMeses] = useState('6')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [showISRInfo, setShowISRInfo] = useState(false)
    const [showExencionInfo, setShowExencionInfo] = useState(false)

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const salMensual = parseFloat(salarioMensual) || 0
        if (salMensual <= 0) return null

        const salDiario = salMensual / 30
        const aniosNum = parseInt(anios) || 0
        const mesesNum = parseInt(meses) || 0
        const antiguedadAnios = aniosNum + (mesesNum / 12)
        const proporcionAnio = mesesNum / 12

        const diasVac = diasVacacionesLFT(Math.max(aniosNum, 1))
        const desglose: Desglose[] = []

        // ═══ INDEMNIZACIÓN CONSTITUCIONAL (solo despido) ═══
        if (motivo === 'despido') {
            const bruto90 = salDiario * 90
            const exento90 = Math.min(bruto90, uma.diaria * EXENCIONES_ISR.indemnizacion)
            const gravado90 = Math.max(bruto90 - exento90, 0)
            const isrIndem = calcularISR(gravado90)
            desglose.push({
                concepto: 'Indemnización constitucional (3 meses)',
                bruto: bruto90, exento: exento90, gravado: gravado90,
                isr: isrIndem, neto: bruto90 - isrIndem,
                base: `Art. 48 LFT · Exención: ${EXENCIONES_ISR.indemnizacion} UMAs ($${fmtMXN(uma.diaria * EXENCIONES_ISR.indemnizacion)})`,
            })

            const bruto20d = salDiario * 20 * antiguedadAnios
            const isr20d = calcularISR(bruto20d)
            desglose.push({
                concepto: `20 días por año (${antiguedadAnios.toFixed(1)} años)`,
                bruto: bruto20d, exento: 0, gravado: bruto20d,
                isr: isr20d, neto: bruto20d - isr20d,
                base: 'Art. 50 LFT · 100% gravado',
            })
        }

        // ═══ PRIMA DE ANTIGÜEDAD ═══
        const topePrima = smg.general * 2
        const sdPrima = Math.min(salDiario, topePrima)
        const diasPrima = Math.floor(aniosNum) * 12
        const brutoPrima = diasPrima * sdPrima
        const exentoPrima = Math.min(brutoPrima, uma.diaria * EXENCIONES_ISR.primaAntiguedad)
        const gravadoPrima = Math.max(brutoPrima - exentoPrima, 0)
        const isrPrima = calcularISR(gravadoPrima)
        if (diasPrima > 0) {
            desglose.push({
                concepto: `Prima de antigüedad (${Math.floor(aniosNum)} años × 12 días)`,
                bruto: brutoPrima, exento: exentoPrima, gravado: gravadoPrima,
                isr: isrPrima, neto: brutoPrima - isrPrima,
                base: `Art. 162 LFT · Tope: 2×SMG ($${fmtMXN(topePrima)}) · Exención: ${EXENCIONES_ISR.primaAntiguedad} UMAs`,
            })
        }

        // ═══ AGUINALDO PROPORCIONAL ═══
        const brutoAguinaldo = salDiario * 15 * proporcionAnio
        const exentoAguinaldo = Math.min(brutoAguinaldo, uma.diaria * EXENCIONES_ISR.aguinaldo)
        const gravadoAguinaldo = Math.max(brutoAguinaldo - exentoAguinaldo, 0)
        const isrAguinaldo = calcularISR(gravadoAguinaldo)
        desglose.push({
            concepto: `Aguinaldo proporcional (${mesesNum} meses)`,
            bruto: brutoAguinaldo, exento: exentoAguinaldo, gravado: gravadoAguinaldo,
            isr: isrAguinaldo, neto: brutoAguinaldo - isrAguinaldo,
            base: `Art. 87 LFT · Exención: ${EXENCIONES_ISR.aguinaldo} UMAs ($${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)})`,
        })

        // ═══ VACACIONES + PRIMA VACACIONAL ═══
        const brutoVac = salDiario * diasVac * proporcionAnio
        const brutoPrimaVac = brutoVac * 0.25
        const brutoVacTotal = brutoVac + brutoPrimaVac
        const exentoVac = Math.min(brutoPrimaVac, uma.diaria * EXENCIONES_ISR.primaVacacional)
        const gravadoVac = brutoVacTotal - exentoVac
        const isrVac = calcularISR(Math.max(gravadoVac, 0))
        desglose.push({
            concepto: `Vacaciones + Prima vacacional (${diasVac}d × ${(proporcionAnio * 100).toFixed(0)}%)`,
            bruto: brutoVacTotal, exento: exentoVac, gravado: Math.max(gravadoVac, 0),
            isr: isrVac, neto: brutoVacTotal - isrVac,
            base: `Arts. 76, 80 LFT · Prima vac. exenta ${EXENCIONES_ISR.primaVacacional} UMAs`,
        })

        const totalBruto = desglose.reduce((s, d) => s + d.bruto, 0)
        const totalExento = desglose.reduce((s, d) => s + d.exento, 0)
        const totalGravado = desglose.reduce((s, d) => s + d.gravado, 0)
        const totalISR = desglose.reduce((s, d) => s + d.isr, 0)
        const totalNeto = desglose.reduce((s, d) => s + d.neto, 0)

        return { desglose, totalBruto, totalExento, totalGravado, totalISR, totalNeto, salDiario }
    }, [salarioMensual, anios, meses, motivo, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧮</span>
                    <span>Calculadora ISR Finiquito · LISR {anioCalculo}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de ISR por
                    <span className="gradient-gold"> Finiquito y Liquidación</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Descubre <strong className="text-white">cuánto te quitan de impuestos</strong> de tu finiquito o liquidación.
                    Calcula el ISR exacto y conoce tu <strong className="text-[var(--color-accent)]">monto NETO real</strong>.
                    UMA {uma.anio}: ${fmtMXN(uma.diaria)}/día · SMG: ${fmtMXN(smg.general)}/día.
                </p>
            </div>

            {/* Ad */}
            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Selector motivo */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => setMotivo('despido')}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${motivo === 'despido'
                        ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                    🔴 Me Despidieron
                    <p className="text-xs font-normal mt-1 opacity-70">Indemnización + 20 días/año + finiquito</p>
                </button>
                <button onClick={() => setMotivo('renuncia')}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${motivo === 'renuncia'
                        ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                    🔵 Renuncié
                    <p className="text-xs font-normal mt-1 opacity-70">Solo finiquito (sin indemnización)</p>
                </button>
            </div>

            {/* Formulario */}
            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg mb-4">📋 Tus datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años trabajados</label>
                        <input type="number" value={anios} onChange={e => setAnios(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses adicionales</label>
                        <input type="number" value={meses} onChange={e => setMeses(e.target.value)} min="0" max="11"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año de cálculo</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-emerald-400 mt-1">UMA y SMG se ajustan automáticamente</p>
                    </div>
                </div>

                {/* Resumen valores vigentes */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="text-center">
                        <p className="text-[10px] text-blue-400">UMA diaria {uma.anio}</p>
                        <p className="text-xs text-white font-mono font-bold">${fmtMXN(uma.diaria)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-blue-400">SMG {smg.anio}</p>
                        <p className="text-xs text-white font-mono font-bold">${fmtMXN(smg.general)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-blue-400">SMG Frontera</p>
                        <p className="text-xs text-white font-mono font-bold">${fmtMXN(smg.fronteraNorte)}</p>
                    </div>
                </div>

                {/* Tooltip ISR */}
                <button type="button" onClick={() => setShowISRInfo(!showISRInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo se calcula el ISR de mi finiquito? <span className={`transition-transform ${showISRInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showISRInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div><h4 className="text-white font-bold text-sm mb-1">📌 Resumen rápido</h4>
                            <p className="text-white/80">El ISR de tu finiquito se calcula <strong className="text-[var(--color-accent)]">por separado</strong> de tu sueldo normal. Se aplica la <strong>tabla ISR mensual</strong> del SAT sobre la parte gravada.</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <h5 className="text-emerald-400 font-bold mb-1">✅ Parte EXENTA (no paga ISR)</h5>
                                <ul className="text-white/60 mt-1 space-y-0.5 list-disc pl-4">
                                    <li>Indemnización: hasta {EXENCIONES_ISR.indemnizacion} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.indemnizacion)})</li>
                                    <li>Aguinaldo: hasta {EXENCIONES_ISR.aguinaldo} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)})</li>
                                    <li>Prima vacacional: hasta {EXENCIONES_ISR.primaVacacional} UMAs (${fmtMXN(uma.diaria * EXENCIONES_ISR.primaVacacional)})</li>
                                </ul>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <h5 className="text-red-400 font-bold mb-1">❌ Parte GRAVADA (sí paga ISR)</h5>
                                <ul className="text-white/60 mt-1 space-y-0.5 list-disc pl-4">
                                    <li>Todo lo que exceda las UMAs exentas</li>
                                    <li>20 días por año de servicio (100% gravado)</li>
                                    <li>Salarios caídos (100% gravado)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-3">
                            <p className="text-white/70">
                                <strong className="text-blue-400">Art. 93 LISR, Fr. XIII y XIV</strong>: exenciones.
                                <strong className="text-blue-400"> Art. 95 LISR</strong>: procedimiento especial pagos por separación.
                                <strong className="text-blue-400"> Art. 96 LISR</strong>: tabla retención mensual.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* RESULTADOS */}
            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu {motivo === 'despido' ? 'liquidación' : 'finiquito'} neto ({anioCalculo})</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Bruto total</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.totalBruto)}</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1">Exento de ISR</p>
                                <p className="text-lg font-bold text-emerald-400 font-mono">${fmtMXN(resultado.totalExento)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">ISR retenido</p>
                                <p className="text-lg font-bold text-red-400 font-mono">-${fmtMXN(resultado.totalISR)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">NETO que recibes</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.totalNeto)}</p>
                            </div>
                        </div>

                        <div className="relative h-8 rounded-full overflow-hidden bg-white/5">
                            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-[var(--color-accent)] rounded-full transition-all"
                                style={{ width: `${(resultado.totalNeto / resultado.totalBruto) * 100}%` }} />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                Recibes {((resultado.totalNeto / resultado.totalBruto) * 100).toFixed(1)}% del bruto
                            </div>
                        </div>
                    </div>

                    {/* Desglose */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4">📊 Desglose concepto por concepto</h3>
                        <button type="button" onClick={() => setShowExencionInfo(!showExencionInfo)}
                            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer mb-4">
                            💡 ¿Por qué algunos conceptos están exentos? <span className={`transition-transform ${showExencionInfo ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {showExencionInfo && (
                            <div className="mb-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
                                <p className="text-white/80">La <strong className="text-blue-400">LISR Art. 93</strong> establece exenciones:</p>
                                <ul className="text-white/60 space-y-1 list-disc pl-4">
                                    <li><strong className="text-white">Indemnización + Prima antigüedad</strong>: Exentas hasta {EXENCIONES_ISR.indemnizacion} × UMA = <strong className="text-emerald-400">${fmtMXN(uma.diaria * EXENCIONES_ISR.indemnizacion)}</strong></li>
                                    <li><strong className="text-white">Aguinaldo</strong>: Exento hasta {EXENCIONES_ISR.aguinaldo} × UMA = <strong className="text-emerald-400">${fmtMXN(uma.diaria * EXENCIONES_ISR.aguinaldo)}</strong></li>
                                    <li><strong className="text-white">Prima vacacional</strong>: Exenta hasta {EXENCIONES_ISR.primaVacacional} × UMA = <strong className="text-emerald-400">${fmtMXN(uma.diaria * EXENCIONES_ISR.primaVacacional)}</strong></li>
                                </ul>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 text-[var(--color-text-muted)] text-xs font-medium">Concepto</th>
                                        <th className="text-right py-2 text-[var(--color-text-muted)] text-xs font-medium">Bruto</th>
                                        <th className="text-right py-2 text-emerald-400 text-xs font-medium">Exento</th>
                                        <th className="text-right py-2 text-orange-400 text-xs font-medium">Gravado</th>
                                        <th className="text-right py-2 text-red-400 text-xs font-medium">ISR</th>
                                        <th className="text-right py-2 text-[var(--color-accent)] text-xs font-medium">Neto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.desglose.map((d, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3"><p className="text-white text-xs font-medium">{d.concepto}</p><p className="text-[10px] text-[var(--color-text-muted)]">{d.base}</p></td>
                                            <td className="text-right text-white font-mono text-xs py-3">${fmtMXN(d.bruto)}</td>
                                            <td className="text-right text-emerald-400 font-mono text-xs py-3">${fmtMXN(d.exento)}</td>
                                            <td className="text-right text-orange-400 font-mono text-xs py-3">${fmtMXN(d.gravado)}</td>
                                            <td className="text-right text-red-400 font-mono text-xs py-3">-${fmtMXN(d.isr)}</td>
                                            <td className="text-right text-[var(--color-accent)] font-mono text-xs font-bold py-3">${fmtMXN(d.neto)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5">
                                        <td className="py-3 text-white font-bold text-sm">TOTAL</td>
                                        <td className="text-right text-white font-mono font-bold text-sm py-3">${fmtMXN(resultado.totalBruto)}</td>
                                        <td className="text-right text-emerald-400 font-mono font-bold text-sm py-3">${fmtMXN(resultado.totalExento)}</td>
                                        <td className="text-right text-orange-400 font-mono font-bold text-sm py-3">${fmtMXN(resultado.totalGravado)}</td>
                                        <td className="text-right text-red-400 font-mono font-bold text-sm py-3">-${fmtMXN(resultado.totalISR)}</td>
                                        <td className="text-right text-[var(--color-accent)] font-mono font-bold text-lg py-3">${fmtMXN(resultado.totalNeto)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Tabla ISR */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-3">📋 Tabla ISR Mensual SAT {anioCalculo} (Art. 96 LISR)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead><tr className="border-b border-white/10">
                                    <th className="text-left py-2 text-[var(--color-text-muted)]">Límite inferior</th>
                                    <th className="text-left py-2 text-[var(--color-text-muted)]">Límite superior</th>
                                    <th className="text-right py-2 text-[var(--color-text-muted)]">Cuota fija</th>
                                    <th className="text-right py-2 text-[var(--color-text-muted)]">% excedente</th>
                                </tr></thead>
                                <tbody>
                                    {TABLA_ISR_MENSUAL.map((r, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-1.5 text-white font-mono">${fmtMXN(r.limInf)}</td>
                                            <td className="py-1.5 text-white font-mono">{r.limSup === Infinity ? 'En adelante' : `$${fmtMXN(r.limSup)}`}</td>
                                            <td className="text-right py-1.5 text-[var(--color-accent)] font-mono">${fmtMXN(r.cuota)}</td>
                                            <td className="text-right py-1.5 text-[var(--color-accent)] font-mono">{r.pct.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="glass-card p-6 rounded-2xl border-[var(--color-accent)]/20 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="text-4xl">⚖️</div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-white font-bold">¿Te despidieron injustamente?</h3>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">Plantillas de demanda laboral, cartas de renuncia y convenios listos para descargar.</p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/calculadora-laboral" className="px-5 py-2.5 rounded-xl border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-sm font-bold hover:bg-[var(--color-accent)]/10 transition-all">Calcular liquidación</Link>
                                <Link href="/plantillas/laboral" className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-dark)] text-sm font-bold hover:bg-[var(--color-accent-light)] transition-all">Ver plantillas →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SEO */}
            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cuánto me quitan de impuestos de mi finiquito en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Cuando recibes un finiquito o liquidación laboral, tu patrón retiene el <strong className="text-white">ISR</strong> sobre la parte gravada.
                    La ley establece <strong className="text-emerald-400">exenciones</strong>: indemnización hasta {EXENCIONES_ISR.indemnizacion} UMAs,
                    aguinaldo hasta {EXENCIONES_ISR.aguinaldo} UMAs, prima vacacional hasta {EXENCIONES_ISR.primaVacacional} UMAs.
                    Esta calculadora te permite ver los valores exactos de cualquier año desde 2016.
                </p>
            </section>

            {/* Links */}
            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Plantillas y Calculadoras Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación Laboral', href: '/calculadora-laboral', desc: 'Calcula tu liquidación bruta' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Convierte UMAs de cualquier año' },
                        { title: 'Calculadora Aguinaldo Neto', href: '/calculadora/aguinaldo-neto', desc: 'Tu aguinaldo después de ISR' },
                        { title: 'Plantillas Laborales', href: '/plantillas/laboral', desc: 'Demandas, renuncias, convenios' },
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
                * Cálculo con tablas ISR SAT (Art. 96 LISR). UMA {uma.anio}: ${fmtMXN(uma.diaria)} · SMG: ${fmtMXN(smg.general)}.
                Exenciones Art. 93 LISR. Procedimiento Art. 95 LISR. Selecciona el año para valores históricos. No sustituye asesoría fiscal.
            </p>
        </main>
    )
}
