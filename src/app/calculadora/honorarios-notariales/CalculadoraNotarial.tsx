'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

type EstadoNot = 'cdmx' | 'jalisco' | 'nleon' | 'edomex' | 'otro'
type TipoActo = 'compraventa' | 'donacion' | 'testamento' | 'poder' | 'constitucion'

const ARANCELES: Record<EstadoNot, { pct: number; min: number; label: string }> = {
    cdmx: { pct: 0.0085, min: 25000, label: 'CDMX (Ley Notarial CDMX)' },
    jalisco: { pct: 0.0070, min: 20000, label: 'Jalisco (Arancel Jal.)' },
    nleon: { pct: 0.0065, min: 18000, label: 'Nuevo León' },
    edomex: { pct: 0.0080, min: 22000, label: 'Estado de México' },
    otro: { pct: 0.0075, min: 20000, label: 'Otro estado (~promedio)' },
}

const ISAI_RATES: Record<EstadoNot, number> = {
    cdmx: 0.020, jalisco: 0.020, nleon: 0.0165, edomex: 0.0175, otro: 0.020,
}

export default function CalculadoraNotarial() {
    const [valorInmueble, setValorInmueble] = useState('2500000')
    const [estado, setEstado] = useState<EstadoNot>('cdmx')
    const [tipoActo, setTipoActo] = useState<TipoActo>('compraventa')
    const [esVivHabitual, setEsVivHabitual] = useState(false)
    const [avaluoCERTIF, setAvaluoCERTIF] = useState('2400000')

    const resultado = useMemo(() => {
        const valor = parseFloat(valorInmueble) || 0
        if (valor <= 0) return null
        const avaluo = parseFloat(avaluoCERTIF) || valor
        const baseCalculo = Math.max(valor, avaluo)
        const arc = ARANCELES[estado]

        const honorariosNotario = Math.max(baseCalculo * arc.pct, arc.min)
        const isai = baseCalculo * ISAI_RATES[estado]
        const registroPublico = baseCalculo * 0.002 + 2000 // estimado
        const derechosCertificados = 1500 // estimado
        const iva = honorariosNotario * 0.16

        const isrAdquisicion = tipoActo === 'compraventa' ? 0 : 0 // VAría; sin retención en compraventa entre PF
        const avaluoComercial = 3500 // costo del avalúo

        const totalGastos = honorariosNotario + iva + isai + registroPublico + derechosCertificados + avaluoComercial

        return {
            valor, baseCalculo, honorariosNotario, iva, isai, registroPublico,
            derechosCertificados, avaluoComercial, totalGastos,
            pctTotalSobreValor: (totalGastos / valor) * 100
        }
    }, [valorInmueble, estado, tipoActo, esVivHabitual, avaluoCERTIF])

    const actos: { v: TipoActo; label: string; icon: string }[] = [
        { v: 'compraventa', label: 'Compraventa', icon: '🏠' },
        { v: 'donacion', label: 'Donación', icon: '🎁' },
        { v: 'testamento', label: 'Testamento', icon: '📜' },
        { v: 'poder', label: 'Poder Notarial', icon: '✍️' },
        { v: 'constitucion', label: 'Constitución SC', icon: '🏢' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📝</span><span>Honorarios Notariales · Ley del Notariado</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Gastos Notariales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima los gastos totales de escrituración: honorarios del notario, IVA,
                    <strong className="text-[var(--color-accent)]"> ISAI</strong> (impuesto sobre adquisición de inmuebles),
                    registro público y derechos.
                </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6 text-xs text-orange-400 text-center">
                ⚠️ <strong>Estimador orientativo.</strong> Cada notario tiene su propio arancel dentro del permitido. Solicita cotización directa.
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
                {actos.map(a => (
                    <button key={a.v} onClick={() => setTipoActo(a.v)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${tipoActo === a.v ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                        {a.icon} {a.label}
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor de venta del inmueble ($)</label>
                        <input type="number" value={valorInmueble} onChange={e => setValorInmueble(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor catastral / avalúo ($)</label>
                        <input type="number" value={avaluoCERTIF} onChange={e => setAvaluoCERTIF(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">El notario usa el mayor entre valor de venta y avalúo</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Estado / entidad federativa</label>
                        <select value={estado} onChange={e => setEstado(e.target.value as EstadoNot)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {Object.entries(ARANCELES).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={esVivHabitual} onChange={e => setEsVivHabitual(e.target.checked)} className="w-4 h-4" />
                            <div>
                                <span className="text-sm text-white/80">Vivienda principal del comprador</span>
                                <p className="text-[10px] text-emerald-400">Puede haber descuento en ISAI según estado</p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Gastos de escrituración estimados</h2>

                    <div className="space-y-2 text-sm mb-4">
                        {[
                            { l: 'Honorarios notario (arancel)', v: resultado.honorariosNotario, c: 'text-white', info: `${(ARANCELES[estado].pct * 100).toFixed(2)}% del valor (mín $${fmtMXN(ARANCELES[estado].min)})` },
                            { l: 'IVA sobre honorarios (16%)', v: resultado.iva, c: 'text-white', info: '' },
                            { l: `ISAI ${(ISAI_RATES[estado] * 100).toFixed(2)}% — impuesto adquisición`, v: resultado.isai, c: 'text-orange-400', info: `Varía por estado y valor` },
                            { l: 'Registro Público de la Propiedad', v: resultado.registroPublico, c: 'text-white', info: 'Estimado ~0.2% + derechos fijos' },
                            { l: 'Certificados y trámites notariales', v: resultado.derechosCertificados, c: 'text-white', info: 'Estimado' },
                            { l: 'Avalúo comercial', v: resultado.avaluoComercial, c: 'text-white', info: 'Costo aproximado' },
                        ].map((r, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/5">
                                <div className="flex justify-between">
                                    <span className="text-white/60 text-xs">{r.l}</span>
                                    <span className={`font-mono font-bold text-xs ${r.c}`}>${fmtMXN(r.v)}</span>
                                </div>
                                {r.info && <p className="text-[10px] text-white/30 mt-0.5">{r.info}</p>}
                            </div>
                        ))}
                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                            <div>
                                <span className="text-[var(--color-accent)] font-bold">TOTAL estimado gastos escrituración</span>
                                <p className="text-[10px] text-[var(--color-accent)]/60">{resultado.pctTotalSobreValor.toFixed(1)}% del valor del inmueble</p>
                            </div>
                            <span className="font-mono font-bold text-[var(--color-accent)] text-xl">${fmtMXN(resultado.totalGastos)}</span>
                        </div>
                    </div>

                    {esVivHabitual && (
                        <p className="text-xs text-emerald-400 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            🏠 Algunas entidades ofrecen descuento o exención de ISAI en vivienda habitual. Consulta al notario de tu estado.
                        </p>
                    )}
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Estimador orientativo. ISAI varía por estado. Honorarios: arancel notarial local. No sustituye cotización directa del notario.
            </p>
        </main>
    )
}
