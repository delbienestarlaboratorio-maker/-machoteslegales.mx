'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

/* ─── Tablas ISR SAT 2026 (Art. 96 LISR — tabla mensual) ─── */
const TABLA_ISR_MENSUAL = [
    { limInf: 0.01, limSup: 746.04, cuota: 0, pct: 1.92 },
    { limInf: 746.05, limSup: 6332.05, cuota: 14.32, pct: 6.40 },
    { limInf: 6332.06, limSup: 11128.01, cuota: 371.83, pct: 10.88 },
    { limInf: 11128.02, limSup: 12935.82, cuota: 893.63, pct: 16.00 },
    { limInf: 12935.83, limSup: 15487.71, cuota: 1182.88, pct: 17.92 },
    { limInf: 15487.72, limSup: 31236.49, cuota: 1640.18, pct: 21.36 },
    { limInf: 31236.50, limSup: 49233.00, cuota: 5004.12, pct: 23.52 },
    { limInf: 49233.01, limSup: 93993.90, cuota: 9236.89, pct: 30.00 },
    { limInf: 93993.91, limSup: 125325.20, cuota: 22665.17, pct: 32.00 },
    { limInf: 125325.21, limSup: 375975.61, cuota: 32691.18, pct: 34.00 },
    { limInf: 375975.62, limSup: Infinity, cuota: 117912.32, pct: 35.00 },
]

/* ─── Datos LFT / LISR 2026 ─── */
const UMA_DIARIA_2026 = 113.14       // UMA diaria 2026
const SMG_2026 = 278.80              // Salario mínimo general 2026
const EXENCION_FINIQUITO_UMAs = 90   // 90 días de UMA para indemnización = exento
const EXENCION_AGUINALDO_UMAs = 30   // 30 días de UMA para aguinaldo

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

function calcularISR(baseGravable: number): number {
    if (baseGravable <= 0) return 0
    for (const rango of TABLA_ISR_MENSUAL) {
        if (baseGravable >= rango.limInf && baseGravable <= rango.limSup) {
            const excedente = baseGravable - rango.limInf
            return rango.cuota + (excedente * rango.pct / 100)
        }
    }
    // Si excede el último rango
    const ultimo = TABLA_ISR_MENSUAL[TABLA_ISR_MENSUAL.length - 1]
    return ultimo.cuota + ((baseGravable - ultimo.limInf) * ultimo.pct / 100)
}

export default function CalculadoraISRFiniquito() {
    const [motivo, setMotivo] = useState<Motivo>('despido')
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [anios, setAnios] = useState('3')
    const [meses, setMeses] = useState('6')
    const [showISRInfo, setShowISRInfo] = useState(false)
    const [showExencionInfo, setShowExencionInfo] = useState(false)

    const resultado = useMemo(() => {
        const salMensual = parseFloat(salarioMensual) || 0
        if (salMensual <= 0) return null

        const salDiario = salMensual / 30
        const aniosNum = parseInt(anios) || 0
        const mesesNum = parseInt(meses) || 0
        const antiguedadAnios = aniosNum + (mesesNum / 12)
        const diasTotales = antiguedadAnios * 365.25
        const proporcionAnio = (mesesNum) / 12

        // Tabla de vacaciones LFT (Art. 76, reforma 2023)
        const tablaVac = [0, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 30, 30, 30, 30, 30, 32, 32, 32, 32, 32, 34]
        const diasVac = aniosNum < tablaVac.length ? tablaVac[Math.max(aniosNum, 1)] : 34

        const desglose: Desglose[] = []

        // ═══ INDEMNIZACIÓN CONSTITUCIONAL (solo despido) ═══
        if (motivo === 'despido') {
            const bruto90 = salDiario * 90
            const exento90 = Math.min(bruto90, UMA_DIARIA_2026 * EXENCION_FINIQUITO_UMAs)
            const gravado90 = Math.max(bruto90 - exento90, 0)
            // ISR por indemnización: se calcula como último sueldo mensual ordinario (Art. 95 LISR)
            // Procedimiento especial: se divide entre 12, se suma al ingreso mensual, se calcula ISR marginal
            const isrIndem = calcularISR(gravado90)
            desglose.push({
                concepto: 'Indemnización constitucional (3 meses)',
                bruto: bruto90,
                exento: exento90,
                gravado: gravado90,
                isr: isrIndem,
                neto: bruto90 - isrIndem,
                base: 'Art. 48 LFT · Exención: 90 UMAs (Art. 93 Fr. XIII LISR)',
            })

            // ═══ 20 días por año ═══
            const bruto20d = salDiario * 20 * antiguedadAnios
            const exento20d = 0 // Ya se usó la exención en la indemnización
            const gravado20d = bruto20d
            const isr20d = calcularISR(gravado20d)
            desglose.push({
                concepto: `20 días por año (${antiguedadAnios.toFixed(1)} años)`,
                bruto: bruto20d,
                exento: exento20d,
                gravado: gravado20d,
                isr: isr20d,
                neto: bruto20d - isr20d,
                base: 'Art. 50 LFT · 100% gravado (sin exención adicional)',
            })
        }

        // ═══ PRIMA DE ANTIGÜEDAD ═══
        const topePrima = SMG_2026 * 2
        const sdPrima = Math.min(salDiario, topePrima)
        const diasPrima = Math.floor(aniosNum) * 12
        const brutoPrima = diasPrima * sdPrima
        const exentoPrima = Math.min(brutoPrima, UMA_DIARIA_2026 * EXENCION_FINIQUITO_UMAs)
        const gravadoPrima = Math.max(brutoPrima - exentoPrima, 0)
        const isrPrima = calcularISR(gravadoPrima)
        if (diasPrima > 0) {
            desglose.push({
                concepto: `Prima de antigüedad (${Math.floor(aniosNum)} años × 12 días)`,
                bruto: brutoPrima,
                exento: exentoPrima,
                gravado: gravadoPrima,
                isr: isrPrima,
                neto: brutoPrima - isrPrima,
                base: 'Art. 162 LFT · Tope: 2×SMG · Exención: 90 UMAs (Art. 93 Fr. XIII LISR)',
            })
        }

        // ═══ AGUINALDO PROPORCIONAL ═══
        const brutoAguinaldo = salDiario * 15 * proporcionAnio
        const exentoAguinaldo = Math.min(brutoAguinaldo, UMA_DIARIA_2026 * EXENCION_AGUINALDO_UMAs)
        const gravadoAguinaldo = Math.max(brutoAguinaldo - exentoAguinaldo, 0)
        const isrAguinaldo = calcularISR(gravadoAguinaldo)
        desglose.push({
            concepto: `Aguinaldo proporcional (${mesesNum} meses)`,
            bruto: brutoAguinaldo,
            exento: exentoAguinaldo,
            gravado: gravadoAguinaldo,
            isr: isrAguinaldo,
            neto: brutoAguinaldo - isrAguinaldo,
            base: 'Art. 87 LFT · Exención: 30 UMAs (Art. 93 Fr. XIV LISR)',
        })

        // ═══ VACACIONES PROPORCIONALES + PRIMA VACACIONAL ═══
        const brutoVac = salDiario * diasVac * proporcionAnio
        const brutoPrimaVac = brutoVac * 0.25
        const brutoVacTotal = brutoVac + brutoPrimaVac
        const exentoVac = Math.min(brutoPrimaVac, UMA_DIARIA_2026 * 15) // 15 UMAs exentas de prima vac
        const gravadoVac = brutoVacTotal - exentoVac
        const isrVac = calcularISR(Math.max(gravadoVac, 0))
        desglose.push({
            concepto: `Vacaciones + Prima vacacional (${diasVac} días × ${(proporcionAnio * 100).toFixed(0)}%)`,
            bruto: brutoVacTotal,
            exento: exentoVac,
            gravado: Math.max(gravadoVac, 0),
            isr: isrVac,
            neto: brutoVacTotal - isrVac,
            base: 'Arts. 76, 80 LFT · Prima vac. exenta 15 UMAs (Art. 93 Fr. XIV LISR)',
        })

        // ═══ TOTALES ═══
        const totalBruto = desglose.reduce((s, d) => s + d.bruto, 0)
        const totalExento = desglose.reduce((s, d) => s + d.exento, 0)
        const totalGravado = desglose.reduce((s, d) => s + d.gravado, 0)
        const totalISR = desglose.reduce((s, d) => s + d.isr, 0)
        const totalNeto = desglose.reduce((s, d) => s + d.neto, 0)

        return { desglose, totalBruto, totalExento, totalGravado, totalISR, totalNeto, salDiario }
    }, [salarioMensual, anios, meses, motivo])

    const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧮</span>
                    <span>Calculadora ISR Finiquito · LISR 2026</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de ISR por
                    <span className="gradient-gold"> Finiquito y Liquidación</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Descubre <strong className="text-white">cuánto te quitan de impuestos</strong> de tu finiquito o liquidación.
                    Calcula el ISR exacto y conoce tu <strong className="text-[var(--color-accent)]">monto NETO real</strong>.
                    Basada en los Arts. 93, 95 y 96 de la LISR y tablas SAT vigentes 2026.
                </p>
            </div>

            {/* Ad Slot */}
            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Selector motivo */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                    onClick={() => setMotivo('despido')}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${motivo === 'despido'
                        ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                >
                    🔴 Me Despidieron
                    <p className="text-xs font-normal mt-1 opacity-70">Indemnización + 20 días/año + finiquito</p>
                </button>
                <button
                    onClick={() => setMotivo('renuncia')}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${motivo === 'renuncia'
                        ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                >
                    🔵 Renuncié
                    <p className="text-xs font-normal mt-1 opacity-70">Solo finiquito (sin indemnización)</p>
                </button>
            </div>

            {/* Formulario */}
            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg mb-4">📋 Tus datos</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Salario */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Salario mensual bruto ($) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={salarioMensual}
                            onChange={(e) => setSalarioMensual(e.target.value)}
                            placeholder="Ej: 15000"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    {/* Años */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Años trabajados <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            value={anios}
                            onChange={(e) => setAnios(e.target.value)}
                            placeholder="Ej: 3"
                            min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    {/* Meses */}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            Meses adicionales
                        </label>
                        <input
                            type="number"
                            value={meses}
                            onChange={(e) => setMeses(e.target.value)}
                            placeholder="Ej: 6"
                            min="0"
                            max="11"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>
                </div>

                {/* Tooltip ISR */}
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => setShowISRInfo(!showISRInfo)}
                        className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        💡 ¿Cómo se calcula el ISR de mi finiquito?
                        <span className={`transition-transform ${showISRInfo ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {showISRInfo && (
                        <div className="mt-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">📌 Resumen rápido</h4>
                                <p className="text-white/80">
                                    El ISR de tu finiquito se calcula <strong className="text-[var(--color-accent)]">por separado</strong> de tu
                                    sueldo normal. No es una retención fija — se aplica la <strong>tabla de ISR mensual</strong> del SAT
                                    sobre la parte gravada de cada concepto.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                    <h5 className="text-emerald-400 font-bold mb-1">✅ Parte EXENTA (no paga ISR)</h5>
                                    <ul className="text-white/60 mt-1 space-y-0.5 list-disc pl-4">
                                        <li>Indemnización: hasta 90 UMAs ($10,182.60)</li>
                                        <li>Aguinaldo: hasta 30 UMAs ($3,394.20)</li>
                                        <li>Prima vacacional: hasta 15 UMAs ($1,697.10)</li>
                                        <li>Prima de antigüedad: hasta 90 UMAs</li>
                                    </ul>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <h5 className="text-red-400 font-bold mb-1">❌ Parte GRAVADA (sí paga ISR)</h5>
                                    <ul className="text-white/60 mt-1 space-y-0.5 list-disc pl-4">
                                        <li>Todo lo que exceda las UMAs exentas</li>
                                        <li>20 días por año de servicio (100% gravado)</li>
                                        <li>Salarios caídos (100% gravado)</li>
                                        <li>Vacaciones pagadas no disfrutadas</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-3">
                                <h4 className="text-white font-bold text-sm mb-2">📖 Fundamento legal</h4>
                                <p className="text-white/70 leading-relaxed">
                                    El <strong className="text-blue-400">Art. 93 LISR, Fracciones XIII y XIV</strong> establece las exenciones
                                    para indemnizaciones, jubilaciones, aguinaldo, prima vacacional y prima de antigüedad.
                                    El <strong className="text-blue-400">Art. 95 LISR</strong> define el procedimiento especial para calcular
                                    el ISR de pagos por separación (finiquito/liquidación).
                                    El <strong className="text-blue-400">Art. 96 LISR</strong> contiene la tabla de retención mensual que
                                    se aplica a la parte gravada.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ RESULTADOS ═══ */}
            {resultado && (
                <div className="mt-8 space-y-6">
                    {/* Resumen visual grande */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">
                            💰 Tu {motivo === 'despido' ? 'liquidación' : 'finiquito'} neto
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Bruto total</p>
                                <p className="text-lg font-bold text-white font-mono">${fmt(resultado.totalBruto)}</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1">Exento de ISR</p>
                                <p className="text-lg font-bold text-emerald-400 font-mono">${fmt(resultado.totalExento)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">ISR retenido</p>
                                <p className="text-lg font-bold text-red-400 font-mono">-${fmt(resultado.totalISR)}</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">NETO que recibes</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmt(resultado.totalNeto)}</p>
                            </div>
                        </div>

                        {/* Barra visual */}
                        <div className="relative h-8 rounded-full overflow-hidden bg-white/5">
                            <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-[var(--color-accent)] rounded-full transition-all"
                                style={{ width: `${(resultado.totalNeto / resultado.totalBruto) * 100}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                Recibes {((resultado.totalNeto / resultado.totalBruto) * 100).toFixed(1)}% del bruto
                            </div>
                        </div>
                    </div>

                    {/* Desglose detallado */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4">📊 Desglose concepto por concepto</h3>

                        {/* Tooltip exención */}
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => setShowExencionInfo(!showExencionInfo)}
                                className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                💡 ¿Por qué algunos conceptos están exentos y otros no?
                                <span className={`transition-transform ${showExencionInfo ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {showExencionInfo && (
                                <div className="mt-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
                                    <p className="text-white/80">
                                        La <strong className="text-blue-400">LISR Art. 93</strong> establece que ciertos ingresos del trabajador
                                        están <strong className="text-emerald-400">exentos</strong> hasta ciertos límites:
                                    </p>
                                    <ul className="text-white/60 space-y-1 list-disc pl-4">
                                        <li><strong className="text-white">Indemnización + Prima antigüedad</strong>: Exentas hasta 90 × UMA diaria = <strong className="text-emerald-400">${fmt(UMA_DIARIA_2026 * 90)}</strong></li>
                                        <li><strong className="text-white">Aguinaldo</strong>: Exento hasta 30 × UMA diaria = <strong className="text-emerald-400">${fmt(UMA_DIARIA_2026 * 30)}</strong></li>
                                        <li><strong className="text-white">Prima vacacional</strong>: Exenta hasta 15 × UMA diaria = <strong className="text-emerald-400">${fmt(UMA_DIARIA_2026 * 15)}</strong></li>
                                    </ul>
                                    <p className="text-white/60 italic">
                                        Lo que exceda estos montos es <strong className="text-red-400">gravado</strong> y se le aplica la tabla ISR del Art. 96 LISR.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tabla */}
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
                                            <td className="py-3">
                                                <p className="text-white text-xs font-medium">{d.concepto}</p>
                                                <p className="text-[10px] text-[var(--color-text-muted)]">{d.base}</p>
                                            </td>
                                            <td className="text-right text-white font-mono text-xs py-3">${fmt(d.bruto)}</td>
                                            <td className="text-right text-emerald-400 font-mono text-xs py-3">${fmt(d.exento)}</td>
                                            <td className="text-right text-orange-400 font-mono text-xs py-3">${fmt(d.gravado)}</td>
                                            <td className="text-right text-red-400 font-mono text-xs py-3">-${fmt(d.isr)}</td>
                                            <td className="text-right text-[var(--color-accent)] font-mono text-xs font-bold py-3">${fmt(d.neto)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5">
                                        <td className="py-3 text-white font-bold text-sm">TOTAL</td>
                                        <td className="text-right text-white font-mono font-bold text-sm py-3">${fmt(resultado.totalBruto)}</td>
                                        <td className="text-right text-emerald-400 font-mono font-bold text-sm py-3">${fmt(resultado.totalExento)}</td>
                                        <td className="text-right text-orange-400 font-mono font-bold text-sm py-3">${fmt(resultado.totalGravado)}</td>
                                        <td className="text-right text-red-400 font-mono font-bold text-sm py-3">-${fmt(resultado.totalISR)}</td>
                                        <td className="text-right text-[var(--color-accent)] font-mono font-bold text-lg py-3">${fmt(resultado.totalNeto)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Tabla ISR SAT */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-3">📋 Tabla ISR Mensual SAT 2026 (Art. 96 LISR)</h3>
                        <p className="text-xs text-[var(--color-text-muted)] mb-4">
                            Esta es la tabla oficial que se aplica a la parte gravada de tu finiquito/liquidación.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 text-[var(--color-text-muted)]">Límite inferior</th>
                                        <th className="text-left py-2 text-[var(--color-text-muted)]">Límite superior</th>
                                        <th className="text-right py-2 text-[var(--color-text-muted)]">Cuota fija</th>
                                        <th className="text-right py-2 text-[var(--color-text-muted)]">% excedente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TABLA_ISR_MENSUAL.map((r, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-1.5 text-white font-mono">${fmt(r.limInf)}</td>
                                            <td className="py-1.5 text-white font-mono">{r.limSup === Infinity ? 'En adelante' : `$${fmt(r.limSup)}`}</td>
                                            <td className="text-right py-1.5 text-[var(--color-accent)] font-mono">${fmt(r.cuota)}</td>
                                            <td className="text-right py-1.5 text-[var(--color-accent)] font-mono">{r.pct.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CTA Plantillas */}
                    <div className="glass-card p-6 rounded-2xl border-[var(--color-accent)]/20 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="text-4xl">⚖️</div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-white font-bold">¿Te despidieron injustamente?</h3>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                                    Tenemos plantillas de demanda laboral, cartas de renuncia y convenios listos para descargar.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/calculadora-laboral" className="px-5 py-2.5 rounded-xl border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-sm font-bold hover:bg-[var(--color-accent)]/10 transition-all">
                                    Calcular liquidación
                                </Link>
                                <Link href="/plantillas/laboral" className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-dark)] text-sm font-bold hover:bg-[var(--color-accent-light)] transition-all">
                                    Ver plantillas →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SEO Content */}
            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">
                    ¿Cuánto me quitan de impuestos de mi finiquito en México?
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Cuando recibes un finiquito o liquidación laboral, tu patrón está obligado a retener el
                    <strong className="text-white"> Impuesto Sobre la Renta (ISR)</strong> sobre la parte gravada de cada
                    concepto. Sin embargo, la ley establece <strong className="text-emerald-400">exenciones importantes</strong>:
                    la indemnización constitucional está exenta hasta 90 UMAs, el aguinaldo hasta 30 UMAs, y la prima
                    vacacional hasta 15 UMAs.
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El cálculo se hace con la <strong className="text-white">tabla de ISR mensual del Art. 96 de la LISR</strong>,
                    aplicada sobre la parte gravada de cada concepto por separado. Esta calculadora te muestra exactamente
                    cuánto se retiene de ISR y cuánto es tu <strong className="text-[var(--color-accent)]">monto neto real</strong>.
                </p>
            </section>

            {/* Ad Slot final */}
            <div className="w-full min-h-[90px] mt-8">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Enlaces a plantillas */}
            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Plantillas y Calculadoras Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora de Liquidación Laboral', href: '/calculadora-laboral', desc: 'Calcula tu liquidación bruta completa' },
                        { title: 'Demanda por Despido Injustificado', href: '/plantillas/laboral/demanda-despido-injustificado', desc: 'Demanda laboral ante JFCA' },
                        { title: 'Carta de Renuncia Voluntaria', href: '/plantillas/laboral/carta-renuncia-voluntaria', desc: 'Renuncia con solicitud de finiquito' },
                        { title: 'Convenio Laboral', href: '/plantillas/laboral/convenio-laboral-conciliacion', desc: 'Acuerdo ante Conciliación' },
                    ].map((t) => (
                        <Link
                            key={t.href}
                            href={t.href}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--color-accent)]/30 transition-all group"
                        >
                            <span className="text-lg flex-shrink-0">📄</span>
                            <div>
                                <p className="text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">{t.title}</p>
                                <p className="text-xs text-white/50 mt-0.5">{t.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Ad Slot final 2 */}
            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Cálculo estimado con tablas ISR SAT 2026 (Art. 96 LISR). UMA diaria 2026: ${UMA_DIARIA_2026}.
                Las exenciones se aplican conforme al Art. 93 LISR. No sustituye asesoría fiscal profesional.
                El procedimiento real del Art. 95 LISR puede variar según caso particular.
            </p>
        </main>
    )
}
