'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'
import { differenceInDays, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CalculadoraInteresesJudiciales() {
    const [suertePrincipal, setSuertePrincipal] = useState('250000')
    const [materia, setMateria] = useState<'civil' | 'mercantil' | 'convencional'>('mercantil')
    const [tasaLibre, setTasaLibre] = useState('24') // Sólo se usa si es convencional
    const [fechaMora, setFechaMora] = useState('2024-01-01') // Fecha en que se incurrió en mora o le notificaron la demanda
    const [fechaLiquidacion, setFechaLiquidacion] = useState(new Date().toISOString().split('T')[0]) // Usualmente es hoy o cuando pague

    const resultado = useMemo(() => {
        const capital = parseFloat(suertePrincipal) || 0
        const fInicio = parseISO(fechaMora)
        const fFin = parseISO(fechaLiquidacion)

        if (!isValid(fInicio) || !isValid(fFin)) return null

        let diasMora = differenceInDays(fFin, fInicio)
        if (diasMora < 0) diasMora = 0 // Aún no ha caído en mora si la fecha liquidación es anterior

        let tasaAnual = 6.0
        let descripcionTasa = ''

        if (materia === 'mercantil') {
            tasaAnual = 6.0 // Art. 362 Código de Comercio
            descripcionTasa = 'Tasa Legal Mercantil (6% anual) aplicada supletoriamente por falta de pacto escrito.'
        } else if (materia === 'civil') {
            tasaAnual = 9.0 // Promedio nacional (Ej. Art 2395 CCF)
            descripcionTasa = 'Tasa Legal Civil (9% anual) impuesta a préstamos y deudas particulares.'
        } else {
            tasaAnual = parseFloat(tasaLibre) || 0
            descripcionTasa = `Tasa Convencional pactada en el contrato (${tasaAnual}% anual).`
        }

        const tasaDiaria = (tasaAnual / 100) / 365
        const interesDevengado = capital * tasaDiaria * diasMora
        const totalEjecutivo = capital + interesDevengado

        // Formateo de los años y meses (Para desglose de sentencia)
        const aniosCompletos = Math.floor(diasMora / 365)
        const mesesRestantes = Math.floor((diasMora % 365) / 30)

        return {
            capital,
            interesDevengado,
            totalEjecutivo,
            diasMora,
            aniosCompletos,
            mesesRestantes,
            tasaAnual,
            descripcionTasa
        }
    }, [suertePrincipal, materia, tasaLibre, fechaMora, fechaLiquidacion])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Ejecución de Sentencias · Mora Legal</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Intereses Judiciales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando un juez dicta una sentencia que condena a pagar, o un deudor no pagó desde fecha estipulada, arranca un reloj moratorio fijado por el Código Civil (9%) o de Comercio (6%). Simula tu planilla de liquidación aquí.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Suerte Principal (Capital a Pagar) $</label>
                        <input type="number" value={suertePrincipal} onChange={e => setSuertePrincipal(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Materia Jurídica de la Deuda</label>
                        <select value={materia} onChange={e => setMateria(e.target.value as any)}
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                            <option value="mercantil">Pagarés / Bancos / C.Comercio (6%)</option>
                            <option value="civil">Contratos Civiles / Préstamo Particular (9%)</option>
                            <option value="convencional">Tasa Convencional Escrita Pura</option>
                        </select>
                    </div>
                </div>

                {materia === 'convencional' && (
                    <div className="border-t border-white/10 pt-4 animate-fade-in">
                        <label className="block text-xs text-orange-300 font-bold mb-1.5">Interés CONVENCIONAL fijado en el Contrato (% Anual)</label>
                        <input type="number" value={tasaLibre} onChange={e => setTasaLibre(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-200 focus:outline-none" />
                        <p className="text-[10px] text-white/50 mt-1">Cuidado con la USURA (art. 21 Convención Americana). Un juez podría reducir este interés de oficio si lo considera engañoso e injusto (&gt;30%).</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                        <label className="block text-xs text-blue-300 font-bold mb-1.5 ">A: Fecha de Inicio de la Mora</label>
                        <input type="date" value={fechaMora} onChange={e => setFechaMora(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 focus:outline-none [color-scheme:dark]" />
                        <p className="text-[10px] text-white/40 mt-1">Suele ser el día siguiente en que no pagó, o la fecha en que lo notificaron de la demanda judicial (emplazamiento).</p>
                    </div>
                    <div>
                        <label className="block text-xs text-green-300 font-bold mb-1.5 ">B: Fecha de Liquidación (Corte)</label>
                        <input type="date" value={fechaLiquidacion} onChange={e => setFechaLiquidacion(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 focus:outline-none [color-scheme:dark]" />
                        <p className="text-[10px] text-white/40 mt-1">Hasta dónde quieres cortar para cobrarle. Usualmente es el Día de Hoy.</p>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-[var(--color-accent)]/20">
                        <p className="text-sm font-bold text-white/50 mb-1">Monto Total a Ejecutar (Liquidación)</p>
                        <p className="text-4xl md:text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.totalEjecutivo)}</p>
                        <p className="text-xs text-white/60 mt-3">{resultado.descripcionTasa}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5">
                            <span className="text-xs font-bold text-white/50 uppercase block mb-3">Cronometría del Impago</span>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b mx-2 pb-1 border-white/5">
                                    <span className="text-white">Días Totales en Letargo</span>
                                    <span className="font-mono text-[var(--color-accent)] font-bold">{resultado.diasMora}</span>
                                </div>
                                <div className="flex justify-between border-b mx-2 pb-1 border-white/5 text-white/60 text-sm">
                                    <span>Años Completos Cubiertos</span>
                                    <span>{resultado.aniosCompletos}</span>
                                </div>
                                <div className="flex justify-between mx-2 pb-1 text-white/60 text-sm">
                                    <span>Meses Irregulares Extras</span>
                                    <span>{resultado.mesesRestantes}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-5 rounded-xl border border-[var(--color-accent)]/20 flex flex-col justify-center">
                            <span className="text-xs font-bold text-[var(--color-accent)] mb-2 uppercase block">Ganancia Pura de Intereses (A su favor)</span>
                            <span className="text-3xl block font-mono font-bold text-orange-400">+ ${fmtMXN(resultado.interesDevengado)}</span>
                            <p className="text-[10px] text-white/40 mt-3">Para hacerlos valer frente al juez, deberás presentar un escrito llamado <strong>"Incidente de Liquidación de Intereses"</strong> anexando el conteo de estos {resultado.diasMora} días desglosados.</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
