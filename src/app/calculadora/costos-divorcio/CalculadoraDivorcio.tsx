'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMXN } from '@/data/legal-constants'

type TipoDivorcio = 'mutuo' | 'incausado'
type RegimenBienes = 'sociedad' | 'separacion'

export default function CalculadoraDivorcio() {
    const [tipo, setTipo] = useState<TipoDivorcio>('incausado')
    const [valorBienes, setValorBienes] = useState('2000000')
    const [regimen, setRegimen] = useState<RegimenBienes>('sociedad')
    const [ingresoMenorConyuge, setIngresoMenorConyuge] = useState('15000')
    const [duracionAnios, setDuracionAnios] = useState('8')
    const [tieneHijos, setTieneHijos] = useState(true)
    const [numHijos, setNumHijos] = useState('2')
    const [estado, setEstado] = useState('cdmx')

    const aranceles: { [k: string]: { notarial: number; judicial: number } } = {
        cdmx: { notarial: 15000, judicial: 8000 },
        jalisco: { notarial: 12000, judicial: 6000 },
        nleon: { notarial: 10000, judicial: 5000 },
        otro: { notarial: 12000, judicial: 6000 },
    }

    const resultado = useMemo(() => {
        const bienes = parseFloat(valorBienes) || 0
        const ingresoMin = parseFloat(ingresoMenorConyuge) || 0
        const anios = parseInt(duracionAnios) || 1
        const hijos = parseInt(numHijos) || 0
        const arc = aranceles[estado]

        // División de bienes
        const bienesACadaConyuge = regimen === 'sociedad' ? bienes * 0.5 : 0

        // Honorarios abogado (estimado por complejidad)
        const honorariosBase = tipo === 'mutuo' ? 20000 : 45000
        const plusHijos = hijos * 5000
        const plusBienes = bienes > 1000000 ? bienes * 0.01 : 0
        const honorariosTotales = honorariosBase + plusHijos + plusBienes

        // Gastos notariales/judiciales
        const gastosOficiales = tipo === 'mutuo' ? arc.notarial : arc.judicial

        // Pensión alimenticia estimada (30% del menor ingreso, por hijo menor)
        const pensionMensualEstimada = tieneHijos ? ingresoMin * 0.30 : 0
        const pensionAnual = pensionMensualEstimada * 12

        // ISR por división de bienes (si aplica ganancia)
        const totalEstimado = honorariosTotales + gastosOficiales

        return {
            bienesACadaConyuge, honorariosTotales, gastosOficiales,
            pensionMensualEstimada, pensiónAnual: pensionAnual,
            totalEstimado, hijos, tipo, regimen
        }
    }, [tipo, valorBienes, regimen, ingresoMenorConyuge, duracionAnios, tieneHijos, numHijos, estado])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💔</span><span>Estimador Costos Divorcio · CCF + CFPC</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Estimador de Costos de <span className="gradient-gold">Divorcio</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima los gastos aproximados de un divorcio en México: honorarios de abogado,
                    gastos notariales/judiciales, y la pensión alimenticia mensual estimada.
                </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6 text-xs text-orange-400 text-center">
                ⚠️ Este es un <strong>estimador orientativo</strong>. Los montos reales varían según el juzgado, abogado y circunstancias específicas.
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { v: 'incausado' as TipoDivorcio, icon: '⚖️', label: 'Divorcio incausado', desc: 'Sin necesidad de alegar causa (domina en MX)' },
                        { v: 'mutuo' as TipoDivorcio, icon: '🤝', label: 'Mutuo acuerdo', desc: 'Los dos de acuerdo en todo' },
                    ].map(t => (
                        <button key={t.v} onClick={() => setTipo(t.v)}
                            className={`p-4 rounded-xl border text-sm text-center transition-all cursor-pointer ${tipo === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                            <p className="text-xl mb-1">{t.icon}</p>
                            <p className="font-bold">{t.label}</p>
                            <p className="text-[10px] font-normal mt-1 opacity-70">{t.desc}</p>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de matrimonio</label>
                        <input type="number" value={duracionAnios} onChange={e => setDuracionAnios(e.target.value)} min="1"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Estado / entidad</label>
                        <select value={estado} onChange={e => setEstado(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="cdmx">CDMX</option>
                            <option value="jalisco">Jalisco</option>
                            <option value="nleon">Nuevo León</option>
                            <option value="otro">Otro estado</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Régimen matrimonial</label>
                    <div className="grid grid-cols-2 gap-3">
                        {[['sociedad', '🏠 Sociedad conyugal', '50% de bienes a cada uno'], ['separacion', '💼 Separación de bienes', 'Cada quien conserva los suyos']].map(([v, label, hint]) => (
                            <button key={v} onClick={() => setRegimen(v as RegimenBienes)}
                                className={`p-3 rounded-xl border text-sm text-left cursor-pointer transition-all ${regimen === v ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                                <p className="font-bold text-xs">{label}</p>
                                <p className="text-[10px] mt-0.5 opacity-60">{hint}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {regimen === 'sociedad' && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor total de bienes en sociedad ($)</label>
                        <input type="number" value={valorBienes} onChange={e => setValorBienes(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={tieneHijos} onChange={e => setTieneHijos(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm text-white/80">Hay hijos menores o dependientes</span>
                </label>

                {tieneHijos && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de hijos</label>
                            <input type="number" value={numHijos} onChange={e => setNumHijos(e.target.value)} min="1"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingreso mensual del cónyuge que paga ($)</label>
                            <input type="number" value={ingresoMenorConyuge} onChange={e => setIngresoMenorConyuge(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Estimado de costos del divorcio</h2>
                        <div className="space-y-2 text-sm">
                            {[
                                { l: `Honorarios abogado (estimado ${tipo === 'mutuo' ? 'mutuo' : 'contencioso'})`, v: resultado.honorariosTotales, c: 'text-orange-400' },
                                { l: `Gastos ${tipo === 'mutuo' ? 'notariales' : 'judiciales'}`, v: resultado.gastosOficiales, c: 'text-blue-400' },
                                ...(resultado.regimen === 'sociedad' ? [{ l: 'Bienes a cada cónyuge (50/50)', v: resultado.bienesACadaConyuge, c: 'text-emerald-400' }] : []),
                            ].map((r, i) => (
                                <div key={i} className="flex justify-between p-3 rounded-lg bg-white/5">
                                    <span className="text-white/60">{r.l}</span>
                                    <span className={`font-mono font-bold ${r.c}`}>${fmtMXN(r.v)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                                <span className="text-[var(--color-accent)] font-bold">Costo total estimado</span>
                                <span className="font-mono font-bold text-[var(--color-accent)] text-lg">${fmtMXN(resultado.totalEstimado)}</span>
                            </div>
                        </div>
                    </div>

                    {tieneHijos && resultado.pensionMensualEstimada > 0 && (
                        <div className="glass-card p-6 rounded-2xl border border-purple-500/20">
                            <h3 className="text-white font-bold mb-3">👶 Pensión alimenticia estimada</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-500/10 rounded-xl p-4 text-center border border-purple-500/20">
                                    <p className="text-xs text-purple-400 mb-1">Mensual estimada (30% ingreso × {resultado.hijos} hijos)</p>
                                    <p className="text-2xl font-bold text-purple-400 font-mono">${fmtMXN(resultado.pensionMensualEstimada)}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Anual acumulado</p>
                                    <p className="text-xl font-bold text-white font-mono">${fmtMXN(resultado.pensiónAnual)}</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-2">* Estimado. El juez fija el monto real según necesidades y posibilidades (Art. 308-310 CCF).</p>
                        </div>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cuánto cuesta un divorcio en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    El costo de un divorcio varía principalmente según el estado, el tipo (mutuo vs. incausado),
                    la presencia de hijos y el valor de los bienes. El <strong>divorcio incausado</strong> es el más
                    común en México: cualquier cónyuge puede solicitarlo sin alegar causa (Art. 267 CCF). El mutuo acuerdo
                    puede tramitarse notarialmente si no hay hijos menores ni bienes en disputa, siendo más rápido y económico.
                </p>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Estimador orientativo. Costos reales varían por estado, juzgado y abogado. Art. 267 CCF (incausado). Art. 308-310 CCF (alimentos).
            </p>
        </main>
    )
}
