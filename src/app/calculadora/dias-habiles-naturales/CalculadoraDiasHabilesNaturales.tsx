'use client'
import { useState, useMemo } from 'react'
import { addDays, parseISO, isValid, isWeekend, format, differenceInBusinessDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CalculadoraDiasHabilesNaturales() {
    const [modo, setModo] = useState<'sumar_habiles' | 'contar_habiles'>('sumar_habiles')
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0])

    // Para modo 'sumar'
    const [diasTermino, setDiasTermino] = useState('9') // El famoso plazo de 9 días para contestar demanda ordinaria

    // Para modo 'contar'
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0])

    const resultado = useMemo(() => {
        const fInicio = parseISO(fechaInicio)
        if (!isValid(fInicio)) return null

        if (modo === 'sumar_habiles') {
            const diasSumar = parseInt(diasTermino) || 0

            // Regla procesal general: El término procesal empieza a correr al DÍA SIGUIENTE DE QUE SURTE EFECTOS LA NOTIFICACIÓN.
            // Para simplificar una calculadora genérica, sumaremos a partir del día siguiente de la fecha ingresada.
            let diasAgregados = 0
            let fechaActual = addDays(fInicio, 1)

            // Contamos los días hábiles strictos (L-V)
            while (diasAgregados < diasSumar) {
                if (!isWeekend(fechaActual)) {
                    diasAgregados++
                }
                if (diasAgregados < diasSumar) {
                    fechaActual = addDays(fechaActual, 1)
                }
            }

            // Un término procesal vence a las 23:59 ó 24:00 horas del último día,
            // pero en la práctica en los juzgados vence a la hora que cierra la Oficialía de Partes (15:00 hrs) o a las 23:59 por buzón electrónico.
            return {
                tipo: 'suma',
                fechaMata: format(fechaActual, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }),
                fechaBruta: fechaActual,
                diasHabilesAgregados: diasSumar
            }

        } else {
            // Contar cuántos días hábiles hay entre dos fechas
            const fFin = parseISO(fechaFin)
            if (!isValid(fFin)) return null

            // Usamos la función de date-fns para diferencias de negocios
            // differenceInBusinessDays asume Lunes-Viernes. 
            // Para términos del reloj procesal, el día 1 es el siguiente al inicio. Así que restamos directamente.
            let diasTranscurridos = differenceInBusinessDays(fFin, fInicio)
            if (diasTranscurridos < 0) diasTranscurridos = 0

            return {
                tipo: 'conteo',
                diasHabilesTranscurridos: diasTranscurridos
            }
        }
    }, [modo, fechaInicio, diasTermino, fechaFin])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🗓️</span><span>Práctica Procesal · Cómputo de Términos</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Cómputo de <span className="gradient-gold">Días Hábiles Judiciales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Los jueces otorgan "Días Hábiles" para contestar demandas, ofrecer pruebas o apelar, saltando sábados y domingos. No te equivoques contando con los dedos.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6">

                <div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/10">
                    <button onClick={() => setModo('sumar_habiles')} className={`flex-1 p-3 text-sm font-bold rounded-lg transition-colors ${modo === 'sumar_habiles' ? 'bg-[var(--color-accent)] text-black' : 'text-white/70 hover:text-white'}`}>
                        Proyectar Fecha de Vencimiento
                    </button>
                    <button onClick={() => setModo('contar_habiles')} className={`flex-1 p-3 text-sm font-bold rounded-lg transition-colors ${modo === 'contar_habiles' ? 'bg-[var(--color-accent)] text-black' : 'text-white/70 hover:text-white'}`}>
                        Contar Días Transcurridos
                    </button>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Día "0" (Fecha en que Surte Efectos la Notificación)</label>
                        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-100 focus:outline-none [color-scheme:dark]" />
                        <p className="text-[10px] text-white/40 mt-1">Dependiendo la materia (Civil, Mercantil), la notificación surte efectos el mismo día, o al día siguiente de que te avisan. Pon la fecha a partir de la cual el reloj arranca. Esta calculadora cuenta el Día 1 como el día posterior al que ingreses aquí.</p>
                    </div>

                    {modo === 'sumar_habiles' ? (
                        <div className="animate-fade-in">
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Cuántos "Días" de Término Legal te dieron?</label>
                            <input type="number" value={diasTermino} onChange={e => setDiasTermino(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha Límite Final (Hoy o Día en que Contestaste)</label>
                            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                                className="w-full p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-100 focus:outline-none [color-scheme:dark]" />
                        </div>
                    )}
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-2xl space-y-4">
                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-[var(--color-accent)]/20">
                        {resultado.tipo === 'suma' ? (
                            <>
                                <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-wide">Fecha Límite para Presentar tu Escrito (Vencimiento)</p>
                                <p className="text-3xl md:text-4xl font-bold uppercase text-[var(--color-accent)] my-2">
                                    {resultado.fechaMata}
                                </p>
                                <p className="text-xs text-white/60">Término de {resultado.diasHabilesAgregados} Días Hábiles saltando Sábados y Domingos.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-wide">Han pasado un total de</p>
                                <p className="text-6xl font-mono font-bold text-[var(--color-accent)] my-2">
                                    {resultado.diasHabilesTranscurridos}
                                </p>
                                <p className="text-xs text-[var(--color-accent)]">Días Procesales Efectivos (Sin contar fines de semana)</p>
                            </>
                        )}
                    </div>

                    <div className="p-3 text-[10px] text-orange-200 bg-orange-500/10 rounded-lg border border-orange-500/20 text-center">
                        <strong>⚠️ IMPORTANTE: ACUERDOS DEL TRIBUNAL:</strong> El cómputo en la vida real <b>descuenta días festivos</b> (1 de enero, 5 de febrero, 21 de marzo, 1 de mayo, 16 de septiembre, 20 de noviembre, 25 de diciembre) y además omite los <b>días en que el tribunal suspende labores</b> (incapacidades del juzgado, huracanes, puentes y vacaciones obligatorias de la burocracia judicial). Siempre cruza esta fecha matemática con el calendario del Poder Judicial de tu Estado o de la Federación.
                    </div>
                </div>
            )}
        </main>
    )
}
