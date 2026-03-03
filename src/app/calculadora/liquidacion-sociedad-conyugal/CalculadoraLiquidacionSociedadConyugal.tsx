'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraLiquidacionSociedadConyugal() {
    const [activos, setActivos] = useState('4000000') // Casas, autos, ahorros
    const [activosExcluidos, setActivosExcluidos] = useState('500000') // Herencias o donaciones no entran
    const [pasivos, setPasivos] = useState('1200000') // Deudas de ambos (Hipotecas, tarjetas compartidas)

    const [aporteSocio1, setAporteSocio1] = useState('80') // Socio A puso el 80% del esfuerzo

    // Regla de oro en México: En la sociedad conyugal, todo es 50/50 de los GANANCIALES,
    // salvo que haya Capitulaciones Matrimoniales expresas que alteren ese porcentaje. 
    // Que uno haya trabajado y pagado y el otro no, no altera la sociedad conyugal base civil.

    const resultado = useMemo(() => {
        const masaBruta = parseFloat(activos) || 0
        const excluidos = parseFloat(activosExcluidos) || 0
        const deudas = parseFloat(pasivos) || 0

        let masaRealGanancial = masaBruta - excluidos
        if (masaRealGanancial < 0) masaRealGanancial = 0

        // Las deudas adquiridas EN BENEFICIO de la familia y hogar se descuentan de la bolsa común
        let bolsaNetaRepartir = masaRealGanancial - deudas
        if (bolsaNetaRepartir < 0) bolsaNetaRepartir = 0

        // El Fondo Líquido / Fijas Gananciales es Partes Iguales (Art. 182-192 CCF)
        const porcionCoyugue1 = bolsaNetaRepartir / 2
        const porcionCoyugue2 = bolsaNetaRepartir / 2

        // Liquidar a uno "en efectivo" si el otro se queda con el bien raíz
        const compensacionCompraFisica = masaRealGanancial / 2

        return {
            masaRealGanancial,
            bolsaNetaRepartir,
            porcionCoyugue1,
            porcionCoyugue2,
            compensacionCompraFisica,
            deudas
        }

    }, [activos, activosExcluidos, pasivos])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💍</span><span>Divorcio · Gananciales e Inventarios</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Liquidación de la <span className="gradient-gold">Sociedad Conyugal</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si te casaste bajo régimen de "Bienes Mancomunados", la ley dispone que todos los bienes y deudas hechos en el matrimonio son de ambos. Simula el reparto (Fondo Líquido) aquí.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6">

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-green-400">Todo el Patrimonio Adquirido (Activos) $</label>
                    <input type="number" value={activos} onChange={e => setActivos(e.target.value)}
                        className="w-full p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-200 font-mono text-xl focus:outline-none" />
                    <p className="text-[10px] text-white/40 mt-1">Suma del valor comercial de las casas, coches y cuentas bancarias compradas DESDE el día de la boda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-yellow-500">Bienes Excluidos (Herencias) $</label>
                        <input type="number" value={activosExcluidos} onChange={e => setActivosExcluidos(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 font-mono text-lg focus:outline-none" />
                        <p className="text-[9px] text-white/40 mt-1">Lo que te dejaron tus abuelos como Herencia, premios de la Lotería, o lo regalado no entra a la sociedad conyugal.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold text-red-400">Deudas Conyugales (Pasivos) $</label>
                        <input type="number" value={pasivos} onChange={e => setPasivos(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 font-mono text-lg focus:outline-none" />
                        <p className="text-[9px] text-white/40 mt-1">Suma del saldo pendiente de la Hipoteca de la casa conyugal y préstamos mutuos.</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 opacity-50 cursor-not-allowed">
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Quién aportó más porcentaje de dinero en la realidad?</label>
                    <input type="range" disabled value="50" className="w-full accent-[var(--color-accent)]" />
                    <div className="flex justify-between text-xs text-[var(--color-accent)]">
                        <span>Yo pagué {aporteSocio1}%</span>
                        <span>Se divide siempre al 50% legal</span>
                    </div>
                    <p className="text-[10px] text-white/40 text-center mt-1">⚠️ Aunque uno no haya trabajado, al casarse por bienes mancomunados sin capitulaciones restrictivas, automáticamente tienen el 50% de gananciales sobre todo el esfuerzo financiero (SCJN Contradicción 185/2014).</p>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-2xl space-y-4">
                    <div className="glass-card p-6 rounded-2xl border border-[var(--color-accent)]/20 text-center">
                        <p className="text-sm font-bold text-white/50 mb-1">Masa Neta Repartible (Gananciales Netos)</p>
                        <p className="text-4xl md:text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.bolsaNetaRepartir)}</p>
                        <p className="text-xs text-[var(--color-accent)] mt-2">Corresponde la mitad de este monto (<b>${fmtMXN(resultado.porcionCoyugue1)}</b>) a cada ex-cónyuge dictado en el inventario.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 space-y-2">
                            <span className="text-xs font-bold text-white/50 uppercase block">Opción 1: Venta Total y Reparto Liquido</span>
                            <p className="text-sm text-white/80">Ambos firman el acta de remate / venta de la casa y del auto por ${fmtMXN(resultado.masaRealGanancial)}.</p>
                            <p className="text-sm text-white/80">Liquidan al banco prestamista los ${fmtMXN(resultado.deudas)}.</p>
                            <div className="font-mono text-lg font-bold text-green-400 mt-2 border-t border-white/10 pt-2">
                                Ganan: ${fmtMXN(resultado.porcionCoyugue1)} en efectivo cada uno.
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-4 rounded-xl border border-[var(--color-accent)]/20 space-y-2">
                            <span className="text-xs font-bold text-[var(--color-accent)] uppercase block">Opción 2: Compensación y Compra Interna</span>
                            <p className="text-sm text-white/80">El Cónyuge "A" quiere quedarse con la casa mancomunada porque ahí viven los niños.</p>
                            <p className="text-sm text-white/80">Asume las deudas de hipoteca y debe pagarle el 50% del valor de la casa al Cónyuge "B".</p>
                            <div className="font-mono text-lg font-bold text-[var(--color-accent)] mt-2 border-t border-white/10 pt-2">
                                Paga: ${fmtMXN(resultado.compensacionCompraFisica)} al ex cónyuge "B".
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
