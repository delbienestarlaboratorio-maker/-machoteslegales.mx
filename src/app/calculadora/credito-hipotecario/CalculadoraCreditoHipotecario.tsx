'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraCreditoHipotecario() {
    const [valorPropiedad, setValorPropiedad] = useState('2000000')
    const [engancheMonto, setEngancheMonto] = useState('200000')
    const [tasaAnual, setTasaAnual] = useState('10.5')
    const [plazoAnios, setPlazoAnios] = useState('20')

    const engancheVal = parseFloat(engancheMonto) || 0
    const propVal = parseFloat(valorPropiedad) || 0
    const enganchePct = propVal > 0 ? (engancheVal / propVal) * 100 : 0

    const resultado = useMemo(() => {
        const p = parseFloat(valorPropiedad) || 0
        const e = parseFloat(engancheMonto) || 0
        const rAnual = parseFloat(tasaAnual) || 0
        const anos = parseInt(plazoAnios) || 0

        if (p <= 0 || anos <= 0) return null

        const prestamo = Math.max(p - e, 0)
        if (prestamo === 0) return null

        const meses = anos * 12
        const rMensual = (rAnual / 100) / 12

        // Fórmula cuota fija sistema francés: C = P * [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]
        let cuotaFija = 0
        if (rMensual === 0) {
            cuotaFija = prestamo / meses
        } else {
            cuotaFija = prestamo * (rMensual * Math.pow(1 + rMensual, meses)) / (Math.pow(1 + rMensual, meses) - 1)
        }

        const ingresosMinimos = cuotaFija / 0.30 // Regla de salud financiera (la mensualidad no debe pasar del 30% del ingreso bruto)

        // Generar primeros 12 meses de tabla amortización
        const amortizacion = []
        let saldo = prestamo
        let totalInteres = 0

        for (let i = 1; i <= meses; i++) {
            const interesMes = saldo * rMensual
            let capitalMes = cuotaFija - interesMes

            // Ajuste último mes por redondeos decimales
            if (i === meses) { capitalMes = saldo; }

            saldo -= capitalMes
            totalInteres += interesMes

            // Solo guardamos 12 para mostrar en UI sin matar el DOM
            if (i <= 12 || i === meses) {
                amortizacion.push({ mes: i, cuota: cuotaFija, capital: capitalMes, interes: interesMes, saldoFin: Math.max(saldo, 0) })
            }
        }

        return { prestamo, cuotaFija, ingresosMinimos, totalPagar: prestamo + totalInteres, totalInteres, meses, amortizacion }
    }, [valorPropiedad, engancheMonto, tasaAnual, plazoAnios])


    // Handlers para sliders sincronizados (ENGANCHE)
    const handleEngancheSlider = (e: any) => {
        const valPct = parseFloat(e.target.value)
        setEngancheMonto(((valPct / 100) * (parseFloat(valorPropiedad) || 0)).toFixed(0))
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏦</span><span>Transparencia Financiera (Sistema Francés)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador <span className="gradient-gold">Crédito Hipotecario</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula la <strong className="text-white">mensualidad fija</strong> de tu casa, el pago de intereses total y los ingresos base que te pedirá el banco.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor de la Propiedad ($)</label>
                        <input type="number" value={valorPropiedad} onChange={e => { setValorPropiedad(e.target.value); setEngancheMonto(((enganchePct / 100) * parseFloat(e.target.value || '0')).toFixed(0)) }}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-mono focus:border-[var(--color-accent)] focus:outline-none mb-4" />

                        <div className="flex justify-between">
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Monto Enganche ($)</label>
                            <span className="text-xs text-[var(--color-accent)] font-bold">{enganchePct.toFixed(1)}%</span>
                        </div>
                        <input type="number" value={engancheMonto} onChange={e => setEngancheMonto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] font-bold font-mono focus:outline-none mb-2" />
                        <input type="range" min="0" max="95" step="1" value={enganchePct} onChange={handleEngancheSlider} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]" />
                        {enganchePct < 10 && <p className="text-[10px] text-orange-400 mt-1">⚠️ Los bancos suelen pedir *al menos* 10% de enganche.</p>}
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tasa de Interés Anual Fija (%)</label>
                        <input type="number" step="0.1" value={tasaAnual} onChange={e => setTasaAnual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none mb-4" />

                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Plazo del Crédito (Años)</label>
                        <select value={plazoAnios} onChange={e => setPlazoAnios(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none mb-1">
                            {[5, 10, 15, 20, 25, 30].map(a => <option key={a} value={a}>{a} años ({a * 12} meses)</option>)}
                        </select>
                        <p className="text-[10px] text-white/40 mt-1">Plazos más largos bajan la mensualidad pero suben los intereses brutales asombrosamente.</p>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center text-center border-[var(--color-accent)]/40 shadow-[0_0_20px_rgba(235,188,110,0.05)]">
                            <p className="text-sm text-white/60 font-bold mb-2">Pago Mensual Fijo (Amortización Pura)</p>
                            <p className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.cuotaFija)}</p>
                            <p className="text-[10px] text-white/40 mt-3 max-w-xs">No incluye Seguros de Vida/Daños ni comisión de administración. Estima ~$500 - $1,000 extra al mes.</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl space-y-3 text-sm">
                            <div className="flex justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-xs text-emerald-400 font-bold">Monto a Financiar (Deuda Inicial)</span>
                                <span className="font-mono text-emerald-400 font-bold">${fmtMXN(resultado.prestamo)}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <span className="text-xs text-orange-400 font-bold">Costo Total de Intereses ({resultado.meses} meses)</span>
                                <span className="font-mono text-orange-400 font-bold">${fmtMXN(resultado.totalInteres)}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-white/5 font-bold">
                                <span className="text-xs text-white">💰 Total que pagarás al Banco al final</span>
                                <span className="font-mono text-white">${fmtMXN(resultado.totalPagar)}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 mt-4">
                                <span className="text-xs text-purple-300 font-bold">Ingreso bruto mín. requerido por banco:</span>
                                <span className="font-mono text-purple-300 font-bold">~${fmtMXN(resultado.ingresosMinimos)}/mes</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl overflow-x-auto">
                        <h3 className="text-white font-bold mb-4">Extracto de Tabla de Amortización (Año 1)</h3>
                        <table className="w-full text-xs text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-white/50">
                                    <th className="py-2">Mes</th>
                                    <th className="py-2">Mensualidad</th>
                                    <th className="py-2 text-orange-400">Va a Interés</th>
                                    <th className="py-2 text-emerald-400">Va a Capital</th>
                                    <th className="py-2">Saldo Insoluto</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80 font-mono">
                                {resultado.amortizacion.map((a, i) => (
                                    <>
                                        {a.mes === resultado.meses && <tr key="sep"><td colSpan={5} className="py-2 text-center text-white/30 italic text-[10px]">... Múltiples meses saltados ...</td></tr>}
                                        <tr key={a.mes} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-2.5">Mes {a.mes} {(a.mes === resultado.meses) ? '(ÚLTIMO)' : ''}</td>
                                            <td className="py-2.5">${fmtMXN(a.cuota)}</td>
                                            <td className="py-2.5 text-orange-400/80">${fmtMXN(a.interes)}</td>
                                            <td className="py-2.5 text-emerald-400/80">${fmtMXN(a.capital)}</td>
                                            <td className="py-2.5 font-bold">${fmtMXN(a.saldoFin)}</td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    )
}
