'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

export default function CalculadoraMultaElectoral() {
    const [tipoInfractor, setTipoInfractor] = useState<'partido' | 'ciudadano' | 'ministro' | 'extranjero'>('partido')
    const [tipoInfraccion, setTipoInfraccion] = useState<'financiamiento_ilicito' | 'tope_campana' | 'afiliacion_indebida'>('tope_campana')

    // Si es financiamiento ilícito (Montos involucrados)
    const [montoIlegal, setMontoIlegal] = useState('2500000')

    const resultado = useMemo(() => {
        const umas = getUMA(2026).diaria
        const montoImplicado = parseFloat(montoIlegal) || 0

        let sancionUMA = 0
        let descripcionPunible = ''
        let esReduccionMinistracion = false

        // Ley General de Instituciones y Procedimientos Electorales (LGIPE) - Art 456
        if (tipoInfractor === 'partido') {
            esReduccionMinistracion = true
            if (tipoInfraccion === 'tope_campana' || tipoInfraccion === 'financiamiento_ilicito') {
                // Cuando es económico, la multa es del doble (200%) del precio originado o rebasado ilegalmente
                sancionUMA = (montoImplicado * 2) / umas
                descripcionPunible = `Multa Pecuniaria de hasta 10,000 UMAs y, adicionalmente, reducción de hasta el 50% de las ministraciones de Financiamiento Público ordinario hasta liquidar el costo de Multa Equivalente a 200% del monto ilícito rebasado.`
            } else {
                // Afiliaciones indebidas
                sancionUMA = 10000 // Topada hasta 10mil umas
                descripcionPunible = 'Sanción administrativa gravosa (10k UMAs) por vulnerar datos personales y afiliar ciudadanos al partido sin su consentimiento firmado.'
            }
        } else if (tipoInfractor === 'ciudadano') {
            sancionUMA = 500 // Ciudadanos, observadores electorales
            descripcionPunible = 'Aspirantes o candidatos independientes, así como ciudadanos comunes: Amonestación pública o multa de hasta 500 UMAs por faltas formales a la Ley Electoral.'
            esReduccionMinistracion = false
        } else if (tipoInfractor === 'ministro') {
            sancionUMA = 500
            descripcionPunible = 'Ministros de culto religioso: Infracciones por inducir al voto desde el púlpito (Hasta 500 UMAs) y vista a la Secretaría de Gobernación.'
            esReduccionMinistracion = false
        } else {
            sancionUMA = 0 // Expulsión 
            descripcionPunible = 'Artículo 33 CN: Los extranjeros no pueden inmiscuirse en la política nacional. Multa administrativa, cese laboral y Expulsión inmediata del territorio nacional por violación y riesgo a la Soberanía Democrática.'
        }

        const multaMonetaria = sancionUMA * umas

        return {
            sancionUMA,
            multaMonetaria,
            descripcionPunible,
            esReduccionMinistracion,
            umasHoy: umas
        }

    }, [tipoInfractor, tipoInfraccion, montoIlegal])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🗳️</span><span>Tribunal Electoral (TEPJF) y Consejos del INE</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador Penal de <span className="gradient-gold">Multas Electorales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El Instituto Nacional Electoral es tajante. En época de elecciones las fallas fiscalizatorias o compra de votos tienen repercusiones millonarias. Entiende el tabulador (Art 456 LGIPE).
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Quién es el infractor / violador de la veda?</label>
                        <select value={tipoInfractor} onChange={e => setTipoInfractor(e.target.value as any)}
                            className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-red-500 outline-none text-sm">
                            <option value="partido">🏛️ Partido Político Federal/Local (PRI, PAN, MORENA)</option>
                            <option value="ciudadano">👤 Ciudadano, Aspirante o Candidato Independiente</option>
                            <option value="ministro">⛪ Sacerdote o Ministro de Culto Religioso</option>
                            <option value="extranjero">🌎 Persona Migrante o Extranjera con injerencia</option>
                        </select>
                    </div>

                    {tipoInfractor === 'partido' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] font-semibold mb-1.5">Naturaleza de la Omisión Resolutiva (INE)</label>
                            <select value={tipoInfraccion} onChange={e => setTipoInfraccion(e.target.value as any)}
                                className="w-full p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-100 focus:outline-none text-sm">
                                <option value="tope_campana">💸 Rebase de Tope de Gastos de Campaña (INEFI)</option>
                                <option value="financiamiento_ilicito">🚫 Recibir Aportaciones de Empresas Ilícitas (Bolsas oscuras)</option>
                                <option value="afiliacion_indebida">📝 Afiliar Ciudadanos Sin su Permiso a sus padrones (Robo de firmas)</option>
                            </select>
                        </div>
                    )}
                </div>

                {tipoInfractor === 'partido' && ['tope_campana', 'financiamiento_ilicito'].includes(tipoInfraccion) && (
                    <div className="border-t border-white/10 pt-4 animate-fade-in">
                        <label className="block text-xs text-red-300 font-bold mb-1.5">
                            Monto de la Tranza / Cantidad Económica Oculta o Rebasada Detectada ($ MXN)
                        </label>
                        <input type="number" value={montoIlegal} onChange={e => setMontoIlegal(e.target.value)}
                            className="w-full p-4 text-center rounded-xl bg-red-900/30 border border-red-500/50 text-red-100 font-mono text-3xl focus:outline-none" />
                        <p className="text-[10px] text-white/50 text-center mt-2">La ingeniería financiera del INE penaliza al DOBLE cualquier peso sucio detectado en campaña.</p>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className={`glass-card p-8 rounded-2xl text-center shadow-lg border-2 
                        ${tipoInfractor === 'extranjero' ? 'border-purple-500/50 bg-purple-900/10' : 'border-orange-500/30 bg-orange-900/10'}
                    `}>
                        <p className="text-sm font-bold text-white/50 mb-1 uppercase tracking-widest text-center">Golpe al Bolsillo Impuesto por la LGIPE</p>

                        {tipoInfractor === 'extranjero' ? (
                            <p className="text-4xl md:text-5xl font-mono font-bold text-purple-400 my-4 uppercase">
                                DEPORTACIÓN Y EXPULSIÓN INMEDIATA (ART 33)
                            </p>
                        ) : (
                            <>
                                <p className="text-5xl md:text-6xl font-mono font-bold text-orange-500 my-3">
                                    ${fmtMXN(resultado.multaMonetaria)}
                                </p>
                                <div className="mt-2 text-xs text-white/60 font-mono border border-white/10 bg-black/50 px-3 py-1 inline-block rounded-full">
                                    Valoración Institucional: {resultado.sancionUMA >= 1000 ? resultado.sancionUMA.toLocaleString() : resultado.sancionUMA.toFixed(0)} UMAs Diarias Oficiales.
                                </div>
                            </>
                        )}

                    </div>

                    <div className="grid md:grid-cols-1 gap-4">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-[var(--color-accent)]/20 shadow-inner flex flex-col justify-center text-center">
                            <span className="flex justify-center items-center gap-2 text-xs font-bold text-[var(--color-accent)] mb-3 uppercase">
                                📖 Dictamen de Consecuencias Electorales y Jurisprudencia
                            </span>
                            <p className="text-sm text-white/90 leading-relaxed font-semibold italic max-w-2xl mx-auto">
                                "{resultado.descripcionPunible}"
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
