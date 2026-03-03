'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraTestamento() {
    const [mesPatrio, setMesPatrio] = useState(false)
    const [estadoRep, setEstadoRep] = useState<'cdmx' | 'norte' | 'sur'>('cdmx') // CDMX / Nuevo Leon / Resto. Tarifas geográficas.
    const [herederoUniversal, setHerederoUniversal] = useState(true) // Si hay muchos legados se cobra por foja extra

    const resultado = useMemo(() => {
        let costoBase = 4500

        // Multiplicador Geográfico 
        if (estadoRep === 'cdmx') costoBase = 5800 // CDMX / EdoMex
        if (estadoRep === 'norte') costoBase = 7500 // Monterrey

        // Especialidades de Redacción 
        const recargoLegados = herederoUniversal ? 0 : 2500 // Si es "Le dejo el coche a Juan, la casa a Pedro y el banco a Ana", es más caro que "Todo a mi esposa por partes iguales".
        let subtotalTestamento = costoBase + recargoLegados

        // Promoción "Septiembre, Mes del Testamento" (Acuerdo SEGOB - Colegio Nacional de Notariado)
        let descuentoSeptiembre = 0
        if (mesPatrio) {
            // Históricamente, en septiembre el costo universal en CDMX se fija en ~$3,500 fijos (un descuento monstruoso).
            descuentoSeptiembre = subtotalTestamento - 3500
            if (descuentoSeptiembre < 0) descuentoSeptiembre = 0
            subtotalTestamento = subtotalTestamento - descuentoSeptiembre
        }

        const ivaNotarial = subtotalTestamento * 0.16
        const derechoAvisoArchivoHeredero = 450 // Aviso a la SEDATU/RENAT o Archivo General (Es obligatorio para que sea busable tras la muerte)

        const granTotal = subtotalTestamento + ivaNotarial + derechoAvisoArchivoHeredero

        return {
            costoBase,
            recargoLegados,
            descuentoSeptiembre,
            ivaNotarial,
            derechoAvisoArchivoHeredero,
            granTotal
        }

    }, [mesPatrio, estadoRep, herederoUniversal])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🕊️</span><span>Derecho Sucesorio y Notarial</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Gastos de Emisión de <span className="gradient-gold">Testamento Público Abierto</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Asegura la tranquilidad de tu familia dictando tu voluntad ante Notario. Calcula evitar sorpresas al solicitar tu escritura mortuoria.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Región Sociodemográfica (Arancel)
                            </label>
                            <select value={estadoRep} onChange={e => setEstadoRep(e.target.value as any)}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-[var(--color-accent)]">
                                <option value="sur">Mayoría de los Estados del Sur y Centro</option>
                                <option value="cdmx">Ciudad de México y Estado de México</option>
                                <option value="norte">Región Norte y Frontera (Nuevo León, Jalisco)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 transition-colors cursor-pointer" onClick={() => setHerederoUniversal(!herederoUniversal)}>
                            <input type="checkbox" checked={herederoUniversal} readOnly className="mt-1 w-4 h-4 accent-amber-500 pointer-events-none" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-amber-300 block mb-1">Deseo dejar Todos mis Bienes como "Todo Entrelazado" (Universal)</label>
                                <p className="text-[10px] text-amber-200/60 leading-tight">Mantenlo activo si dirás "Dejo todo en partes iguales a mis 3 hijos". Si lo APAGAS, significa que enlistarás cuenta por cuenta con nombre apellido (Legados), el Notario cobra más porque son fojas extra.</p>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button onClick={() => setMesPatrio(!mesPatrio)} className={`px-6 py-3 rounded-xl border font-bold uppercase tracking-widest text-xs transition-all ${mesPatrio ? 'bg-green-700 text-white border-green-500 shadow-[0_0_20px_rgba(22,163,74,0.4)]' : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'}`}>
                                🇲🇽 Trámite Exclusivo en Septiembre
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="glass-card p-6 rounded-2xl flex items-center justify-between border-2 border-slate-700 bg-gradient-to-r from-slate-900 to-black">
                        <div>
                            <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Presupuesto Referencial Sugerido</p>
                            <p className="text-4xl text-white mt-1 font-mono font-bold">
                                ${fmtMXN(resultado.granTotal)}
                            </p>
                        </div>
                        {mesPatrio && (
                            <div className="text-right">
                                <div className="text-[10px] bg-green-500 text-black px-3 py-1 rounded font-bold inline-block mb-1 animate-pulse">AHORRO NACIONAL ACTIVADO</div>
                                <div className="font-mono text-xs text-green-400">-${fmtMXN(resultado.descuentoSeptiembre)} bonificados</div>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 space-y-3">
                        <span className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wide border-b border-white/10 pb-2">Desglose Paramétrico</span>
                        <div className="flex justify-between items-center text-[11px] text-white/80">
                            <span>Honorarios por Escribanía y Protocolo Cerrado:</span>
                            <span className="font-mono">${fmtMXN(resultado.costoBase)}</span>
                        </div>
                        {!herederoUniversal && (
                            <div className="flex justify-between items-center text-[11px] text-amber-300">
                                <span>Redacción de Fojas Extraordinarias (Peticiones Legadas Especiales):</span>
                                <span className="font-mono">+ ${fmtMXN(resultado.recargoLegados)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-[11px] text-white/60">
                            <span>Impuesto al Valor Agregado (16% IVA):</span>
                            <span className="font-mono">${fmtMXN(resultado.ivaNotarial)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-white/60 pb-2 border-b border-white/10">
                            <span>Emisión de Aviso al Archivo General de Notarías o RENAT:</span>
                            <span className="font-mono">${fmtMXN(resultado.derechoAvisoArchivoHeredero)}</span>
                        </div>
                    </div>

                    <div className="p-3 text-[10px] text-white/30 text-center leading-relaxed">
                        En México, la mayoría de los notarios ofrecen asesoría inicial gratuita. Este tabulador representa el mercado libre; no compromete ofertas individuales. Promovido en alianza ficticia con la campaña dictatutestamento.gob.mx.
                    </div>
                </div>
            )}
        </main>
    )
}
