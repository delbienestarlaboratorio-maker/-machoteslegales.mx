'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN } from '@/data/legal-constants'

// Cuotas IMSS 2026 (Art. 106 y 147 LSS) — porcentajes patrón y trabajador
const RAMOS_IMSS = [
    {
        ramo: 'Enfermedad y Maternidad',
        seccion: 'Cuota Fija / Excedente',
        patronPct: 0,    // especial: cuota fija + variable
        trabajadorPct: 0,
        esFijo: true,
        leyenda: 'Cuota fija = 20.40% SMG diario × 30 días'
    },
    {
        ramo: 'Prestaciones en Dinero',
        seccion: 'Art. 106 Fr. II LSS',
        patronPct: 0.70 / 100,
        trabajadorPct: 0.25 / 100,
        esFijo: false,
        leyenda: ''
    },
    {
        ramo: 'Gastos Médicos Pensionados',
        seccion: 'Art. 106 Fr. III LSS',
        patronPct: 1.05 / 100,
        trabajadorPct: 0.375 / 100,
        esFijo: false,
        leyenda: ''
    },
    {
        ramo: 'Invalidez y Vida',
        seccion: 'Art. 147 LSS',
        patronPct: 1.75 / 100,
        trabajadorPct: 0.625 / 100,
        esFijo: false,
        leyenda: ''
    },
    {
        ramo: 'Cesantía en Edad Avanzada y Vejez',
        seccion: 'Art. 168 Fr. I LSS',
        patronPct: 3.150 / 100,
        trabajadorPct: 1.125 / 100,
        esFijo: false,
        leyenda: ''
    },
    {
        ramo: 'Retiro',
        seccion: 'Art. 168 Fr. II LSS',
        patronPct: 2.00 / 100,
        trabajadorPct: 0,
        esFijo: false,
        leyenda: 'Solo patrón'
    },
    {
        ramo: 'Guarderías y Prestaciones Sociales',
        seccion: 'Art. 211 LSS',
        patronPct: 1.00 / 100,
        trabajadorPct: 0,
        esFijo: false,
        leyenda: 'Solo patrón'
    },
    {
        ramo: 'Riesgo de Trabajo',
        seccion: 'Art. 73 LSS — Prima media',
        patronPct: 0.54355 / 100,
        trabajadorPct: 0,
        esFijo: false,
        leyenda: 'Prima media industria (varía por actividad)'
    },
    {
        ramo: 'INFONAVIT',
        seccion: 'Art. 29 Fr. II Ley INFONAVIT',
        patronPct: 5.00 / 100,
        trabajadorPct: 0,
        esFijo: false,
        leyenda: 'Solo patrón — va directo al subcuenta vivienda'
    },
]

export default function CalculadoraCuotasIMSS() {
    const [salarioBruto, setSalarioBruto] = useState('20000')
    const [diasMes, setDiasMes] = useState('30')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))

    const uma = getUMA(parseInt(anioCalculo))
    const smgDiario = 278.80  // SMG 2026

    const resultado = useMemo(() => {
        const salario = parseFloat(salarioBruto) || 0
        const dias = parseInt(diasMes) || 30
        if (salario <= 0) return null

        // SDI diario
        const sdi = salario / dias

        // Tope máximo: 25 UMAs diarias
        const tope25UMA = uma.diaria * 25
        const sdTope = Math.min(sdi, tope25UMA)

        // Cuota fija enfermedad y maternidad
        const cuotaFijaEM = smgDiario * 30 * 0.2040  // 20.40% sobre SMG mensual

        // Excedente por encima de 3 SMG
        const tope3SMG = smgDiario * 3
        const excedente = Math.max(sdi - tope3SMG, 0) * 30
        const cuotaExcedentePatron = excedente * 0.011
        const cuotaExcedenteTrab = excedente * 0.004

        const base = sdTope * dias

        const ramos = RAMOS_IMSS.map(r => {
            if (r.esFijo) {
                return { ...r, montoPatron: cuotaFijaEM + cuotaExcedentePatron, montoTrabajador: cuotaExcedenteTrab }
            }
            return { ...r, montoPatron: base * r.patronPct, montoTrabajador: base * r.trabajadorPct }
        })

        const totalPatron = ramos.reduce((s, r) => s + r.montoPatron, 0)
        const totalTrabajador = ramos.reduce((s, r) => s + r.montoTrabajador, 0)
        const totalIMSS = totalPatron + totalTrabajador
        const costoTotalLaboral = salario + totalPatron

        return { sdi, sdTope, tope25UMA, ramos, totalPatron, totalTrabajador, totalIMSS, costoTotalLaboral, base }
    }, [salarioBruto, diasMes, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏥</span><span>Cuotas IMSS · Arts. 73-211 LSS + Ley INFONAVIT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Cuotas IMSS Patrón 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Desglose completo de las cuotas que paga el
                    <strong className="text-[var(--color-accent)]"> patrón</strong> y el
                    <strong className="text-white"> trabajador</strong> al IMSS e INFONAVIT por cada empleado.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario mensual bruto ($)</label>
                        <input type="number" value={salarioBruto} onChange={e => setSalarioBruto(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Días del período</label>
                        <select value={diasMes} onChange={e => setDiasMes(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="30">30 días (mensual)</option>
                            <option value="14">14 días (quincenal)</option>
                            <option value="7">7 días (semanal)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Año</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {[2026, 2025, 2024].map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Cuotas Patrón', value: resultado.totalPatron, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' },
                            { label: 'Cuotas Trabajador', value: resultado.totalTrabajador, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20' },
                            { label: 'Costo Total Laboral', value: resultado.costoTotalLaboral, color: 'text-white', bg: 'bg-white/10 border border-white/20' },
                        ].map((s, i) => (
                            <div key={i} className={`p-4 rounded-xl text-center ${s.bg}`}>
                                <p className="text-[10px] text-white/50 mb-1">{s.label}</p>
                                <p className={`text-lg font-bold font-mono ${s.color}`}>${fmtMXN(s.value)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-4 gap-0 p-3 border-b border-white/10 text-[10px] text-white/40 font-bold">
                            <span className="col-span-1">Ramo</span>
                            <span className="text-right">Patrón %</span>
                            <span className="text-right">Patrón $</span>
                            <span className="text-right">Trabajador $</span>
                        </div>
                        {resultado.ramos.map((r, i) => (
                            <div key={i} className={`grid grid-cols-4 gap-0 p-3 text-xs border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                                <div className="col-span-1">
                                    <p className="text-white font-semibold">{r.ramo}</p>
                                    <p className="text-white/30 text-[9px]">{r.seccion}</p>
                                    {r.leyenda && <p className="text-[var(--color-accent)] text-[9px]">{r.leyenda}</p>}
                                </div>
                                <span className="text-right text-white/50 font-mono">
                                    {r.esFijo ? 'Cuota fija' : `${(r.patronPct * 100).toFixed(3)}%`}
                                </span>
                                <span className="text-right text-[var(--color-accent)] font-mono font-bold">${fmtMXN(r.montoPatron)}</span>
                                <span className="text-right text-blue-400 font-mono">${fmtMXN(r.montoTrabajador)}</span>
                            </div>
                        ))}
                        <div className="grid grid-cols-4 gap-0 p-3 bg-white/5 text-xs font-bold">
                            <span className="col-span-2 text-white">TOTAL</span>
                            <span className="text-right text-[var(--color-accent)] font-mono">${fmtMXN(resultado.totalPatron)}</span>
                            <span className="text-right text-blue-400 font-mono">${fmtMXN(resultado.totalTrabajador)}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-white/30 text-center">
                        SDI: ${fmtMXN(resultado.sdi)}/día | Tope 25 UMAs: ${fmtMXN(resultado.tope25UMA)}/día | UMA {anioCalculo}: ${fmtMXN(uma.diaria)}/día
                    </p>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * LSS Art. 73-211. Cuotas para 2026. Tope máximo 25 UMAs. Prima de riesgo varía por SIMIT. INFONAVIT Art. 29 Fr. II. Consulta a tu contador para prima exacta.
            </p>
        </main>
    )
}
