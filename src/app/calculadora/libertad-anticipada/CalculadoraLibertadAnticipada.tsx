'use client'
import { useState, useMemo } from 'react'
import { addYears, addDays, parseISO, isValid, format, isAfter, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CalculadoraLibertadAnticipada() {
    const [aniosCondena, setAniosCondena] = useState('10')
    const [mesesCondena, setMesesCondena] = useState('0')
    const [fechaDetencion, setFechaDetencion] = useState('2020-01-01')

    // Filtros restrictivos de la LNEP y Art 19 Const.
    const [delitoGrave, setDelitoGrave] = useState(false) // Secuestro, Trata, Delincuencia Organizada
    const [buenaConducta, setBuenaConducta] = useState(true)
    const [pagoReparacion, setPagoReparacion] = useState(true)

    const resultado = useMemo(() => {
        const dDetencion = parseISO(fechaDetencion)
        if (!isValid(dDetencion)) return null

        const anios = parseInt(aniosCondena) || 0
        const meses = parseInt(mesesCondena) || 0
        const totalDiasCondena = (anios * 365.25) + (meses * 30.4)

        const fechaFinAbsoluta = addDays(dDetencion, totalDiasCondena)

        // Libertad Condicionada (Art. 136 LNEP) -> 50%
        // Libertad Anticipada (Art. 141 LNEP) -> 70% (Remisión parcial / Condonación total de la pena)

        let porcentajeCondicionada = 0.50
        let porcentajeAnticipada = 0.70

        const diasParaCondicionada = totalDiasCondena * porcentajeCondicionada
        const diasParaAnticipada = totalDiasCondena * porcentajeAnticipada

        const fechaCondicionada = addDays(dDetencion, diasParaCondicionada)
        const fechaAnticipada = addDays(dDetencion, diasParaAnticipada)

        const hoy = new Date()
        const cumpleCondicionadaPorTiempo = isAfter(hoy, fechaCondicionada)
        const cumpleAnticipadaPorTiempo = isAfter(hoy, fechaAnticipada)

        // Verificadores LNEP
        const prohibidoPorDelito = delitoGrave
        const bloqueadoPorRequisitos = !buenaConducta || !pagoReparacion

        let estatusGeneral = ''
        let colorEstatus = ''

        if (prohibidoPorDelito) {
            estatusGeneral = 'PROHIBIDO POR LA CONSTITUCIÓN (DELITO GRAVE)'
            colorEstatus = 'text-red-500'
        } else if (bloqueadoPorRequisitos) {
            estatusGeneral = 'BLOQUEADO: Faltan Requisitos (Conducta o Pago)'
            colorEstatus = 'text-orange-500'
        } else if (cumpleAnticipadaPorTiempo) {
            estatusGeneral = 'ELEGIBLE PARA LIBERTAD ANTICIPADA (70%)'
            colorEstatus = 'text-green-400'
        } else if (cumpleCondicionadaPorTiempo) {
            estatusGeneral = 'ELEGIBLE PARA LIBERTAD CONDICIONADA (50%)'
            colorEstatus = 'text-yellow-400'
        } else {
            estatusGeneral = 'EN TIEMPO DE ESPERA (No alcanza % legal)'
            colorEstatus = 'text-white/50'
        }

        const diasCompletados = differenceInDays(hoy, dDetencion)
        const porcentajeCompletado = Math.min((diasCompletados / totalDiasCondena) * 100, 100)

        return {
            fechaFinAbsoluta: format(fechaFinAbsoluta, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }),
            fechaCondicionada: format(fechaCondicionada, "dd/MM/yyyy"),
            fechaAnticipada: format(fechaAnticipada, "dd/MM/yyyy"),
            estatusGeneral,
            colorEstatus,
            prohibidoPorDelito,
            bloqueadoPorRequisitos,
            porcentajeCompletado: porcentajeCompletado.toFixed(1)
        }

    }, [aniosCondena, mesesCondena, fechaDetencion, delitoGrave, buenaConducta, pagoReparacion])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🗝️</span><span>Derecho Penitenciario · LNEP</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Beneficios Preliberacionales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La prisión no siempre se cumple completa. La Ley Nacional de Ejecución Penal premia la readaptación permitiendo salir libres a la mitad (Condicionada) o al 70% del tiempo (Anticipada).
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            ⚖️ Tiempo Total de la Sentencia Ordenada
                        </label>
                        <div className="flex gap-2">
                            <input type="number" placeholder="Años" value={aniosCondena} onChange={e => setAniosCondena(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] outline-none" />
                            <input type="number" placeholder="Meses" value={mesesCondena} onChange={e => setMesesCondena(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            ⏰ Fecha de Aprehensión / Detención Inicial
                        </label>
                        <input type="date" value={fechaDetencion} onChange={e => setFechaDetencion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-100 focus:outline-none focus:border-blue-400 [color-scheme:dark]" />
                        <p className="text-[10px] text-white/40 mt-1">El reloj cuenta desde el minuto 1 de la detención, incluyendo el arraigo y prisión preventiva oficiosa.</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                    <label className="block text-xs text-[var(--color-text-muted)] font-semibold text-center mb-2">Exclusiones y Requisitos Obligatorios</label>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                        <div className="text-sm text-red-100">🚫 ¿El delito es Secuestro, Trata de Personas, o Delincuencia Organizada?</div>
                        <input type="checkbox" className="w-5 h-5 accent-red-500" checked={delitoGrave} onChange={e => setDelitoGrave(e.target.checked)} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                        <div className="text-sm text-green-100">✅ ¿Ha tenido Buena Conducta y participado en actividades educativas?</div>
                        <input type="checkbox" className="w-5 h-5 accent-green-500" checked={buenaConducta} onChange={e => setBuenaConducta(e.target.checked)} />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
                        <div className="text-sm text-blue-100">💸 ¿Ya pagó la multa y la Reparación del Daño a la víctima?</div>
                        <input type="checkbox" className="w-5 h-5 accent-blue-500" checked={pagoReparacion} onChange={e => setPagoReparacion(e.target.checked)} />
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-[var(--color-accent)]/20">
                        <p className="text-sm font-bold text-white/50 mb-1">Estatus Actual del Interno</p>
                        <p className={`text-xl md:text-2xl font-bold uppercase ${resultado.colorEstatus} my-2`}>
                            {resultado.estatusGeneral}
                        </p>

                        <div className="w-full bg-black/50 rounded-full h-4 mt-6 border border-white/10 overflow-hidden">
                            <div className="bg-[var(--color-accent)] h-4 transition-all duration-1000 relative" style={{ width: `${Math.max(0, parseFloat(resultado.porcentajeCompletado))}%` }}>
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('/grid.svg')] opacity-30"></div>
                            </div>
                        </div>
                        <p className="text-xs text-white/50 mt-2 font-mono">{resultado.porcentajeCompletado}% de la pena compurgada al día de hoy</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className={`bg-[#0f172a] p-5 rounded-xl border ${resultado.prohibidoPorDelito ? 'border-red-500/30 opacity-50' : 'border-yellow-500/30'}`}>
                            <span className="text-xs font-bold text-yellow-500 block mb-2 uppercase">🔓 Libertad Condicionada (50%)</span>
                            <span className="text-2xl font-mono text-white block">{resultado.fechaCondicionada}</span>
                            <p className="mt-2 text-[10px] text-white/60">Modalidad Art 136: Se sale de prisión con brazalete electrónico o medidas estrictas de supervisión extra-muros.</p>
                        </div>

                        <div className={`bg-[#0f172a] p-5 rounded-xl border ${resultado.prohibidoPorDelito ? 'border-red-500/30 opacity-50' : 'border-green-500/30'}`}>
                            <span className="text-xs font-bold text-green-500 block mb-2 uppercase">🕊️ Libertad Anticipada (70%)</span>
                            <span className="text-2xl font-mono text-white block">{resultado.fechaAnticipada}</span>
                            <p className="mt-2 text-[10px] text-white/60">Modalidad Art 141: Extingue por completo la pena de prisión. Liberación total y definitiva. Fin de la reclusión.</p>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <span className="text-xs font-semibold text-white/50 border border-white/10 bg-white/5 px-4 py-1 rounded-full">
                            Cierre Absoluto (Compurgación 100%): <b>{resultado.fechaFinAbsoluta}</b>
                        </span>
                    </div>

                    {resultado.prohibidoPorDelito && (
                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-xs text-red-200 text-center animate-fade-in">
                            🔥 <b>PROHIBIDO (Art. 137 LNEP y Art. 19 Constitucional):</b> Quien esté sentenciado por Secuestro, Trata o Crimen Organizado, deberá cumplir su condena hasta el ultimísimo día en reclusión. <b>CERO BENEFICIOS.</b>
                        </div>
                    )}
                    {resultado.bloqueadoPorRequisitos && !resultado.prohibidoPorDelito && (
                        <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-xl text-xs text-orange-200 text-center animate-fade-in">
                            ⚠️ <b>TE FALTA UN REQUISITO:</b> Aunque llegues al 50% o al 70% del tiempo, el Juez de Ejecución te NEGARÁ la libertad de la cárcel si adentro eres un interno problemático (malos reportes de conducta) o si tu familia no junta el dinero para pagarle a la víctima la Reparación del Daño sentenciada.
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}
