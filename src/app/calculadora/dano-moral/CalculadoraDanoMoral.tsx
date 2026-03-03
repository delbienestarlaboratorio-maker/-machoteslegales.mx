'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraDanoMoral() {
    const [ingresosVictima, setIngresosVictima] = useState('15000')
    const [ingresosOfensor, setIngresosOfensor] = useState('30000')
    const [gravedadIlicito, setGravedadIlicito] = useState<'leve' | 'media' | 'grave' | 'muy_grave'>('media')
    const [afectacionExtrapatrimonial, setAfectacionExtrapatrimonial] = useState<'baja' | 'moderada' | 'severa' | 'irrevesible'>('moderada')

    const resultado = useMemo(() => {
        // Art. 1916 CCF: Grado de responsabilidad, situación económica del responsable/víctima y demás circunstancias.
        const ingVic = parseFloat(ingresosVictima) || 0
        const ingOfe = parseFloat(ingresosOfensor) || 0

        let multiplicadorBase = 0
        if (gravedadIlicito === 'leve') multiplicadorBase = 3;       // 3 meses de salario
        if (gravedadIlicito === 'media') multiplicadorBase = 12;      // 1 año de salario
        if (gravedadIlicito === 'grave') multiplicadorBase = 36;      // 3 años
        if (gravedadIlicito === 'muy_grave') multiplicadorBase = 120; // 10 años (casos extremos SCJN como negligencias graves u hoteles)

        // Ajuste por gravedad de afectación personal
        if (afectacionExtrapatrimonial === 'baja') multiplicadorBase *= 0.5
        if (afectacionExtrapatrimonial === 'moderada') multiplicadorBase *= 1
        if (afectacionExtrapatrimonial === 'severa') multiplicadorBase *= 1.5
        if (afectacionExtrapatrimonial === 'irrevesible') multiplicadorBase *= 2.5

        // Ingreso mixto ponderado: La Corte dice "justa indemnización" y "capacidad económica del responsable" (punitivo).
        // Ponderamos 60% el ingreso de la víctima (lo que perdió en calidad de vida ponderable) y 40% el del ofensor (pena).
        let ingresoBase = (ingVic * 0.6) + (ingOfe * 0.4)

        // Piso mínimo para que existan montos de condena (equivalente a 1 UMA elevada al mes aprox)
        if (ingresoBase < 3500) ingresoBase = 3500

        // Estimación paramétrica judicial
        const estimacionMinima = ingresoBase * multiplicadorBase * 0.6 // -40% como banda baja
        const estimacionJusta = ingresoBase * multiplicadorBase
        const estimacionMaxima = ingresoBase * multiplicadorBase * 1.5 // +50% jurisprudencial punitivo

        // Días estimados de juicio (simbólico)
        const duracionJuicio = gravedadIlicito === 'leve' ? '12-18 meses' : '2 a 4 años (con amparos)'

        return {
            estimacionMinima,
            estimacionJusta,
            estimacionMaxima,
            duracionJuicio,
            factorMultiplicador: multiplicadorBase
        }
    }, [ingresosVictima, ingresosOfensor, gravedadIlicito, afectacionExtrapatrimonial])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💔</span><span>Responsabilidad Civil · Art. 1916 CCF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador Estimado de <span className="gradient-gold">Daño Moral</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    A diferencia del daño a las cosas (fácil de cuantificar), el Daño Moral atenta contra **sentimientos, honor y reputación**. Este simulador proyecta bandas de indemnización usando los **Parámetros Jurisprudenciales de la SCJN**.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tus ingresos mensuales aprox ($) - Víctima</label>
                        <input type="number" value={ingresosVictima} onChange={e => setIngresosVictima(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-accent)] mt-1">Sirve para medir la alteración a tu estándar o proyecto de vida.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos mensuales aprox ($) - Empresa/Persona Ofensora</label>
                        <input type="number" value={ingresosOfensor} onChange={e => setIngresosOfensor(e.target.value)}
                            className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold font-mono text-lg focus:outline-none" />
                        <p className="text-[10px] text-amber-400 mt-1">Si es una empresa cotizada o multimedios, pon un ingreso MUY alto. La multa es 'punitiva'.</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                    <label className="block text-sm text-white font-bold mb-3">1. Gravedad de la Conducta (dolo o negligencia del ofensor)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { val: 'leve', label: 'Leve', desc: 'Culpa sin dolo.' },
                            { val: 'media', label: 'Media', desc: 'Difamación común.' },
                            { val: 'grave', label: 'Grave', desc: 'Destrucción reputacional dolo.' },
                            { val: 'muy_grave', label: 'Muy Grave', desc: 'Negligencia médica muerte/dolo.' }
                        ].map(opt => (
                            <div key={opt.val} onClick={() => setGravedadIlicito(opt.val as any)}
                                className={`p-3 rounded-xl cursor-pointer border text-center transition-all ${gravedadIlicito === opt.val ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                <span className={`block font-bold text-sm ${gravedadIlicito === opt.val ? 'text-[var(--color-accent)]' : 'text-white'}`}>{opt.label}</span>
                                <span className="text-[9px] text-white/50 block mt-1">{opt.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-white font-bold mb-3">2. Afectación a los Sentimientos (dolor de la víctima)</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {[
                            { val: 'baja', label: 'Baja', desc: 'Enojo, molestia pasajera.' },
                            { val: 'moderada', label: 'Moderada', desc: 'Daño público, estrés constante.' },
                            { val: 'severa', label: 'Severa', desc: 'Trauma psicológico severo.' },
                            { val: 'irrevesible', label: 'Irreversible', desc: 'Trastorno o pérdida humana.' }
                        ].map(opt => (
                            <div key={opt.val} onClick={() => setAfectacionExtrapatrimonial(opt.val as any)}
                                className={`p-3 rounded-xl cursor-pointer border text-center transition-all ${afectacionExtrapatrimonial === opt.val ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                <span className={`block font-bold text-sm ${afectacionExtrapatrimonial === opt.val ? 'text-purple-400' : 'text-white'}`}>{opt.label}</span>
                                <span className="text-[9px] text-white/50 block mt-1">{opt.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-3xl mx-auto custom-pattern bg-[url('/grid.svg')]">
                    <h2 className="text-white font-bold text-lg mb-4 text-center">Banda de Indemnización Esperada</h2>
                    <p className="text-xs text-white/60 text-center mb-6">El juez es LIBRE en dictar sentencia en base al "prudente arbitrio". No existe "tarifa legal".</p>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex-1 w-full text-center">
                            <span className="block text-xs text-white/40 mb-1">Peor Escenario (Mínimo)</span>
                            <span className="font-mono text-xl text-white/80">${fmtMXN(resultado.estimacionMinima)}</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)] outline outline-4 outline-[var(--color-accent)]/10 flex-1 w-full text-center transform md:scale-110 z-10">
                            <span className="block text-sm text-[var(--color-accent)] font-bold mb-1">Monto Justo Ponderado</span>
                            <span className="font-mono text-3xl font-bold text-[var(--color-accent)]">${fmtMXN(resultado.estimacionJusta)}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex-1 w-full text-center">
                            <span className="block text-xs text-orange-400/70 mb-1">Supuesto Punitivo (Máximo)</span>
                            <span className="font-mono text-xl text-orange-400 font-bold">${fmtMXN(resultado.estimacionMaxima)}</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm p-4 bg-black/30 rounded-lg">
                        <p className="text-white/70">⚖️ Duración estimada del litigio civil: <strong className="text-white">{resultado.duracionJuicio}</strong></p>
                        <p className="text-[10px] text-white/40 mt-2">Fundamento: Al cuantificar la indemnización, no debe tasarse en tarifas inamovibles (Tope del LFT inconstitucional para Daño Moral civil, Amparo Directo 30/2013 SCJN), sino basarse en los derechos lesionados y la reprochabilidad del sujeto.</p>
                    </div>
                </div>
            )}
        </main>
    )
}
