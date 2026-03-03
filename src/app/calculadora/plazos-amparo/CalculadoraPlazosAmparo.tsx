'use client'
import { useState, useMemo } from 'react'
import { addDays, parseISO, isValid, isWeekend, format, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'

// Función simple para sumar días hábiles (Salta sábados y domingos)
// Nota: Para un cálculo de tribunal real se deben saltar también días festivos acordados por el CJF. 
// Aquí lo mantendremos asumiendo solo fines de semana para dar la base teórica estándar.
function sumarDiasHabiles(fechaInicio: Date, diasAAgregar: number): Date {
    let diasAgregados = 0
    let fechaActual = fechaInicio

    // En amparo, el plazo empieza a correr al día siguiente de que surte efectos la notificación
    // Para simplificar, asumiremos que surte efectos el mismo día, por lo que empezamos a contar 
    // al día siguiente de la fecha de notificación ingresada.
    fechaActual = addDays(fechaActual, 1) // El "día 1" es el siguiente a la notificación

    while (diasAgregados < diasAAgregar) {
        if (!isWeekend(fechaActual)) {
            diasAgregados++
        }
        if (diasAgregados < diasAAgregar) {
            fechaActual = addDays(fechaActual, 1)
        }
    }
    return fechaActual
}

export default function CalculadoraPlazosAmparo() {
    const [tipoActo, setTipoActo] = useState<'general_15' | 'leyes_30' | 'penal_incomunicacion' | 'agrario_7' | 'sentencia_definitiva'>('general_15')
    const [fechaNotificacion, setFechaNotificacion] = useState(new Date().toISOString().split('T')[0])
    const [tipoRecurso, setTipoRecurso] = useState<'ninguno' | 'revision_10' | 'queja_5' | 'reclamacion_3'>('ninguno')

    const resultado = useMemo(() => {
        const fNotificacion = parseISO(fechaNotificacion)
        if (!isValid(fNotificacion)) return null

        let diasPlazo = 15 // General: 15 días (Art. 17 Ley de Amparo)
        let excepcionDetalle = 'Regla general: Tienes 15 días hábiles desde que fuiste notificado o tuviste conocimiento del acto de autoridad para presentar la Demanda de Amparo Provisional.'
        let esHabil = true

        if (tipoActo === 'leyes_30') {
            diasPlazo = 30
            excepcionDetalle = 'Contra normas generales autoaplicativas (leyes nuevas): 30 días hábiles desde su entrada en vigor.'
        } else if (tipoActo === 'penal_incomunicacion') {
            diasPlazo = 0 // Cualquier momento
            excepcionDetalle = 'EXCEPCIÓN MÁXIMA (Art 15 LA): Tratándose de incomunicación, tortura, desaparición forzada, deportación o ataques a la vida/libertad fuera de procedimiento, el amparo se puede promover EN CUALQUIER TIEMPO, incluso en fines de semana o de madrugada.'
            esHabil = false // Se cuentan todos los días (naturales/horas)
        } else if (tipoActo === 'agrario_7') {
            diasPlazo = 365 * 7 // 7 años representativos, los calcularemos diferente si es necesario, pero ej 7 años.
            excepcionDetalle = 'Derechos Agrarios de ejidos o comunidades: Tienen hasta 7 años para ampararse.'
        } else if (tipoActo === 'sentencia_definitiva') {
            diasPlazo = 15
            excepcionDetalle = 'Amparo Directo contra sentencias definitivas: Tienes 15 días hábiles desde que te notificaron el fallo.'
        }

        // Si están consultando por un RECURSO dentro de un juicio de amparo que ya existe:
        if (tipoRecurso !== 'ninguno') {
            if (tipoRecurso === 'revision_10') {
                diasPlazo = 10
                excepcionDetalle = 'Recurso de Revisión (Amparo ya en curso): 10 días hábiles (Art. 86 LA).'
            } else if (tipoRecurso === 'queja_5') {
                diasPlazo = 5
                excepcionDetalle = 'Recurso de Queja: 5 días hábiles (Art. 97 LA) por regla general, 2 días si es contra auto que decide suspensión, en cualquier tiempo si son omisiones.'
            } else if (tipoRecurso === 'reclamacion_3') {
                diasPlazo = 3
                excepcionDetalle = 'Recurso de Reclamación: 3 días hábiles contra providencias de trámite del presidente de la Corte o Colegiado.'
            }
        }

        let fechaVencimiento: Date;

        if (tipoActo === 'penal_incomunicacion') {
            fechaVencimiento = new Date() // Hoy, siempre vigente
        } else if (tipoActo === 'agrario_7') {
            fechaVencimiento = addDays(fNotificacion, 365 * 7)
        } else {
            // Cómputo procesal normal (Hábiles)
            fechaVencimiento = sumarDiasHabiles(fNotificacion, diasPlazo)
        }

        const hoy = new Date()
        let vencido = false
        if (tipoActo !== 'penal_incomunicacion') {
            vencido = isAfter(hoy, addDays(fechaVencimiento, 1)) // Le damos margen hasta la medianoche del día calculado
        }

        return {
            diasPlazo,
            fechaFatal: tipoActo === 'penal_incomunicacion' ? 'EN CUALQUIER MOMENTO' : format(fechaVencimiento, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }),
            excepcionDetalle,
            vencido,
            esHabil
        }

    }, [tipoActo, fechaNotificacion, tipoRecurso])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⏳</span><span>Derecho Constitucional · Tiempos Procesales</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Plazos de Amparo</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La Ley de Amparo marca el reloj procesal en <strong>Días Hábiles</strong>. El cómputo siempre arranca al día siguiente de la notificación (Art 18). Descubre tu "Día Fatal" para presentar tu demanda.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Qué estás intentando presentar?</label>
                            <select value={tipoActo} onChange={e => { setTipoActo(e.target.value as any); setTipoRecurso('ninguno') }}
                                className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                                <option value="general_15">Amparo Indirecto General (Contra Resoluciones/Actos)</option>
                                <option value="sentencia_definitiva">Amparo Directo (Contra Sentencia Definitiva o Laudo)</option>
                                <option value="leyes_30">Amparo contra Ley Nueva (Norma Autoaplicativa)</option>
                                <option value="penal_incomunicacion">Actos graves (Tortura, Vida, Incomunicación Penal)</option>
                                <option value="agrario_7">Amparo en materia Agraria (Derechos de núcleos)</option>
                            </select>
                        </div>

                        {['general_15', 'sentencia_definitiva'].includes(tipoActo) && (
                            <div className="animate-fade-in p-3 rounded-lg border border-purple-500/30 bg-purple-500/10">
                                <label className="block text-xs text-purple-300 mb-1.5 font-bold">Variante: Interponer un Recurso a un Amparo Ya Abierto</label>
                                <select value={tipoRecurso} onChange={e => setTipoRecurso(e.target.value as any)}
                                    className="w-full p-2 text-sm rounded-lg bg-black/40 border border-white/10 text-purple-100 outline-none">
                                    <option value="ninguno">No, presento Demanda Inicial</option>
                                    <option value="revision_10">Presentar Recurso de Revisión</option>
                                    <option value="queja_5">Presentar Recurso de Queja</option>
                                    <option value="reclamacion_3">Presentar Recurso de Reclamación</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs text-green-300 font-bold mb-1.5">Fecha de Notificación Oficial / Conocimiento del Acto</label>
                        <input type="date" value={fechaNotificacion} onChange={e => setFechaNotificacion(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-green-500/10 border border-green-500/30 text-green-100 focus:outline-none [color-scheme:dark]" />
                        <div className="mt-3 text-[10px] text-white/50 space-y-1">
                            <p>✔️ <strong>Regla del "Día Siguiente":</strong> La app automáticamente asume que si te notificaron el Lunes, el plazo "Día 1" arranca el Martes.</p>
                            <p>✔️ <strong>Fines de Semana:</strong> La app salta sábados y domingos por defecto.</p>
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl">

                    <div className={`glass-card p-8 rounded-2xl text-center shadow-lg transform transition-all border-2 
                        ${resultado.vencido ? 'border-red-500/50 bg-red-900/10' : 'border-[var(--color-accent)]/30 bg-[url("/grid.svg")]'}
                    `}>
                        <p className="text-sm font-bold text-white/50 mb-2 uppercase tracking-wide">
                            {resultado.vencido ? 'El Plazo Legal ha Expirado / Precluido' : 'Fecha Fatal Límite de Presentación (23:59 hrs)'}
                        </p>
                        <p className={`text-3xl md:text-4xl font-bold uppercase ${resultado.vencido ? 'text-red-500' : 'text-[var(--color-accent)]'}`}>
                            {resultado.fechaFatal}
                        </p>

                        <div className="mt-6 flex justify-center gap-4 text-xs font-mono">
                            <span className="px-3 py-1 rounded bg-black/30 border border-white/5 whitespace-nowrap">
                                ⏳ Plazo Legal: <b>{resultado.diasPlazo > 0 ? `${resultado.diasPlazo} Días` : 'Inmediato'}</b>
                            </span>
                            <span className="px-3 py-1 rounded bg-black/30 border border-white/5 whitespace-nowrap">
                                🗓 Cómputo: <b>{resultado.esHabil ? 'Días Hábiles (L a V)' : 'Días Calendarizados'}</b>
                            </span>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-white/5 text-left border border-white/10 text-sm text-white/80 leading-relaxed">
                            <p><strong className="text-white">📝 Justificación de la Ley de Amparo:</strong> {resultado.excepcionDetalle}</p>
                        </div>

                        <div className="p-3 mt-4 text-[10px] text-orange-200 bg-orange-500/10 rounded-lg border border-orange-500/20 text-left">
                            <strong>⚠️ ADVERTENCIA SOBRE FESTIVOS:</strong> Este simulador matemático <b>descarta inteligentemente los Sábados y Domingos</b>, pero NO tiene programados los días Festivos e Inhábiles variables que dicta el <a href="https://www.cjf.gob.mx/" target="_blank" className="underline">Consejo de la Judicatura Federal (CJF)</a> cada ciclo anual (por ejemplo: Semana Santa, 52 y demás asuetos obligatorios). Por tanto, tu fecha fatal TEÓRICA mostrada podría ser <i>aún más generosa</i> en la vida real si se cruza con un puente festivo federal oficial o suspensión de labores en el Juzgado. Ante la duda, presenta tu demanda siempre ANTES del día límite calculado aquí para evitar rechazos por preclusión de términos procesales.
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
