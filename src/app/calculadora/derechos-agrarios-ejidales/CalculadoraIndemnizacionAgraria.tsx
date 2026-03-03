'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraIndemnizacionAgraria() {
    const [hectareas, setHectareas] = useState('15')
    const [tipoSuelo, setTipoSuelo] = useState<'temporal' | 'riego' | 'agostadero' | 'urbano'>('temporal')
    const [precioEstComercialHectarea, setPrecioEstComercialHectarea] = useState('150000') // $150k por hecárea como base referencial

    // Impactos directos en Derechos Agrarios 
    const [tieneBienesDistintos, setTieneBienesDistintos] = useState(false) // Construcciones, huertas frutales (Bienes Distintos a la Tierra - BDT)

    const resultado = useMemo(() => {
        const h = parseFloat(hectareas) || 0
        const precioBaseHectarea = parseFloat(precioEstComercialHectarea) || 0

        // Multiplicadores según la calidad natural de la tierra ejidal (Factores INDAABIN referenciales de castigo/premio)
        let multiplicadorCalidad = 1
        let clasificacionAgraria = ''

        if (tipoSuelo === 'temporal') {
            multiplicadorCalidad = 1 // Agricultura de lluvia
            clasificacionAgraria = 'Suelo de Temporal'
        } else if (tipoSuelo === 'riego') {
            multiplicadorCalidad = 1.8 // Agricultura irrigada (alta plusvalía, laudo favorable INDAABIN)
            clasificacionAgraria = 'Suelo de Riego (Alta Calidad)'
        } else if (tipoSuelo === 'agostadero') {
            multiplicadorCalidad = 0.5 // Tierra rústica para pastoreo
            clasificacionAgraria = 'Suelo de Agostadero/Monte'
        } else {
            multiplicadorCalidad = 2.5 // Tierra que ya fue invadida por la ciudad o tiene potencial fraccionador
            clasificacionAgraria = 'Transición Urbano-Ejidal'
        }

        const precioPorHeactareaAjustado = precioBaseHectarea * multiplicadorCalidad
        const indemnizacionTerrenoPuro = h * precioPorHeactareaAjustado

        // Bienes Distintos a la Tierra (BDT): Indemnización separada que marca la Ley Agraria para proteger lo que el ejidatario invirtió arriba del piso
        const indemnizacionBDT = tieneBienesDistintos ? (indemnizacionTerrenoPuro * 0.20) : 0 // Estimado del 20% del valor para cubrir cercos, corrales, pozos, cosechas pendientes.

        const avaluoComercialReferencia = indemnizacionTerrenoPuro + indemnizacionBDT

        // Regla: En derecho agrario, la SCJN prohibe pagar a "Valor Catastral", siempre se debe pagar a "Valor Comercial" el día del despojo o decreto (Art. 94 Ley Agraria). Mismo principio para venta de cesiones entre ejidatarios.

        return {
            h,
            precioBaseHectarea,
            precioPorHeactareaAjustado,
            clasificacionAgraria,
            indemnizacionTerrenoPuro,
            indemnizacionBDT,
            avaluoComercialReferencia
        }

    }, [hectareas, tipoSuelo, precioEstComercialHectarea, tieneBienesDistintos])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🌽</span><span>Tribunales Agrarios y RAM (Ley Agraria)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Avalúos en <span className="gradient-gold">Expropiación de Derechos Agrarios</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando el Gobierno, un tren o una constructora ocupan tu Parcela o Ejido, la Ley Agraria (Art. 94) exige una Indemnización Justa calculada por el INDAABIN, nunca a valor catastral.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">
                            Número de Hectáreas Afectadas
                        </label>
                        <input type="number" step="0.5" value={hectareas} onChange={e => setHectareas(e.target.value)}
                            className="w-full p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-100 font-mono text-3xl focus:border-green-500 outline-none" />
                        <p className="text-[10px] text-white/50 mt-1">Superficie geométrica exacta del polígono parcelario a enajenar o ceder a la asamblea.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Clasificación Topológica (Afecta Plusvalía INDAABIN)
                            </label>
                            <select value={tipoSuelo} onChange={e => setTipoSuelo(e.target.value as any)}
                                className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none">
                                <option value="temporal">Temporal (Cultivo según lluvias de temporada)</option>
                                <option value="riego">De Riego (Infraestructura hídrica Premium)</option>
                                <option value="agostadero">Agostadero / Monte (Ganadería, baja calidad de siembra)</option>
                                <option value="urbano">Rústico Urbanizable (Pegado a la ciudad / lotificable)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Valor Comercial Sondeo (Por 1 Hectárea)
                            </label>
                            <input type="number" value={precioEstComercialHectarea} onChange={e => setPrecioEstComercialHectarea(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5 transition-colors cursor-pointer" onClick={() => setTieneBienesDistintos(!tieneBienesDistintos)}>
                        <input type="checkbox" checked={tieneBienesDistintos} readOnly className="mt-1 w-5 h-5 accent-orange-500 pointer-events-none" />
                        <div className="flex-1">
                            <label className="text-sm font-bold text-orange-300 block mb-1">Inclusión de "Bienes Distintos a la Tierra" (BDT)</label>
                            <p className="text-[10px] text-orange-200/60 leading-tight">Obliga a pagar el trabajo humano invertido. Incluye corrales, bodegas, pozos profundos de agua, cercos, árboles frutales y Cosechas (lucro cesante de la siembra arruinada).</p>
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="glass-card p-8 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <p className="text-sm font-bold text-green-500/70 mb-1 uppercase tracking-widest">
                            {resultado.clasificacionAgraria}
                        </p>
                        <p className="text-4xl md:text-5xl font-mono font-bold text-green-400 my-4">
                            ${fmtMXN(resultado.avaluoComercialReferencia)}
                        </p>
                        <div className="mt-2 text-[10px] text-white/50 border-t border-white/10 pt-3">
                            Suma Expropiable: Valor de Suelo (${fmtMXN(resultado.indemnizacionTerrenoPuro)}) {tieneBienesDistintos ? `+ Avalúo Especial de B.D.T. Cosechas y Construcciones ($${fmtMXN(resultado.indemnizacionBDT)})` : ''}
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="text-xs font-bold text-[var(--color-accent)] block mb-3 uppercase tracking-wide">Interpretación Jurisprudencial</span>
                        <ul className="space-y-3 text-[11px] text-white/80 leading-relaxed font-mono">
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--color-accent)] shrink-0">■</span>
                                <span><b>Protección Constitucional:</b> El ejidatario no debe ser pagado tasando la tierra a centavos el metro cuadrado (valor catastral). La Corte ampara que se indemnice a **Valor Comercial** actualizado y proyectado.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[var(--color-accent)] shrink-0">■</span>
                                <span><b>Cesión de Derechos:</b> Este mismo principio de avaluó libre y de lucro cesante rige como parámetro sugerido en el contrato de "Enajenación de Derechos Parcelarios" frente a la Asamblea del Comisariado Ejidal y el Fedatario.</span>
                            </li>
                        </ul>
                    </div>

                </div>
            )}
        </main>
    )
}
