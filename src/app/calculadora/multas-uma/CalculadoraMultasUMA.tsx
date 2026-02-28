'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

interface MultaComun {
    tipo: string
    descripcion: string
    minUMA: number
    maxUMA: number
    fundamento: string
    icon: string
    categoria: 'transito' | 'fiscal' | 'penal' | 'administrativa'
}

const MULTAS_COMUNES: MultaComun[] = [
    { tipo: 'Exceso de velocidad (leve <20km/h)', descripcion: 'En zona urbana, límite 40km/h', minUMA: 5, maxUMA: 15, fundamento: 'Regl. Tránsito', icon: '🚗', categoria: 'transito' },
    { tipo: 'Exceso de velocidad (grave >40km/h)', descripcion: 'Zona escolar o vía rápida', minUMA: 15, maxUMA: 50, fundamento: 'Regl. Tránsito', icon: '🏎️', categoria: 'transito' },
    { tipo: 'Alcoholemia (conducir ebrio)', descripcion: 'Primera infracción — varía por estado', minUMA: 40, maxUMA: 100, fundamento: 'Regl. Tránsito CDMX', icon: '🍺', categoria: 'transito' },
    { tipo: 'Omisión de declaración fiscal', descripcion: 'No presentar declaración en fecha', minUMA: 100, maxUMA: 500, fundamento: 'Art. 82 Fr. I CFF', icon: '📊', categoria: 'fiscal' },
    { tipo: 'No emitir CFDI', descripcion: 'No expedir factura electrónica', minUMA: 65, maxUMA: 200, fundamento: 'Art. 83 Fr. VII CFF', icon: '🧾', categoria: 'fiscal' },
    { tipo: 'Desacato a autoridad', descripcion: 'Desobedecer orden judicial', minUMA: 100, maxUMA: 500, fundamento: 'Art. 178 CPF', icon: '⚖️', categoria: 'penal' },
    { tipo: 'Multa por ruido / contaminación', descripcion: 'Infracción ambiental municipal', minUMA: 20, maxUMA: 100, fundamento: 'Ley Ambiental', icon: '🔊', categoria: 'administrativa' },
    { tipo: 'No portar INE (conducir)', descripcion: 'En algunos estados — no traer licencia', minUMA: 3, maxUMA: 10, fundamento: 'Regl. Local', icon: '🪪', categoria: 'transito' },
    { tipo: 'Accidente sin seguro vigente', descripcion: 'Conducción sin seguro', minUMA: 50, maxUMA: 200, fundamento: 'LGSC', icon: '💥', categoria: 'transito' },
    { tipo: 'Infracción INAI / privacidad', descripcion: 'Uso indebido de datos personales', minUMA: 200, maxUMA: 1000, fundamento: 'Art. 64 LFPDPPP', icon: '🔒', categoria: 'administrativa' },
]

export default function CalculadoraMultasUMA() {
    const [diasUMA, setDiasUMA] = useState('20')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [anioComparacion, setAnioComparacion] = useState('2020')
    const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
    const [multaSeleccionada, setMultaSeleccionada] = useState<MultaComun | null>(null)

    const uma = getUMA(parseInt(anioCalculo))
    const umaComp = getUMA(parseInt(anioComparacion))

    const resultado = useMemo(() => {
        const dias = parseFloat(diasUMA) || 0
        if (dias <= 0) return null
        const montoPesos = dias * uma.diaria
        const montoComp = dias * umaComp.diaria
        const diferencia = montoPesos - montoComp
        const inflacion = montoComp > 0 ? (diferencia / montoComp) * 100 : 0
        return { dias, montoPesos, montoComp, diferencia, inflacion }
    }, [diasUMA, anioCalculo, anioComparacion])

    const multasFiltradas = categoriaFiltro ? MULTAS_COMUNES.filter(m => m.categoria === categoriaFiltro) : MULTAS_COMUNES
    const categorias = [
        { v: 'transito', label: '🚗 Tránsito' },
        { v: 'fiscal', label: '📊 Fiscal' },
        { v: 'penal', label: '⚖️ Penal' },
        { v: 'administrativa', label: '🏛️ Administrativa' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🚨</span><span>Multas en UMAs · Art. 21 CPEUM + Art. 29 CFF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Multas en UMAs</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Desde 2016 las multas se expresan en <strong className="text-[var(--color-accent)]">UMAs (días)</strong> en lugar de
                    salarios mínimos. Compara cuánto vale tu multa en distintos años.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5 mb-6">
                <h2 className="text-white font-bold">🔢 Convertir días-UMA a pesos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de días-UMA de la multa</label>
                        <input type="number" value={diasUMA} onChange={e => setDiasUMA(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año de pago de la multa</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().filter(a => a >= 2016).map(a => (
                                <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Comparar con año:</label>
                        <select value={anioComparacion} onChange={e => setAnioComparacion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().filter(a => a >= 2016).map(a => <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>)}
                        </select>
                    </div>
                </div>

                {resultado && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                            <p className="text-xs text-[var(--color-accent)] mb-1">{anioCalculo}: {resultado.dias} UMAs × ${fmtMXN(uma.diaria)}</p>
                            <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.montoPesos)}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center">
                            <p className="text-xs text-[var(--color-text-muted)] mb-1">{anioComparacion}: ${fmtMXN(umaComp.diaria)}/UMA</p>
                            <p className="text-xl font-bold text-white font-mono">${fmtMXN(resultado.montoComp)}</p>
                        </div>
                        <div className={`rounded-xl p-4 text-center ${resultado.diferencia > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                            <p className={`text-xs mb-1 ${resultado.diferencia > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {resultado.diferencia > 0 ? '▲ Más cara hoy' : '▼ Más barata hoy'}
                            </p>
                            <p className={`text-xl font-bold font-mono ${resultado.diferencia > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {resultado.diferencia > 0 ? '+' : ''}${fmtMXN(resultado.diferencia)} ({resultado.inflacion.toFixed(1)}%)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-card p-4 rounded-2xl">
                <h3 className="text-white font-bold mb-3">📋 Multas comunes en días-UMA</h3>
                <div className="flex gap-2 flex-wrap mb-3">
                    <button onClick={() => setCategoriaFiltro(null)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${!categoriaFiltro ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                        Todas
                    </button>
                    {categorias.map(c => (
                        <button key={c.v} onClick={() => setCategoriaFiltro(c.v === categoriaFiltro ? null : c.v)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${categoriaFiltro === c.v ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/50'}`}>
                            {c.label}
                        </button>
                    ))}
                </div>
                <div className="space-y-1.5">
                    {multasFiltradas.map((m, i) => (
                        <button key={i} onClick={() => { setMultaSeleccionada(m); setDiasUMA(String(Math.round((m.minUMA + m.maxUMA) / 2))) }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 text-left transition-all cursor-pointer">
                            <span className="text-lg flex-shrink-0">{m.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white">{m.tipo}</p>
                                <p className="text-[10px] text-white/40">{m.fundamento} — {m.descripcion}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-xs font-bold text-[var(--color-accent)]">{m.minUMA}–{m.maxUMA} UMAs</p>
                                <p className="text-[10px] text-white/40">${fmtMXN(m.minUMA * uma.diaria)}–${fmtMXN(m.maxUMA * uma.diaria)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 21 CPEUM. UMA desde 2016 Art. 29 CFF. Multas referenciales; el monto exacto lo fija la autoridad. No sustituye asesoría legal.
            </p>
        </main>
    )
}
