'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

export default function CalculadoraMultaPenal() {
    const [diasMulta, setDiasMulta] = useState('500')
    const [delitoReferencia, setDelitoReferencia] = useState('fraude')
    const [anioDelito, setAnioDelito] = useState('2026') // El año en el que se CONSUMÓ el delito

    // Regla Penal Art 29 CPF: 
    // "La multa consiste en el pago de una cantidad de dinero al Estado... 
    // El día multa equivale a la percepción neta del sentenciado PERO el límite inferior 
    // será el equivalente a la Unidad de Medida y Actualización diaria vigente 
    // en el momento de consumarse el delito. 
    // NOTA: Para efectos prácticos y por "indubio pro reo", los jueces suelen cuantificar los "Días Multa" a valor de 1 UMA Diaria, a menos que el infractor sea de muy altos ingresos.
    const [ingresoPersonalDiario, setIngresoPersonalDiario] = useState('') // Opcional para individualización real

    const resultado = useMemo(() => {
        const dias = parseFloat(diasMulta) || 0
        const valorUMADiaria = getUMA(parseInt(anioDelito)).diaria

        let cuotaDiariaAImponer = valorUMADiaria
        let justificacionCuota = 'Cuota Básica Constitucional (Umbral Inferior de 1 UMA Diaria)'
        let esProReo = true

        const ingresoDiarioReal = parseFloat(ingresoPersonalDiario) || 0

        // Si el ingreso diario demostrado en la sentencia es mayor a la UMA, el juez PUEDE individualizar la multa usando ese cuota superior hasta donde dicte el tipo penal
        if (ingresoDiarioReal > valorUMADiaria) {
            cuotaDiariaAImponer = ingresoDiarioReal
            justificacionCuota = `Cuota Particularizada basada en Ingresos Netos Comprobados (Art. 29 CPF)`
            esProReo = false
        }

        const multaTotal = dias * cuotaDiariaAImponer

        let rangoSugerido = ''
        if (delitoReferencia === 'fraude') rangoSugerido = 'Penalidad Común: de 30 a 120 días multa.'
        if (delitoReferencia === 'narcotrafico') rangoSugerido = 'Alta Penalidad: de 100 a 500 días multa.'
        if (delitoReferencia === 'robo') rangoSugerido = 'Variable: hasta 500 días multa en robo agravado.'

        const esMultaGrave = multaTotal > (valorUMADiaria * 1000)

        return {
            dias,
            cuotaDiariaAImponer,
            justificacionCuota,
            multaTotal,
            esProReo,
            rangoSugerido,
            esMultaGrave,
            valorUMADiaria
        }

    }, [diasMulta, delitoReferencia, anioDelito, ingresoPersonalDiario])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Sentencias Condenatorias · Multa Pública</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Cálculo de <span className="gradient-gold">Días Multa Penales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Aparte de la privación de libertad (Prisión) y devolverle a la víctima lo robado (Reparación), el Estado condena al agresor a pagar una **Sanción Pecuniaria (Multa Pública)** tasada en "Días".
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            ¿A cuántos "Días Multa" te ha condenado el Código Penal?
                        </label>
                        <input type="number" value={diasMulta} onChange={e => setDiasMulta(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-3xl focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[10px] text-white/50 mt-1">Busca en tu sentencia o en el Código la pena que dice "Y multa de Cincuenta a Quinientos Días".</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-blue-300 font-bold mb-1.5">
                                Año en que se COMETIÓ el delito (Vital para el Art 29 CPF)
                            </label>
                            <select value={anioDelito} onChange={e => setAnioDelito(e.target.value)}
                                className="w-full p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 focus:outline-none">
                                <option value="2026">2026 - Año del ilícito</option>
                                <option value="2025">2025 - Juicios Atrasados</option>
                                <option value="2024">2024 o Anterior</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] font-semibold mb-1.5">
                                Opcional: Ingreso Diario Nominal Comprobado ($)
                            </label>
                            <input type="number" placeholder={`Déjalo en blanco para usar la UMA (${fmtMXN(getUMA(parseInt(anioDelito)).diaria)})`} value={ingresoPersonalDiario} onChange={e => setIngresoPersonalDiario(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <label className="block text-xs text-[var(--color-text-muted)] font-semibold mb-2">Para darte perspectiva, ¿Qué ilícito analizas?</label>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {['fraude', 'robo', 'narcotrafico', 'otro'].map(tipo => (
                            <button key={tipo} onClick={() => setDelitoReferencia(tipo)} className={`px-4 py-2 rounded-lg border capitalize transition-colors ${delitoReferencia === tipo ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-[#0f172a] border-white/10 text-white/70'}`}>
                                {tipo}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className="glass-card p-8 rounded-2xl text-center shadow-lg border-2 border-slate-700 bg-gradient-to-br from-slate-900 to-black">
                        <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-wider">Sanción Pecuniaria Definitiva a Pagar a Tesorería</p>
                        <p className={`text-5xl md:text-6xl font-mono font-bold my-3 ${resultado.esMultaGrave ? 'text-red-500' : 'text-gray-300'}`}>
                            ${fmtMXN(resultado.multaTotal)}
                        </p>
                        <div className="mt-2 text-[10px] text-white/50 font-mono">
                            Matemática Penal: {resultado.dias} Días x ${resultado.cuotaDiariaAImponer.toFixed(2)} Cuota Diaria = Sanción Exacta
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-[var(--color-accent)]/20 shadow-inner">
                            <span className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent)] block mb-2 uppercase">
                                ⚖️ Individualización Judicial (Art 29)
                            </span>
                            <p className="text-sm text-white/90 leading-relaxed font-bold">
                                {resultado.justificacionCuota}
                            </p>
                            <p className="text-[11px] text-white/60 mt-3 pt-3 border-t border-white/5">
                                {resultado.esProReo ?
                                    `Al carecer de pruebas sobre las fortunas ocultas del indiciado, o tratarse de un jornalero, la jurisprudencia dicta que se tasará cada día multa usando íntegramente el valor de 1 UMA ($${fmtMXN(resultado.valorUMADiaria)}) imperante temporalmente EN EL DÍA DE LOS HECHOS, no en el momento de la condena.` :
                                    'El Ministerio Público logró comprobar que las cuentas bancarias o ingresos del indiciado superan la UMA libre, por tanto la pena pecuniaria se agrava de oficio sin rebasar su tope de ingreso neto lícito.'}
                            </p>
                        </div>

                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 flex flex-col justify-center text-center">
                            <span className="text-xs font-bold text-white/50 block mb-2 uppercase">Glosario Penal y Permutas</span>
                            <div className="text-[11px] text-white/70 italic leading-relaxed text-justify mt-2 space-y-3">
                                <b>Importante:</b> Esta Multa Pública Federal NO es en favor de la víctima, este dinero ingresa al erario para financiar infraestructura penitenciaria. <br /><br />
                                <b>Impago (Art 29 CPF):</b> Si el sentenciado se niega a pagarla, el Juez está facultado para EMBARGARLE propiedades formalmente por el procedimiento coactivo, o exigirle Tareas Comunitarias Forzadas No Remuneradas hasta extinguir el crédito estatal.
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
