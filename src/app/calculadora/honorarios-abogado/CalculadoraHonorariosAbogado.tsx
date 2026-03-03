'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraHonorariosAbogado() {
    const [montoJuicio, setMontoJuicio] = useState('800000') // Cuantía o negocio
    const [dificultad, setDificultad] = useState<'baja' | 'media' | 'alta'>('media')
    const [esCondenaCostas, setEsCondenaCostas] = useState(false)

    // Regla empírica y Arancelaria (Ley de Aranceles de Abogados vigente en el foro de CDMX y gran parte del país):
    // Cuando hay un monto cuantificable, el abogado cobra un porcentaje.
    // Menor monto = mayor porcentaje.
    // Mayor monto = menor porcentaje.
    // Promedio Cuota Litis (A éxito puro): 20% al 30%.
    // Promedio Tarifa Mixta (Anticipo + Éxito): 5% anticipo + 10% éxito.
    // Costas Judiciales (Condena al Perdedor): Porcentajes fijos dados en la ley adjetiva (Civil: Ej. 6% al 12% Primera Instancia, 4% a 8% Segunda Instancia, etc. O en LGTOC o CPC de CDMX, hasta el 20% cumulado).

    const resultado = useMemo(() => {
        const cuantia = parseFloat(montoJuicio) || 0
        let porcentajeRecomendado = 15 // Base

        if (cuantia <= 100000) porcentajeRecomendado = 25
        else if (cuantia <= 500000) porcentajeRecomendado = 20
        else if (cuantia <= 2000000) porcentajeRecomendado = 15
        else if (cuantia <= 10000000) porcentajeRecomendado = 10
        else porcentajeRecomendado = 8

        if (dificultad === 'alta') porcentajeRecomendado += 3
        if (dificultad === 'baja') porcentajeRecomendado -= 3

        const cobroTotalEstimadoLitis = cuantia * (porcentajeRecomendado / 100)

        // Estructura Mixta (25% al inicio, 75% al final)
        const igualaInicial = cobroTotalEstimadoLitis * 0.25
        const bonoExito = cobroTotalEstimadoLitis * 0.75

        // Costas Judiciales (Normalmente si se condena en base a arancel, varían entre el 10% y el 12% en doble instancia)
        // Tomaremos un 10% estándar como costas de Primera Instancia aplicados al negocio.
        const costasJudiciales = cuantia * 0.10

        return {
            cuantia,
            porcentajeRecomendado,
            cobroTotalEstimadoLitis,
            igualaInicial,
            bonoExito,
            costasJudiciales
        }

    }, [montoJuicio, dificultad, esCondenaCostas])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💼</span><span>Práctica Legal · Aranceles</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Honorarios de Abogado</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si el negocio es cuantificable en dinero (Cobrar un pagaré, repartir herencia, indemnización civil), el arancel profesional mexicano dicta porcentajes inversamente proporcionales al monto recuperado.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6">

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Monto del Negocio a Litigar (Cuantía Total Recuperable) $</label>
                    <input type="number" value={montoJuicio} onChange={e => setMontoJuicio(e.target.value)}
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-2xl focus:border-[var(--color-accent)] focus:outline-none" />
                </div>

                <div className="border-t border-white/10 pt-4">
                    <label className="block text-xs text-[var(--color-text-muted)] mb-3 font-semibold text-center">Nivel de Dificultad o Riesgo (Incidentes/Apelaciones probables)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                            { val: 'baja', label: 'Rutinario', desc: 'Sencillo o pactado.' },
                            { val: 'media', label: 'Contencioso', desc: 'Juicio peleado normal.' },
                            { val: 'alta', label: 'De Alto Riesgo', desc: 'Demanda reconvencional / Larga duración.' }
                        ].map(opt => (
                            <div key={opt.val} onClick={() => setDificultad(opt.val as any)}
                                className={`p-3 rounded-xl cursor-pointer border text-center transition-all ${dificultad === opt.val ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                <span className={`block font-bold text-sm ${dificultad === opt.val ? 'text-[var(--color-accent)]' : 'text-white'}`}>{opt.label}</span>
                                <span className="text-[10px] text-white/50 block mt-1">{opt.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <input type="checkbox" id="costas" checked={esCondenaCostas} onChange={e => setEsCondenaCostas(e.target.checked)} className="w-5 h-5 accent-red-500" />
                    <label htmlFor="costas" className="text-sm text-red-200">Quiero que el programa me calcule el Incidente de Costas Judiciales si mi Rival Pierde o litiga de Mala Fe.</label>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-2xl space-y-4">

                    {!esCondenaCostas && (
                        <>
                            <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-blue-500/30">
                                <p className="text-sm font-bold text-white/50 mb-1">Tarifa Sugerida Totales (Cuota Litis al {resultado.porcentajeRecomendado}%)</p>
                                <p className="text-5xl font-mono font-bold text-blue-400 my-2">${fmtMXN(resultado.cobroTotalEstimadoLitis)}</p>
                                <p className="text-xs text-blue-200/60">Este es el arancel sugerido para absorber toda la representación de principio a fin, sujeto a ajuste por el profesional.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10 text-center">
                                    <span className="text-xs font-bold text-white/50 block mb-2 uppercase">💰 Abonos Clásicos (Anticipo Contractual)</span>
                                    <span className="text-2xl font-mono text-white block">${fmtMXN(resultado.igualaInicial)}</span>
                                    <span className="text-[10px] text-white/40 block mt-1">25% inicial para arrancar la demanda de inmediato.</span>
                                </div>
                                <div className="bg-[#0f172a] p-5 rounded-xl border border-[var(--color-accent)]/20 text-center">
                                    <span className="text-xs font-bold text-[var(--color-accent)] block mb-2 uppercase">🎯 Liquidación por Éxito Judicial</span>
                                    <span className="text-2xl font-mono text-[var(--color-accent)] block">${fmtMXN(resultado.bonoExito)}</span>
                                    <span className="text-[10px] text-white/40 block mt-1">75% depositado al cobrarse físicamente la sentencia.</span>
                                </div>
                            </div>
                        </>
                    )}

                    {esCondenaCostas && (
                        <div className="glass-card p-6 rounded-2xl border-2 border-red-500/50 bg-red-900/10 text-center animate-fade-in">
                            <h3 className="text-red-300 font-bold mb-2 uppercase tracking-custom">Condena en Costas Judiciales</h3>
                            <p className="text-[11px] text-white/70 mb-4 max-w-md mx-auto">
                                Si alguien litiga de manera temeraria y pierde todas las instancias, puedes interponer un Incidente de Liquidación de Costas, obligándolo a él a pagar a TUS abogados en base al Código de Procedimientos Civiles.
                            </p>
                            <span className="text-5xl font-mono font-bold text-red-400 block">${fmtMXN(resultado.costasJudiciales)}</span>
                            <span className="text-xs text-red-200/50 block mt-2">Tasado al 10% conservador sobre los ${fmtMXN(resultado.cuantia)} de la Suerte Principal peleada en Juicio de Primera Instancia.</span>
                        </div>
                    )}

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/40 mt-4 leading-relaxed">
                        En México existe el precepto de la libertad contractual en materia de cobro de honorarios. Los Colegios de Abogados fijan "Aranceles" (Leyes de aranceles y parámetros sugeridos del 5% al 30%) que solo son **directamente vinculantes y obligatorios por parte del Juez en los Incidentes Resolutivos de Ejecución de Condena en Costas**. Entre Cliente y Abogado, se puede pactar cualquier cifra, iguala permanente, o porcentaje al libre arbitrio de ambas partes en un Contrato de Prestación de Servicios.
                    </div>
                </div>
            )}
        </main>
    )
}
