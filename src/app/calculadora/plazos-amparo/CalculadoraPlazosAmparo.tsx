'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

type TipoAmparo = 'indirecto' | 'directo' | 'adhesivo'

interface DelitoInfo {
    tipo: TipoAmparo
    diasHabiles: number
    fundamento: string
    descripcion: string
    excepcion?: string
}

const PLAZOS: DelitoInfo[] = [
    { tipo: 'indirecto', diasHabiles: 15, fundamento: 'Art. 17 LA', descripcion: 'Amparo indirecto general: actos de autoridad, órdenes de aprehensión, cateo, etc.', excepcion: 'Excepción: orden de aprehensión NO ejecutada = 15 días desde que se tuvo conocimiento' },
    { tipo: 'directo', diasHabiles: 15, fundamento: 'Art. 17 LA', descripcion: 'Amparo directo: contra sentencias definitivas de primera instancia (civil, penal, laboral, familiar)' },
    { tipo: 'adhesivo', diasHabiles: 15, fundamento: 'Art. 182 LA', descripcion: 'Amparo adhesivo: promovido por la parte que obtuvo resolución favorable para fortalecer argumentos' },
]

const EXCEPCIONES_PLAZO: { motivo: string; plazo: string; art: string }[] = [
    { motivo: 'Actos de ejecución de sentencia (última actuación)', plazo: '15 días hábiles', art: 'Art. 17 LA' },
    { motivo: 'Norma general auto-aplicativa', plazo: '30 días desde vigencia', art: 'Art. 17 Fr. I LA' },
    { motivo: 'Norma hetero-aplicativa (con acto de aplicación)', plazo: '15 días desde aplicación', art: 'Art. 17 Fr. II LA' },
    { motivo: '🚨 Orden de aprehensión o cateo (en el acto)', plazo: 'EN CUALQUIER TIEMPO (no vence)', art: 'Art. 17 Fr. IV LA' },
    { motivo: 'Actos que importen peligro de privación de vida', plazo: 'EN CUALQUIER TIEMPO', art: 'Art. 17 Fr. IV LA' },
    { motivo: 'Extradición', plazo: 'EN CUALQUIER TIEMPO', art: 'Art. 17 Fr. IV LA' },
    { motivo: '⚠️ Acto consumado de plano (impossible restitución)', plazo: 'Improcedente (Art. 61 Fr. XVI)', art: 'Art. 61 LA' },
]

export default function CalculadoraPlazosAmparo() {
    const [tipo, setTipo] = useState<TipoAmparo>('indirecto')
    const [fechaNotificacion, setFechaNotificacion] = useState('2026-02-20')
    const [excepcionEspecial, setExcepcionEspecial] = useState('normal')

    const resultado = useMemo(() => {
        const plazoInfo = PLAZOS.find(p => p.tipo === tipo)!
        if (excepcionEspecial === 'cualquier_tiempo') {
            return { sinVencimiento: true, plazoInfo }
        }
        if (excepcionEspecial === 'improcedente') {
            return { improcedente: true, plazoInfo }
        }

        const inicio = new Date(fechaNotificacion)
        if (isNaN(inicio.getTime())) return null

        // Calcular días hábiles sumando solo días L-V
        const diasHabilesNecesarios = excepcionEspecial === 'norma_general' ? 30 : 15
        let diasContados = 0
        const fecha = new Date(inicio)
        fecha.setDate(fecha.getDate() + 1) // Empieza a contar al día siguiente

        while (diasContados < diasHabilesNecesarios) {
            const dow = fecha.getDay()
            if (dow !== 0 && dow !== 6) diasContados++ // Solo L-V
            if (diasContados < diasHabilesNecesarios) fecha.setDate(fecha.getDate() + 1)
        }

        const hoy = new Date('2026-02-27')
        const diasRestantes = Math.ceil((fecha.getTime() - hoy.getTime()) / 86400000)
        const vencido = diasRestantes < 0

        return {
            sinVencimiento: false,
            improcedente: false,
            fechaLimite: fecha,
            diasHabilesNecesarios,
            diasRestantes,
            vencido,
            plazoInfo
        }
    }, [tipo, fechaNotificacion, excepcionEspecial])

    const formatFecha = (f: Date) => f.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Amparo · Arts. 17-18 Ley de Amparo</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Plazos de Amparo</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Cuánto tiempo tienes para promover el amparo?
                    El plazo general es <strong className="text-[var(--color-accent)]">15 días hábiles</strong> desde la notificación del acto reclamado (Art. 17 LA).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                {PLAZOS.map(p => (
                    <button key={p.tipo} onClick={() => setTipo(p.tipo)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${tipo === p.tipo ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xs font-bold capitalize">{p.tipo}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{p.fundamento}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de notificación del acto reclamado</label>
                        <input type="date" value={fechaNotificacion} onChange={e => setFechaNotificacion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">El plazo corre a partir del día siguiente hábil</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">¿Existe alguna excepción?</label>
                        <select value={excepcionEspecial} onChange={e => setExcepcionEspecial(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="normal">No — Acto ordinario (15 días hábiles)</option>
                            <option value="norma_general">Norma auto-aplicativa (30 días)</option>
                            <option value="cualquier_tiempo">🚨 Orden de aprehensión / peligro de vida</option>
                            <option value="improcedente">Acto ya consumado / improcedente</option>
                        </select>
                    </div>
                </div>

                {PLAZOS.find(p => p.tipo === tipo)?.excepcion && (
                    <p className="text-xs text-orange-400 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        ⚠️ {PLAZOS.find(p => p.tipo === tipo)?.excepcion}
                    </p>
                )}
            </div>

            {resultado && (
                <div className="mt-8">
                    {'improcedente' in resultado && resultado.improcedente ? (
                        <div className="glass-card p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
                            <p className="text-red-400 font-bold text-xl">❌ Amparo improcedente</p>
                            <p className="text-white/70 text-sm mt-2">Si el acto reclamado ya se consumó de manera irreparable (Art. 61 Fr. XVI LA), el amparo es improcedente pues no puede restituirse el goce de derechos. Considera otras acciones legales.</p>
                        </div>
                    ) : 'sinVencimiento' in resultado && resultado.sinVencimiento ? (
                        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                            <p className="text-emerald-400 font-bold text-xl">✅ Sin plazo — Puede promoverse en cualquier tiempo</p>
                            <p className="text-white/70 text-sm mt-2">Art. 17 Fr. IV LA: cuando el acto reclamado importa peligro de privación de la vida, deportación, destierro, extradición u otros supuestos del Art. 22 CPEUM, el amparo puede promoverse en cualquier tiempo. <strong className="text-white">Actúa de inmediato.</strong></p>
                        </div>
                    ) : 'fechaLimite' in resultado && resultado.fechaLimite ? (
                        <div className={`glass-card p-6 rounded-2xl border ${resultado.vencido ? 'border-red-500/30' : resultado.diasRestantes <= 3 ? 'border-orange-500/30' : 'border-[var(--color-accent)]/30'}`}>
                            <h2 className="text-white font-bold text-lg mb-4">📅 Fecha límite para presentar el amparo</h2>
                            <div className={`p-6 rounded-xl text-center mb-4 ${resultado.vencido ? 'bg-red-500/10' : resultado.diasRestantes <= 3 ? 'bg-orange-500/10' : 'bg-[var(--color-accent)]/10'}`}>
                                <p className={`text-3xl font-bold font-mono ${resultado.vencido ? 'text-red-400' : resultado.diasRestantes <= 3 ? 'text-orange-400' : 'text-[var(--color-accent)]'}`}>
                                    {formatFecha(resultado.fechaLimite)}
                                </p>
                                <p className={`text-sm mt-2 ${resultado.vencido ? 'text-red-400' : resultado.diasRestantes <= 3 ? 'text-orange-400' : 'text-white/60'}`}>
                                    {resultado.vencido ? `⛔ VENCIDO hace ${Math.abs(resultado.diasRestantes)} días — Considera amparo por extemporáneo` : resultado.diasRestantes === 0 ? '🔴 VENCE HOY — Presenta el amparo urgente' : resultado.diasRestantes <= 3 ? `🔴 ¡QUEDAN SOLO ${resultado.diasRestantes} DÍAS NATURALES!` : `✅ Quedan ${resultado.diasRestantes} días naturales`}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-white/50 mb-1">Plazo aplicado</p>
                                    <p className="text-white font-bold">{resultado.diasHabilesNecesarios} días hábiles</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-white/50 mb-1">Fundamento</p>
                                    <p className="text-white font-bold">{resultado.plazoInfo.fundamento}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            <div className="mt-8 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📋 Tabla de excepciones al plazo (Art. 17 LA)</h3>
                <div className="space-y-2">
                    {EXCEPCIONES_PLAZO.map((e, i) => (
                        <div key={i} className="flex justify-between items-start p-3 rounded-lg bg-white/5 text-xs gap-4">
                            <div className="flex-1">
                                <p className="text-white font-bold">{e.motivo}</p>
                                <p className="text-white/40 text-[10px] mt-0.5">{e.art}</p>
                            </div>
                            <span className="text-[var(--color-accent)] font-bold whitespace-nowrap">{e.plazo}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 17-18 Ley de Amparo. Solo días hábiles (excluye sábado, domingo y días inhábiles del PJF). No sustituye asesoría legal urgente.
            </p>
        </main>
    )
}
