'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// UMA diaria histórica para cálculos de pensión
const UMA_DIARIA: Record<number, number> = {
    2026: 113.14, 2025: 108.57, 2024: 103.74, 2023: 96.22, 2022: 96.22,
    2021: 89.62, 2020: 86.88, 2019: 84.49, 2018: 80.60,
}

export default function CalculadoraPensionIMSS() {
    const [semanasCotizadas, setSemanasCotizadas] = useState('1250')
    const [saldoAFORE, setSaldoAFORE] = useState('800000')
    const [edadActual, setEdadActual] = useState('60')
    const [salarioBase, setSalarioBase] = useState('15000')
    const [modalidad, setModalidad] = useState<'renta-vitalicia' | 'retiro-programado'>('renta-vitalicia')
    const anioCalculo = 2026
    const uma = UMA_DIARIA[anioCalculo]

    const resultado = useMemo(() => {
        const semanas = parseInt(semanasCotizadas) || 0
        const afore = parseFloat(saldoAFORE) || 0
        const edad = parseInt(edadActual) || 0
        const salario = parseFloat(salarioBase) || 0
        if (semanas <= 0 || afore <= 0 || edad <= 0) return null

        // Ley 97 (AFORE): requisitos mínimos
        const puedeJubilarse = semanas >= 1250 && edad >= 60 // cesantía
        const puedeVejez = semanas >= 1250 && edad >= 65     // vejez

        // Pensión garantizada (mínima) — Art. 168 LSS = 1 UMA mensual actualizado
        const pensionGarantizadaDiaria = uma
        const pensionGarantizadaMensual = pensionGarantizadaDiaria * 30

        // Estimación de renta vitalicia
        // Factor de anualidad estimado (depende de aseguradora, edad, tasa técnica)
        // Factor típico IMSS: 200-250 mensualidades garantizadas dependiendo de edad
        const factorEdad = Math.max(200 - (edad - 60) * 8, 100)
        const rentaVitalicia = puedeJubilarse ? Math.max(afore / factorEdad, pensionGarantizadaMensual) : 0

        // Retiro programado — AFORE te va pagando hasta agotar el fondo
        // Esperanza de vida aproximada según tablas
        const aniosVida = Math.max(85 - edad, 15)
        const mesesVida = aniosVida * 12
        const retiroProgramado = puedeJubilarse ? Math.max(afore / mesesVida, pensionGarantizadaMensual) : 0

        const semanasFaltantes = Math.max(1250 - semanas, 0)
        const pctAvance = Math.min((semanas / 1250) * 100, 100)

        return {
            semanas, afore, edad, salario,
            puedeJubilarse, puedeVejez,
            pensionGarantizadaMensual,
            rentaVitalicia,
            retiroProgramado,
            semanasFaltantes,
            pctAvance,
            pensionSeleccionada: modalidad === 'renta-vitalicia' ? rentaVitalicia : retiroProgramado
        }
    }, [semanasCotizadas, saldoAFORE, edadActual, salarioBase, modalidad])

    const pensionInfos = [
        { label: 'Mínima (UMA mensual)', valor: uma * 30, color: 'bg-white/5', text: 'text-white/60' },
        { label: 'Renta vitalicia (estimado)', valor: resultado?.rentaVitalicia || 0, color: 'bg-[var(--color-accent)]/10', text: 'text-[var(--color-accent)]', border: 'border border-[var(--color-accent)]/30' },
        { label: 'Retiro programado (estimado)', valor: resultado?.retiroProgramado || 0, color: 'bg-blue-500/10', text: 'text-blue-400', border: 'border border-blue-500/20' },
    ]

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏦</span><span>Pensión IMSS · Ley 97 — Art. 154 LSS</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Pensión IMSS Vejez / Cesantía</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Bajo la <strong className="text-white">Ley 97 (AFORE)</strong>, tu pensión depende de tu saldo acumulado.
                    Requisito: <strong className="text-[var(--color-accent)]">1,250 semanas</strong> cotizadas + 60 años (cesantía) o 65 (vejez).
                </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 text-xs text-center">
                <span className="text-amber-400 font-bold">⚠️ ¿Ley 73 o Ley 97?</span>
                <span className="text-white/60"> Si cotizaste antes del 1° de julio de 1997, puedes elegir la pensión bajo Ley 73 (pensión garantizada más alta). Esta calculadora es para Ley 97 (AFORE).</span>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Semanas cotizadas al IMSS</label>
                        <input type="number" value={semanasCotizadas} onChange={e => setSemanasCotizadas(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Mínimo 1,250 semanas (~24 años de cotización)</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Saldo AFORE estimado ($)</label>
                        <input type="number" value={saldoAFORE} onChange={e => setSaldoAFORE(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Consulta tu estado de cuenta AFORE</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Edad actual (años)</label>
                        <input type="number" value={edadActual} onChange={e => setEdadActual(e.target.value)} min="50" max="90"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Modalidad de pensión</label>
                        <div className="grid grid-cols-2 gap-2">
                            {([
                                { v: 'renta-vitalicia' as const, label: 'Renta Vitalicia', sub: 'Aseguradora' },
                                { v: 'retiro-programado' as const, label: 'Retiro Programado', sub: 'AFORE' },
                            ] as const).map(m => (
                                <button key={m.v} onClick={() => setModalidad(m.v)}
                                    className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${modalidad === m.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                    <p className="font-bold">{m.label}</p>
                                    <p className="opacity-60">{m.sub}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 space-y-4">
                    {/* Avance semanas */}
                    <div className="glass-card p-5 rounded-2xl">
                        <div className="flex justify-between mb-2">
                            <span className="text-white font-bold text-sm">Progreso semanas cotizadas</span>
                            <span className={`text-sm font-bold ${resultado.puedeJubilarse ? 'text-emerald-400' : 'text-orange-400'}`}>
                                {resultado.semanas.toLocaleString()} / 1,250
                            </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${resultado.puedeJubilarse ? 'bg-emerald-500' : 'bg-orange-500'}`}
                                style={{ width: `${resultado.pctAvance}%` }} />
                        </div>
                        {!resultado.puedeJubilarse && (
                            <p className="text-xs text-orange-400 mt-2">Faltan {resultado.semanasFaltantes} semanas (~{Math.ceil(resultado.semanasFaltantes / 52)} años más de cotización)</p>
                        )}
                        {resultado.puedeJubilarse && !resultado.puedeVejez && (
                            <p className="text-xs text-emerald-400 mt-2">✅ Requisitos de cesantía cumplidos (60 años + 1,250 semanas). Para vejez: 65 años.</p>
                        )}
                        {resultado.puedeVejez && (
                            <p className="text-xs text-emerald-400 mt-2">✅ Requisitos de vejez cumplidos (65 años + 1,250 semanas).</p>
                        )}
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">🏦 Estimado de pensión mensual</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            {pensionInfos.map((p, i) => (
                                <div key={i} className={`p-4 rounded-xl text-center ${p.color} ${p.border || ''}`}>
                                    <p className="text-[10px] text-white/50 mb-1">{p.label}</p>
                                    <p className={`text-xl font-bold font-mono ${p.text}`}>${fmtMXN(p.valor)}/mes</p>
                                </div>
                            ))}
                        </div>
                        {!resultado.puedeJubilarse && (
                            <p className="text-xs text-orange-400 text-center">⚠️ Aún no cumples los requisitos mínimos para pensionarte bajo Ley 97.</p>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 154 LSS (cesantía) y Art. 162 LSS (vejez). Ley 97 AFORE. Estimaciones basadas en factores actuariales simplificados. Consulta a tu AFORE para cálculo exacto.
            </p>
        </main>
    )
}
