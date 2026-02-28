'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Países con convenio fiscal México y sus tasas reducidas (Art. 10 Convenios)
// Fuente: SAT — lista de convenios bilaterales vigentes
const CONVENIOS: { pais: string; tasaReducida: number; descripcion: string }[] = [
    { pais: 'Sin convenio / Tasa general', tasaReducida: 25, descripcion: 'Art. 167 LISR: tasa 25% sobre el total' },
    { pais: 'Estados Unidos', tasaReducida: 10, descripcion: 'Convenio México-EE.UU.: 10% si aplica Art. 14' },
    { pais: 'Canadá', tasaReducida: 15, descripcion: 'Convenio México-Canadá' },
    { pais: 'España', tasaReducida: 10, descripcion: 'Convenio México-España' },
    { pais: 'Alemania', tasaReducida: 10, descripcion: 'Convenio México-Alemania' },
    { pais: 'Francia', tasaReducida: 10, descripcion: 'Convenio México-Francia' },
    { pais: 'Reino Unido', tasaReducida: 15, descripcion: 'Convenio México-UK' },
    { pais: 'Países Bajos', tasaReducida: 10, descripcion: 'Convenio México-Holanda' },
    { pais: 'Suiza', tasaReducida: 10, descripcion: 'Convenio México-Suiza' },
    { pais: 'Japón', tasaReducida: 10, descripcion: 'Convenio México-Japón' },
    { pais: 'China', tasaReducida: 10, descripcion: 'Convenio México-China' },
    { pais: 'India', tasaReducida: 10, descripcion: 'Convenio México-India' },
    { pais: 'Brasil', tasaReducida: 15, descripcion: 'Convenio México-Brasil' },
    { pais: 'Chile', tasaReducida: 10, descripcion: 'Convenio México-Chile' },
    { pais: 'Argentina', tasaReducida: 15, descripcion: 'Convenio México-Argentina' },
]

export default function CalculadoraHonorariosExtranjeros() {
    const [honorarios, setHonorarios] = useState('100000')
    const [paisIdx, setPaisIdx] = useState(0)
    const [tipoServicio, setTipoServicio] = useState<'independiente' | 'dependiente' | 'tecnico'>('independiente')
    const [incluyeIVA, setIncluyeIVA] = useState(true)

    const convenio = CONVENIOS[paisIdx]

    const tasas: Record<typeof tipoServicio, number> = {
        'independiente': convenio.tasaReducida,
        'dependiente': convenio.tasaReducida === 25 ? 30 : convenio.tasaReducida,  // Art. 167 Fr. varía
        'tecnico': Math.min(convenio.tasaReducida, 15),  // Asistencia técnica: max 15%
    }

    const resultado = useMemo(() => {
        const monto = parseFloat(honorarios) || 0
        if (monto <= 0) return null

        const tasa = tasas[tipoServicio]
        const isrRetenido = monto * (tasa / 100)
        const montoNeto = monto - isrRetenido

        const iva = incluyeIVA ? monto * 0.16 : 0
        const totalFactura = monto + iva
        const ivaAcreditable = iva  // Para el pagador mexicano

        return { monto, tasa, isrRetenido, montoNeto, iva, totalFactura, ivaAcreditable }
    }, [honorarios, paisIdx, tipoServicio, incluyeIVA])

    const tiposServicio = [
        { v: 'independiente' as const, label: 'Servicios Independientes', sub: 'Honorarios profesionales' },
        { v: 'dependiente' as const, label: 'Salarios / Remuneraciones', sub: 'Trabajo dependiente' },
        { v: 'tecnico' as const, label: 'Asistencia Técnica', sub: 'Máx. 15% Art. 167' },
    ] as const

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🌍</span><span>Honorarios Extranjeros · Art. 167 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Retención Honorarios Extranjeros</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando una empresa mexicana paga servicios a un
                    <strong className="text-white"> residente en el extranjero</strong>, debe retener
                    <strong className="text-[var(--color-accent)]"> 25% de ISR</strong> (Art. 167 LISR), salvo convenio fiscal que reduzca la tasa.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Monto de honorarios pactado ($)</label>
                        <input type="number" value={honorarios} onChange={e => setHonorarios(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">País del prestador de servicios</label>
                        <select value={paisIdx} onChange={e => setPaisIdx(parseInt(e.target.value))}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {CONVENIOS.map((c, i) => <option key={i} value={i}>{c.pais} — {c.tasaReducida}%</option>)}
                        </select>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{convenio.descripcion}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-2 font-semibold">Tipo de servicio prestado</label>
                    <div className="grid grid-cols-3 gap-2">
                        {tiposServicio.map(t => (
                            <button key={t.v} onClick={() => setTipoServicio(t.v)}
                                className={`p-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${tipoServicio === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                <p className="font-bold">{t.label}</p>
                                <p className="opacity-60 text-[9px] mt-0.5">{t.sub}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5">
                    <input type="checkbox" checked={incluyeIVA} onChange={e => setIncluyeIVA(e.target.checked)} className="w-4 h-4 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-white">Agregar IVA 16% (para servicios aprovechados en México)</p>
                        <p className="text-[10px] text-white/40">El IVA es acreditable para el pagador mexicano. Art. 1° LIVA.</p>
                    </div>
                </label>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${paisIdx === 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {paisIdx === 0 ? '25% — Tasa general' : `${resultado.tasa}% — Convenio fiscal`}
                        </div>
                        <h2 className="text-white font-bold text-lg">Retención ISR extranjero</h2>
                    </div>
                    <div className="space-y-2 text-sm">
                        {[
                            { l: 'Monto de honorarios', v: resultado.monto },
                            { l: `ISR retenido (${resultado.tasa}% Art. 167 LISR)`, v: -resultado.isrRetenido, accent: true },
                            { l: 'Neto recibido por el extranjero', v: resultado.montoNeto },
                            ...(incluyeIVA ? [
                                { l: 'IVA 16% (acreditable para pagador MX)', v: resultado.iva },
                                { l: 'Total de la factura / contraprestación', v: resultado.totalFactura },
                            ] : []),
                        ].map((r: { l: string; v: number; accent?: boolean }, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-orange-400 font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-orange-400 text-xl' : 'text-white text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs">
                        <p className="text-blue-400 font-bold mb-1">📋 Obligaciones del pagador mexicano:</p>
                        <p className="text-white/60">1. Retener el ISR al momento del pago o abono en cuenta.</p>
                        <p className="text-white/60">2. Enterar la retención al SAT a más tardar el 17 del mes siguiente (Art. 26 Fr. I CFF).</p>
                        <p className="text-white/60">3. Presentar declaración informativa anual (DIOT si aplica IVA).</p>
                        {paisIdx > 0 && <p className="text-emerald-400 mt-1">✅ Tasa reducida: requiere que el beneficiario entregue Certificado de Residencia Fiscal del país de convenio.</p>}
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 167 LISR retención fuente México. Tasas de convenio son referenciales — verificar el convenio vigente con el SAT. Requiere Certificado de Residencia Fiscal del beneficiario.
            </p>
        </main>
    )
}
