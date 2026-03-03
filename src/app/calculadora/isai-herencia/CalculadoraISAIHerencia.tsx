'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraISAIHerencia() {
    const [valorInmueble, setValorInmueble] = useState('2500000')
    const [estado, setEstado] = useState('CDMX')
    const [parentesco, setParentesco] = useState<'linea_recta' | 'conyuge' | 'colateral' | 'tercero'>('linea_recta')

    const resultado = useMemo(() => {
        const valor = parseFloat(valorInmueble) || 0
        let tasaISAI = 0
        let exento = false
        let detalleExencion = ''

        // Reglas de ISAI / ISABI / Traslado de Dominio por Herencia
        // Muchos estados exentan de este pago si se trata de línea recta (Padres a hijos) o Cónyuges.
        // Colaterales (hermanos, tíos) y Terceros sin parentesco casi siempre pagan la tasa general.

        if (estado === 'CDMX') {
            tasaISAI = valor > 1200000 ? 5.5 : 4.5
            if (parentesco === 'linea_recta' || parentesco === 'conyuge') { exento = true; detalleExencion = 'En CDMX la adquisición por sucesión entre cónyuges, concubinos o línea recta (ascendiente/descendiente) tiene Tasa Cero (Art. 115 Código Fiscal CDMX).' }
            else { detalleExencion = 'En CDMX los hermanos, tíos o terceros sí pagan el impuesto ISAI de forma regular en la adjudicación.' }
        } else if (estado === 'EDOMEX') {
            tasaISAI = 4.0 // Promedio municipal
            if (parentesco === 'linea_recta') { exento = true; detalleExencion = 'En los municipios del Edomex se suele aplicar factor cero para descendientes en primer grado (hijos).' }
            else { detalleExencion = 'Pagas ISABI municipal.' }
        } else if (estado === 'NUEVO_LEON') {
            tasaISAI = 3.0 // Promedio Monterrey
            if (parentesco === 'linea_recta' || parentesco === 'conyuge') { exento = true; detalleExencion = 'Tienen subsidios altos o exención en herencias directas (Línea Recta).' }
            else { detalleExencion = 'Se causa el ISAI normal.' }
        } else if (estado === 'JALISCO') {
            tasaISAI = 4.5 // ZMG (Guadalajara, Zapopan)
            // En Jalisco hay descuentos, pero varía por municipio (suele haber tope al 50% de descuento o 100% pero limitado en UMAs).
            if (parentesco === 'linea_recta' || parentesco === 'conyuge') {
                tasaISAI = tasaISAI / 2 // Simplificación
                detalleExencion = 'La Ley de Ingresos del Municipio otorga reducciones (ej. 50% a 70%) para familiares directos.'
            } else { detalleExencion = 'No hay apoyos fiscales en transmisiones patrimoniales para este parentesco.' }
        } else {
            // General
            tasaISAI = 3.0
            if (parentesco === 'linea_recta') {
                tasaISAI = 0 // Asumiendo regla general garantista
                detalleExencion = 'Por regla general en el derecho fiscal mexicano, el traslado de dominio por causa de muerte a descendientes y ascendientes está exento o altamente subsidiado.'
            } else if (parentesco === 'conyuge') {
                tasaISAI = 0
                detalleExencion = 'Sucesión a cónyuge supérstite generalmente exenta.'
            } else {
                detalleExencion = 'Impuestos normales por traslado de dominio.'
            }
        }

        const montoISAI = exento ? 0 : (valor * (tasaISAI / 100))

        // Honorarios Notariales para Adjudicación Testada o Intestada (Arancel Promedio 2.5%)
        const honorariosNotario = valor * 0.025

        // Derechos de Registro Público de la Propiedad (Promedio Nacional)
        const derechosRPP = valor > 1000000 ? 12000 : 6000

        // Avalúo
        const costoAvaluo = valor * 0.003

        const gastoTotal = montoISAI + honorariosNotario + derechosRPP + costoAvaluo

        return {
            tasaISAI: exento ? 0 : tasaISAI,
            montoISAI,
            honorariosNotario,
            derechosRPP,
            costoAvaluo,
            gastoTotal,
            exento,
            detalleExencion
        }
    }, [valorInmueble, estado, parentesco])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏛️</span><span>Sucesiones · Fiscal Notarial</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">ISAI y Gastos Hereditarios</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    A diferencia del "ISR" del SAT que es federal (y está 100% exento en toda herencia según el Art. 93), el <strong>ISAI</strong> es un impuesto municipal que sí podrías tener que pagar al escriturar a tu nombre la casa que heredaste.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor Acordado o Catastral del Inmueble ($)</label>
                    <input type="number" value={valorInmueble} onChange={e => setValorInmueble(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ubicación del Inmueble</label>
                        <select value={estado} onChange={e => setEstado(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                            <option value="CDMX">Ciudad de México (CDMX)</option>
                            <option value="EDOMEX">Estado de México (EDOMEX)</option>
                            <option value="NUEVO_LEON">Nuevo León / Monterrey</option>
                            <option value="JALISCO">Jalisco / Guadalajara</option>
                            <option value="OTRO">Demás Entidades Federativas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Parentesco con el Difunto</label>
                        <select value={parentesco} onChange={e => setParentesco(e.target.value as any)}
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                            <option value="linea_recta">Hijo / Nieto / Padre / Abuelo</option>
                            <option value="conyuge">Cónyuge / Concubino(a)</option>
                            <option value="colateral">Hermano / Tío / Sobrino (Colateral)</option>
                            <option value="tercero">Sin parentesco legal (Particular / Amigo)</option>
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-2xl space-y-4">

                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-[var(--color-accent)]/20">
                        <p className="text-sm font-bold text-white/50 mb-1">Costo Estimado de "Cambiar el Propietario" (Adjudicación Testamentaria)</p>
                        <p className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.gastoTotal)}</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl space-y-3 font-mono text-sm leading-relaxed text-white/80">

                        <div className={`flex justify-between p-3 rounded-lg border ${resultado.exento ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-orange-500/10 border-orange-500/20 text-orange-200'}`}>
                            <div>
                                <span className="block font-bold">Impuesto Estatal (ISAI / Traslativo de Dominio)</span>
                                <span className="text-[10px] font-sans opacity-80">{resultado.detalleExencion}</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold">${fmtMXN(resultado.montoISAI)}</span>
                                <span className="text-xs opacity-60">Tasa: {resultado.tasaISAI}%</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-2">
                            <span>Honorarios de la Notaría y Papelería (~2.5%)</span>
                            <span>${fmtMXN(resultado.honorariosNotario)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <span>Derechos (Registro Público de la Propiedad)</span>
                            <span>${fmtMXN(resultado.derechosRPP)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <span>Avalúo o Levantamiento Topográfico</span>
                            <span>${fmtMXN(resultado.costoAvaluo)}</span>
                        </div>

                    </div>

                    <div className="text-[10px] text-white/30 text-center mt-4">
                        <p>Incluso si tienes la herencia exenta de impuestos de Traslado ISAI, el Notario Público siempre te cobrará honorarios por generar la nueva Escritura Pública (llamada de Adjudicación Testamentaria o Intestamentaria) y los derechos que cobra el Registro Público del Estado por inscribirte como el nuevo dueño en su base de datos son ineludibles. La "Herencia no es 100% gratuita" en la práctica material.</p>
                    </div>
                </div>
            )}
        </main>
    )
}
