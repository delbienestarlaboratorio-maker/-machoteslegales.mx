'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraActualizacionINPC() {
    const [cantidadHistorica, setCantidadHistorica] = useState('150000') // Deuda base
    // Ya que no tenemos una DB gigantesca conectada on-the-fly con todo el històrico de tabuladores mensuales de INEGI desde 1990
    // Usaremos un modo SIMULADOR (inflacion anualada base 5%) o un modo EXACTO manual.
    const [modoCalculo, setModoCalculo] = useState<'simulador_anual' | 'inpc_exacto'>('inpc_exacto')

    // Modo Analítico (Exacto art 17 CFF)
    const [inpcAntiguo, setInpcAntiguo] = useState('110.230') // Mes en que ocurrio deuda
    const [inpcReciente, setInpcReciente] = useState('131.780') // Mes mas reciente previo al pago

    // Modo Anualizado Ciego
    const [aniosTranscurridos, setAniosTranscurridos] = useState('3')
    const [inflacionPromedio, setInflacionPromedio] = useState('5') // 5% promedio històrico

    const resultado = useMemo(() => {
        const principalOriginal = parseFloat(cantidadHistorica) || 0
        let factorActualizacion = 1.0000
        let valorPresenteHistorico = principalOriginal
        let justificacionMatematica = ''

        if (modoCalculo === 'inpc_exacto') {
            // Art 17-A CFF
            // Factor = INPC del mes más reciente / INPC de mes antiguo. Truncado a 4 decimas legales.
            const reciente = parseFloat(inpcReciente) || 1
            const antiguo = parseFloat(inpcAntiguo) || 1
            let ratioFloat = reciente / antiguo
            if (ratioFloat < 1) ratioFloat = 1 // La ley prohibe deflation para efectos tributarios de castigo. (Raro q aplique)

            // Truncar a 4 decimales
            factorActualizacion = Math.floor(ratioFloat * 10000) / 10000

            valorPresenteHistorico = principalOriginal * factorActualizacion
            justificacionMatematica = `Cálculo Art 17-A CFF exacto: Dividir INPC Reciente (${reciente.toFixed(4)}) ➗ INPC Antiguo (${antiguo.toFixed(4)}). El Factor oficial es de ${factorActualizacion.toFixed(4)}.`
        } else {
            // Cálculo estimado simulando interés compuesto inflacionario
            const aTranscurridos = parseInt(aniosTranscurridos) || 0
            const tasaInf = parseFloat(inflacionPromedio) / 100 || 0

            factorActualizacion = Math.pow(1 + tasaInf, aTranscurridos)

            valorPresenteHistorico = principalOriginal * factorActualizacion
            justificacionMatematica = `Simulación por interés compuesto indexable. Inflación anualizada sostenida del ${inflacionPromedio}% a capitalización por ${aTranscurridos} años transcurridos. Factor sintético equivalente: ${factorActualizacion.toFixed(4)}.`
        }

        const depreciacionSufrida = valorPresenteHistorico - principalOriginal
        const porcentajeDegradacion = (factorActualizacion - 1) * 100

        return {
            principalOriginal,
            factorActualizacion,
            valorPresenteHistorico,
            justificacionMatematica,
            depreciacionSufrida,
            porcentajeDegradacion
        }

    }, [cantidadHistorica, modoCalculo, inpcAntiguo, inpcReciente, aniosTranscurridos, inflacionPromedio])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📈</span><span>Matemática Financiera · Art 17-A CFF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Factor de Actualización Nacional <span className="gradient-gold">INPC</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El dinero del 2018 no vale lo mismo hoy. Los jueces y el SAT exigen que las deudas viejas sean "Actualizadas" trayéndolas a Valor Presente usando los precios reportados por el INEGI.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/10 mx-auto max-w-sm">
                    <button onClick={() => setModoCalculo('inpc_exacto')} className={`flex-1 p-3 text-xs font-bold rounded-lg transition-colors ${modoCalculo === 'inpc_exacto' ? 'bg-orange-600' : 'text-white/70 hover:text-white'}`}>
                        Modo CFF (Indices Exactos)
                    </button>
                    <button onClick={() => setModoCalculo('simulador_anual')} className={`flex-1 p-3 text-xs font-bold rounded-lg transition-colors ${modoCalculo === 'simulador_anual' ? 'bg-[var(--color-accent)] text-black' : 'text-white/70 hover:text-white'}`}>
                        Simulador Proyectado %
                    </button>
                </div>

                <div className="pt-2">
                    <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold text-center">Deuda Histórica / Cantidad del Pasado Congelada</label>
                    <input type="number" value={cantidadHistorica} onChange={e => setCantidadHistorica(e.target.value)}
                        className="w-full text-center p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-3xl focus:border-[var(--color-accent)] outline-none" />
                </div>

                {modoCalculo === 'inpc_exacto' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 animate-fade-in shadow-inner bg-black/20 p-4 rounded-xl">
                        <div>
                            <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold text-orange-200">
                                🗃️ INPC Antiguo (INPC del mes más antiguo donde nació la obligación)
                            </label>
                            <input type="number" step="0.001" value={inpcAntiguo} onChange={e => setInpcAntiguo(e.target.value)}
                                className="w-full p-3 rounded-xl bg-orange-900/10 border border-orange-500/30 text-white font-mono text-xl focus:border-orange-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold text-green-200">
                                📅 INPC Reciente (INPC del mes anterior a efectuar el pago en la actualidad)
                            </label>
                            <input type="number" step="0.001" value={inpcReciente} onChange={e => setInpcReciente(e.target.value)}
                                className="w-full p-3 rounded-xl bg-green-900/10 border border-green-500/30 text-white font-mono text-xl focus:border-green-500 outline-none" />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 animate-fade-in shadow-inner bg-black/20 p-4 rounded-xl">
                        <div>
                            <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold text-[var(--color-accent)]">
                                Años Transcurridos desde el Adeudo Omitido
                            </label>
                            <input type="number" value={aniosTranscurridos} onChange={e => setAniosTranscurridos(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        </div>

                        <div>
                            <label className="block text-[11px] text-[var(--color-text-muted)] mb-1.5 font-semibold text-[var(--color-accent)]">
                                Tasa de Inflación Media Anual Estimada Histórica (%)
                            </label>
                            <input type="number" step="0.5" value={inflacionPromedio} onChange={e => setInflacionPromedio(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="glass-card p-8 rounded-2xl text-center shadow-lg border-2 border-slate-700 bg-gradient-to-t from-slate-900/40 to-[#020817] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 font-mono font-bold text-6xl text-white/5 right-10 top-0 pointer-events-none select-none">
                            x{resultado.factorActualizacion.toFixed(4)}
                        </div>
                        <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest flex justify-center items-center gap-2">
                            Monto a Reclamar a Valor de Moneda Presente (Actualizado)
                        </p>
                        <p className={`text-4xl md:text-5xl font-mono font-bold my-4 ${modoCalculo === 'inpc_exacto' ? 'text-orange-400' : 'text-[var(--color-accent)]'}`}>
                            ${fmtMXN(resultado.valorPresenteHistorico)}
                        </p>
                        <div className="mt-2 text-[10px] text-white/40 font-mono">
                            Deuda Base ${fmtMXN(resultado.principalOriginal)}  +  Interés Inflacionario Implícito ${fmtMXN(resultado.depreciacionSufrida)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                            <span className="text-xs font-bold text-blue-400 block mb-3 uppercase tracking-wide">Desglose Legal Tributario</span>
                            <ul className="space-y-3 text-[11px] text-white/80 leading-relaxed font-mono">
                                <li className="flex items-start gap-2">
                                    <span className="text-white/50 shrink-0">■</span>
                                    <span>{resultado.justificacionMatematica}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-white/50 shrink-0">■</span>
                                    <span>Degradación Histórica del Valor Dinero: <b>+{resultado.porcentajeDegradacion.toFixed(2)}%</b> de devaluación resarcida.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 flex flex-col justify-center text-center text-[10px] text-white/50 leading-relaxed">
                            <b>Actualización NO es Recargo ni Interés Moratorio. </b><br /><br />
                            Los tribunales han dictaminado repetidas veces que el Factor INPC únicamente restituye el poder adquisitivo perdido por el tiempo. Al demandar, tú pides la cantidad Actualizada + (Los intereses Moratorios aparte o el % por recargos).
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
