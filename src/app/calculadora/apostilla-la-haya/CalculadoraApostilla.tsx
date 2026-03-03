'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraApostilla() {
    const [numDocumentos, setNumDocumentos] = useState('1')
    const [tipoDocumento, setTipoDocumento] = useState<'certificacion_federal' | 'certificacion_estatal'>('certificacion_estatal')
    const [requiereTraduccion, setRequiereTraduccion] = useState(false) // Los peritos traductores cobran por hoja
    const [usarGestor, setUsarGestor] = useState(false) // Evitar filas y traslados foráneos

    const resultado = useMemo(() => {
        const docCount = parseInt(numDocumentos) || 1

        let tarifaDerechoPorApostilla = 0
        let dependenciaFederalOGobierno = ''

        // Las apostillas locales (Actas de nacimiento, Defunción, Divorcios Estatales) las apostilla el Secretario de Gobierno del Edo.
        // Las apostillas federales (SEP, Universidades Privadas con RVOE Nacional, Cofepris) las apostilla directamente la SEGOB / SRE en CDMX.

        if (tipoDocumento === 'certificacion_federal') {
            tarifaDerechoPorApostilla = 2074 // Cuota LFD Federal SEGOB Promedio para certificación de firmas
            dependenciaFederalOGobierno = 'Secretaría de Gobernación Federal (CDMX Monterrey o Tijuana)'
        } else {
            tarifaDerechoPorApostilla = 950 // Promedio nacional (Ej. CDMX, Jalisco, Edomex andan de 700 a 1100 MXN)
            dependenciaFederalOGobierno = 'Dirección General de Gobierno de la Entidad Federativa local'
        }

        const subtotalDerechosBrutos = docCount * tarifaDerechoPorApostilla

        // Traducción de Perito certificado por el Consejo de la Judicatura (Alemán, Inglés, Francés a Español o viceversa)
        // Usualmente un perito cobra $800 - $1200 la cuartilla traducida. Actas y títulos conllevan aprox 2 cuartillas.
        const costoPorTraduccion = requiereTraduccion ? (docCount * (2 * 900)) : 0

        // Gestoría (Mensajeros o bufetes que gestionan la e.firma y hacen las filas físicamente en SEGOB)
        // Gestor foráneo general cobra ~$2000 el servicio inicial de la vuelta
        const recargoGestor = usarGestor ? 2500 : 0

        const totalInversionExtranjera = subtotalDerechosBrutos + costoPorTraduccion + recargoGestor

        return {
            dependenciaFederalOGobierno,
            tarifaDerechoPorApostilla,
            subtotalDerechosBrutos,
            costoPorTraduccion,
            recargoGestor,
            totalInversionExtranjera
        }

    }, [numDocumentos, tipoDocumento, requiereTraduccion, usarGestor])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🌍</span><span>Tratados Internacionales y Derecho Consular</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Desglose de Trámite de <span className="gradient-gold">Apostilla de La Haya</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Te piden validar tus diplomas o actas mexicanas en otro país (o viceversa)? Calcula cuánto pagarás de derechos fiscales y peritos traductores para llevar "El sello de La Haya".
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Emisor del Documento a Apostillar
                            </label>
                            <select value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value as any)}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-[var(--color-accent)]">
                                <option value="certificacion_estatal">Estatal Centralizado (Actas de Nacimiento Civiles locales, Jueces Notarios Estatales)</option>
                                <option value="certificacion_federal">Federal SEP / Tribunales (Títulos Universitarios, PGR y Agencias Federales)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">
                                Cantidad de Papeles (Soportes)
                            </label>
                            <input type="number" min="1" max="100" value={numDocumentos} onChange={e => setNumDocumentos(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-[var(--color-accent)] font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 transition-colors cursor-pointer" onClick={() => setRequiereTraduccion(!requiereTraduccion)}>
                        <input type="checkbox" checked={requiereTraduccion} readOnly className="mt-1 w-5 h-5 accent-indigo-500 pointer-events-none" />
                        <div className="flex-1">
                            <label className="text-sm font-bold text-indigo-300 block mb-1">Traducción Oficial Anexa por Perito (TSJ)</label>
                            <p className="text-[10px] text-indigo-200/60 leading-tight">Si llevas los papeles a Estados Unidos o Alemania, el simple sello no basta: otro país exigirá que vaya atado por un Perito Traductor habilitado oficialmente.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-pink-500/20 bg-pink-500/5 transition-colors cursor-pointer" onClick={() => setUsarGestor(!usarGestor)}>
                        <input type="checkbox" checked={usarGestor} readOnly className="mt-1 w-5 h-5 accent-pink-500 pointer-events-none" />
                        <div className="flex-1">
                            <label className="text-sm font-bold text-pink-300 block mb-1">Evitar el viaje contratando una Gestoría Privada Intermediaria</label>
                            <p className="text-[10px] text-pink-200/60 leading-tight">La Apostilla Federal exige presentarse presencial en CDMX/Monterrey, y la Estatal en Palacio de Gobernación local. Simulador suma los honorarios de un pasante haciendo fila y la mensajería DHL de vuelta.</p>
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 space-y-3 relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/5 rounded-full blur-[20px]"></div>
                            <span className="text-[10px] font-bold text-white/50 block mb-2 uppercase tracking-wide border-b border-white/10 pb-2 relative z-10">Desglose Paramétrico</span>

                            <div className="flex justify-between items-center text-[10px] text-white/80 relative z-10">
                                <span>Derechos de Gobernación (${fmtMXN(resultado.tarifaDerechoPorApostilla)} x {numDocumentos} uni):</span>
                                <span className="font-mono">${fmtMXN(resultado.subtotalDerechosBrutos)}</span>
                            </div>

                            {resultado.costoPorTraduccion > 0 && (
                                <div className="flex justify-between items-center text-[10px] text-indigo-300 relative z-10">
                                    <span>Traducción Jurada Certificada (Sellos Perito TSJ):</span>
                                    <span className="font-mono">+ ${fmtMXN(resultado.costoPorTraduccion)}</span>
                                </div>
                            )}

                            {resultado.recargoGestor > 0 && (
                                <div className="flex justify-between items-center text-[10px] text-pink-300 relative z-10">
                                    <span>Gestoría de Vuelta, Filas, Citas y Guías Prepagadas Entregadas:</span>
                                    <span className="font-mono">+ ${fmtMXN(resultado.recargoGestor)}</span>
                                </div>
                            )}
                        </div>

                        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-lg border-2 border-[var(--color-accent)]/30">
                            <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Inversión Bruta Requerida</p>
                            <p className="text-4xl text-[var(--color-accent)] mt-1 font-mono font-bold whitespace-nowrap">
                                ${fmtMXN(resultado.totalInversionExtranjera)}
                            </p>
                            <div className="text-[9px] text-white/40 mt-3 pt-2 border-t border-[var(--color-accent)]/10 px-4 leading-relaxed">
                                Sede Autorizada requerida: <b>{resultado.dependenciaFederalOGobierno}</b>. (Un notario no puede apostillar directamente para validar fuera de MX).
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
