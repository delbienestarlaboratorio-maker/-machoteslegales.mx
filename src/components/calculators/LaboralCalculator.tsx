'use client'

import { useState, useMemo } from 'react'

interface LaboralCalculatorProps {
    tier: 'v1' | 'v2' | 'v3'
}

interface ResultLine {
    concepto: string
    monto: number
    base: string
    bloqueado?: boolean
}

export default function LaboralCalculator({ tier }: LaboralCalculatorProps) {
    const isAdvanced = tier !== 'v1'

    // Campos básicos (V1)
    const [salarioDiario, setSalarioDiario] = useState('')
    const [fechaIngreso, setFechaIngreso] = useState('')
    const [fechaDespido, setFechaDespido] = useState('')

    // Campos avanzados (V2+)
    const [horasExtraSemanal, setHorasExtraSemanal] = useState('')
    const [diasAguinaldo, setDiasAguinaldo] = useState('15')
    const [diasVacaciones, setDiasVacaciones] = useState('')
    const [primaVacPct, setPrimaVacPct] = useState('25')
    const [mesesSalariosCaidos, setMesesSalariosCaidos] = useState('12')

    const calculo = useMemo<ResultLine[]>(() => {
        const sd = parseFloat(salarioDiario) || 0
        if (!sd || !fechaIngreso || !fechaDespido) return []

        const ingreso = new Date(fechaIngreso)
        const despido = new Date(fechaDespido)
        const diffMs = despido.getTime() - ingreso.getTime()
        if (diffMs <= 0) return []

        const anios = diffMs / (1000 * 60 * 60 * 24 * 365.25)
        const meses = diffMs / (1000 * 60 * 60 * 24 * 30.44)
        const diasTrabajados = diffMs / (1000 * 60 * 60 * 24)

        // Tabla de vacaciones según antigüedad (Art. 76 LFT, reforma 2023)
        function diasVacLFT(a: number): number {
            if (a < 1) return 12
            if (a === 1) return 12
            if (a === 2) return 14
            if (a === 3) return 16
            if (a === 4) return 18
            if (a === 5) return 20
            if (a <= 10) return 20 + Math.floor((a - 5) / 1) * 2
            if (a <= 15) return 30 + Math.floor((a - 10) / 1) * 2
            if (a <= 20) return 30 + Math.floor((a - 10) / 1) * 2
            return 32 + Math.floor((a - 6) * 2)
        }

        const results: ResultLine[] = []

        // 1. Indemnización Constitucional (Art. 48 LFT) — 3 meses de salario
        results.push({
            concepto: 'Indemnización constitucional (3 meses)',
            monto: sd * 90,
            base: 'Art. 48 LFT — 90 días de salario',
        })

        // 2. Prima de antigüedad (Art. 162 LFT) — 12 días por año, tope doble salario mínimo
        const diasPrima = Math.floor(anios) * 12
        const topeSM = 278.80 * 2 // Doble del SMG 2026 estimado
        const sdPrima = Math.min(sd, topeSM)
        results.push({
            concepto: `Prima de antigüedad (${Math.floor(anios)} años × 12 días)`,
            monto: diasPrima * sdPrima,
            base: `Art. 162 LFT — ${diasPrima} días (tope 2xSMG)`,
        })

        // 3. Aguinaldo proporcional
        const diasAg = parseInt(diasAguinaldo) || 15
        const propAguinaldo = (diasTrabajados % 365.25) / 365.25
        results.push({
            concepto: `Aguinaldo proporcional (${diasAg} días/año)`,
            monto: sd * diasAg * propAguinaldo,
            base: `Art. 87 LFT — Prop. ${(propAguinaldo * 100).toFixed(0)}%`,
        })

        // === V2+ campos ===
        if (isAdvanced) {
            // 4. Vacaciones proporcionales
            const dv = parseInt(diasVacaciones) || diasVacLFT(Math.floor(anios))
            const propVac = (diasTrabajados % 365.25) / 365.25
            results.push({
                concepto: `Vacaciones proporcionales (${dv} días)`,
                monto: sd * dv * propVac,
                base: `Art. 76 LFT (reforma 2023) — Prop. ${(propVac * 100).toFixed(0)}%`,
            })

            // 5. Prima vacacional
            const pvPct = parseFloat(primaVacPct) || 25
            results.push({
                concepto: `Prima vacacional (${pvPct}%)`,
                monto: sd * dv * propVac * (pvPct / 100),
                base: `Art. 80 LFT — ${pvPct}% s/vacaciones`,
            })

            // 6. Salarios caídos
            const mesesSC = parseInt(mesesSalariosCaidos) || 12
            results.push({
                concepto: `Salarios caídos (${mesesSC} meses)`,
                monto: sd * mesesSC * 30,
                base: `Art. 48 LFT — ${mesesSC} × 30 días`,
            })

            // 7. Horas extra
            const hx = parseFloat(horasExtraSemanal) || 0
            if (hx > 0) {
                const hxDoble = Math.min(hx, 9) * (sd / 8) * 2
                const hxTriple = Math.max(hx - 9, 0) * (sd / 8) * 3
                results.push({
                    concepto: `Horas extra semanales (${hx}h)`,
                    monto: (hxDoble + hxTriple) * (meses * 4.33),
                    base: `Arts. 66-68 LFT — Doble/Triple`,
                })
            }
        } else {
            // Conceptos bloqueados en V1
            results.push({ concepto: 'Vacaciones proporcionales', monto: 0, base: 'Disponible en V2', bloqueado: true })
            results.push({ concepto: 'Prima vacacional', monto: 0, base: 'Disponible en V2', bloqueado: true })
            results.push({ concepto: 'Salarios caídos', monto: 0, base: 'Disponible en V2', bloqueado: true })
        }

        return results
    }, [salarioDiario, fechaIngreso, fechaDespido, diasAguinaldo, diasVacaciones, primaVacPct, mesesSalariosCaidos, horasExtraSemanal, isAdvanced])

    const total = calculo.filter(r => !r.bloqueado).reduce((s, r) => s + r.monto, 0)

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] text-white">
                    🧮 Calculadora de Indemnización Laboral
                </h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isAdvanced ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-white/10 text-white'}`}>
                    {isAdvanced ? 'V2 AVANZADO' : 'V1 BÁSICO'}
                </span>
            </div>

            {/* Campos básicos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Salario diario ($)</label>
                    <input
                        type="number"
                        value={salarioDiario}
                        onChange={(e) => setSalarioDiario(e.target.value)}
                        placeholder="461.53"
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50"
                    />
                </div>
                <div>
                    <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Fecha de ingreso</label>
                    <input
                        type="date"
                        value={fechaIngreso}
                        onChange={(e) => setFechaIngreso(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50"
                    />
                </div>
                <div>
                    <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Fecha de despido</label>
                    <input
                        type="date"
                        value={fechaDespido}
                        onChange={(e) => setFechaDespido(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50"
                    />
                </div>
            </div>

            {/* Campos avanzados V2 */}
            {isAdvanced && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-white/5">
                    <div>
                        <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Días de aguinaldo</label>
                        <input type="number" value={diasAguinaldo} onChange={(e) => setDiasAguinaldo(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50" />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Días de vacaciones</label>
                        <input type="number" value={diasVacaciones} onChange={(e) => setDiasVacaciones(e.target.value)} placeholder="Auto" className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50" />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Meses sal. caídos</label>
                        <input type="number" value={mesesSalariosCaidos} onChange={(e) => setMesesSalariosCaidos(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50" />
                    </div>
                    <div>
                        <label className="text-xs text-[var(--color-text-muted)] mb-1 block">Hrs. extra/semana</label>
                        <input type="number" value={horasExtraSemanal} onChange={(e) => setHorasExtraSemanal(e.target.value)} placeholder="0" className="w-full px-3 py-2.5 rounded-lg bg-[var(--color-surface-light)] border border-white/10 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/50" />
                    </div>
                </div>
            )}

            {/* Resultados */}
            {calculo.length > 0 && (
                <div className="space-y-1 pt-2">
                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-[var(--color-text-muted)] mb-2 px-3">
                        <div className="col-span-5">Concepto</div>
                        <div className="col-span-4">Fundamento</div>
                        <div className="col-span-3 text-right">Monto</div>
                    </div>
                    {calculo.map((r, i) => (
                        <div
                            key={i}
                            className={`grid grid-cols-12 gap-2 items-center px-3 py-2 rounded-lg text-sm ${r.bloqueado ? 'opacity-40 bg-white/5' : 'hover:bg-white/5'} transition-colors`}
                        >
                            <div className="col-span-5 text-white flex items-center gap-2">
                                {r.bloqueado && <span className="text-[10px]">🔒</span>}
                                {r.concepto}
                            </div>
                            <div className="col-span-4 text-xs text-[var(--color-text-muted)]">{r.base}</div>
                            <div className={`col-span-3 text-right font-mono font-semibold ${r.bloqueado ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-accent)]'}`}>
                                {r.bloqueado ? '—' : `$${r.monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </div>
                        </div>
                    ))}
                    {/* Total */}
                    <div className="grid grid-cols-12 gap-2 items-center px-3 py-3 mt-2 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                        <div className="col-span-9 text-white font-bold">TOTAL ESTIMADO</div>
                        <div className="col-span-3 text-right font-mono font-bold text-lg text-[var(--color-accent)]">
                            ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
            )}

            {!isAdvanced && calculo.length > 0 && (
                <div className="text-center pt-3 border-t border-white/5">
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                        🔒 Desbloquea vacaciones, prima vacacional, salarios caídos y horas extra con <strong className="text-[var(--color-accent)]">V2 Negocios</strong>
                    </p>
                    <a href="/precios" className="inline-block px-5 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-dark)] text-sm font-bold hover:bg-[var(--color-accent-light)] transition-colors">
                        Obtener V2 — $79 MXN
                    </a>
                </div>
            )}

            <p className="text-[10px] text-[var(--color-text-muted)]">
                * Cálculo estimado con base en la Ley Federal del Trabajo vigente (reforma vacaciones 2023). No sustituye asesoría legal profesional. SMG 2026 estimado: $278.80
            </p>
        </div>
    )
}
