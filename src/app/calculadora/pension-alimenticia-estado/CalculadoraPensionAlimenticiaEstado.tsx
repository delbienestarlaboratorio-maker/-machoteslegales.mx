'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraPensionAlimenticiaEstado() {
    const [estado, setEstado] = useState('CDMX')
    const [ingreso, setIngreso] = useState('20000')
    const [hijos, setHijos] = useState('2')

    const estadosData: Record<string, { nombre: string, minHijo: number, regla: string }> = {
        'CDMX': { nombre: 'Ciudad de México', minHijo: 15, regla: 'jurisprudencial 15-20% por hijo, tope 50-60%' },
        'EDOMEX': { nombre: 'Estado de México', minHijo: 15, regla: 'mínimo 15% a 20% por acreedor' },
        'JALISCO': { nombre: 'Jalisco', minHijo: 15, regla: 'mínimo prudencial 15%-20%' },
        'NUEVO_LEON': { nombre: 'Nuevo León', minHijo: 15, regla: 'prudente arbitrio del juez, no menor a un salario mínimo' },
        'YUCATAN': { nombre: 'Yucatán', minHijo: 20, regla: 'Código Familiar art 38, suele fijarse más alto (20% base)' },
        'QUERETARO': { nombre: 'Querétaro', minHijo: 15, regla: 'jurisprudencial' },
        'VERACRUZ': { nombre: 'Veracruz', minHijo: 15, regla: 'mínimo jurisprudencial' },
        'OTROS': { nombre: 'Resto de los Estados', minHijo: 15, regla: 'Regla general: Proporcionalidad (Art. 311 CCF)' }
    }

    const resultado = useMemo(() => {
        const ingresosNum = parseFloat(ingreso) || 0
        const numHijos = parseInt(hijos) || 1
        const infoEstado = estadosData[estado]

        let porcentajeSugerido = infoEstado.minHijo * numHijos
        // Tope jurisprudencial general: no dejar en estado de inanición al deudor (tope 50% - 60% en embargos)
        const porcentajeTope = 50

        let porcentajeAplicado = porcentajeSugerido > porcentajeTope ? porcentajeTope : porcentajeSugerido
        const montoMensual = ingresosNum * (porcentajeAplicado / 100)

        // Ver si cae menor a un salario mínimo (aprox 7,500 mensuales en 2026)
        let advertenciaMinimo = false
        if (montoMensual < 7500) advertenciaMinimo = true

        return {
            estado: infoEstado.nombre,
            regla: infoEstado.regla,
            porcentajeSugerido: porcentajeAplicado,
            montoMensual,
            advertenciaMinimo,
            porcentajeOriginal: porcentajeSugerido
        }
    }, [estado, ingreso, hijos])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>👨‍👩‍👧</span><span>Derecho Familiar · Proporcionalidad</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora Pensión Alimenticia <span className="gradient-gold">por Estado</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    La ley no fija una fórmula matemática exacta, pero la SCJN y los tribunales colegiados usan banderines del <strong className="text-white">15% al 20% por hijo</strong>. Esto varía ligeramente por estado.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Estado de la Demanda</label>
                        <select value={estado} onChange={e => setEstado(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {Object.entries(estadosData).map(([k, v]) => <option key={k} value={k}>{v.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de Hijos</label>
                        <select value={hijos} onChange={e => setHijos(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'hijo' : 'hijos'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingreso Neto Padre/Madre ($)</label>
                        <input type="number" value={ingreso} onChange={e => setIngreso(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-2xl mx-auto">
                    <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
                        <div>
                            <p className="text-sm text-white/50 font-bold mb-1">Pensión Sugerida Bruta</p>
                            <p className="text-3xl font-mono text-white">${fmtMXN(resultado.montoMensual)}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">Regla aplicada civil en {resultado.estado}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-[var(--color-accent)] font-bold tracking-widest uppercase mb-1">Porcentaje de Retención Juzgado</span>
                            <span className="text-5xl font-mono font-bold text-[var(--color-accent)]">{resultado.porcentajeSugerido}%</span>
                            {resultado.porcentajeOriginal > resultado.porcentajeSugerido && (
                                <p className="text-[10px] text-orange-400 mt-1">⚠️ Topado al 50% por regla de inanición</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
                        <p className="text-[var(--color-accent)] font-bold mb-1">💡 Jurisprudencia {resultado.estado}:</p>
                        <p className="text-white/80">{resultado.regla}</p>
                    </div>

                    {resultado.advertenciaMinimo && (
                        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-bold">
                            ⚠️ OJO: Las pensiones establecidas nunca deben ser inferiores a 1 Salario Mínimo General Vigente (aprox $7,500/mes) para garantizar la subsistencia del menor, independientemente del bajo ingreso comprobable.
                        </div>
                    )}

                    <p className="text-[10px] text-white/30 text-center mt-6">
                        El principio rector es la "Proporcionalidad" (Art. 311 CCF): Dar en proporción a las necesidades del que debe recibirlos y a la capacidad del que debe darlos. El juez valorará el nivel de vida previo.
                    </p>
                </div>
            )}
        </main>
    )
}
