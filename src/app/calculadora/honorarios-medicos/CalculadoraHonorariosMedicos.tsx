'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraHonorariosMedicos() {
    const [monto, setMonto] = useState('1000')
    const [tipoMonto, setTipoMonto] = useState<'bruto' | 'neto'>('bruto')
    const [facturaAPM, setFacturaAPM] = useState(true)

    const resultado = useMemo(() => {
        const amt = parseFloat(monto) || 0
        if (amt === 0) return null

        let subtotal = 0
        let retencionISR = 0
        let totalNeto = 0

        // Art. 15 Fracc. XIV de LIVA: Los servicios profesionales de medicina (incluidos dentistas y psicólogos) prestados por personas físicas están EXENTOS de IVA.
        // IVA retenido por tanto es 0.
        // Art. 106 LISR: Retención del 10% de ISR por PM a PF por servicios profesionales.

        if (tipoMonto === 'bruto') {
            subtotal = amt
            retencionISR = facturaAPM ? subtotal * 0.10 : 0
            totalNeto = subtotal - retencionISR
        } else {
            // Ingeniería inversa desde el neto.
            // Si Factura a PM: Neto = Subtotal - (Subtotal * 0.10) => Neto = Subtotal * 0.90 => Subtotal = Neto / 0.90
            totalNeto = amt
            if (facturaAPM) {
                subtotal = totalNeto / 0.90
                retencionISR = subtotal * 0.10
            } else {
                subtotal = totalNeto
                retencionISR = 0
            }
        }

        return { subtotal, retencionISR, totalNeto }
    }, [monto, tipoMonto, facturaAPM])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🩺</span><span>Honorarios Médicos · Exentos de LIVA</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Honorarios Médicos (Sin IVA)</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Los médicos, odontólogos, psicólogos y nutriólogos (con título) están <strong className="text-white">exentos de IVA</strong> por ley. Calcula tus recibos considerando retenciones si le facturas a un Hospital o Aseguradora (Persona Moral).
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Monto del recibo ($)</label>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">El monto ingresado es...</label>
                        <select value={tipoMonto} onChange={e => setTipoMonto(e.target.value as any)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="bruto">Bruto (Mi tarifa u honorario base)</option>
                            <option value="neto">Neto (Quiero que me depositen esto exacto libre)</option>
                        </select>
                    </div>
                </div>

                <label className="flex gap-3 p-4 rounded-xl bg-[var(--color-accent)]/10 cursor-pointer border border-[var(--color-accent)]/30 items-center mt-2">
                    <input type="checkbox" checked={facturaAPM} onChange={e => setFacturaAPM(e.target.checked)} className="w-5 h-5 text-[var(--color-accent)]" />
                    <div>
                        <span className="text-sm font-bold text-white">Le facturo a una Empresa, Hospital o Aseguradora</span>
                        <p className="text-[10px] text-white/50">Si es Persona Moral, te deben retener por ley el 10% de ISR.</p>
                    </div>
                </label>
                {!facturaAPM && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold">
                        ⚕️ Paciente directo (Persona Física): No hay retenciones. El subtotal es el total.
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-2xl mx-auto">
                    <h2 className="text-white font-bold text-lg mb-4 text-center">🧾 Estructura de Factura (Recibo de Honorarios)</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">Honorarios Médicos (Subtotal)</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.subtotal)}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-xs text-emerald-400 font-bold">IVA (Exento 0%)</span>
                            <span className="font-mono text-emerald-400 font-bold">$0.00</span>
                        </div>

                        {resultado.retencionISR > 0 && (
                            <>
                                <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                    <span className="text-xs text-orange-400 font-bold">Retención ISR (10%)</span>
                                    <span className="font-mono text-orange-400 font-bold">-${fmtMXN(resultado.retencionISR)}</span>
                                </div>
                                <div className="flex justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 opacity-50">
                                    <span className="text-xs text-orange-400 font-bold line-through">Retención IVA (No aplica)</span>
                                    <span className="font-mono text-orange-400 font-bold">-$0.00</span>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 mt-4">
                            <div>
                                <span className="block text-sm text-[var(--color-accent)] font-bold">Total a Depositar (Neto)</span>
                                <span className="text-[10px] text-[var(--color-accent)]/60">Éste es el monto final que te pagarán.</span>
                            </div>
                            <span className="font-mono text-[var(--color-accent)] font-bold text-2xl self-center">${fmtMXN(resultado.totalNeto)}</span>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-[10px] text-white/30 text-center mt-6 max-w-2xl mx-auto">
                Ojo: Al facturar médicos, la clave de producto/servicio SAT suele ser "85121600 - Servicios médicos" o según especialidad. En concepto de impuestos debe reflejarse el IVA marcado como "Exento". Veterinarios NO califican en esta exención, ellos sí cobran 16% de IVA.
            </p>
        </main>
    )
}
