'use client'
import { useState, useMemo } from 'react'
import { getUMA, fmtMXN, ANIO_ACTUAL, getAniosDisponibles } from '@/data/legal-constants'

interface PlazoInfo {
    materia: string
    tipo: string
    anios: number
    meses?: number
    fundamento: string
    descripcion: string
    icon: string
    especial?: string
}

const PLAZOS: PlazoInfo[] = [
    { materia: 'Civil', tipo: 'Acción personal (deuda)', anios: 10, fundamento: 'Art. 1159 CCF', descripcion: 'Deudas en general, préstamos, contratos civiles', icon: '⚖️' },
    { materia: 'Civil', tipo: 'Pensión alimenticia no cobrada', anios: 5, fundamento: 'Art. 517 Fr. II CFPC', descripcion: 'Mensualidades de alimentos devengadas y no cobradas', icon: '👶' },
    { materia: 'Civil', tipo: 'Acción hipotecaria', anios: 10, fundamento: 'Art. 1162 CCF', descripcion: 'Derecho a ejecutar una hipoteca', icon: '🏠' },
    { materia: 'Civil', tipo: 'Responsabilidad civil extracontractual', anios: 2, fundamento: 'Art. 1934 CCF', descripcion: 'Daños causados por hecho ilícito (accidentes, etc.)', icon: '🚗' },
    { materia: 'Civil', tipo: 'Nulidad (acción)', anios: 10, fundamento: 'Art. 2238 CCF', descripcion: 'Acción de nulidad de contratos y actos jurídicos', icon: '❌' },
    { materia: 'Mercantil', tipo: 'Acciones mercantiles en general', anios: 10, fundamento: 'Art. 1047 C.Com', descripcion: 'Créditos, pagarés, deudas mercantiles', icon: '🏢' },
    { materia: 'Mercantil', tipo: 'Facturas (acción)', meses: 3, anios: 0, fundamento: 'Art. 128 LGTOC', descripcion: 'Cobro de facturas por actos de comercio', icon: '🧾' },
    { materia: 'Mercantil', tipo: 'Cheque (acción directa)', meses: 6, anios: 0, fundamento: 'Art. 191 LGTOC', descripcion: 'Acción contra librador del cheque', icon: '💳' },
    { materia: 'Mercantil', tipo: 'Pagaré / Letra de cambio', anios: 3, fundamento: 'Art. 174 LGTOC', descripcion: 'Acción cambiaría directa contra el firmante', icon: '📄' },
    { materia: 'Laboral', tipo: 'Acciones laborales en general', anios: 1, fundamento: 'Art. 516 LFT', descripcion: 'Horas extra, diferencias de salario, prestaciones', icon: '👷' },
    { materia: 'Laboral', tipo: 'Reinstalación / Indemnización despido', meses: 2, anios: 0, fundamento: 'Art. 518 LFT', descripcion: 'Demanda por despido injustificado para reinstalación', icon: '❌' },
    { materia: 'Laboral', tipo: 'Acción por discriminación', anios: 1, fundamento: 'Art. 516 LFT', descripcion: 'Acción por actos discriminatorios del patrón', icon: '⚠️' },
    { materia: 'Fiscal', tipo: 'Crédito fiscal (cobro SAT)', anios: 5, fundamento: 'Art. 146 CFF', descripcion: 'Tiempo que tiene el SAT para cobrar un crédito fiscal', icon: '🏛️' },
    { materia: 'Fiscal', tipo: 'Devolución impuestos', anios: 5, fundamento: 'Art. 146 CFF', descripcion: 'Para solicitar devolución de impuestos pagados en exceso', icon: '💰' },
    { materia: 'Penal', tipo: 'Delitos graves (ej. homicidio)', anios: 20, fundamento: 'Art. 107 CPF', descripcion: 'La prescripción penal varía por tipo de delito y sanción', icon: '⚖️', especial: 'Imprescriptible si pena máx > 12 años en algunos estados' },
    { materia: 'Penal', tipo: 'Querella privada (hurto simple)', anios: 1, fundamento: 'Art. 107 Fr. III CPF', descripcion: 'Delitos de querella: 1 año desde que se supo', icon: '🔒' },
]

const MATERIAS = ['Civil', 'Mercantil', 'Laboral', 'Fiscal', 'Penal']
const MATERIA_COLORS: Record<string, string> = {
    Civil: 'blue', Mercantil: 'purple', Laboral: 'orange', Fiscal: 'red', Penal: 'rose'
}

export default function CalculadoraPrescripcion() {
    const [materiaFiltro, setMateriaFiltro] = useState<string | null>(null)
    const [fechaInicio, setFechaInicio] = useState('2023-01-15')
    const [plazoSeleccionado, setPlazoSeleccionado] = useState<PlazoInfo | null>(null)
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const plazosFiltrados = materiaFiltro ? PLAZOS.filter(p => p.materia === materiaFiltro) : PLAZOS

    const resultado = useMemo(() => {
        if (!plazoSeleccionado || !fechaInicio) return null
        const inicio = new Date(fechaInicio)
        if (isNaN(inicio.getTime())) return null

        const fechaPrescripcion = new Date(inicio)
        if (plazoSeleccionado.anios > 0) {
            fechaPrescripcion.setFullYear(fechaPrescripcion.getFullYear() + plazoSeleccionado.anios)
        } else if (plazoSeleccionado.meses) {
            fechaPrescripcion.setMonth(fechaPrescripcion.getMonth() + plazoSeleccionado.meses)
        }

        const hoy = new Date('2026-02-27')
        const diasRestantes = Math.ceil((fechaPrescripcion.getTime() - hoy.getTime()) / 86400000)
        const prescrito = diasRestantes < 0

        return { fechaPrescripcion, diasRestantes, prescrito, plazoSeleccionado }
    }, [plazoSeleccionado, fechaInicio])

    const colorClass = (c: string) => ({
        blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
        orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
        red: 'border-red-500/30 bg-red-500/10 text-red-400',
        rose: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    }[c] || 'border-white/20 bg-white/5 text-white/60')

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⏳</span><span>Prescripción · Arts. 1159 CCF · 146 CFF · 516 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Plazos de Prescripción</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Cuándo <strong className="text-[var(--color-accent)]">caduca tu derecho</strong> a cobrar una deuda o
                    ejercer una acción legal? Selecciona el tipo y calcula la fecha exacta de prescripción.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Filtro por materia */}
            <div className="flex gap-2 flex-wrap mb-4">
                <button onClick={() => setMateriaFiltro(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${!materiaFiltro ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                    Todas las materias
                </button>
                {MATERIAS.map(m => (
                    <button key={m} onClick={() => setMateriaFiltro(m === materiaFiltro ? null : m)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${materiaFiltro === m ? `border-${MATERIA_COLORS[m]}-500/50 bg-${MATERIA_COLORS[m]}-500/10 text-${MATERIA_COLORS[m]}-400` : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        {m}
                    </button>
                ))}
            </div>

            {/* Tabla de plazos */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="space-y-1.5">
                    {plazosFiltrados.map((p, i) => {
                        const color = MATERIA_COLORS[p.materia]
                        const sel = plazoSeleccionado?.tipo === p.tipo && plazoSeleccionado?.materia === p.materia
                        return (
                            <button key={i} onClick={() => setPlazoSeleccionado(sel ? null : p)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${sel ? `border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10` : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                                <span className="text-lg flex-shrink-0">{p.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colorClass(color)}`}>{p.materia}</span>
                                        <span className="text-xs font-bold text-white">{p.tipo}</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 mt-0.5">{p.fundamento} — {p.descripcion}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-bold ${sel ? 'text-[var(--color-accent)]' : 'text-white'}`}>
                                        {p.anios > 0 ? `${p.anios} año${p.anios > 1 ? 's' : ''}` : `${p.meses} mes${(p.meses ?? 0) > 1 ? 'es' : ''}`}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Calculadora de fecha */}
            {plazoSeleccionado && (
                <div className="glass-card p-6 rounded-2xl space-y-4">
                    <h2 className="text-white font-bold">📅 Calcular fecha de prescripción — <span className="text-[var(--color-accent)]">{plazoSeleccionado.tipo}</span></h2>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de inicio (cuando nació el derecho / se tuvo conocimiento)</label>
                        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>

                    {resultado && (
                        <div className={`p-6 rounded-xl text-center border ${resultado.prescrito ? 'border-red-500/30 bg-red-500/5' : 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5'}`}>
                            <p className="text-xs text-white/50 mb-2">Fecha de prescripción:</p>
                            <p className={`text-2xl font-bold font-mono ${resultado.prescrito ? 'text-red-400' : 'text-[var(--color-accent)]'}`}>
                                {resultado.fechaPrescripcion.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className={`text-sm mt-3 font-bold ${resultado.prescrito ? 'text-red-400' : 'text-emerald-400'}`}>
                                {resultado.prescrito
                                    ? `⛔ Ya prescribió hace ${Math.abs(resultado.diasRestantes)} días — Consulta sobre interrupción (Art. 1168 CCF)`
                                    : `✅ Quedan ${resultado.diasRestantes} días para que prescriba`}
                            </p>
                            {plazoSeleccionado.especial && (
                                <p className="text-[10px] text-orange-400 mt-2 p-2 rounded-lg bg-orange-500/10">⚠️ {plazoSeleccionado.especial}</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué interrumpe la prescripción?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La prescripción se <strong>interrumpe</strong> (el plazo vuelve a correr desde cero) por: (1) reconocimiento
                    escrito de la deuda, (2) presentación de demanda, (3) interpelación judicial o notarial (Art. 1168 CCF).
                    En materia fiscal, la prescripción del crédito fiscal se interrumpe cuando el contribuyente promueve algún
                    medio de defensa (Art. 146 CFF).
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Plazos generales. Pueden variar según contrato o ley especial. Art. 1168 CCF interrupción. No sustituye análisis jurídico del caso concreto.
            </p>
        </main>
    )
}
