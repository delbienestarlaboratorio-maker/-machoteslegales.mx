'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraGastosCustodiaCompartida() {
    const [ingresoPadre1, setIngresoPadre1] = useState('35000') // Quien no tiene la custodia física primaria
    const [ingresoPadre2, setIngresoPadre2] = useState('15000') // Quien suele tener la custodia física
    const [gastoMensualMenores, setGastoMensualMenores] = useState('12000')
    const [valorCuidadoFisico, setValorCuidadoFisico] = useState('5000') // Tiempo y cuidado dedican diariamente

    const resultado = useMemo(() => {
        const i1 = parseFloat(ingresoPadre1) || 0
        const i2 = parseFloat(ingresoPadre2) || 0
        const gastosTotal = parseFloat(gastoMensualMenores) || 0
        const valorCuidado = parseFloat(valorCuidadoFisico) || 0

        const ingresoTotalFormativo = i1 + i2

        if (ingresoTotalFormativo === 0) return null

        // Principio de proporcionalidad: El que gana más aporta mayor porcentaje (no 50-50 forzoso).
        const proporcionPadre1 = i1 / ingresoTotalFormativo
        const proporcionPadre2 = i2 / ingresoTotalFormativo

        let aportacionPadre1 = gastosTotal * proporcionPadre1
        let aportacionPadre2 = gastosTotal * proporcionPadre2

        // Ajuste por Cuidado Directo (SCJN: Quien se queda a cuidar al menor también aporta económicamente con su tiempo)
        // Restamos esa aportación física en especie a su aportación líquida
        const aportacionLiquidaFinalPadre2 = Math.max(aportacionPadre2 - valorCuidado, 0)

        // Lo que el Padre 2 ya no pone líquido, el Padre 1 debe compensarlo si los gastos exigen cubrir el diferencial (o se bajan los gastos del menor)
        // Para simplificar, la "pensión" neta que Padre 1 entrega a Padre 2 para igualar el gasto proyectado es:
        const pensionSugeridaDepositar = gastosTotal - aportacionLiquidaFinalPadre2

        return {
            proporcionPadre1: proporcionPadre1 * 100,
            proporcionPadre2: proporcionPadre2 * 100,
            aportacionJustaPadre1: aportacionPadre1,
            aportacionJustaPadre2: aportacionPadre2,
            aportacionLiquidaFinalPadre2,
            pensionSugeridaDepositar,
            valorCuidado
        }

    }, [ingresoPadre1, ingresoPadre2, gastoMensualMenores, valorCuidadoFisico])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Derecho Familiar · Proporcionalidad</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador Proporcional de <span className="gradient-gold">Gastos de Crianza</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La ley dice que los alimentos no deben dividirse "50/50" a la fuerza. Deben aportarse proporcionalmente al ingreso de cada padre, y debe valuarse monetariamente el trabajo del padre que cuida físicamente a los hijos.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-blue-300">Ingreso Mensual - El que NO tiene la Custodia Directa (Padre A) $</label>
                        <input type="number" value={ingresoPadre1} onChange={e => setIngresoPadre1(e.target.value)}
                            className="w-full p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 font-mono text-lg focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-pink-300">Ingreso Mensual - El que TIENE la Custodia / Los Cuida (Padre B) $</label>
                        <input type="number" value={ingresoPadre2} onChange={e => setIngresoPadre2(e.target.value)}
                            className="w-full p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-200 font-mono text-lg focus:outline-none" />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Gasto Mensual Real de los Menores ($)</label>
                        <input type="number" value={gastoMensualMenores} onChange={e => setGastoMensualMenores(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Suma escuelas, ropa, comidas, actividades extracurriculares de todos los hijos.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-[var(--color-accent)]">Estimación Económica del Trabajo de Cuidados ($)</label>
                        <input type="number" value={valorCuidadoFisico} onChange={e => setValorCuidadoFisico(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] font-mono text-lg focus:outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">¿Cuánto valen las horas que Padre B invierte haciéndoles tareas, guisando y llevándolos al médico en su propio carro?</p>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4 text-center">Desglose Judicial (Art. 311 CC)</h2>

                        <div className="flex h-4 rounded-full overflow-hidden bg-white/10 mb-4">
                            <div style={{ width: `${resultado.proporcionPadre1}%` }} className="bg-blue-500"></div>
                            <div style={{ width: `${resultado.proporcionPadre2}%` }} className="bg-pink-500"></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold mb-6">
                            <span className="text-blue-400">Padre A aporta el {resultado.proporcionPadre1.toFixed(1)}%</span>
                            <span className="text-pink-400">Padre B aporta el {resultado.proporcionPadre2.toFixed(1)}%</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2 text-center">
                                <span className="block text-blue-300 font-bold">Cuota Pura que le Tocaría (Padre A)</span>
                                <span className="block text-2xl font-mono text-blue-400">${fmtMXN(resultado.aportacionJustaPadre1)}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-2 text-center">
                                <span className="block text-pink-300 font-bold">Cuota Pura que le Tocaría (Padre B)</span>
                                <span className="block text-2xl font-mono text-pink-400">${fmtMXN(resultado.aportacionJustaPadre2)}</span>
                                <div className="text-[10px] text-pink-300/60 mt-2 text-left bg-black/20 p-2 rounded">
                                    (-) Descuento en especie por criar: ${fmtMXN(resultado.valorCuidado)}<br />
                                    <strong>= Dinero Líquido a Poner: ${fmtMXN(resultado.aportacionLiquidaFinalPadre2)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-2xl bg-[var(--color-accent)]/10 outline outline-2 outline-[var(--color-accent)]/30 text-center">
                        <p className="text-sm text-[var(--color-accent)] font-bold mb-2">💵 Pensión a Depositar Quincenal/Mensualmente</p>
                        <p className="text-5xl font-mono font-bold text-white">${fmtMXN(resultado.pensionSugeridaDepositar)}</p>
                        <p className="text-xs text-white/60 mt-3 max-w-md mx-auto">
                            Esto es lo que debe transferir el Padre A al Padre B para asegurar que los niños mantengan su gasto mensual de ${fmtMXN(parseFloat(gastoMensualMenores))} compensando la carga física.
                        </p>
                    </div>

                </div>
            )}
            <p className="text-[10px] text-white/30 text-center mt-6">Basado en Jurisprudencia de la SCJN que determina que las labores de cuidado y el tiempo invertido se computan como aportación monetaria equivalente en obligaciones parentales.</p>
        </main>
    )
}
