'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles, diasVacacionesLFT } from '@/data/legal-constants'

export default function CalculadoraIndemnizacion50() {
    const [sdActual, setSdActual] = useState('800')
    const [aniosTrabajados, setAniosTrabajados] = useState('5')
    const [mesesAdicionales, setMesesAdicionales] = useState('3')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [incluyePrima, setIncluyePrima] = useState(true)
    const [incluyeVacaciones, setIncluyeVacaciones] = useState(true)
    const [incluyeAguinaldo, setIncluyeAguinaldo] = useState(true)

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sd = parseFloat(sdActual) || 0
        const anios = parseFloat(aniosTrabajados) || 0
        const meses = parseInt(mesesAdicionales) || 3
        if (sd <= 0 || anios <= 0) return null

        // Art. 50 LFT: 20 días por año de servicios
        const dias20PorAnio = 20 * anios
        const monto20PorAnio = sd * dias20PorAnio

        // 3 meses de salario (período del aviso / indemnización constitucional)
        const monto3Meses = sd * 30 * meses

        // Prima de antigüedad Art. 162 LFT: 12 días × año, tope 2×SMG
        let prima = 0
        if (incluyePrima && anios >= 1) {
            const sdParaPrima = Math.min(sd, smg.diario * 2)
            prima = sdParaPrima * 12 * anios
        }

        // Partes proporcionales
        const diasVac = diasVacacionesLFT(anios)
        const fraccionAnio = parseFloat(String(anios)) % 1 // si hay meses incompletos
        const vacaciones = incluyeVacaciones ? sd * diasVac * (fraccionAnio > 0 ? fraccionAnio : 1) : 0
        const primaVac = vacaciones * 0.25
        const aguinaldo = incluyeAguinaldo ? sd * 15 * (fraccionAnio > 0 ? fraccionAnio : 1) : 0

        const total = monto20PorAnio + monto3Meses + prima + (incluyeVacaciones ? vacaciones + primaVac : 0) + (incluyeAguinaldo ? aguinaldo : 0)

        return {
            sd, anios, meses,
            dias20PorAnio, monto20PorAnio,
            monto3Meses,
            prima,
            vacaciones: incluyeVacaciones ? vacaciones : 0,
            primaVac: incluyeVacaciones ? primaVac : 0,
            aguinaldo: incluyeAguinaldo ? aguinaldo : 0,
            total
        }
    }, [sdActual, aniosTrabajados, mesesAdicionales, anioCalculo, incluyePrima, incluyeVacaciones, incluyeAguinaldo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Indemnización · Art. 50 LFT — Rescisión Patronal</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Indemnización Art. 50 LFT</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando el <strong className="text-white">patrón rescinde sin causa justificada</strong> a un trabajador de
                    confianza o de planta, deberá pagar <strong className="text-[var(--color-accent)]">20 días de salario por año</strong> más
                    los meses de aviso (Art. 50 LFT).
                </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6 text-xs text-center">
                <span className="text-blue-400 font-bold">ℹ️ Art. 50 vs Art. 48 LFT:</span>
                <span className="text-white/60"> Art. 50 = rescisión por patrón sin causa | Art. 48 = despido injustificado (trabajador elige reinstalación o indemnización constitucional)</span>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">📋 Datos del trabajador</h2>
                    <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                        {getAniosDisponibles().map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario Diario Integrado ($)</label>
                        <input type="number" value={sdActual} onChange={e => setSdActual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">SMG {anioCalculo}: ${fmtMXN(smg.diario)}/día</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Años de antigüedad</label>
                        <input type="number" value={aniosTrabajados} onChange={e => setAniosTrabajados(e.target.value)} step="0.5" min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Meses de aviso (Art. 50)</label>
                        <select value={mesesAdicionales} onChange={e => setMesesAdicionales(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            <option value="1">1 mes (hasta 1 año)</option>
                            <option value="2">2 meses</option>
                            <option value="3">3 meses (estándar)</option>
                            <option value="6">6 meses (> 15 años)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { state: incluyePrima, setter: setIncluyePrima, label: 'Prima antigüedad', sub: 'Art. 162' },
                        { state: incluyeVacaciones, setter: setIncluyeVacaciones, label: 'Vacaciones prop.', sub: 'Art. 76' },
                        { state: incluyeAguinaldo, setter: setIncluyeAguinaldo, label: 'Aguinaldo prop.', sub: 'Art. 87' },
                    ].map((item, i) => (
                        <label key={i} className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5 hover:border-white/20 transition-all">
                            <input type="checkbox" checked={item.state} onChange={e => item.setter(e.target.checked)} className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-white">{item.label}</p>
                                <p className="text-[10px] text-white/40">{item.sub}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Indemnización total — Art. 50 LFT</h2>
                    <div className="space-y-2 text-sm mb-4">
                        {[
                            { l: `20 días × ${resultado.anios} años (${resultado.dias20PorAnio} días × $${fmtMXN(resultado.sd)})`, v: resultado.monto20PorAnio, key: 'main' },
                            { l: `${resultado.meses} mes(es) de salario`, v: resultado.monto3Meses, key: 'meses' },
                            ...(resultado.prima > 0 ? [{ l: `Prima de antigüedad (12 días × ${resultado.anios} años Art. 162)`, v: resultado.prima, key: 'prima' }] : []),
                            ...(resultado.vacaciones > 0 ? [{ l: `Vacaciones proporcionales + prima 25%`, v: resultado.vacaciones + resultado.primaVac, key: 'vac' }] : []),
                            ...(resultado.aguinaldo > 0 ? [{ l: `Aguinaldo proporcional`, v: resultado.aguinaldo, key: 'ag' }] : []),
                            { l: 'TOTAL A PAGAR', v: resultado.total, key: 'total' },
                        ].map((r, i, arr) => (
                            <div key={r.key} className={`flex justify-between p-3 rounded-lg ${i === arr.length - 1 ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${i === arr.length - 1 ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${i === arr.length - 1 ? 'text-[var(--color-accent)] text-xl' : 'text-white text-xs'}`}>${fmtMXN(r.v)}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-white/30 mt-2">2×SMG {anioCalculo}: ${fmtMXN(smg.diario * 2)}/día — tope prima antigüedad.</p>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 50 LFT (rescisión sin causa). Art. 162 prima antigüedad. Art. 76-80 vacaciones. Art. 87 aguinaldo. No sustituye asesoría laboral.
            </p>
        </main>
    )
}
