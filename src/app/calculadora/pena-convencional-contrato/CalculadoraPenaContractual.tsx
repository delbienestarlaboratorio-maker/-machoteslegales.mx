'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraPenaContractual() {
    const [suertePrincipal, setSuertePrincipal] = useState('100000') // Deuda base
    const [interesMensualContractual, setInteresMensualContractual] = useState('5') // Porcentaje mensual empírico firmado en el documento
    const [mesesAtraso, setMesesAtraso] = useState('18')

    const resultado = useMemo(() => {
        const capital = parseFloat(suertePrincipal) || 0
        const tasaMensual = parseFloat(interesMensualContractual) || 0
        const meses = parseInt(mesesAtraso) || 0

        let interesAcumuladoTeorico = capital * (tasaMensual / 100) * meses

        let observacionesLegislativas = []
        let cobroMaximoSugerido = interesAcumuladoTeorico
        let colorAlerta = 'text-green-400'
        let tieneAnomalias = false

        // REGLAS JURISPRUDENCIALES Y LEGALES MÉXICO (CÓDIGO CIVIL / CONVENCIÓN AMERICANA / SCJN)

        // 1. Límite de la Pena Convencional (Art. 1843 Código Civil Federal): La pena no puede exceder ni en valor ni en cuantía a la obligación principal.
        const limiteCodigoCivil = capital
        if (interesAcumuladoTeorico > limiteCodigoCivil) {
            observacionesLegislativas.push(`Violación al Art. 1843 CCF: El castigo generado ($${fmtMXN(interesAcumuladoTeorico)}) ya rebasó el tope de la misma deuda original ($${fmtMXN(capital)}). Un juez limitará la condena de recargos hasta la cantidad original máxima prestada.`)
            cobroMaximoSugerido = capital // Se topa a 1 a 1.
            colorAlerta = 'text-orange-500'
            tieneAnomalias = true
        }

        // 2. Control de Usura y Explotación (Art. 21.3 Convención Americana sobre Derechos Humanos - Pacto de San José)
        // La SCJN ha establecido que tasas excesivas en pagarés y contratos son reprochables de oficio.
        // Se toma usualmente como parámetro que más de un TIIE+algo, o más de un 36-40% Anual (Aprox 3% mensual) ya huele a usura.
        const tasaAnualFirmada = tasaMensual * 12

        if (tasaAnualFirmada > 45) {
            observacionesLegislativas.push(`Usura Detectada (Tasa del ${tasaAnualFirmada.toFixed(1)}% Anual): Es lesivo. Los tribunales colegiados y la SCJN exigen a los jueces reducir prudencialmente estas tasas agiotistas de oficio, generalmente bajándolas al 37% o al CAT bancario promedio (2-3% mensual max).`)
            colorAlerta = 'text-red-500'
            tieneAnomalias = true

            // Recalcular cobro sugerido aplicando el Test de Usura (Topando al 36% anual = 3% mensual)
            const recargoPrudencial = capital * (3 / 100) * meses
            cobroMaximoSugerido = Math.min(recargoPrudencial, limiteCodigoCivil) // Se aplican ambos topes
        } else if (tasaAnualFirmada > 30) {
            observacionesLegislativas.push(`Riesgo de Lesión Financiera: Tu tasa anual del ${tasaAnualFirmada.toFixed(1)}% roza en los límites de lo que los tribunales amparan. Según los criterios del Banco de México para créditos no bancarios, podría sufrir una quita a discreción del juez.`)
            if (!tieneAnomalias) colorAlerta = 'text-yellow-400'
        } else {
            observacionesLegislativas.push(`Tasa Legal Operativa sana (${tasaAnualFirmada.toFixed(1)}% Anual): Dentro de los estándares mercantiles permisibles para el libre acuerdo de voluntades.`)
        }

        const totalAdeudadoTeorico = capital + interesAcumuladoTeorico
        const totalAdeudadoLitigio = capital + cobroMaximoSugerido

        return {
            capital,
            tasaMensual,
            tasaAnualFirmada,
            meses,
            interesAcumuladoTeorico,
            totalAdeudadoTeorico,
            cobroMaximoSugerido,
            totalAdeudadoLitigio,
            observacionesLegislativas,
            colorAlerta,
            tieneAnomalias
        }

    }, [suertePrincipal, interesMensualContractual, mesesAtraso])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📑</span><span>Derecho Civil y Mercantil · Jurisprudencia SCJN</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Filtro Legal de <span className="gradient-gold">Penas Convencionales y Usura</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Los prestamistas suelen estipular intereses del 10% mensual u obligan a pagar el triple como castigo. Calcula hasta dónde permite la Ley cobrar antes de que un Juez anule las cláusulas abusivas.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold">Suerte Principal (Deuda Real Muta / Capital Sin Intereses)</label>
                        <input type="number" value={suertePrincipal} onChange={e => setSuertePrincipal(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                    </div>

                    <div>
                        <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold">Tasa Moratoria / Castigo Firmada (Mensual %)</label>
                        <input type="number" value={interesMensualContractual} onChange={e => setInteresMensualContractual(e.target.value)} step="0.5"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                    </div>

                    <div>
                        <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses Acumulados de Atraso o Impago</label>
                        <input type="number" value={mesesAtraso} onChange={e => setMesesAtraso(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass-card p-6 rounded-2xl text-center border border-white/10 opacity-60">
                            <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Lo que dicta el Documento Literalmente</p>
                            <p className="text-3xl font-mono text-white/50 mt-2 line-through">${fmtMXN(resultado.totalAdeudadoTeorico)}</p>
                            <div className="mt-2 text-[9px] text-white/40">Capital ${fmtMXN(resultado.capital)} + Intereses Brutos Acumulados ${fmtMXN(resultado.interesAcumuladoTeorico)}. (Tasa {resultado.tasaAnualFirmada.toFixed(0)}% Anual)</div>
                        </div>

                        <div className={`glass-card p-6 rounded-2xl text-center border-2 border-indigo-500/30 bg-indigo-900/10 shadow-lg`}>
                            <p className="text-[10px] font-bold text-indigo-400 mb-1 uppercase tracking-widest flex justify-center items-center gap-2">
                                Lo que sentenciaría un Juez (Test de Usura) ⚖️
                            </p>
                            <p className={`text-4xl md:text-5xl font-mono font-bold my-2 ${resultado.colorAlerta}`}>
                                ${fmtMXN(resultado.totalAdeudadoLitigio)}
                            </p>
                            <div className="mt-2 text-[9px] text-indigo-200/50">
                                Capital Base (${fmtMXN(resultado.capital)}) + Recargos Topados de Ajuste Legal (${fmtMXN(resultado.cobroMaximoSugerido)})
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-xs font-bold text-[var(--color-accent)] block mb-3 uppercase">Alertas de Ilegalidad Convencional Pactada</span>
                        <ul className="space-y-3 text-[11px] text-white/80 leading-relaxed font-mono">
                            {resultado.observacionesLegislativas.map((obs, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold shrink-0">►</span>
                                    <span>{obs}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </main>
    )
}
