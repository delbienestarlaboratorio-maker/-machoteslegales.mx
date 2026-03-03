'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tablas Art 113-E LISR (Ingresos Mensuales)
const TARIFA_RESICO_MENSUAL = [
    { limiteSup: 25000, tasa: 0.0100 },  // 1.00%
    { limiteSup: 50000, tasa: 0.0110 },  // 1.10%
    { limiteSup: 83333.33, tasa: 0.0150 },// 1.50%
    { limiteSup: 208333.33, tasa: 0.0200 },// 2.00%
    { limiteSup: 3500000, tasa: 0.0250 },// 2.50% (límite anual mensualizado aprox o tarifa máxima mensual aplicada) - LISR dice ingresos cobrados en el mes.
]

export default function CalculadoraRESICO() {
    const [ingresoMensual, setIngresoMensual] = useState('40000')
    const [facturaAPM, setFacturaAPM] = useState(false)

    const resultado = useMemo(() => {
        const ingresos = parseFloat(ingresoMensual) || 0
        if (ingresos <= 0) return null

        // Determinar tasa aplicable
        let tasaAplicable = 0.0250 // Max default
        for (const tramo of TARIFA_RESICO_MENSUAL) {
            if (ingresos <= tramo.limiteSup) {
                tasaAplicable = tramo.tasa
                break
            }
        }

        const isrCausado = ingresos * tasaAplicable

        // Retenciones: PM retiene 1.25% en RESICO (Art 113-J)
        const retencionPM = facturaAPM ? ingresos * 0.0125 : 0

        // El ISR a pagar puede dar saldo a favor si la retención es mayor al causado
        const isrAPagar = isrCausado - retencionPM
        const saldoAFavor = isrAPagar < 0 ? Math.abs(isrAPagar) : 0
        const isrNetoPagar = isrAPagar > 0 ? isrAPagar : 0

        return { ingresos, tasaAplicable, isrCausado, retencionPM, isrNetoPagar, saldoAFavor }
    }, [ingresoMensual, facturaAPM])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧾</span><span>Personas Físicas · Art. 113-E LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR RESICO 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si estás en el <strong className="text-white">Régimen Simplificado de Confianza</strong>, pagas un ISR súper bajo (1% a 2.5%) directo sobre lo que cobras sin considerar deducciones.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-xl mx-auto">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tus ingresos cobrados en el mes (Sin IVA) $</label>
                    <input type="number" value={ingresoMensual} onChange={e => setIngresoMensual(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                </div>

                <label className="flex gap-3 p-4 rounded-xl bg-[var(--color-accent)]/10 cursor-pointer border border-[var(--color-accent)]/30 items-center mt-2">
                    <input type="checkbox" checked={facturaAPM} onChange={e => setFacturaAPM(e.target.checked)} className="w-5 h-5 text-[var(--color-accent)]" />
                    <div>
                        <span className="text-sm font-bold text-white">Le presté servicios o vendí a Personas Morales (Empresas)</span>
                        <p className="text-[10px] text-white/50">Si palomeas, asumimos que todos los ingresos de este mes fueron a Persona Moral (retiene 1.25%).</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-xl mx-auto">
                    <h2 className="text-white font-bold text-lg mb-4 text-center">🧮 Tu ISR Provisional Mensual</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">Base (Ingresos cobrados)</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.ingresos)}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                            <span className="text-xs text-[var(--color-accent)] font-bold">Tasa Aplicable por Ley</span>
                            <span className="font-mono text-[var(--color-accent)] font-bold">{(resultado.tasaAplicable * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">ISR Causado</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.isrCausado)}</span>
                        </div>

                        {resultado.retencionPM > 0 && (
                            <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <span className="text-xs text-orange-400 font-bold">(-) Retención PM (1.25%)</span>
                                <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.retencionPM)}</span>
                            </div>
                        )}

                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 mt-4">
                            <div>
                                <span className="block text-sm text-[var(--color-accent)] font-bold">ISR Neto A Pagar</span>
                                <span className="text-[10px] text-[var(--color-accent)]/60">Monto a enterar al SAT.</span>
                            </div>
                            <span className="font-mono text-[var(--color-accent)] font-bold text-2xl self-center">${fmtMXN(resultado.isrNetoPagar)}</span>
                        </div>

                        {resultado.saldoAFavor > 0 && (
                            <div className="p-3 mt-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold">
                                ✨ Tienes un saldo virtual a favor por retenciones de ${fmtMXN(resultado.saldoAFavor)} que podrás aplicar en tu declaración anual de RESICO.
                            </div>
                        )}
                    </div>
                </div>
            )}
            <p className="text-[10px] text-white/30 text-center mt-6 max-w-xl mx-auto">
                Ojo: Al ser RESICO no puedes aplicar deducciones autorizadas para calcular el ISR (como gasolina o gastos médicos). El IVA se sigue declarando de forma normal según las facturas cobradas y pagadas. Límite anual para tributar en RESICO: $3.5 millones MXN.
            </p>
        </main>
    )
}
