'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraHerenciaTestamentaria() {
    const [tipoHerencia, setTipoHerencia] = useState<'intestada' | 'testamentaria'>('intestada')
    const [masaHereditaria, setMasaHereditaria] = useState('3000000')
    const [conyuge, setConyuge] = useState(true)
    const [hijos, setHijos] = useState('2')
    const [legados, setLegados] = useState('500000') // En testamentaria

    const resultado = useMemo(() => {
        const masa = parseFloat(masaHereditaria) || 0
        const cantHijos = parseInt(hijos) || 0
        const valorLegados = parseFloat(legados) || 0
        const herederos: { parentesco: string, porcentaje: number, monto: number, nota: string }[] = []

        if (tipoHerencia === 'intestada') {
            // Reglas de Sucesión Legítima (Art. 1599 - 1637 CCF)
            if (cantHijos > 0) {
                // Hay descendientes.
                if (conyuge) {
                    // El cónyuge hereda como un hijo más (Art. 1624 CCF) si carece de bienes o tiene menos que la porción de un hijo
                    const partes = cantHijos + 1
                    const porcion = masa / partes
                    herederos.push({ parentesco: 'Cónyuge / Concubino(a)', porcentaje: (1 / partes) * 100, monto: porcion, nota: 'Hereda la porción equivalente a un hijo (Art. 1624 CCF).' })
                    for (let i = 1; i <= cantHijos; i++) {
                        herederos.push({ parentesco: `Hijo ${i}`, porcentaje: (1 / partes) * 100, monto: porcion, nota: 'Heredan por cabeza y en partes iguales.' })
                    }
                } else {
                    // Solo hijos
                    const porcion = masa / cantHijos
                    for (let i = 1; i <= cantHijos; i++) {
                        herederos.push({ parentesco: `Hijo ${i}`, porcentaje: (1 / cantHijos) * 100, monto: porcion, nota: 'Ascendientes y colaterales quedan excluidos al haber descendientes.' })
                    }
                }
            } else if (conyuge) {
                // Sin hijos, pero con cónyuge.
                // Si hay padres, el cónyuge hereda la mitad y los padres la otra mitad. Si no asumimos que se lleva todo (simplificado).
                herederos.push({ parentesco: 'Cónyuge Único', porcentaje: 100, monto: masa, nota: 'A falta de descendientes y ascendientes, el cónyuge o concubino(a) sucede en todos los bienes (Art. 1629 CCF).' })
            } else {
                // Sin hijos ni cónyuge
                herederos.push({ parentesco: 'Padres / Abuelos (Ascendientes)', porcentaje: 100, monto: masa, nota: 'A falta de descendientes y cónyuge, heredan los ascendientes por partes iguales.' })
            }
        } else {
            // Reglas de Sucesión Testamentaria
            // Libre disposición en México: a diferencia de otros países, en México hay plena libertad para testar,
            // pero se deben garantizar los ALIMENTOS (Art. 1368 CCF) para incapacitados, menores, o cónyuge que no pueda trabajar.
            // Para la calculadora, descontamos los legados específicos (Cantidades precisas dadas a personas) y el remanente es para el heredero(s) universal(es).

            const remanente = Math.max(0, masa - valorLegados)
            if (valorLegados > 0) {
                herederos.push({ parentesco: 'Legatarios (Bienes Específicos)', porcentaje: (valorLegados / masa) * 100, monto: valorLegados, nota: 'Reciben cosas o cantidades expresamente indicadas antes del reparto general.' })
            }
            if (remanente > 0) {
                herederos.push({ parentesco: 'Herederos Universales (Masa remanente)', porcentaje: (remanente / masa) * 100, monto: remanente, nota: 'Se dividen el resto de la masa hereditaria en las proporciones dictadas en el testamento, respondiendo por las deudas proporcionales.' })
            }
        }

        return {
            herederos,
            masa
        }

    }, [tipoHerencia, masaHereditaria, conyuge, hijos, legados])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📜</span><span>Derecho Familiar · Sucesiones</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Herencias y Reparto</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Averigua cómo distribuye la ley el patrimonio de una persona fallecida (Intestado / Art. 1599 CCF) o cómo opera la distribución según su última voluntad escrita (Testamento).
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto grid md:grid-cols-2 gap-8">

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Configuración del Acervo</h3>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor Total de la Herencia (Bienes - Deudas)</label>
                        <input type="number" value={masaHereditaria} onChange={e => setMasaHereditaria(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-2 font-semibold">Tipo de Sucesión</label>
                        <div className="flex gap-2">
                            <button onClick={() => setTipoHerencia('intestada')} className={`flex-1 p-2 text-sm rounded-lg border font-bold ${tipoHerencia === 'intestada' ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white'}`}>Intestado (Sin Testamento)</button>
                            <button onClick={() => setTipoHerencia('testamentaria')} className={`flex-1 p-2 text-sm rounded-lg border font-bold ${tipoHerencia === 'testamentaria' ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white'}`}>Con Testamento</button>
                        </div>
                    </div>

                    {tipoHerencia === 'intestada' ? (
                        <div className="pt-2 border-t border-white/10 space-y-4">
                            <h4 className="text-sm font-bold text-[var(--color-accent)]">Deudos que le sobreviven:</h4>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="conyuge" checked={conyuge} onChange={e => setConyuge(e.target.checked)} className="w-5 h-5 accent-[var(--color-accent)]" />
                                <label htmlFor="conyuge" className="text-sm text-white">Dejó Cónyuge / Concubino(a)</label>
                            </div>
                            <div>
                                <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de Hijos</label>
                                <input type="number" value={hijos} onChange={e => setHijos(e.target.value)} min="0" max="20"
                                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--color-accent)] focus:outline-none" />
                            </div>
                        </div>
                    ) : (
                        <div className="pt-2 border-t border-white/10 space-y-4">
                            <h4 className="text-sm font-bold text-[var(--color-accent)]">Parámetros Testamentarios:</h4>
                            <div>
                                <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor asignado en Legados Particulares ($)</label>
                                <input type="number" value={legados} onChange={e => setLegados(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                                <p className="text-[10px] text-white/50 mt-1">Suma de bienes específicos dados a personas exactas (Ej. Un carro a mi sobrino). El resto se divide entre los herederos universales.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-[var(--color-accent)]/5 rounded-2xl border border-[var(--color-accent)]/10 p-5 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-[var(--color-accent)] mb-4 text-center">Radiografía de Distribución Legal</h3>

                    {resultado.herederos.length > 0 ? (
                        <div className="space-y-3">
                            {resultado.herederos.map((h, i) => (
                                <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent)]"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-white font-bold">{h.parentesco}</span>
                                        <span className="text-[var(--color-accent)] font-bold">{h.porcentaje.toFixed(1)}%</span>
                                    </div>
                                    <span className="block font-mono text-lg text-white mb-1.5">${fmtMXN(h.monto)}</span>
                                    <p className="text-[10px] text-white/50 leading-tight">{h.nota}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-white/50">Configura los deudos para ver el reparto.</p>
                    )}

                    {tipoHerencia === 'testamentaria' && (
                        <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                            <p className="text-[10px] text-orange-200"><strong>⚠️ Límite a la Libre Disposición (Art. 1368 CCF):</strong> En México eres libre de dejar tus bienes a quien quieras (incluso al gato), siempre y cuando garantices primero la "Pensión Alimenticia" de menores de edad y ascendientes/cónyuge que no puedan sostenerse por sí mismos. De otra forma el testamento sería calificado como "Inoficioso".</p>
                        </div>
                    )}
                </div>
            </div>

            <p className="max-w-2xl mx-auto mt-6 text-center text-[10px] text-white/40">Nota Fiscal: La recepción de herencias y legados por línea recta (padres a hijos o cónyuges) está por ley Exenta del pago de Impuesto Sobre la Renta (ISR Art. 93 Fr. XXII), pero deberán declararse ante el SAT en la Declaración Anual si superan los $500,000 pesos so pena de perder el beneficio. Independientemente de esto, los herederos sí tendrán que pagar los gastos notariales y de escrituración por los inmuebles y el ISAI/ISABI correspondiente en cada Estado.</p>
        </main>
    )
}
