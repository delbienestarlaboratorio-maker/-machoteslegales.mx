'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

const TARIFAS_LFD_INM = [
    // Artículo 8 LFD
    { id: 'recepcion', nombre: 'Recepción y Estudio de Trámite', costo: 1827, tipo: 'estudio', desc: 'Cuota inicial no reembolsable obligatoria al meter cualquier solicitud al INM (Autorización de visas).' },
    // Artículo 10 y 11 LFD - Tarifas aproximadas indexadas anualmente
    { id: 'permiso_trabajo', nombre: 'Permiso de Trabajo (Lucrativo)', costo: 4192, tipo: 'derecho', desc: 'Permiso para realizar actividades remuneradas (si tu visa no lo traía por default).' },
    { id: 'temporal_1', nombre: 'Residencia Temporal (1 Año)', costo: 5585, tipo: 'tarjeta', desc: 'Expedición del plástico (FM3) válido por 1 año.' },
    { id: 'temporal_2', nombre: 'Residencia Temporal (2 Años)', costo: 8361, tipo: 'tarjeta', desc: 'Renovación de plástico válido por 2 años.' },
    { id: 'temporal_3', nombre: 'Residencia Temporal (3 Años)', costo: 10582, tipo: 'tarjeta', desc: 'Renovación de plástico válido por 3 años.' },
    { id: 'permanente', nombre: 'Residencia Permanente', costo: 6867, tipo: 'tarjeta', desc: 'Expedición de la tarjeta verde definitiva (FM2). No se renueva anualmente.' },
    { id: 'regularizacion', nombre: 'Multa por Regularización', costo: 1827, tipo: 'multa', desc: 'Infracción mínima base por haber perdido estatus legal y buscar acogerse al programa de regularización.' },
    { id: 'naturalizacion', nombre: 'Carta de Naturalización (SRE)', costo: 8878, tipo: 'sre', desc: 'Certificado oficial de Ciudadanía Mexicana, se tramita por separado en Cancillería (SRE), no en el INM.' },
]

export default function CalculadoraTramiteMigratorio() {
    const [tramitesSeleccionados, setTramitesSeleccionados] = useState<string[]>(['recepcion', 'temporal_1'])

    const toggleTramite = (id: string) => {
        setTramitesSeleccionados(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
    }

    const resultado = useMemo(() => {
        const seleccion = TARIFAS_LFD_INM.filter(t => tramitesSeleccionados.includes(t.id))
        const subtotalEstudio = seleccion.filter(t => t.tipo === 'estudio').reduce((acc, sum) => acc + sum.costo, 0)
        const subtotalTarjetas = seleccion.filter(t => t.tipo === 'tarjeta' || t.tipo === 'derecho').reduce((acc, sum) => acc + sum.costo, 0)
        const subtotalOtros = seleccion.filter(t => t.tipo === 'multa' || t.tipo === 'sre').reduce((acc, sum) => acc + sum.costo, 0)

        const totalGobierno = subtotalEstudio + subtotalTarjetas + subtotalOtros

        // Estimación de honorarios de abogados migratorios (variable, promediada a $10,000 / $15,000 según tipo de trámite)
        const tienePermanente = seleccion.some(t => t.tipo === 'sre' || t.id === 'permanente')
        const honorariosEstimados = tienePermanente ? 18000 : 10000

        const granTotal = totalGobierno + honorariosEstimados

        return {
            subtotalEstudio,
            subtotalTarjetas,
            subtotalOtros,
            totalGobierno,
            honorariosEstimados,
            granTotal
        }
    }, [tramitesSeleccionados])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🛂</span><span>Secretaría de Gobernación / Instituto Nacional de Migración</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Tarifas y Derechos Migratorios</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si eres extranjero o Abogado Gestor, usa esta herramienta para sumar los "pagos de derechos" federales a ventanilla que exige la Ley Federal de Derechos para tramitar tu Estancia en México.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-8">

                <div className="w-full md:w-3/5">
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-text-muted)] mb-3 font-bold">
                        Selecciona los requerimientos (Conceptos a Pagar)
                    </label>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {TARIFAS_LFD_INM.map(tramite => (
                            <div key={tramite.id} onClick={() => toggleTramite(tramite.id)}
                                className={`p-4 rounded-xl cursor-pointer border transition-all 
                                     ${tramitesSeleccionados.includes(tramite.id) ? 'bg-cyan-900/40 border-cyan-500 shadow-md shadow-cyan-500/10' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${tramitesSeleccionados.includes(tramite.id) ? 'bg-cyan-500 border-cyan-500' : 'border-white/30'}`}>
                                            {tramitesSeleccionados.includes(tramite.id) && <span className="text-black text-xs">✓</span>}
                                        </div>
                                        <span className={`font-bold ${tramitesSeleccionados.includes(tramite.id) ? 'text-cyan-300' : 'text-white'}`}>{tramite.nombre}</span>
                                    </div>
                                    <span className="font-mono text-white/80 border border-white/10 px-2 py-0.5 rounded text-sm bg-black/50">${fmtMXN(tramite.costo)}</span>
                                </div>
                                <div className="text-[10px] text-white/50 pl-8 leading-relaxed">
                                    {tramite.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-2/5 flex flex-col">
                    <div className="glass-card p-6 rounded-2xl sticky top-6 shadow-2xl border border-[var(--color-accent)]/20">
                        <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest text-center mb-6">Desglose Consular</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-xs text-white/70">Recepción / Estudio</span>
                                <span className="font-mono text-sm">${fmtMXN(resultado.subtotalEstudio)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-xs text-white/70">Expedición de Plásticos</span>
                                <span className="font-mono text-sm">${fmtMXN(resultado.subtotalTarjetas)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                <span className="text-xs text-white/70">Multas e Ingresos SRE</span>
                                <span className="font-mono text-sm">${fmtMXN(resultado.subtotalOtros)}</span>
                            </div>

                            <div className="bg-[#0f172a] p-3 rounded border border-white/5 flex justify-between items-center">
                                <span className="text-[11px] text-[var(--color-accent)] font-bold">TOTAL PAGOS AL GOBIERNO</span>
                                <span className="font-mono text-lg font-bold text-[var(--color-accent)]">${fmtMXN(resultado.totalGobierno)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-dashed border-white/20">
                            <p className="text-[10px] text-white/40 mb-2 uppercase text-center font-bold">Agregado: Costo de un Gestor/Abogado</p>
                            <div className="flex justify-between items-center text-white/70">
                                <span className="text-xs">+ Honorarios Estimados</span>
                                <span className="font-mono text-sm">${fmtMXN(resultado.honorariosEstimados)}</span>
                            </div>

                            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-black border border-[var(--color-accent)]/30 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[var(--color-accent)]/5"></div>
                                <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Inversión Total del Inmigrante</p>
                                <p className="text-3xl font-mono font-bold text-white mt-1 relative z-10">${fmtMXN(resultado.granTotal)}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="max-w-4xl mx-auto mt-6 bg-[#0f172a] p-5 rounded-xl border border-white/5 text-center px-8">
                <span className="text-xs font-bold text-cyan-500 block mb-2 uppercase tracking-wide">¿A dónde va mi Dinero?</span>
                <p className="text-[11px] text-white/60 leading-relaxed font-mono">
                    Toda tarifa migratoria se paga físicamente en el Banco descargando la <b>Hoja de Ayuda (Formato e5cinco)</b> desde el SAT y exhibiendo el Boucher original sellado en las oficinas del INM. Jamás se le paga en efectivo a los oficiales ni guardias de la frontera. Si tu trámite es rechazado, <b>el INM no reembolsa</b> los pagos por recepción y estudio.
                </p>
            </div>
        </main>
    )
}
