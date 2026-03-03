'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraCompensacionHogar() {
    const [valorBienes, setValorBienes] = useState('2500000')
    const [aniosMatrimonio, setAniosMatrimonio] = useState('10')
    const [dedicacionHogar, setDedicacionHogar] = useState<'total' | 'parcial_doble_jornada' | 'casi_nula'>('total')
    const [bienesPropios, setBienesPropios] = useState('0')

    const resultado = useMemo(() => {
        const masaAcumulada = parseFloat(valorBienes) || 0
        const patrimonioPropio = parseFloat(bienesPropios) || 0
        const anios = parseInt(aniosMatrimonio) || 1

        let porcentajeCompensacion = 0
        let justificacion = ''

        // SCJN ha determinado que la dedicación al hogar tiene valor patrimonial.
        // El máximo legal es 50%, pero el juez lo gradúa según la duración del matrimonio y el esfuerzo aportado.

        if (dedicacionHogar === 'total') {
            // Dedicación exclusiva = indemnización alta
            porcentajeCompensacion = Math.min(20 + (anios * 1.5), 50)
            justificacion = `Digna acreedora de hasta el máximo legal (50%) por dedicación plena que causó costo de oportunidad (no pudiste desarrollarte profesionalmente fuera). SCJN: El trabajo del hogar es una aportación económica.`
        } else if (dedicacionHogar === 'parcial_doble_jornada') {
            // Doble jornada (Trabajaba y aparte hacía la mayor parte del hogar) - SCJN Amparo Directo en Revisión
            porcentajeCompensacion = Math.min(10 + (anios * 1.5), 40)
            justificacion = `La Suprema Corte de Justicia reconoce la "doble jornada". Aunque trabajaste y tienes bienes propios, haber llevado la carga mayoritaria del hogar desequilibró tu crecimiento frente a tu cónyuge.`
        } else {
            porcentajeCompensacion = 0
            justificacion = `No procede compensación patrimonial significativa si no existió dedicación preponderante al cuidado del hogar ni hijos.`
        }

        // El juez descuenta los bienes que el solicitante HAYA adquirido a su propio nombre durante el matrimonio
        let montoBaseTeorico = masaAcumulada * (porcentajeCompensacion / 100)

        let montoNeto = montoBaseTeorico - patrimonioPropio
        if (montoNeto < 0) montoNeto = 0

        return {
            porcentajeCompensacion,
            montoBruto: montoBaseTeorico,
            montoNeto,
            patrimonioPropio,
            justificacion
        }

    }, [valorBienes, aniosMatrimonio, dedicacionHogar, bienesPropios])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏠</span><span>Derecho Familiar · Equidad de Género</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Compensación Económica</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si te casaste por <strong className="text-white">Separación de Bienes</strong> pero te dedicaste al hogar o hijos, la ley (Ej. Art. 267 Fr. VI CDMX) te otorga el derecho a reclamar hasta el 50% de los bienes que tu expareja compró durante el matrimonio.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor Total de Bienes que compró tu Ex-cónyuge ($)</label>
                    <input type="number" value={valorBienes} onChange={e => setValorBienes(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] focus:outline-none" />
                    <p className="text-[10px] text-white/40 mt-1">Cuentan casas, cuentas bancarias, autos y negocios adquiridos *durante* la vigencia del matrimonio.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de Matrimonio</label>
                        <input type="number" value={aniosMatrimonio} onChange={e => setAniosMatrimonio(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Bienes Adquiridos a TU nombre ($)</label>
                        <input type="number" value={bienesPropios} onChange={e => setBienesPropios(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-2 font-semibold text-center mt-2">Nivel de Dedicación al Hogar / Hijos</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                            { val: 'total', label: 'Dedicación Total', desc: 'Renuncié a mi vida laboral.' },
                            { val: 'parcial_doble_jornada', label: 'Doble Jornada', desc: 'Trabajaba pero hacía todo en casa.' },
                            { val: 'casi_nula', label: 'Casi Nula', desc: 'Ambos aportaban igual en casa y trabajo.' }
                        ].map(opt => (
                            <div key={opt.val} onClick={() => setDedicacionHogar(opt.val as any)}
                                className={`p-3 rounded-xl cursor-pointer border text-center transition-all ${dedicacionHogar === opt.val ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                <span className={`block font-bold text-sm ${dedicacionHogar === opt.val ? 'text-[var(--color-accent)]' : 'text-white'}`}>{opt.label}</span>
                                <span className="text-[9px] text-white/50 block mt-1">{opt.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-2xl mx-auto custom-pattern bg-[url('/grid.svg')]">

                    <div className="text-center mb-6">
                        <p className="text-sm text-white/50 font-bold mb-1">Monto de Compensación Estimado Demandable</p>
                        <p className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.montoNeto)}</p>
                        <p className="text-xs text-[var(--color-accent)] mt-2">El juez podría otorgarte el <strong>{resultado.porcentajeCompensacion.toFixed(1)}%</strong> del patrimonio acumulado por tu expareja.</p>
                    </div>

                    <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                        <div className="flex justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-white/60">Estimación Bruta (Porcentaje sobre masa total)</span>
                            <span className="font-mono text-white/80">${fmtMXN(resultado.montoBruto)}</span>
                        </div>

                        {resultado.patrimonioPropio > 0 && (
                            <div className="flex justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                                <div>
                                    <span className="block text-orange-400 font-bold">(-) Ajuste de Equidad: Tus Bienes Propios</span>
                                    <span className="text-[10px] text-orange-300">Si tú también lograste comprar bienes propios trabajando, el juez los descuenta de la compensación para buscar el equilibrio.</span>
                                </div>
                                <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.patrimonioPropio)}</span>
                            </div>
                        )}

                        <div className="mt-4 p-4 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                            <p className="text-xs text-[var(--color-accent)] font-bold mb-1">💡 Jurisprudencia de la SCJN (Sentido de la Sentencia):</p>
                            <p className="text-xs text-white/80 leading-relaxed">{resultado.justificacion}</p>
                        </div>
                    </div>

                    <p className="text-[10px] text-white/30 text-center mt-6">
                        Para cobrarlo debes solicitarlo en la Demanda de Divorcio Inicial o como Incidente. No prescriben los derechos de paridad patrimonial, la Suprema Corte ha sido sumamente garantista en la mal llamada "pensión compensatoria".
                    </p>
                </div>
            )}
        </main>
    )
}
