'use client'
import { useState, useMemo } from 'react'
import { format, addYears, addDays, isBefore, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CalculadoraPrescripcionUniversal() {
    const [materia, setMateria] = useState('pagare')
    const [fechaSuceso, setFechaSuceso] = useState('2020-01-01')
    const [penalMediaArimetica, setPenalMediaArimetica] = useState('5') // Años de cárcel media
    const [tarjetaCredito, setTarjetaCredito] = useState(false)

    const materiasInfo: Record<string, { label: string, desc: string }> = {
        'pagare': { label: 'Pagaré (Acción Cambiaria Directa)', desc: 'Cobro de título de crédito suscrito.' },
        'mercantil_ord': { label: 'Deuda Mercantil Común', desc: 'Facturas, contratos mercantiles sin título de crédito.' },
        'civil_deuda': { label: 'Deuda Civil / Préstamo Ocasional', desc: 'Mutuo sin interés, contratos civiles generales.' },
        'civil_rentas': { label: 'Rentas / Arrendamiento', desc: 'Cobro de pensiones o rentas atrasadas.' },
        'laboral_despido': { label: 'Demanda por Despido Injustificado', desc: 'Plazo para demandar ante Conciliación/Tribunal.' },
        'fiscal_sat': { label: 'Crédito Fiscal (Adeudo SAT)', desc: 'Tiempo que tiene el SAT para cobrarte una deuda firme.' },
        'penal_ordinaria': { label: 'Delito (Prescripción de la Acción Penal)', desc: 'Querella o denuncia para que la fiscalía investigue.' }
    }

    const resultado = useMemo(() => {
        if (!fechaSuceso) return null

        const fechaBase = new Date(fechaSuceso)
        const hoy = new Date()

        let limite: Date | null = null
        let textoFundamento = ''
        let aniosPlazo = 0

        switch (materia) {
            case 'pagare':
                // Art. 165 Fracc I LGTOC: 3 años desde su vencimiento.
                aniosPlazo = 3
                limite = addYears(fechaBase, aniosPlazo)
                textoFundamento = 'Artículo 165 Fracción I de la Ley General de Títulos y Operaciones de Crédito prescribe en 3 años.'
                break;
            case 'mercantil_ord':
                // Art. 1047 C.Com: 10 años ordinaria.
                aniosPlazo = 10
                if (tarjetaCredito) {
                    aniosPlazo = 3 // Art 1043 Fr 1 CCom mercaderías, pero TC/Banco suele pelearse vía 10 años como mercantil genérico, o 3 años como intereses. Tomaremos el genérico CCom 1047: 10 años.
                    aniosPlazo = 10
                    textoFundamento = 'Artículo 1047 del Código de Comercio: Prescripción ordinaria mercantil es de 10 años (Típico en deudas bancarias puras no soportadas en títulos).'
                } else {
                    textoFundamento = 'Artículo 1047 del Código de Comercio: Prescripción ordinaria mercantil es de 10 años.'
                }
                limite = addYears(fechaBase, aniosPlazo)
                break;
            case 'civil_deuda':
                // Art. 1159 CCF: 10 años regla general.
                aniosPlazo = 10
                limite = addYears(fechaBase, aniosPlazo)
                textoFundamento = 'Artículo 1159 del Código Civil Federal: Fuera de los casos de excepción, se necesita el lapso de diez años.'
                break;
            case 'civil_rentas':
                // Art. 1162 CCF: 5 años para rentas y anualidades.
                aniosPlazo = 5
                limite = addYears(fechaBase, aniosPlazo)
                textoFundamento = 'Artículo 1162 del Código Civil Federal: Las pensiones, rentas, alquileres y prestacionales periódicas prescriben en 5 años.'
                break;
            case 'laboral_despido':
                // Art. 518 LFT: 2 meses.
                limite = addDays(fechaBase, 60) // Legalmente es meses, aproximamos a 60 días para la herramienta rápida.
                textoFundamento = 'Artículo 518 de la Ley Federal del Trabajo: Prescriben en dos meses las acciones para exigir reinstalación o indemnización.'
                break;
            case 'fiscal_sat':
                // Art. 146 CFF: 5 años.
                aniosPlazo = 5
                limite = addYears(fechaBase, aniosPlazo)
                textoFundamento = 'Artículo 146 del Código Fiscal de la Federación: El crédito fiscal se extingue por prescripción en el término de cinco años.'
                break;
            case 'penal_ordinaria':
                // Art. 105 CPF: Término medio aritmético de la pena privativa, no menor a 3 años.
                const media = parseFloat(penalMediaArimetica) || 0
                aniosPlazo = Math.max(media, 3)
                limite = addYears(fechaBase, aniosPlazo)
                textoFundamento = 'Artículo 105 del Código Penal Federal: La acción penal prescribe en un plazo igual al término medio aritmético de la pena, o nunca menor a tres años.'
                break;
        }

        if (!limite) return null

        const yaPrescribio = isAfter(hoy, limite)

        return {
            limiteFormateado: format(limite, "dd 'de' MMMM 'de' yyyy", { locale: es }),
            textoFundamento,
            yaPrescribio,
            aniosPlazo
        }

    }, [materia, fechaSuceso, penalMediaArimetica, tarjetaCredito])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⏳</span><span>Todas las Materias</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Prescripción Universal</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Te están cobrando una deuda viejísima? ¿Quieres demandar un despido pero pasó tiempo? Descubre si por ley el derecho o la deuda ya <strong className="text-white">caducó / prescribió</strong>.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Qué intentas prescribir?</label>
                        <select value={materia} onChange={e => setMateria(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {Object.entries(materiasInfo).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <p className="text-[10px] text-[var(--color-accent)] mt-1">{materiasInfo[materia].desc}</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha en que ocurrió o venció</label>
                        <input type="date" value={fechaSuceso} onChange={e => setFechaSuceso(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Día de impago del pagaré, día de despido, día del delito.</p>
                    </div>
                </div>

                {materia === 'mercantil_ord' && (
                    <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5 w-full items-center mt-2">
                        <input type="checkbox" checked={tarjetaCredito} onChange={e => setTarjetaCredito(e.target.checked)} className="w-4 h-4" />
                        <span className="text-xs font-bold text-white">Es deuda de Tarjeta de Crédito Bancaria</span>
                    </label>
                )}

                {materia === 'penal_ordinaria' && (
                    <div className="mt-2">
                        <label className="block text-xs text-orange-400 mb-1.5 font-semibold">Suma Pena Mínima + Máxima del Delito, divídela en 2 (Término Medio en Años):</label>
                        <input type="number" step="0.5" value={penalMediaArimetica} onChange={e => setPenalMediaArimetica(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold focus:outline-none" />
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-8 rounded-2xl max-w-2xl mx-auto text-center border-t-4" style={{ borderColor: resultado.yaPrescribio ? '#34d399' : '#f87171' }}>
                    <div className="mb-4">
                        {resultado.yaPrescribio ? (
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 text-4xl mb-2">🎉</div>
                        ) : (
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-4xl mb-2">🚨</div>
                        )}
                        <h2 className={`text-2xl font-bold ${resultado.yaPrescribio ? 'text-emerald-400' : 'text-red-400'}`}>
                            {resultado.yaPrescribio ? '¡Ya ha Prescrito!' : 'Aún NO Prescribe'}
                        </h2>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl mt-4">
                        <p className="text-sm text-white/60 font-bold mb-1">Fecha límite de exigibilidad legal:</p>
                        <p className="text-2xl font-mono text-white capitalize">{resultado.limiteFormateado}</p>
                    </div>

                    <div className="mt-6 text-left p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                        <p className="text-[var(--color-accent)] font-bold mb-1">📖 Fundamento Legal:</p>
                        <p className="text-white/80">{resultado.textoFundamento}</p>
                    </div>

                    <p className="text-[10px] text-white/30 text-center mt-6">
                        🚨 Advertencia: La prescripción se <strong className="text-white/50">interrumpe</strong> si firmaste un convenio, te notificaron demanda o reconociste la deuda (Art. 1041 CCom / Art. 1168 CCF). Esta calculadora asume inactividad total desde la fecha ingresada.
                    </p>
                </div>
            )}
        </main>
    )
}
