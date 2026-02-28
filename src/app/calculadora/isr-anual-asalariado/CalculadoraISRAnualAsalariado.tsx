'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tarifa anual ISR 2026 (Art. 152 LISR) — Personas Físicas
const TARIFA_ANUAL_2026 = [
    { limiteInf: 0, limiteSup: 8952.49, cuotaFija: 0, tasa: 0.0192 },
    { limiteInf: 8952.50, limiteSup: 75984.55, cuotaFija: 171.88, tasa: 0.0640 },
    { limiteInf: 75984.56, limiteSup: 133536.07, cuotaFija: 4461.94, tasa: 0.1088 },
    { limiteInf: 133536.08, limiteSup: 155229.80, cuotaFija: 10723.55, tasa: 0.1600 },
    { limiteInf: 155229.81, limiteSup: 185852.57, cuotaFija: 14194.54, tasa: 0.1792 },
    { limiteInf: 185852.58, limiteSup: 374837.88, cuotaFija: 19682.13, tasa: 0.2136 },
    { limiteInf: 374837.89, limiteSup: 590795.99, cuotaFija: 60049.40, tasa: 0.2352 },
    { limiteInf: 590796.00, limiteSup: 1127926.84, cuotaFija: 110842.74, tasa: 0.3000 },
    { limiteInf: 1127926.85, limiteSup: 1503902.46, cuotaFija: 271981.99, tasa: 0.3200 },
    { limiteInf: 1503902.47, limiteSup: 4511707.37, cuotaFija: 392294.17, tasa: 0.3400 },
    { limiteInf: 4511707.38, limiteSup: Infinity, cuotaFija: 1414947.85, tasa: 0.3500 },
]

function calcularISR(base: number): number {
    const tramo = TARIFA_ANUAL_2026.find(t => base >= t.limiteInf && base <= t.limiteSup)
    if (!tramo) return 0
    return tramo.cuotaFija + (base - tramo.limiteInf) * tramo.tasa
}

// Tabla Subsidio al Empleo anual 2026 (Art. 113 LISR)
function calcularSubsidioEmpleo(ingresosAnuales: number): number {
    // La tabla mensual es hasta ~8,346 MXN/mes = 100,152 anuales
    if (ingresosAnuales > 100152) return 0
    if (ingresosAnuales <= 20046) return 4113.60
    if (ingresosAnuales <= 22398) return 3906.00
    if (ingresosAnuales <= 24654) return 3498.00
    if (ingresosAnuales <= 26952) return 3258.00
    if (ingresosAnuales <= 29250) return 3018.00
    if (ingresosAnuales <= 31548) return 2682.00
    if (ingresosAnuales <= 33858) return 2448.00
    if (ingresosAnuales <= 36162) return 2214.00
    if (ingresosAnuales <= 38472) return 1980.00
    if (ingresosAnuales <= 40788) return 1740.00
    if (ingresosAnuales <= 100152) return 1140.00
    return 0
}

export default function CalculadoraISRAnualAsalariado() {
    const [ingresosAnuales, setIngresosAnuales] = useState('300000')
    const [retencionesAnuales, setRetencionesAnuales] = useState('30000')
    const [deducciones, setDeducciones] = useState('15000')
    const [honMedicos, setHonMedicos] = useState('8000')
    const [actividadEmpresarial, setActividadEmpresarial] = useState(false)
    const [donativos, setDonativos] = useState('5000')
    const [fondoAhorro, setFondoAhorro] = useState('0')

    const resultado = useMemo(() => {
        const ingresos = parseFloat(ingresosAnuales) || 0
        const retenciones = parseFloat(retencionesAnuales) || 0
        const dedsPers = parseFloat(deducciones) || 0
        const medicos = parseFloat(honMedicos) || 0
        const donat = parseFloat(donativos) || 0
        const ahorro = parseFloat(fondoAhorro) || 0
        if (ingresos <= 0) return null

        // Deducciones personales (Art. 151 LISR)
        const dedTotal = dedsPers + medicos + donat + ahorro
        const limDed = Math.min(ingresos * 0.15, 179110.40)  // Tope 5 UMAs anuales 2026
        const dedPermitidas = Math.min(dedTotal, limDed)

        // Base gravable
        const baseGravable = Math.max(ingresos - dedPermitidas, 0)

        // ISR según tarifa Art. 152
        const isrSegunTarifa = calcularISR(baseGravable)

        // Subsidio al empleo anual
        const subsidio = calcularSubsidioEmpleo(ingresos)

        // ISR del ejercicio (neto de subsidio)
        const isrEjercicio = Math.max(isrSegunTarifa - subsidio, 0)

        // Comparar con retenciones
        const diferencia = isrEjercicio - retenciones
        const saldoFavor = diferencia < 0
        const montoDif = Math.abs(diferencia)

        return {
            ingresos, retenciones, dedPermitidas, dedTotal, limDed,
            baseGravable, isrSegunTarifa, subsidio, isrEjercicio,
            diferencia, saldoFavor, montoDif
        }
    }, [ingresosAnuales, retencionesAnuales, deducciones, honMedicos, donativos, fondoAhorro])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📋</span><span>ISR Anual Asalariado · Arts. 96, 151, 152 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR Anual PF Asalariado 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Determina si tienes <strong className="text-emerald-400">saldo a favor</strong> o
                    <strong className="text-red-400"> impuesto a pagar</strong> en tu declaración anual.
                    Incluye deducciones personales Art. 151 LISR.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div>
                    <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-3">📥 Ingresos y retenciones del año</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">Ingresos anuales por salarios ($)</label>
                            <input type="number" value={ingresosAnuales} onChange={e => setIngresosAnuales(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">ISR retenido por el patrón ($)</label>
                            <input type="number" value={retencionesAnuales} onChange={e => setRetencionesAnuales(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-[var(--color-text-muted)] font-semibold mb-3">📤 Deducciones personales (Art. 151 LISR)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Honorarios médicos ($)', val: honMedicos, set: setHonMedicos, icon: '🏥' },
                            { label: 'Donativos ($)', val: donativos, set: setDonativos, icon: '🤲' },
                            { label: 'Fondo de ahorro ($)', val: fondoAhorro, set: setFondoAhorro, icon: '💰' },
                            { label: 'Otras ded. personales ($)', val: deducciones, set: setDeducciones, icon: '📄' },
                        ].map((d, i) => (
                            <div key={i}>
                                <label className="block text-xs text-[var(--color-text-muted)] mb-1.5">{d.icon} {d.label}</label>
                                <input type="number" value={d.val} onChange={e => d.set(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className={`p-4 rounded-xl border text-center ${resultado.saldoFavor ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <p className={`text-2xl font-bold font-mono ${resultado.saldoFavor ? 'text-emerald-400' : 'text-red-400'}`}>
                            {resultado.saldoFavor ? `✅ Saldo a Favor: $${fmtMXN(resultado.montoDif)}` : `⚠️ ISR a Pagar: $${fmtMXN(resultado.montoDif)}`}
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                            {resultado.saldoFavor ? 'El SAT te devuelve este monto en tu declaración anual' : 'Debes pagar este monto al SAT antes del 30 de abril'}
                        </p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="space-y-2 text-sm">
                            {[
                                { l: 'Ingresos acumulables del ejercicio', v: resultado.ingresos },
                                { l: `Deducciones personales permitidas (tope: $${fmtMXN(resultado.limDed)})`, v: -resultado.dedPermitidas },
                                { l: 'Base gravable', v: resultado.baseGravable },
                                { l: 'ISR según tarifa Art. 152', v: resultado.isrSegunTarifa },
                                ...(resultado.subsidio > 0 ? [{ l: 'Subsidio al empleo anual', v: -resultado.subsidio }] : []),
                                { l: 'ISR del ejercicio', v: resultado.isrEjercicio },
                                { l: 'ISR retenido por el patrón', v: -resultado.retenciones },
                                { l: resultado.saldoFavor ? 'SALDO A FAVOR' : 'IMPUESTO A PAGAR', v: resultado.diferencia, accent: true },
                            ].map((r: { l: string; v: number; accent?: boolean }, i) => (
                                <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? (resultado.saldoFavor ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30') : 'bg-white/5'}`}>
                                    <span className={`text-xs ${r.accent ? (resultado.saldoFavor ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold') : 'text-white/60'}`}>{r.l}</span>
                                    <span className={`font-mono font-bold ${r.accent ? (resultado.saldoFavor ? 'text-emerald-400 text-xl' : 'text-red-400 text-xl') : 'text-white text-xs'}`}>
                                        {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 96, 151, 152 LISR. Tarifa anual 2026. Deducciones Art. 151: tope menor al 15% ingresos o 5 UMAs anuales. Declaración anual: 1° enero–30 abril del año siguiente.
            </p>
        </main>
    )
}
