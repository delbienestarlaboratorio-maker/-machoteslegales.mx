'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

export default function CalculadoraUMA() {
    const [cantidadUnidades, setCantidadUnidades] = useState('100')
    const [modo, setModo] = useState<'a_pesos' | 'a_umas'>('a_pesos')
    const [anio, setAnio] = useState('2026') // Último año disponible
    const [tipoUMA, setTipoUMA] = useState<'diario' | 'mensual' | 'anual'>('diario')

    const resultado = useMemo(() => {
        const cantidad = parseFloat(cantidadUnidades) || 0
        const valorUMA = getUMA(parseInt(anio))

        // Determinar qué valor UMA usar (aunque la mayoría de leyes usa el Diario para multas)
        let factor = valorUMA.diaria
        let leyendaFactor = `1 UMA Diaria = ${fmtMXN(factor)}`

        if (tipoUMA === 'mensual') {
            factor = valorUMA.mensual
            leyendaFactor = `1 UMA Mensual = ${fmtMXN(factor)}`
        } else if (tipoUMA === 'anual') {
            factor = valorUMA.anual
            leyendaFactor = `1 UMA Anual = ${fmtMXN(factor)}`
        }

        let resultadoFinal = 0
        let textoPrincipal = ''
        let unidadSufijo = ''

        if (modo === 'a_pesos') {
            resultadoFinal = cantidad * factor
            textoPrincipal = 'Monto Convertido en Pesos Mexicanos'
            unidadSufijo = 'MXN'
        } else {
            resultadoFinal = cantidad / factor
            textoPrincipal = 'Equivalencia Legal en Unidades'
            unidadSufijo = 'UMAs'
        }

        return {
            resultadoFinal,
            textoPrincipal,
            unidadSufijo,
            leyendaFactor,
            anio
        }

    }, [cantidadUnidades, modo, anio, tipoUMA])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🔄</span><span>Herramientas Financieras · Conversor General</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora Universal: <span className="gradient-gold">UMA a Pesos</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La Unidad de Medida y Actualización (UMA) es la referencia económica en pesos creada para sustituir al Salario Mínimo en el pago de obligaciones (multas, créditos Infonavit, deducciones).
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/10 mx-auto max-w-md">
                    <button onClick={() => setModo('a_pesos')} className={`flex-1 p-3 text-sm font-bold rounded-lg transition-colors ${modo === 'a_pesos' ? 'bg-[var(--color-accent)] text-black' : 'text-white/70 hover:text-white'}`}>
                        Tengo UMAs → Quiero Pesos
                    </button>
                    <button onClick={() => setModo('a_umas')} className={`flex-1 p-3 text-sm font-bold rounded-lg transition-colors ${modo === 'a_umas' ? 'bg-[var(--color-accent)] text-black' : 'text-white/70 hover:text-white'}`}>
                        Tengo Pesos → A cuántas UMAs equivale
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-center">
                            {modo === 'a_pesos' ? 'Cantidad de UMAs a Convertir (Ej. Multa de 100 UMAs)' : 'Monto en Pesos de tu Recibo/Obligación ($)'}
                        </label>
                        <input type="number" value={cantidadUnidades} onChange={e => setCantidadUnidades(e.target.value)}
                            className="w-full p-4 text-center rounded-xl bg-white/5 border border-white/10 text-white font-mono text-3xl focus:border-[var(--color-accent)] outline-none" />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Factor de Cálculo UMA</label>
                            <select value={tipoUMA} onChange={e => setTipoUMA(e.target.value as any)}
                                className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                                <option value="diario">UMA Diaria (Usada para el 99% de las Multas)</option>
                                <option value="mensual">UMA Mensual (Topes Exención ISR, Pensiones)</option>
                                <option value="anual">UMA Anual (Cálculos de Hipotecas y Créditos)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor Oficial del Año</label>
                            <select value={anio} onChange={e => setAnio(e.target.value)}
                                className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                                <option value="2026">2026 (Febrero a Enero 2027)</option>
                                <option value="2025">2025 (Histórico)</option>
                                <option value="2024">2024 (Histórico)</option>
                                <option value="2023">2023 (Histórico)</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="glass-card p-8 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-[var(--color-accent)]/20 shadow-lg shadow-[var(--color-accent)]/5">
                        <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-wide">{resultado.textoPrincipal}</p>
                        <p className="text-5xl md:text-6xl font-mono font-bold text-[var(--color-accent)] my-3">
                            {modo === 'a_pesos' ? '$' : ''}{modo === 'a_pesos' ? fmtMXN(resultado.resultadoFinal) : resultado.resultadoFinal.toFixed(2)} {modo === 'a_umas' ? 'UMAs' : ''}
                        </p>

                        <div className="mt-4 inline-flex px-4 py-2 bg-[#0f172a] rounded-xl border border-white/10 text-white/80 font-mono text-sm max-w-xs justify-center mx-auto shadow-inner">
                            🎯 {resultado.leyendaFactor} (Año {resultado.anio})
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 text-center">
                            <span className="text-xs font-bold text-[var(--color-accent)] block mb-2 uppercase">¿Por qué usamos UMA y no Salarios Mínimos?</span>
                            <p className="text-[11px] text-white/70 leading-relaxed">
                                En 2016 se reformó la Constitución Política (Art. 26 B) para "desindexar" el Salario Mínimo. Esto significa que cuando el gobierno aumenta drásticamente el salario mínimo para beneficiar a los trabajadores, evitar que las multas de tránsito y las deudas fiscales se disparen injustamente en la misma proporción.
                            </p>
                        </div>

                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 text-center flex flex-col justify-center">
                            <span className="text-xs font-bold text-white/50 block mb-2 uppercase">Vigencia del Calendario Diario</span>
                            <p className="text-sm text-white/90 leading-relaxed font-mono">
                                A diferencia del año calendario, el valor publicado de la UMA por cuenta del INEGI entra en vigor oficial el <b>1 de Febrero</b> de cada año y expira el 31 de Enero del siguiente.
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
