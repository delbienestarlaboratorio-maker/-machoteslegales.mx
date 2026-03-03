'use client'
import { useState, useMemo } from 'react'
import { addYears, addDays, parseISO, isValid, format, isAfter, differenceInYears } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CalculadoraPrescripcionFiscal() {
    // Escenarios básicos del 146 CFF
    const [fechaExigibilidad, setFechaExigibilidad] = useState('2019-04-30') // Fecha en que debió pagarse o fecha de notificación legal
    const [huboRequerimiento, setHuboRequerimiento] = useState(false)
    const [fechaInterrupcion, setFechaInterrupcion] = useState(new Date().toISOString().split('T')[0]) // Fecha del embargo o notificación de cobro coactivo
    const [huboSuspension, setHuboSuspension] = useState(false)
    const [mesesSuspension, setMesesSuspension] = useState('12') // Ejemplo: Recurso de revocación, juicios donde el SAT no pudo cobrar.

    const resultado = useMemo(() => {
        const dExigible = parseISO(fechaExigibilidad)
        if (!isValid(dExigible)) return null

        // Regla general: 5 años a partir de la fecha de exigibilidad
        let fechaPrescripcion = addYears(dExigible, 5)
        let detalles = []
        let resetWarning = false

        detalles.push(`Regla General (Art. 146 CFF): 5 años naturales desde la fecha en que pudo ser legalmente cobrado el crédito. Base: ${format(fechaPrescripcion, "dd/MM/yyyy")}`)

        // Interrupción de la prescripción
        // El reloj se va a ceros nuevamente con cada cobro o acto de embargo (PAE).
        if (huboRequerimiento) {
            const dInterrupcion = parseISO(fechaInterrupcion)
            if (isValid(dInterrupcion)) {
                fechaPrescripcion = addYears(dInterrupcion, 5)
                detalles.push(`Interrupción del Reloj: Todo acto de cobro notificado o embargo reinicia los 5 años desde cero. Nueva base: ${format(fechaPrescripcion, "dd/MM/yyyy")}`)
                resetWarning = true
            }
        }

        // Suspensión de la prescripción (Art. 144 CFF / 146)
        // El reloj de los 5 años se PAUSA cuando el deudor interpone juicios o desocupa su domicilio.
        const topeAbsoluto = addYears(dExigible, 10) // La prescripción con TODO interrupciones NO puede rebasar los 10 años.

        let topeAbsolutoActualizado = addYears(dExigible, 10)

        if (huboSuspension) {
            const meses = parseInt(mesesSuspension) || 0
            fechaPrescripcion = addDays(fechaPrescripcion, meses * 30.4) // Agrega los meses pauzados
            topeAbsolutoActualizado = addDays(topeAbsoluto, meses * 30.4) // El tope absoluto también crece con pausas legales (Ej. ocultarse o juicios largos).
            detalles.push(`Suspensión Registrada (+${meses} meses): Durante medios de defensa (Juicios Nulidad, Amparo) o por no estar localizable, el tiempo no cuenta. El plazo se alargó.`)
        }

        // Regla del Tope de los 10 años
        let usoTope10Anios = false
        if (isAfter(fechaPrescripcion, topeAbsolutoActualizado)) {
            fechaPrescripcion = topeAbsolutoActualizado
            usoTope10Anios = true
            detalles.push(`Aplicación Tope Máximo Legal: Las interrupciones múltiples (el SAT embargando a cada rato) no pueden alargar la agonía por más de 10 años. Se topa la fecha a los 10 años de la primera exigencia (+ meses de suspensión).`)
        }

        const hoy = new Date()
        const prescrito = isAfter(hoy, fechaPrescripcion)

        const diferencia = differenceInYears(fechaPrescripcion, dExigible)

        return {
            fechaExigibilidad: format(dExigible, "dd 'de' MMMM 'de' yyyy", { locale: es }),
            fechaFatal: format(fechaPrescripcion, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }),
            prescrito,
            detalles,
            resetWarning,
            usoTope10Anios,
            diferencia
        }

    }, [fechaExigibilidad, huboRequerimiento, fechaInterrupcion, huboSuspension, mesesSuspension])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⏳</span><span>Defensa Fiscal · Código Fiscal (CFF)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Prescripción de <span className="gradient-gold">Créditos Fiscales (SAT)</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si el SAT, el IMSS o tu Estado no te cobran una multa o impuesto en 5 años de forma eficiente, la Ley castiga su inactividad **extinguiendo la deuda para siempre**. Calcula si ya "caducó" el crédito.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                        A: Fecha en que la Multa o Declaración Debía Pagarse o se Notificó el "Crédito"
                    </label>
                    <input type="date" value={fechaExigibilidad} onChange={e => setFechaExigibilidad(e.target.value)}
                        className="w-full p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-100 font-bold focus:outline-none focus:border-green-400 [color-scheme:dark]" />
                    <p className="text-[10px] text-white/50 mt-1">Ej: Si presentaste tu anual el 30 de abril y te salió a pagar, el límite era ese día. Al día siguiente nace el crédito de forma exigible. O si el SAT te embargó un dictamen, el día surte efectos.</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-red-500/20 bg-red-500/5 transition-colors hover:bg-red-500/10">
                        <input type="checkbox" id="interrupcion" checked={huboRequerimiento} onChange={e => setHuboRequerimiento(e.target.checked)} className="mt-1 w-5 h-5 accent-red-500" />
                        <div className="flex-1">
                            <label htmlFor="interrupcion" className="text-sm font-bold text-red-300 block mb-1">
                                Interrupción Fetal: Hubo Cobro Coactivo o Solicité Pagos a Plazos
                            </label>
                            <p className="text-xs text-red-200/60 leading-relaxed mb-2">
                                Si el SAT mandó a un ejecutor a tocar tu puerta, te embargó cuentas bancarias mediante PAE oficial, o TÚ reconociste la deuda (pediste condonaciones), el reloj de 5 años **SE RESETEÓ A CERO**.
                            </p>
                            {huboRequerimiento && (
                                <div className="mt-3 animate-fade-in">
                                    <label className="block text-[10px] text-red-400 font-bold mb-1">Dime el ÚLTIMO día que sufres este acto o petición:</label>
                                    <input type="date" value={fechaInterrupcion} onChange={e => setFechaInterrupcion(e.target.value)}
                                        className="w-full p-2 text-sm rounded-lg bg-red-900/40 border border-red-500/50 text-red-100 outline-none [color-scheme:dark]" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 transition-colors hover:bg-blue-500/10">
                        <input type="checkbox" id="suspension" checked={huboSuspension} onChange={e => setHuboSuspension(e.target.checked)} className="mt-1 w-5 h-5 accent-blue-500" />
                        <div className="flex-1">
                            <label htmlFor="suspension" className="text-sm font-bold text-blue-300 block mb-1">
                                Suspensión de Tiempo: Congelamiento temporal del reloj
                            </label>
                            <p className="text-xs text-blue-200/60 leading-relaxed mb-2">
                                Si te fuiste a Juicio de Nulidad/Amparo garantizando el crédito, o te declararon "No Localizable" (te fuiste a otro lado y abandonaste el domicilio fiscal sin avisar), el reloj de prescripción NO corre mientras estemos en ese estatus.
                            </p>
                            {huboSuspension && (
                                <div className="mt-3 animate-fade-in">
                                    <label className="block text-[10px] text-blue-400 font-bold mb-1">¿Cuántos Meses duró el juicio o la no-localización?</label>
                                    <input type="number" value={mesesSuspension} onChange={e => setMesesSuspension(e.target.value)}
                                        className="w-full p-2 text-sm rounded-lg bg-blue-900/40 border border-blue-500/50 text-blue-100 outline-none" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className={`glass-card p-8 rounded-2xl text-center shadow-lg transform transition-all border-2 
                        ${resultado.prescrito ? 'border-green-500/50 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}
                    `}>
                        <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-wide">
                            {resultado.prescrito ? '¡El Crédito ha muerto legalmente!' : 'Deuda Plenamente Vigente y Cobrable'}
                        </p>
                        <p className={`text-3xl md:text-5xl font-bold uppercase mb-2 ${resultado.prescrito ? 'text-green-500' : 'text-red-500'}`}>
                            {resultado.fechaFatal}
                        </p>

                        <div className="text-xs text-white/70">
                            {resultado.prescrito
                                ? 'La Autoridad perdió su derecho de cobro obligatoriamente. Debes interponer la Declaratoria de Prescripción en PRODECON (Art 146).'
                                : `El fisco aún cuenta con todas sus potestades de embargo y PAE hasta este día. Faltan años.`
                            }
                        </div>

                        {resultado.usoTope10Anios && (
                            <div className="mt-4 p-2 bg-orange-500/20 text-orange-300 font-bold text-xs rounded border border-orange-500/30">
                                🛡️ MAX CAP (10 AÑOS): Entró al quite el blindaje de la Suprema Corte contra las interrupciones abusivas y eternas del fisco.
                            </div>
                        )}

                        {resultado.resetWarning && !resultado.usoTope10Anios && (
                            <div className="mt-4 p-2 bg-red-500/20 text-red-300 font-bold text-xs rounded border border-red-500/30">
                                ❌ RESET APLICADO: Al gestionar cobros y requerimientos, resucitaste a la bestia. Volvió a empezar el ciclo de 5 años.
                            </div>
                        )}
                    </div>

                    <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-[var(--color-accent)] uppercase block mb-3">Auditoría del Cálculo de Fechas</span>
                        <ul className="space-y-2 text-[11px] text-white/70 italic">
                            {resultado.detalles.map((d, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-[var(--color-accent)] shrink-0">›</span>
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}
        </main>
    )
}
