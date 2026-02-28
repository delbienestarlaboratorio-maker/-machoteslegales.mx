'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getSMG, fmtMXN } from '@/data/legal-constants'

export default function CalculadoraEmbargoNomina() {
    const [salarioMensual, setSalarioMensual] = useState('20000')
    const [tipoEmbargo, setTipoEmbargo] = useState<'judicial' | 'pension' | 'sat' | 'imss' | 'infonavit' | 'institucional'>('judicial')
    const [montoDeuda, setMontoDeuda] = useState('100000')
    const [mesesPago, setMesesPago] = useState('12')
    const anioCalculo = ANIO_ACTUAL
    const smg = getSMG(anioCalculo)

    // Reglas Art. 110 LFT y Art. 20 CFF
    const REGLAS = {
        judicial: { nombre: 'Embargo judicial (crédito civil/mercantil)', pctMax: 30, base: 'sobre ingresos netos', art: 'Art. 110 Fr. IV LFT' },
        pension: { nombre: 'Pensión alimenticia', pctMax: 100, base: 'el juez fija el monto', art: 'Art. 110 Fr. V LFT' },
        sat: { nombre: 'Embargo SAT (Art. 20 CFF)', pctMax: 10, base: 'sobre ingresos brutos', art: 'Art. 20 Fr. III CFF' },
        imss: { nombre: 'Cuotas IMSS no cubiertas', pctMax: 20, base: 'sobre salario', art: 'Art. 110 Fr. II LFT + LSS' },
        infonavit: { nombre: 'Descuento INFONAVIT (crédito vigente)', pctMax: 30, base: 'sobre salario', art: 'Art. 29 Fr. II Ley INFONAVIT' },
        institucional: { nombre: 'Préstamo institucional (FONACOT, caja)', pctMax: 25, base: 'sobre salario mediante convenio', art: 'Art. 110 Fr. I LFT' },
    } as const

    const resultado = useMemo(() => {
        const salario = parseFloat(salarioMensual) || 0
        const deuda = parseFloat(montoDeuda) || 0
        const meses = parseInt(mesesPago) || 12
        if (salario <= 0) return null

        const regla = REGLAS[tipoEmbargo]
        const pctMax = regla.pctMax / 100

        // Parte inembargable (1 SMG mensual siempre protegido — Art. 110 LFT)
        const montoProtegido = smg.general * 30.4
        const salarioEmbargable = Math.max(salario - montoProtegido, 0)

        // Monto máximo descontable
        let montoMaxDescuentoMes: number
        if (tipoEmbargo === 'pension') {
            // Pensión: el juez decide, el salario mínimo no se puede tocar
            montoMaxDescuentoMes = salario - montoProtegido
        } else if (tipoEmbargo === 'sat') {
            montoMaxDescuentoMes = salario * pctMax
        } else {
            montoMaxDescuentoMes = Math.min(salario * pctMax, salarioEmbargable)
        }

        // Descuento mensual sugerido para cubrir deuda en plazo
        const descuentoMesParaDeuda = deuda / meses
        const descuentoAplicable = Math.min(descuentoMesParaDeuda, montoMaxDescuentoMes)

        // Meses reales necesarios con el descuento máximo
        const mesesNecesarios = montoMaxDescuentoMes > 0 ? Math.ceil(deuda / montoMaxDescuentoMes) : 0

        const salarioNeto = salario - descuentoAplicable
        const pctDescuento = (descuentoAplicable / salario) * 100

        return {
            salario, deuda, meses,
            montoProtegido, salarioEmbargable,
            montoMaxDescuentoMes, descuentoMesParaDeuda,
            descuentoAplicable, mesesNecesarios, salarioNeto,
            pctDescuento, regla, pctMax
        }
    }, [salarioMensual, montoDeuda, mesesPago, tipoEmbargo])

    const tiposEmb = Object.entries(REGLAS).map(([k, v]) => ({ k: k as typeof tipoEmbargo, ...v }))

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🔒</span><span>Embargo Nómina · Art. 110 LFT + Art. 20 CFF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Embargo / Retención en Nómina</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El salario tiene límites legales de embargo. El
                    <strong className="text-[var(--color-accent)]"> salario mínimo siempre es inembargable</strong> (Art. 110 LFT).
                    El resto tiene topes según el tipo de deuda.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {tiposEmb.map(t => (
                    <button key={t.k} onClick={() => setTipoEmbargo(t.k)}
                        className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${tipoEmbargo === t.k ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="font-bold text-[10px] leading-tight">{t.nombre}</p>
                        <p className={`font-mono mt-1 ${tipoEmbargo === t.k ? 'text-[var(--color-accent)]' : 'text-white/40'}`}>
                            {t.pctMax === 100 ? '⚖️ Juez' : `${t.pctMax}% máx.`}
                        </p>
                    </button>
                ))}
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">SMG mensual protegido: ${fmtMXN(smg.general * 30.4)}</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Monto total de la deuda ($)</label>
                        <input type="number" value={montoDeuda} onChange={e => setMontoDeuda(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Plazo propuesto (meses)</label>
                        <input type="number" value={mesesPago} onChange={e => setMesesPago(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-white font-bold text-lg">🔒 Límites de embargo</h2>
                        <span className="text-[10px] text-[var(--color-text-muted)]">{resultado.regla.art}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        {[
                            { l: 'Salario mensual', v: resultado.salario },
                            { l: `Parte inembargable (SMG mensual — Art. 110 LFT)`, v: -resultado.montoProtegido },
                            { l: 'Salario embargable', v: resultado.salarioEmbargable },
                            { l: `Máximo descontable por nómina (${resultado.pctMax * 100}% — ${resultado.regla.base})`, v: resultado.montoMaxDescuentoMes, accent: true },
                        ].map((r: { l: string; v: number; accent?: boolean }, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-white/50 mb-1">Descuento mes (tu propuesta)</p>
                            <p className="text-white font-bold font-mono">${fmtMXN(resultado.descuentoMesParaDeuda)}</p>
                            {resultado.descuentoMesParaDeuda > resultado.montoMaxDescuentoMes && (
                                <p className="text-red-400 text-[9px] mt-0.5">Excede el límite legal</p>
                            )}
                        </div>
                        <div className="bg-[var(--color-accent)]/5 rounded-xl p-3 text-center border border-[var(--color-accent)]/20">
                            <p className="text-white/50 mb-1">Descuento máx. aplicable</p>
                            <p className="text-[var(--color-accent)] font-bold font-mono">${fmtMXN(resultado.descuentoAplicable)}/mes</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-white/50 mb-1">Meses necesarios</p>
                            <p className="text-white font-bold font-mono">{resultado.mesesNecesarios} meses</p>
                        </div>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5 mt-2 text-xs">
                        <span className="text-white/60">Salario neto después del embargo</span>
                        <span className="font-mono text-white font-bold">${fmtMXN(resultado.salarioNeto)}</span>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 110 LFT: descuentos máximos en salarios. Art. 20 CFF: embargo SAT 10%. SMG siempre inembargable. Pensión alimenticia: juez determina monto. Consulta abogado para tu caso específico.
            </p>
        </main>
    )
}
