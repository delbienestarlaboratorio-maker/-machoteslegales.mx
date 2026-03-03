'use client'
import { useState, useMemo } from 'react'

// Base de datos simplificada de delitos comunes del Código Penal Federal
const BASE_DELITOS = [
    { id: 'homicidio_simple', nombre: 'Homicidio Simple Doloso', min: 12, max: 24, fund: 'Art. 307 CPF', desc: 'Privar de la vida sin ventajas (Ej. Riña callejera que escala).' },
    { id: 'homicidio_calificado', nombre: 'Homicidio Calificado / Asesinato', min: 30, max: 60, fund: 'Art. 320 CPF', desc: 'Con premeditación, alevosía, ventaja o traición (Sicariato, emboscada).' },
    { id: 'feminicidio', nombre: 'Feminicidio', min: 40, max: 60, fund: 'Art. 325 CPF', desc: 'Privar de la vida a una mujer por razones de género.' },
    { id: 'secuestro', nombre: 'Secuestro Base', min: 40, max: 80, fund: 'Ley Gral. Secuestro', desc: 'Privar de libertad para pedir rescate o causar daño.' },
    { id: 'violacion', nombre: 'Violación', min: 8, max: 20, fund: 'Art. 265 CPF', desc: 'Cópula por medio de violencia física o moral.' },
    { id: 'fraude', nombre: 'Fraude (Cuantía Mayor)', min: 3, max: 12, fund: 'Art. 386 CPF', desc: 'Engañar para hacerse ilícitamente de alguna cosa o lucro $>500 UMAs.' },
    { id: 'robo_simple', nombre: 'Robo Simple (Sin violencia)', min: 2, max: 10, fund: 'Art. 367 y 370 CPF', desc: 'Apoderarse de cosa ajena sin intimidación según tabulador.' },
    { id: 'robo_violencia', nombre: 'Robo con Violencia (Asalto)', min: 6, max: 15, fund: 'Art. 372 CPF', desc: 'Se añade multa de 6 meses a 5 años EXTRA a la pena de robo base.' },
    { id: 'narcomenudeo', nombre: 'Narcomenudeo (Posesión simple excedida)', min: 10, max: 36, fund: 'Art. 476 LGS (Meses)', desc: 'Posesión sin fines de venta, mayor a dosis personal máxima (Penalidad en MESES, 10 meses a 3 años).' },
    { id: 'extorsion', nombre: 'Extorsión (Derecho de Piso)', min: 2, max: 8, fund: 'Art. 390 CPF', desc: 'Obligar a dar lucro con violencia.' },
    { id: 'lesiones_graves', nombre: 'Lesiones Graves (Cicatriz permanente / Órgano)', min: 3, max: 8, fund: 'Art. 291 CPF', desc: 'Perturban la vista o marcan el rostro.' },
    { id: 'violencia_familiar', nombre: 'Violencia Familiar', min: 3, max: 7, fund: 'Art. 343 Bis CPF', desc: 'Agresiones físicas, psicológicas o económicas a parentela.' }
]

export default function CalculadoraPenaDelito() {
    const [delitoActivo, setDelitoActivo] = useState(BASE_DELITOS[0].id)
    const [atenuanteTentativa, setAtenuanteTentativa] = useState(false)
    const [agravantePandilla, setAgravantePandilla] = useState(false)

    const resultado = useMemo(() => {
        const delito = BASE_DELITOS.find(d => d.id === delitoActivo)!

        let penaMin = delito.min
        let penaMax = delito.max

        // Las reglas del Código Penal Federal sobre atenuantes/agravantes matemáticas

        // Tentativa (Art 63 CPF): Se impone hasta 2/3 de la pena que se impondría si se consumara.
        if (atenuanteTentativa) {
            penaMin = penaMin * 0.33 // Reducida hasta en una tercera parte/mitad aprox dependiendo juez
            penaMax = penaMax * 0.66
        }

        // Pandilla (Art 164 Bis CPF): Aumenta hasta en 1/2 la sanción si se comete en grupo de 3+ sin ser crimen organizado complejo.
        if (agravantePandilla) {
            penaMin = penaMin * 1.50
            penaMax = penaMax * 1.50
        }

        // Regla general de prisión máxima Constitucional/CPF suele ser de 60 años. No se acumulan a 300 años como en USA (salvo raras excepciones locales).
        if (penaMax > 60 && delito.id !== 'secuestro') penaMax = 60; // Secuestro tiene leyes especiales

        return {
            ...delito,
            penaMin: penaMin.toFixed(1).replace('.0', ''),
            penaMax: penaMax.toFixed(1).replace('.0', ''),
            unidadTemporal: delito.id === 'narcomenudeo' ? 'MESES' : 'AÑOS'
        }

    }, [delitoActivo, atenuanteTentativa, agravantePandilla])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⛓️</span><span>Derecho Penal · Tipos Penales</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Explorador de <span className="gradient-gold">Penas de Prisión</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Averigua cuántos años marca la Ley por la comisión de crímenes en México. Las penas son rangos matemáticos que el Juez individualiza dependiendo del grado de culpabilidad.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-1/2 overflow-y-auto max-h-[500px] pr-2 space-y-2 custom-scrollbar">
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-accent)] mb-3 font-bold sticky top-0 bg-[#020817] py-2">
                        Catálogo de Delitos Tipificados
                    </label>
                    {BASE_DELITOS.map(d => (
                        <div key={d.id} onClick={() => setDelitoActivo(d.id)}
                            className={`p-3 rounded-xl cursor-pointer border transition-all text-sm group
                                ${delitoActivo === d.id ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] backdrop-blur-sm' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                            <div className={`font-bold ${delitoActivo === d.id ? 'text-[var(--color-accent)]' : 'text-white'}`}>{d.nombre}</div>
                            <div className="text-[10px] text-white/50 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">{d.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/2 flex flex-col space-y-6">
                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-red-500/20 shadow-lg shadow-red-500/10">
                        <p className="text-xs font-bold text-red-500/80 mb-1 uppercase tracking-wider">{resultado.nombre}</p>

                        <div className="flex items-center justify-center gap-3 my-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-white/50 uppercase">Mínima</span>
                                <span className="text-4xl font-mono font-bold text-white">{resultado.penaMin}</span>
                            </div>
                            <span className="text-3xl font-light text-red-500/50">-</span>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-white/50 uppercase">Máxima</span>
                                <span className="text-4xl font-mono font-bold text-red-400">{resultado.penaMax}</span>
                            </div>
                        </div>

                        <p className="text-sm text-red-200/50 font-bold uppercase tracking-widest mb-4">
                            {resultado.unidadTemporal} DE RECLUSIÓN
                        </p>

                        <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] text-white/40">
                            Base Punitiva: Código Penal Federal <b>{resultado.fund}</b>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs uppercase text-white/50 mb-1 font-bold">Modificadores Matemáticos en Audiencia</label>

                        <div className="flex items-start gap-3 p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 transition-colors">
                            <input type="checkbox" checked={atenuanteTentativa} onChange={e => setAtenuanteTentativa(e.target.checked)} className="mt-1 w-5 h-5 accent-purple-500" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-purple-300 block mb-1">En Grado de Tentativa</label>
                                <p className="text-[10px] text-purple-200/60 leading-tight">El arma falló / La policía lo impidió. Se rebaja el castigo bruto inicial porque el daño final no se materializó del todo (Art 63).</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5 transition-colors">
                            <input type="checkbox" checked={agravantePandilla} onChange={e => setAgravantePandilla(e.target.checked)} className="mt-1 w-5 h-5 accent-orange-500" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-orange-300 block mb-1">Agravante por Pandilla / Asociación</label>
                                <p className="text-[10px] text-orange-200/60 leading-tight">Ejecutado por 3 o más personas unidas (montoneros). El juez Aumenta la punibilidad legal como castigo a la red criminal.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 text-[10px] text-white/30 text-center leading-relaxed">
                        Este simulador obedece a las reglas del Fuero Federal. Las penalidades exactas pueden variar notablemente si el delito se persigue bajo el Código Penal específico de un Estado local de la República Mexicana.
                    </div>
                </div>

            </div>
        </main>
    )
}
