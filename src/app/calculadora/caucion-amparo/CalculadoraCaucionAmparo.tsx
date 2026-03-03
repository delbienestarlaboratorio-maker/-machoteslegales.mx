'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraCaucionAmparo() {
    const [tipoActo, setTipoActo] = useState<'cobro_dinero' | 'clausura_negocio' | 'posesion_inmueble' | 'arresto_multa' | 'vida_libertad_absoluta'>('cobro_dinero')

    // Parámetros dinámicos según el tipo de acto
    const [montoCobro, setMontoCobro] = useState('500000') // Para embargo/pago
    const [tasaInteresEstimado, setTasaInteresEstimado] = useState('9') // Demanda normal
    const [tiempoEstimadoAmparo, setTiempoEstimadoAmparo] = useState('6') // Meses promedio

    // Para Inmuebles
    const [rentaInmueble, setRentaInmueble] = useState('15000')

    // Para Negocios Clausurados
    const [ingresoMinimoSemanal, setIngresoMinimoSemanal] = useState('10000')

    const resultado = useMemo(() => {
        let caucionRequerida = 0
        let discrecional = false
        let desglose = []
        let fundamento = 'Art. 132 Ley de Amparo'
        let textoAclaratorio = ''

        const mesesAmparo = parseInt(tiempoEstimadoAmparo) || 6

        if (tipoActo === 'cobro_dinero') {
            // Actos que importan el cobro de una cantidad (Ej. Ejecución de embargo mercantil o laudo laboral)
            // Regla: Se garantiza el rendimiento (interés/daños) que la parte ganadora dejará de percibir el tiempo que el amparo esté congelando la ejecución. NO el capital de la deuda total.

            const capital = parseFloat(montoCobro) || 0
            const tasaDiaria = parseFloat(tasaInteresEstimado) / 100 / 365
            const diasEstimados = mesesAmparo * 30

            caucionRequerida = capital * tasaDiaria * diasEstimados

            desglose.push(`Capital retenido/congelado: ${fmtMXN(capital)}`)
            desglose.push(`Tasa de estimación de daños (Ej. Legal 9% u Cetes): ${(parseFloat(tasaInteresEstimado)).toFixed(1)}% anual`)
            desglose.push(`Daño por mora durante el juicio (${mesesAmparo} meses): ${fmtMXN(caucionRequerida)}`)

            textoAclaratorio = 'Para paralizar un embargo o cobro judicial de dinero, NO DEBES DEPOSITAR TODO EL DINERO adeudado. La SCJN establece que la caución es solo para "reparar el daño" por el tiempo retrasado (Intereses paralizados).'

        } else if (tipoActo === 'posesion_inmueble') {
            // Desalojo, restitución de inmueble
            // Regla: Se garantizan las rentas comerciales dejadas de percibir

            const renta = parseFloat(rentaInmueble) || 0
            caucionRequerida = renta * mesesAmparo

            desglose.push(`Valor de renta comercial estimada: ${fmtMXN(renta)} al mes`)
            desglose.push(`Meses del juicio bloqueando al verdadero dueño: ${mesesAmparo}`)

            textoAclaratorio = 'Para paralizar un desalojo (Lanzamiento), el Juez pide una fianza equivalente a las RENTAS que el ganador va a perder mientras peleas el amparo.'

        } else if (tipoActo === 'clausura_negocio') {
            // Regla: Lucro cesante estimado o gastos fijos
            const semanal = parseFloat(ingresoMinimoSemanal) || 0
            caucionRequerida = semanal * 4 * mesesAmparo // Menos un castigo / utilidades
            caucionRequerida = caucionRequerida * 0.30 // Asumimos un 30% de margen de utilidad neta como caución, es altamente discrecional. Discrecional.
            discrecional = true

            desglose.push(`Margen operativo estimado congelado (30% utilidades)`)

            textoAclaratorio = 'En clausuras de negocios, las cauciones son altamente DISCRECIONALES del Juez de Distrito basados en la Ley de Ingresos, peritajes o utilidades estimadas. Este cálculo es una media observacional.'

        } else if (tipoActo === 'arresto_multa') {
            // Para arresto administrativo (alcoholímetro, multas viales no firmes)
            // Generalmente piden una cantidad baja
            caucionRequerida = 15000
            discrecional = true
            textoAclaratorio = 'Las multas fijas o arrestos por faltas administrativas que no exceden 36h reciben fianzas accesibles a discreción judicial para acceder a la Suspensión Provisional.'
        } else if (tipoActo === 'vida_libertad_absoluta') {
            // Incomunicación, deportación, penas graves. La suspensión es de PLANO/OFICIO
            caucionRequerida = 0
            fundamento = 'Art. 126 Ley de Amparo'
            textoAclaratorio = '¡SUSPENSIÓN DE OFICIO Y DE PLANO! Cuando el acto reclamado pone en peligro tu vida, tu libertad fuera de proceso, tortura o deportación judicial extralegal, la Suspensión se otorga SIN NECESIDAD DE PAGAR FIANZA ALGUNA.'
        }

        return {
            caucionRequerida,
            discrecional,
            desglose,
            fundamento,
            textoAclaratorio,
            mesesAmparo
        }

    }, [tipoActo, montoCobro, tasaInteresEstimado, tiempoEstimadoAmparo, rentaInmueble, ingresoMinimoSemanal])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💳</span><span>Amparo Federal · Garantías y Fianza</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Estimador de <span className="gradient-gold">Caución Suspensoria</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si pides al Juez de Distrito que congele a las autoridades para que NO ejecuten el acto mientras dura el juicio de Amparo (Suspensión Provisional), deberás exhibir un **Billete de Depósito (BANSEFI)**.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="space-y-4 border-b border-white/10 pb-6">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Qué es lo que la Autoridad (El Juez Natural / Municipio) te quiere hacer?</label>
                        <select value={tipoActo} onChange={e => setTipoActo(e.target.value as any)}
                            className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-red-500 outline-none text-lg">
                            <option value="cobro_dinero">📌 Me van a EMBARGAR por una deuda (Laudo Laboral, Pagaré)</option>
                            <option value="posesion_inmueble">📌 Me quieren DESALOJAR de la casa (Juicio Reivindicatorio, Arrendamiento)</option>
                            <option value="clausura_negocio">📌 El Municipio CLAUSURÓ o suspendió mi negocio/obra comercial</option>
                            <option value="arresto_multa">📌 Arresto administrativo menor o multa fiscal no cuantificada</option>
                            <option value="vida_libertad_absoluta">🚨 Extradición, Tortura, Peligro de Vida o Desaparición Forzada</option>
                        </select>
                    </div>
                </div>

                {tipoActo !== 'vida_libertad_absoluta' && (
                    <div className="animate-fade-in space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {tipoActo === 'cobro_dinero' && (
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor Total de la Deuda o Multa ($)</label>
                                    <input type="number" value={montoCobro} onChange={e => setMontoCobro(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] outline-none" />
                                </div>
                            )}

                            {tipoActo === 'cobro_dinero' && (
                                <div>
                                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tasa Punitiva (% Anual Civil 9% Promedio)</label>
                                    <input type="number" value={tasaInteresEstimado} onChange={e => setTasaInteresEstimado(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--color-accent)] outline-none" />
                                </div>
                            )}

                            {tipoActo === 'posesion_inmueble' && (
                                <div className="col-span-2">
                                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Costo Real mensual de la Renta Comercial de la Casa/Local ($)</label>
                                    <input type="number" value={rentaInmueble} onChange={e => setRentaInmueble(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] outline-none" />
                                </div>
                            )}

                            {tipoActo === 'clausura_negocio' && (
                                <div className="col-span-2">
                                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos Brutos Estimados del Negocio por SEMANA ($)</label>
                                    <input type="number" value={ingresoMinimoSemanal} onChange={e => setIngresoMinimoSemanal(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] outline-none" />
                                </div>
                            )}

                            {tipoActo !== 'arresto_multa' && (
                                <div className="col-span-2 border-t border-white/5 pt-4">
                                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tiempo Estimado que durará el Juicio de Amparo frenando a tu rival (Meses)</label>
                                    <div className="flex items-center gap-4">
                                        <input type="range" min="1" max="18" value={tiempoEstimadoAmparo} onChange={e => setTiempoEstimadoAmparo(e.target.value)}
                                            className="w-full accent-[var(--color-accent)]" />
                                        <span className="font-bold text-white whitespace-nowrap">{tiempoEstimadoAmparo} Meses</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-1">El Juez Federal calcula la caución en base a los meses potenciales que tardará él en emitir una Sentencia Definitiva (Usualmente 6 meses).</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className={`glass-card p-6 rounded-2xl text-center custom-pattern  
                        ${tipoActo === 'vida_libertad_absoluta' ? 'border-2 border-green-500 bg-green-500/10' : 'border border-[var(--color-accent)]/20 bg-[url("/grid.svg")]'}
                    `}>
                        <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-wide">Fianza Jurisprudencial a Exhibir en BANSEFI</p>

                        {tipoActo === 'vida_libertad_absoluta' ? (
                            <div className="text-green-400 font-bold text-3xl md:text-5xl mt-2 mb-2">¡GRATUITA! (DE PLANO)</div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.caucionRequerida)}</span>
                                {resultado.discrecional && <span className="mt-2 text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">⚠️ Cantidad Sumamente Discrecional por el Juez</span>}
                            </div>
                        )}

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {resultado.desglose.length > 0 && (
                            <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5">
                                <span className="text-xs font-bold text-white/50 uppercase block mb-3">¿De dónde saca el Juez del Banco esta cantidad?</span>
                                <ul className="space-y-2 text-sm text-white/80 font-mono">
                                    {resultado.desglose.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 border-b border-white/5 pb-2">
                                            <span className="text-[var(--color-accent)]">›</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={`p-5 rounded-xl border flex flex-col justify-center ${resultado.desglose.length === 0 ? 'col-span-2' : ''} border-white/10 bg-white/5`}>
                            <span className="text-[10px] font-bold text-blue-300 mb-2 uppercase block ">{resultado.fundamento} (Ley de Amparo)</span>
                            <p className="text-sm text-white/90 leading-relaxed italic">"{resultado.textoAclaratorio}"</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
