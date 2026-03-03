'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

const SECRETARIAS = [
    { id: 'profeco', nombre: 'PROFECO (Protecc. Consumidor)', umasMin: 50, umasMax: 30000, desc: 'Publicidad engañosa, no exhibir precios, abusos tarifarios.' },
    { id: 'cofepris', nombre: 'COFEPRIS (Salud y Sanitarios)', umasMin: 2000, umasMax: 16000, desc: 'Falta de Aviso de Funcionamiento, productos caducos industriales.' },
    { id: 'stps', nombre: 'STPS (Secretaría del Trabajo)', umasMin: 250, umasMax: 5000, desc: 'No pagar PTU, aguar aguinaldos, normas de seguridad deficientes.' },
    { id: 'segob', nombre: 'SEGOB (Juegos / Sorteos / Migración)', umasMin: 1000, umasMax: 10000, desc: 'Casino sin permiso, contratar ilegalmente extranjeros sin forma FM.' },
    { id: 'municipio', nombre: 'Municipales (Tránsito / Clausura de Obra Municipal)', umasMin: 5, umasMax: 500, desc: 'Alcoholímetro (Torito), Pasarse un Alto (20 UMAs), remodelación civil extramuros.' },
]

export default function CalculadoraMultaAdministrativa() {
    const [entidad, setEntidad] = useState(SECRETARIAS[0].id)
    const [descuentoProntoPago, setDescuentoProntoPago] = useState(false)
    const [multaDirectaImputada, setMultaDirectaImputada] = useState('')

    const resultado = useMemo(() => {
        const umasHoy = getUMA(2026).diaria
        const dependenciaInfo = SECRETARIAS.find(s => s.id === entidad)!

        let mnxtMin = dependenciaInfo.umasMin * umasHoy
        let mnxtMax = dependenciaInfo.umasMax * umasHoy

        let multaFija = parseFloat(multaDirectaImputada) || 0
        let multaProyectada = multaFija * umasHoy

        // Descuentos previstos en la Ley Federal de Procedimiento Administrativo LFPA y legislaciones locales (Pronto pago de multa de tránsito o conciliación Profeco antes de laudo).
        let porcentajeDescuento = 0

        if (descuentoProntoPago) {
            if (entidad === 'municipio') porcentajeDescuento = 50 // Pronto pago boleta de tránsito es 50%
            else porcentajeDescuento = 20 // Reglas de allanamiento y reconocimiento LFPA 20%

            mnxtMin = mnxtMin - (mnxtMin * (porcentajeDescuento / 100))
            mnxtMax = mnxtMax - (mnxtMax * (porcentajeDescuento / 100))
            multaProyectada = multaProyectada - (multaProyectada * (porcentajeDescuento / 100))
        }

        return {
            ...dependenciaInfo,
            mnxtMin,
            mnxtMax,
            multaProyectada,
            multaFijaOrig: multaFija,
            porcentajeDescuento
        }

    }, [entidad, descuentoProntoPago, multaDirectaImputada])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏛️</span><span>Sanciones por el Estado (Poder Ejecutivo LFPA)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Multas Gubernamentales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si te visitó un verificador de salubridad, inspección del trabajo o consumidor. La multa no se dicta al aire, se taza rigurosamente en tabuladores cerrados de UMA para evitar abusos corporativos.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-accent)] mb-3 font-bold">
                        ¿Que dependencia te dejó una infracción o clausura?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {SECRETARIAS.map(sec => (
                            <div key={sec.id} onClick={() => setEntidad(sec.id)} className={`p-3 rounded-lg border cursor-pointer transition-colors ${entidad === sec.id ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'bg-[#0f172a] border-white/10 hover:border-white/30'}`}>
                                <div className={`font-bold ${entidad === sec.id ? 'text-[var(--color-accent)]' : 'text-white'}`}>{sec.nombre}</div>
                                <div className="text-[10px] text-white/50 mt-1 line-clamp-1">{sec.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 transition-colors cursor-pointer" onClick={() => setDescuentoProntoPago(!descuentoProntoPago)}>
                        <input type="checkbox" checked={descuentoProntoPago} readOnly className="mt-1 w-5 h-5 accent-blue-500 pointer-events-none" />
                        <div className="flex-1">
                            <label className="text-sm font-bold text-blue-300 block mb-1">Beneficio por Allanamiento y Reconocimiento (Pronto Pago)</label>
                            <p className="text-[10px] text-blue-200/60 leading-tight">La ley te da descuentos (20% en tribunales/LFPA o 50% en bandos municipales) si renuncias al Juicio de Nulidad y pagas de forma voluntaria dentro de las primeras semanas.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] font-semibold mb-1.5">
                            ¿Sabes exactamente de cuántas UMAs es la multa tasada en la boleta? (Ej: 20 UMAs por "Alto")
                        </label>
                        <input type="number" placeholder="Dejar vacío para ver el rango general" value={multaDirectaImputada} onChange={e => setMultaDirectaImputada(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    {resultado.multaFijaOrig > 0 ? (
                        <div className="glass-card p-8 rounded-2xl text-center shadow-lg border-2 border-slate-700 bg-gradient-to-br from-slate-900 to-[#1e1b4b]">
                            <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-wider">Deuda Exacta por Boleta Determinante</p>
                            <p className="text-5xl md:text-6xl font-mono font-bold text-indigo-400 my-3">
                                ${fmtMXN(resultado.multaProyectada)}
                            </p>
                            <div className="mt-2 text-xs text-indigo-200/60 font-mono">
                                Equivalente formal de {resultado.multaFijaOrig} UMAs ingresadas. {resultado.porcentajeDescuento > 0 ? `(Con Retención de Descuento Especial P.P. -${resultado.porcentajeDescuento}% aplicado).` : ''}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-amber-500/30">
                            <p className="text-[10px] font-bold text-amber-500/50 mb-1 uppercase tracking-widest">Espectro y Límites Federales (Art {resultado.umasMin} a {resultado.umasMax} Diario/UMAS)</p>
                            <h2 className="text-sm text-amber-200 mb-4 font-bold">{resultado.nombre}</h2>

                            <div className="flex items-center justify-center gap-4 my-2">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-white/50 uppercase">Mínima Piso</span>
                                    <span className="text-3xl font-mono font-bold text-white">${fmtMXN(resultado.mnxtMin)}</span>
                                </div>
                                <span className="text-3xl font-light text-amber-500/50">-</span>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] text-amber-400/80 font-bold uppercase">Tope Máximo y Clausurador</span>
                                    <span className="text-4xl font-mono font-bold text-amber-400">${fmtMXN(resultado.mnxtMax)}</span>
                                </div>
                            </div>
                            {resultado.porcentajeDescuento > 0 && (
                                <p className="text-xs text-amber-200 bg-amber-500/10 inline-block px-3 py-1 rounded border border-amber-500/20 mt-3">Rango proyectado simulando el -{resultado.porcentajeDescuento}% amortizado por pronto pago.</p>
                            )}
                        </div>
                    )}

                </div>
            )}
        </main>
    )
}
