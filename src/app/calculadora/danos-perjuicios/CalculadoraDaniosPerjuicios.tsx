'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN } from '@/data/legal-constants'

export default function CalculadoraDaniosPerjuicios() {
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    // Daño Emergente
    const [bienesDestruidos, setBienesDestruidos] = useState('50000')
    const [gastosEmergencia, setGastosEmergencia] = useState('15000')
    const [honorariosLegales, setHonorariosLegales] = useState('20000')
    // Lucro Cesante
    const [ingresosDejaronCobrar, setIngresosDejaronCobrar] = useState('8000')
    const [mesesAafectacion, setMesesAfectacion] = useState('6')
    // Daño Moral
    const [incluyeDanoMoral, setIncluyeDanoMoral] = useState(false)
    const [intensidadDano, setIntensidadDano] = useState<1 | 2 | 3>(1)  // 1=leve, 2=moderado, 3=severo
    // Actualización
    const [incluyeActualizacion, setIncluyeActualizacion] = useState(true)
    const [mesesDesdeEvento, setMesesDesdeEvento] = useState('12')

    const uma = getUMA(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        // Daño emergente = todo lo que salió del patrimonio
        const danoEmergente = (parseFloat(bienesDestruidos) || 0) + (parseFloat(gastosEmergencia) || 0) + (parseFloat(honorariosLegales) || 0)

        // Lucro cesante = lo que dejó de entrar al patrimonio
        const lucroCesante = (parseFloat(ingresosDejaronCobrar) || 0) * (parseFloat(mesesAafectacion) || 0)

        const meses = parseInt(mesesDesdeEvento) || 0
        const factorActualizacion = incluyeActualizacion ? Math.pow(1 + 0.035 / 12, meses) : 1  // 3.5% anual estimado
        const danoAct = danoEmergente * factorActualizacion
        const lucroAct = lucroCesante * factorActualizacion

        // Daño moral (Art. 1916 CCF) — estimación referencial
        // Criterios: grado de culpa, situación económica, publicidad, duración, consecuencias
        const intensidades: Record<number, { multiplicador: number; desc: string; rango: string }> = {
            1: { multiplicador: 20, desc: 'Daño leve/transitorio', rango: '20-100 días de SMG' },
            2: { multiplicador: 150, desc: 'Daño moderado/prolongado', rango: '100-500 días de SMG' },
            3: { multiplicador: 500, desc: 'Daño severo/permanente', rango: '500+ días de SMG' },
        }
        const smgDiario = 278.80
        const danoMoralEstimado = incluyeDanoMoral ? smgDiario * intensidades[intensidadDano].multiplicador : 0

        // Total
        const totalSinMoral = danoAct + lucroAct
        const totalGeneral = totalSinMoral + danoMoralEstimado

        // Intereses moratorios (Art. 2395 CC: 9% anual sobre daño)
        const interesesMoratorios = danoEmergente * (0.09 / 12) * meses

        return {
            danoEmergente, lucroCesante, factorActualizacion, danoAct, lucroAct,
            danoMoralEstimado, totalSinMoral, totalGeneral, interesesMoratorios,
            intensidades, smgDiario
        }
    }, [bienesDestruidos, gastosEmergencia, honorariosLegales, ingresosDejaronCobrar, mesesAafectacion,
        incluyeDanoMoral, intensidadDano, incluyeActualizacion, mesesDesdeEvento])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Daños y Perjuicios · Arts. 1910, 2108-2117 CCF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Daños y Perjuicios</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    <strong className="text-white">Daño emergente</strong> (Art. 2108 CCF) + <strong className="text-[var(--color-accent)]">Lucro cesante</strong> (Art. 2109 CCF) +
                    <strong className="text-orange-400"> Daño moral</strong> (Art. 1916 CCF) + actualización por inflación.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="glass-card p-5 rounded-2xl">
                    <p className="text-white font-bold text-sm mb-3">💥 Daño Emergente — Art. 2108 CCF</p>
                    <p className="text-[11px] text-white/50 mb-3">Todo lo que salió del patrimonio como consecuencia directa del daño.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Bienes destruidos/dañados ($)', val: bienesDestruidos, set: setBienesDestruidos },
                            { label: 'Gastos de emergencia/atención ($)', val: gastosEmergencia, set: setGastosEmergencia },
                            { label: 'Honorarios legales y periciales ($)', val: honorariosLegales, set: setHonorariosLegales },
                        ].map((f, i) => (
                            <div key={i}>
                                <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">{f.label}</label>
                                <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl">
                    <p className="text-[var(--color-accent)] font-bold text-sm mb-3">📈 Lucro Cesante — Art. 2109 CCF</p>
                    <p className="text-[11px] text-white/50 mb-3">Ganancia lícita que dejó de percibir por el daño.</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">Ingresos mensuales que dejó de percibir ($)</label>
                            <input type="number" value={ingresosDejaronCobrar} onChange={e => setIngresosDejaronCobrar(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">Meses de afectación</label>
                            <input type="number" value={mesesAafectacion} onChange={e => setMesesAfectacion(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-orange-400 font-bold text-sm">😔 Daño Moral — Art. 1916 CCF (opcional)</p>
                        <label className="flex gap-2 cursor-pointer">
                            <input type="checkbox" checked={incluyeDanoMoral} onChange={e => setIncluyeDanoMoral(e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs text-white/60">Incluir</span>
                        </label>
                    </div>
                    {incluyeDanoMoral && (
                        <div className="grid grid-cols-3 gap-2">
                            {([1, 2, 3] as const).map(n => (
                                <button key={n} onClick={() => setIntensidadDano(n)}
                                    className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${intensidadDano === n ? 'border-orange-500/50 bg-orange-500/10 text-orange-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                    <p className="font-bold">{resultado?.intensidades[n]?.desc}</p>
                                    <p className="opacity-60 text-[9px] mt-0.5">{resultado?.intensidades[n]?.rango}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-white font-bold text-sm">📅 Actualización por inflación</p>
                        <label className="flex gap-2 cursor-pointer">
                            <input type="checkbox" checked={incluyeActualizacion} onChange={e => setIncluyeActualizacion(e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs text-white/60">Incluir</span>
                        </label>
                    </div>
                    {incluyeActualizacion && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">Meses desde el evento dañoso</label>
                            <input type="number" value={mesesDesdeEvento} onChange={e => setMesesDesdeEvento(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                    )}
                </div>
            </div>

            {resultado && (
                <div className="mt-6 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">⚖️ Cuantificación de daños</h2>
                    <div className="space-y-2 text-sm">
                        {[
                            { l: 'Daño emergente', v: resultado.danoEmergente },
                            ...(incluyeActualizacion && resultado.factorActualizacion > 1 ? [{ l: `Daño emergente actualizado (f=${resultado.factorActualizacion.toFixed(4)})`, v: resultado.danoAct }] : []),
                            { l: 'Lucro cesante', v: resultado.lucroCesante },
                            ...(incluyeActualizacion && resultado.factorActualizacion > 1 ? [{ l: 'Lucro cesante actualizado', v: resultado.lucroAct }] : []),
                            ...(incluyeDanoMoral ? [{ l: `Daño moral (${resultado.intensidades[intensidadDano]?.multiplicador} días × SMG $${fmtMXN(resultado.smgDiario)})`, v: resultado.danoMoralEstimado, moral: true }] : []),
                            { l: 'TOTAL DAÑOS Y PERJUICIOS', v: resultado.totalGeneral, accent: true },
                        ].map((r: { l: string; v: number; accent?: boolean; moral?: boolean }, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : r.moral ? 'bg-orange-500/5 border border-orange-500/15' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : r.moral ? 'text-orange-400' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>${fmtMXN(r.v)}</span>
                            </div>
                        ))}
                        {resultado.interesesMoratorios > 0 && (
                            <p className="text-[10px] text-white/30 text-right">+ Intereses moratorios 9% anual (Art. 2395): ${fmtMXN(resultado.interesesMoratorios)}</p>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 1910 CCF responsabilidad civil. Art. 2108: daño emergente. Art. 2109: lucro cesante. Art. 1916: daño moral. Estimador referencial. El juez cuantifica el daño con peritos.
            </p>
        </main>
    )
}
