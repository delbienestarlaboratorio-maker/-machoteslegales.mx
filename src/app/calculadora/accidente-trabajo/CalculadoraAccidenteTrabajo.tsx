'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, getSMG, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

type TipoIncapacidad = 'temporal' | 'parcial' | 'total' | 'muerte'

export default function CalculadoraAccidenteTrabajo() {
    const [salarioMensual, setSalarioMensual] = useState('15000')
    const [tipo, setTipo] = useState<TipoIncapacidad>('temporal')
    const [diasIncapacidadTemp, setDiasIncapacidadTemp] = useState('90')
    const [grado, setGrado] = useState('50')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [showInfo, setShowInfo] = useState(false)

    const uma = getUMA(parseInt(anioCalculo))
    const smg = getSMG(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const sm = parseFloat(salarioMensual) || 0
        if (sm <= 0) return null
        const sd = sm / 30

        if (tipo === 'temporal') {
            const dias = parseInt(diasIncapacidadTemp) || 0
            // IMSS paga 60% del SDI (Art. 58 Fr. I LSS). LFT pide diferencia hasta 100% si hay RT.
            const subsidiarioDiario = sd * 0.60
            const subsidiarioTotal = subsidiarioDiario * dias
            const diferenciaPDTotal = (sd - subsidiarioDiario) * dias
            return { tipo, dias, sd, subsidiarioDiario, subsidiarioTotal, diferenciaPDTotal }
        }

        if (tipo === 'parcial') {
            const gradoNum = parseFloat(grado) / 100
            // Art. 492 LFT: indemnización proporcional al grado de incapacidad × 5 años de SDI
            const aniosSalario = 5
            const diasBase = aniosSalario * 365
            const montoBase = sd * diasBase * gradoNum
            // IMSS paga pensión del % de incapacidad sobre 75% SDI. LFT complementa
            const pensionIMSS = sd * 0.75 * gradoNum
            return { tipo, gradoNum, sd, montoBase, pensionIMSS }
        }

        if (tipo === 'total') {
            // Art. 495 LFT: 70% del SDI de por vida (IMSS), Patrón paga diferencia si aplica
            const topeUMA = uma.diaria * 25
            const sdiTopado = Math.min(sd, topeUMA)
            const pensionMensual = sdiTopado * 30 * 0.70
            // Indemnización complementaria LFT Art. 495: 5 años de salario
            const indemnizacion = sd * 365 * 5
            return { tipo, sd, sdiTopado, pensionMensual, indemnizacion }
        }

        // Muerte
        const gastosFunerarios = smg.general * 60
        // Art. 502 LFT: 730 días de salario
        const indemnizacion = sd * 730
        const total = indemnizacion + gastosFunerarios
        return { tipo, sd, indemnizacion, gastosFunerarios, total }
    }, [salarioMensual, tipo, diasIncapacidadTemp, grado, anioCalculo])

    const tiposOpts: { value: TipoIncapacidad; label: string; icon: string; desc: string }[] = [
        { value: 'temporal', icon: '🩹', label: 'Incapacidad temporal', desc: 'Baja médica por accidente' },
        { value: 'parcial', icon: '♿', label: 'Incapacidad permanente parcial', desc: 'Secuela con % reducción' },
        { value: 'total', icon: '🚑', label: 'Incapacidad permanente total', desc: 'Imposibilidad de trabajar' },
        { value: 'muerte', icon: '⚰️', label: 'Muerte por riesgo laboral', desc: 'Art. 502 LFT: 730 días' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏥</span><span>Riesgo de Trabajo · Arts. 487-502 LFT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Accidente de Trabajo</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula la indemnización que te corresponde por un <strong className="text-white">riesgo de trabajo</strong>:
                    accidente o enfermedad profesional. Incapacidad temporal, permanente parcial, total o muerte.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            {/* Tipo de incapacidad */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {tiposOpts.map(t => (
                    <button key={t.value} onClick={() => setTipo(t.value)}
                        className={`p-3 rounded-xl border text-center text-sm font-bold transition-all cursor-pointer ${tipo === t.value
                            ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-lg'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="text-[10px] font-normal mt-0.5 opacity-70">{t.desc}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioMensual} onChange={e => setSalarioMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    {tipo === 'temporal' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días de incapacidad</label>
                            <input type="number" value={diasIncapacidadTemp} onChange={e => setDiasIncapacidadTemp(e.target.value)} min="1"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    )}
                    {tipo === 'parcial' && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Grado de incapacidad (%)</label>
                            <input type="number" value={grado} onChange={e => setGrado(e.target.value)} min="1" max="99"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año de cálculo</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Qué es un riesgo de trabajo y qué me corresponde? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <h4 className="text-white font-bold">⚖️ Tipos de riesgo de trabajo (Art. 474 LFT)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { t: '🩹 Temporal', d: 'Inhabilitación temporal. IMSS paga 60% SDI desde el 4° día. El patrón debe pagar los 3 primeros días (Art. 58 LSS).' },
                                { t: '♿ Parcial', d: 'Secuela permanente con cierto % de reducción. Indemnización proporcional al grado (Art. 492 LFT). Tabla de valuación por lesión.' },
                                { t: '🚑 Total', d: 'Imposibilidad de trabajar (100%). Pensión 70% SDI de por vida vía IMSS (Art. 495 LFT). Sin tope si el patrón la cubre directamente.' },
                                { t: '⚰️ Muerte', d: '730 días de SDI para beneficiarios (Art. 502 LFT) + gastos funerarios 60 × SMG (Art. 501 LFT).' },
                            ].map(r => (
                                <div key={r.t} className="bg-white/5 rounded-lg p-3">
                                    <p className="text-white font-bold mb-1">{r.t}</p>
                                    <p className="text-white/60">{r.d}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-orange-400"><strong>Importante:</strong> Aplica cuando el accidente ocurre en horas de trabajo o en trayecto (in itinere). El patrón debe tener Prima RT en IMSS. Si no tiene, responde directamente.</p>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 Tu indemnización por riesgo de trabajo</h2>

                    {resultado.tipo === 'temporal' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Subsidio IMSS/día (60%)</p>
                                    <p className="text-lg font-bold text-blue-400 font-mono">${fmtMXN(resultado.subsidiarioDiario)}</p>
                                </div>
                                <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                    <p className="text-xs text-blue-400 mb-1">Subsidio total ({resultado.dias} días)</p>
                                    <p className="text-xl font-bold text-blue-400 font-mono">${fmtMXN(resultado.subsidiarioTotal)}</p>
                                </div>
                                <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                    <p className="text-xs text-[var(--color-accent)] mb-1">Diferencia 100%−60% (patrón)</p>
                                    <p className="text-xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.diferenciaPDTotal)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">Art. 58 Fr. I LSS: IMSS paga 60% del SDI. Arts. 487-490 LFT: el patrón complementa la diferencia si procede por convenio colectivo o sentencia.</p>
                        </div>
                    )}

                    {resultado.tipo === 'parcial' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                    <p className="text-xs text-[var(--color-accent)] mb-1">Indemnización ({(resultado.gradoNum * 100).toFixed(0)}% × 5 años SDI)</p>
                                    <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.montoBase)}</p>
                                </div>
                                <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                    <p className="text-xs text-blue-400 mb-1">Pensión IMSS/mes</p>
                                    <p className="text-xl font-bold text-blue-400 font-mono">${fmtMXN(resultado.pensionIMSS)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">Art. 492 LFT: proporcional al grado de incapacidad × 1825 días (5 años). La tabla de valuación médica determina el grado exacto.</p>
                        </div>
                    )}

                    {resultado.tipo === 'total' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                                    <p className="text-xs text-blue-400 mb-1">Pensión mensual IMSS (70% SDI)</p>
                                    <p className="text-xl font-bold text-blue-400 font-mono">${fmtMXN(resultado.pensionMensual)}</p>
                                    <p className="text-[10px] text-blue-400/60">SDI topado: ${fmtMXN(resultado.sdiTopado)}/día</p>
                                </div>
                                <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                    <p className="text-xs text-[var(--color-accent)] mb-1">Indemnización LFT (5 años)</p>
                                    <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.indemnizacion)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">Art. 495 LFT: 70% SDI vía IMSS de por vida. El patrón puede ser demandado adicionalmente si existe responsabilidad subjetiva (Art. 489 LFT).</p>
                        </div>
                    )}

                    {resultado.tipo === 'muerte' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">730 días (Art. 502 LFT)</p>
                                    <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.indemnizacion)}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Gastos funerarios (60 × SMG)</p>
                                    <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.gastosFunerarios)}</p>
                                </div>
                                <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                    <p className="text-xs text-[var(--color-accent)] mb-1">TOTAL beneficiarios</p>
                                    <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.total)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">Art. 502 LFT: 730 días SDI a beneficiarios (cónyuge/concubina, hijos, ascendientes). Art. 501 LFT: gastos funerarios hasta 60 días de SMG (${fmtMXN(smg.general * 60)}) pagados por IMSS.</p>
                        </div>
                    )}
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué derechos tengo si sufro un accidente de trabajo?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Un <strong>riesgo de trabajo</strong> (accidente o enfermedad profesional) activa automáticamente los derechos
                    del Art. 487 LFT: atención médica, medicamentos, hospitalización, aparatos ortopédicos, y la indemnización
                    según el tipo de incapacidad. El IMSS cubre el 60% del SDI durante la incapacidad temporal; el patrón puede
                    ser demandado por la diferencia y responsabilidad subjetiva (Art. 489 LFT).
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Calculadora Muerte Laboral', href: '/calculadora/muerte-laboral', desc: '730 días + gastos funerarios' },
                        { title: 'Cuotas IMSS (Prima RT)', href: '/calculadora/cuotas-imss', desc: 'Costo de la prima de riesgo' },
                        { title: 'Calculadora Liquidación', href: '/calculadora-laboral', desc: 'Art. 48 + Art. 50 LFT' },
                        { title: 'Plantillas Laborales', href: '/plantillas/laboral', desc: 'Demandas ante JFCA/TEDT' },
                    ].map(t => (
                        <Link key={t.href} href={t.href}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--color-accent)]/30 transition-all group">
                            <span className="text-lg flex-shrink-0">📄</span>
                            <div>
                                <p className="text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">{t.title}</p>
                                <p className="text-xs text-white/50 mt-0.5">{t.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Arts. 473-502 LFT. Art. 58 LSS (subsidio). UMA {uma.anio}: ${fmtMXN(uma.diaria)}. SMG {smg.anio}: ${fmtMXN(smg.general)}. No sustituye asesoría legal.
            </p>
        </main>
    )
}
