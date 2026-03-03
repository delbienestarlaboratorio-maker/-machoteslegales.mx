'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, ANIO_ACTUAL, getUMA } from '@/data/legal-constants'

// Tarifa Mensual 2026 (Art. 96 LISR)
const TARIFA_MENSUAL_2026 = [
    { limiteInf: 0, limiteSup: 746.04, cuotaFija: 0, tasa: 0.0192 },
    { limiteInf: 746.05, limiteSup: 6332.05, cuotaFija: 14.32, tasa: 0.0640 },
    { limiteInf: 6332.06, limiteSup: 11128.01, cuotaFija: 371.83, tasa: 0.1088 },
    { limiteInf: 11128.02, limiteSup: 12935.82, cuotaFija: 893.63, tasa: 0.1600 },
    { limiteInf: 12935.83, limiteSup: 15487.71, cuotaFija: 1182.88, tasa: 0.1792 },
    { limiteInf: 15487.72, limiteSup: 31236.49, cuotaFija: 1640.18, tasa: 0.2136 },
    { limiteInf: 31236.50, limiteSup: 49233.00, cuotaFija: 5004.12, tasa: 0.2352 },
    { limiteInf: 49233.01, limiteSup: 93993.90, cuotaFija: 9236.89, tasa: 0.3000 },
    { limiteInf: 93993.91, limiteSup: 125325.20, cuotaFija: 22665.17, tasa: 0.3200 },
    { limiteInf: 125325.21, limiteSup: 375975.61, cuotaFija: 32691.18, tasa: 0.3400 },
    { limiteInf: 375975.62, limiteSup: Infinity, cuotaFija: 117912.32, tasa: 0.3500 },
]

// Función auxiliar de cálculo directo (Bruto -> Neto)
function calcularNetoDirecto(brutoMensual: number, cuotaObrero: number, subsidio: number) {
    const tramo = TARIFA_MENSUAL_2026.find(t => brutoMensual >= t.limiteInf && brutoMensual <= t.limiteSup)
    let isr = 0
    if (tramo) isr = tramo.cuotaFija + (brutoMensual - tramo.limiteInf) * tramo.tasa

    // Subsidio tope: Si ingresos <= 9081, subsidio = 390.12. (Decreto Mayo 2024: 11.82% UMA * 30.4)
    // Pasado ese límite es 0
    let subsidioAplicable = 0
    if (subsidio > 0 && brutoMensual <= 9081) {
        subsidioAplicable = subsidio
    }

    const isrRetenido = Math.max(isr - subsidioAplicable, 0)
    const subsidioEntregado = Math.max(subsidioAplicable - isr, 0)

    const neto = brutoMensual - isrRetenido + subsidioEntregado - cuotaObrero
    return { isrRetenido, neto, pago: -isrRetenido + subsidioEntregado - cuotaObrero }
}


export default function CalculadoraSueldoNetoBruto() {
    const [sueldoNetoDeseado, setSueldoNetoDeseado] = useState('20000')
    const [tieneIMSS, setTieneIMSS] = useState(true)

    const uma = getUMA(ANIO_ACTUAL)
    const topeSupSubsidio = 9081 // Límite mensual Decreto de Subsidio para el empleo.

    const resultado = useMemo(() => {
        const netoDeseado = parseFloat(sueldoNetoDeseado) || 0
        if (netoDeseado <= 0) return null

        // Constantes del año
        const subsidioBase = uma.diaria * 11.82 * 30.4 / 100 // 390.12 ~ Mayo 2024 DOF

        // Algoritmo de Búsqueda Binaria para encontrar el Bruto Exacto (hasta el centavo)
        // Ya que la relación impositiva no es una fórmula lineal sencilla, Binary Search converge en milisegundos.
        let low = netoDeseado // El bruto jamás será menor al neto sin prestaciones (salvo que aplique subsidio inmenso que no es el caso mexicano hoy)
        let high = netoDeseado * 2 // Difícilmente será el doble si hablamos de clases medias-altas (<35% isr)

        const epsilon = 0.01 // Precisión de 1 centavo MXN
        let iterations = 0
        let mid = (low + high) / 2

        let foundNeto = 0
        let cuotaIMSSObrero = 0
        let currentISR = 0

        while (low <= high && iterations < 100) {
            mid = (low + high) / 2

            // Asumimos prestaciones de ley mínimas para el SBC (Factor 1.0493)
            let sbc = 0
            if (tieneIMSS) {
                sbc = (mid / 30.4) * 1.0493
                const sbcMensual = sbc * 30.4
                // Estimación cuota obrera IMSS ~2.375% - 2.775% del SBC dependiendo de excedentes.
                // Cuota obrera base (EnyM, IyV, Cesantía) => (0.375% + 0.625% + 1.125%) = 2.125% + Excedente de 3 UMAs.
                let base3UMA = 3 * uma.diaria
                let excedentePatrono = Math.max(0, sbc - base3UMA)
                let cuotaMensual = (sbc * 0.02125 /* base */ + excedentePatrono * 0.004 /* exc obrero */) * 30.4
                cuotaIMSSObrero = cuotaMensual
            } else {
                cuotaIMSSObrero = 0
            }

            const resDirecto = calcularNetoDirecto(mid, cuotaIMSSObrero, subsidioBase)
            foundNeto = resDirecto.neto
            currentISR = resDirecto.isrRetenido

            if (Math.abs(foundNeto - netoDeseado) < epsilon) {
                break // Encontramos el bruto exacto
            } else if (foundNeto > netoDeseado) {
                high = mid - epsilon
            } else {
                low = mid + epsilon
            }
            iterations++
        }

        const sueldoBruto = mid

        return { netoDeseado, sueldoBruto, isr: currentISR, imss: cuotaIMSSObrero, iteraciones: iterations }

    }, [sueldoNetoDeseado, tieneIMSS, uma])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🔄</span><span>Ingeniería Inversa Laboral</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Sueldo Neto a Bruto</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Te preguntan cuánto quieres ganar <strong className="text-white">bruto</strong> en una entrevista, pero tú sólo sabes cuánto dinero quieres <strong className="text-[var(--color-accent)]">libre en tu cuenta</strong>? Ingresa tu neto ideal y nosotros calculamos el contrato oficial.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-xl mx-auto">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Sueldo Neto Mensual Deseado ($ libres de polvo/paja)</label>
                    <input type="number" value={sueldoNetoDeseado} onChange={e => setSueldoNetoDeseado(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-2xl font-mono font-bold focus:border-[var(--color-accent)] focus:outline-none" />
                </div>

                <label className="flex gap-3 p-4 rounded-xl bg-[var(--color-accent)]/10 cursor-pointer border border-[var(--color-accent)]/30 items-center mt-2">
                    <input type="checkbox" checked={tieneIMSS} onChange={e => setTieneIMSS(e.target.checked)} className="w-5 h-5 text-[var(--color-accent)]" />
                    <div>
                        <span className="text-sm font-bold text-white">Estaré registrado ante el IMSS</span>
                        <p className="text-[10px] text-white/50">Incluye cálculo de la cuota obrera a retener (Aprox 2.5%). Si eres honorario asimilado/sin prestaciones, desmárcalo.</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8">
                    <div className="flex justify-center mb-6 max-w-xl mx-auto">
                        <div className="p-6 rounded-2xl bg-white/5 border border-[var(--color-accent)]/50 text-center w-full shadow-[0_0_30px_rgba(235,188,110,0.1)]">
                            <p className="text-xs text-white/50 font-bold mb-2">¡Pide este Sueldo Mensual Bruto en tu Contrato!</p>
                            <p className="text-[var(--color-accent)] text-5xl md:text-6xl font-mono font-bold">${fmtMXN(resultado.sueldoBruto)}</p>
                            <p className="text-xs text-white/40 mt-3 md:font-bold">Total antes de Impuestos y Deducciones</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl max-w-xl mx-auto">
                        <h2 className="text-white font-bold text-lg mb-4 text-center">🧾 Comprobación (Recibo de Nómina Hipotético)</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                                <span className="text-sm text-[var(--color-accent)] font-bold">1. Sueldo Diario Bruto Registrado (Base)</span>
                                <span className="font-mono text-[var(--color-accent)] font-bold">${fmtMXN(resultado.sueldoBruto)}</span>
                            </div>

                            <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <span className="text-xs text-orange-400 font-bold">2. (-) ISR Mensual Retenido (Art 96)</span>
                                <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.isr)}</span>
                            </div>

                            {tieneIMSS && (
                                <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                    <span className="text-xs text-orange-400 font-bold">3. (-) Cuotas Obreras IMSS Base</span>
                                    <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.imss)}</span>
                                </div>
                            )}

                            <div className="flex justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mt-4">
                                <div>
                                    <span className="block text-sm text-emerald-400 font-bold">4. Sueldo Neto Deseado a Depositar</span>
                                </div>
                                <span className="font-mono text-emerald-400 font-bold text-2xl self-center">${fmtMXN(resultado.netoDeseado)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-[10px] text-white/30 text-center mt-6 max-w-xl mx-auto">
                Cálculo de ingeniería inversa (Binary Search Algorithm, ~{resultado?.iteraciones} mills). Asume el factor de integración IMSS básico (1.0493) aplicable a prestaciones mínimas de Ley (Aguinaldo 15 días, Vacaciones 12 días, Prima Vacacional 25%).
            </p>
        </main>
    )
}
