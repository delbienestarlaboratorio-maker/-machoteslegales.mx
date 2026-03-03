'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'
import { differenceInDays, parseISO, isValid } from 'date-fns'

export default function CalculadoraChequeSinFondos() {
    const [montoCheque, setMontoCheque] = useState('50000')
    const [fechaRebote, setFechaRebote] = useState(new Date().toISOString().split('T')[0])
    const [tasaConvencional, setTasaConvencional] = useState('') // El cheque en sí no suele tener tasa, pero si firmaron un acuerdo anexo, sí.

    // El Art. 193 LGTOC marca el 20% de indemnización mínima legal.

    const resultado = useMemo(() => {
        const capital = parseFloat(montoCheque) || 0
        const indemnizacionLey = capital * 0.20 // 20% obligatorio Art. 193

        let diasMora = 0
        let interesMoratorio = 0

        const fechaCobro = parseISO(fechaRebote)
        const hoy = new Date()

        if (isValid(fechaCobro)) {
            diasMora = differenceInDays(hoy, fechaCobro)
            if (diasMora < 0) diasMora = 0
        }

        // Tasa de interés: Si no se pactó, en materia mercantil es el 6% anual (Art. 362 Código de Comercio).
        const tasaAnual = parseFloat(tasaConvencional) > 0 ? parseFloat(tasaConvencional) : 6.0
        const tasaDiaria = (tasaAnual / 100) / 365
        interesMoratorio = capital * tasaDiaria * diasMora

        const totalAdeudadoDemanda = capital + indemnizacionLey + interesMoratorio

        return {
            capital,
            indemnizacionLey,
            diasMora,
            tasaAnualApicada: tasaAnual,
            interesMoratorio,
            totalAdeudadoDemanda
        }

    }, [montoCheque, fechaRebote, tasaConvencional])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏦</span><span>Títulos de Crédito · Derecho Mercantil</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Acción Cambiaria por <span className="gradient-gold">Cheque Rebotado</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El <strong className="text-white">Artículo 193 de la LGTOC</strong> sanciona fuertemente a quien libra un cheque sin fondos, obligándolo a pagar el importe más una indemnización del 20% como mínimo.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor del Cheque en Letra/Número ($)</label>
                    <input type="number" value={montoCheque} onChange={e => setMontoCheque(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-red-500/20 text-white font-mono text-xl focus:border-red-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha en que fue devuelto (Rebote Bancario)</label>
                        <input type="date" value={fechaRebote} onChange={e => setFechaRebote(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none [color-scheme:dark]" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Interés Moratorio Pactado (% Anual Múltiple)</label>
                        <input type="number" value={tasaConvencional} onChange={e => setTasaConvencional(e.target.value)} placeholder="(Opcional) Ej. 12"
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[9px] text-white/50 mt-1">Si dejas en blanco, aplicaremos el 6% del Código de Comercio.</p>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-2xl space-y-4">

                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-red-500/30">
                        <p className="text-sm font-bold text-red-400 mb-1">Monto Total Demandable (Ejecutivo Mercantil)</p>
                        <p className="text-5xl font-mono font-bold text-red-500">${fmtMXN(resultado.totalAdeudadoDemanda)}</p>
                        <p className="text-xs text-red-300/80 mt-2">Puedes embargar bienes garantizando este importe el día que se le notifique la demanda.</p>
                    </div>

                    <div className="glass-card p-6 rounded-2xl space-y-3 font-mono text-sm leading-relaxed text-white/80">

                        <div className="flex justify-between items-center p-2 rounded-lg bg-black/20">
                            <span>Importe Original del Documento (Suerte Principal)</span>
                            <span className="font-bold text-white">${fmtMXN(resultado.capital)}</span>
                        </div>

                        <div className="flex justify-between p-3 rounded-lg border bg-orange-500/10 border-orange-500/20 text-orange-200">
                            <div>
                                <span className="block font-bold">Indemnización Obligatoria (Art. 193 LGTOC)</span>
                                <span className="text-[10px] font-sans opacity-80">Si lo cobras extrajudicialmente también puedes exigirla.</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold">${fmtMXN(resultado.indemnizacionLey)}</span>
                                <span className="text-xs opacity-60">20.0%</span>
                            </div>
                        </div>

                        <div className="flex justify-between p-2">
                            <div>
                                <span className="block">Intereses Moratorios Acumulados</span>
                                <span className="text-[10px] text-white/40">Han pasado {resultado.diasMora} días. Tasa del {resultado.tasaAnualApicada}% anual.</span>
                            </div>
                            <span>+ ${fmtMXN(resultado.interesMoratorio)}</span>
                        </div>

                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mt-4">
                        <p className="text-xs text-blue-300 font-bold mb-1">💡 Además, podrías demandar Fraude:</p>
                        <p className="text-xs text-white/70">Librar un cheque sin tener fondos suficientes, si se demuestra dolo y ánimo de enriquecerse a tus expensas, configura el delito de <strong>Fraude</strong> por la vía Penal (lo cual presionaría aún más a tu deudor para pagar ante el miedo de ir a prisión).</p>
                    </div>
                </div>
            )}
        </main>
    )
}
