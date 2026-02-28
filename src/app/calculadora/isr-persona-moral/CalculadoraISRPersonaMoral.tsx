'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Coeficiente de utilidad por actividad (Art. 14 LISR) — valores representativos
const COEFICIENTES = [
    { actividad: 'Servicios profesionales', cf: 0.30 },
    { actividad: 'Comercio al por menor', cf: 0.20 },
    { actividad: 'Comercio al por mayor', cf: 0.15 },
    { actividad: 'Industria manufacturera', cf: 0.18 },
    { actividad: 'Construcción', cf: 0.12 },
    { actividad: 'Transporte terrestre', cf: 0.10 },
    { actividad: 'Restaurantes y alimentos', cf: 0.22 },
    { actividad: 'Tecnología / software', cf: 0.35 },
    { actividad: 'Inmobiliaria y renta', cf: 0.25 },
    { actividad: 'Otro (ingresar manual)', cf: 0.20 },
] as const

type Row = { l: string; v: number; accent?: boolean }

export default function CalculadoraISRPersonaMoral() {
    const [modoCalculo, setModoCalculo] = useState<'provisional' | 'anual'>('provisional')
    const [ingresosMensual, setIngresosMensual] = useState('500000')
    const [ingresosAnual, setIngresosAnual] = useState('6000000')
    const [deduccionesAnual, setDeduccionesAnual] = useState('4000000')
    const [perdidasAnteriores, setPerdidasAnteriores] = useState('0')
    const [actividad, setActividad] = useState(0)
    const [cfManual, setCfManual] = useState('0.20')

    const cf = actividad === COEFICIENTES.length - 1 ? parseFloat(cfManual) || 0.20 : COEFICIENTES[actividad].cf

    const resultado = useMemo(() => {
        if (modoCalculo === 'provisional') {
            const ingMens = parseFloat(ingresosMensual) || 0
            if (ingMens <= 0) return null
            const baseGravable = ingMens * cf
            const isrMensual = baseGravable * 0.30
            const isrAnual = isrMensual * 12
            const tasaEfectiva = (isrMensual / ingMens) * 100
            return { modo: 'provisional' as const, ingMens, baseGravable, isrMensual, isrAnual, cf, tasaEfectiva }
        } else {
            const ingresos = parseFloat(ingresosAnual) || 0
            const deducciones = parseFloat(deduccionesAnual) || 0
            const perdidas = parseFloat(perdidasAnteriores) || 0
            if (ingresos <= 0) return null
            const utilidadFiscal = Math.max(ingresos - deducciones, 0)
            const baseGravable = Math.max(utilidadFiscal - perdidas, 0)
            const isrAnual = baseGravable * 0.30
            const isrMensual = isrAnual / 12
            const tasaEfectiva = (isrAnual / ingresos) * 100
            return { modo: 'anual' as const, ingresos, deducciones, perdidas, utilidadFiscal, baseGravable, isrAnual, isrMensual, tasaEfectiva, cf }
        }
    }, [modoCalculo, ingresosMensual, ingresosAnual, deduccionesAnual, perdidasAnteriores, actividad, cfManual])

    // Compute rows in component body (not in JSX) to keep TS happy
    let rows: Row[] = []
    if (resultado) {
        if (resultado.modo === 'provisional') {
            rows = [
                { l: 'Ingresos del período', v: resultado.ingMens },
                { l: `Base gravable (${(resultado.cf * 100).toFixed(1)}% × ingresos)`, v: resultado.baseGravable },
                { l: 'ISR provisional (30% × base)', v: resultado.isrMensual, accent: true },
                { l: 'ISR anual proyectado', v: resultado.isrAnual },
            ]
        } else {
            rows = [
                { l: 'Ingresos acumulados', v: resultado.ingresos },
                { l: 'Deducciones autorizadas', v: -resultado.deducciones },
                { l: 'Utilidad fiscal', v: resultado.utilidadFiscal },
                ...(resultado.perdidas > 0 ? [{ l: 'Pérdidas fiscales anteriores', v: -resultado.perdidas }] : []) as Row[],
                { l: 'Base gravable', v: resultado.baseGravable },
                { l: 'ISR anual (30%)', v: resultado.isrAnual, accent: true },
                { l: 'ISR promedio mensual', v: resultado.isrMensual },
            ]
        }
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏢</span><span>ISR PM · Arts. 9 y 14 LISR — Tasa 30%</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR Personas Morales 2026</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Las empresas pagan <strong className="text-[var(--color-accent)]">30% sobre la utilidad fiscal</strong> (Art. 9 LISR).
                    Los pagos provisionales mensuales usan el <strong className="text-white">coeficiente de utilidad</strong> (Art. 14 LISR).
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                    { v: 'provisional' as const, icon: '📅', label: 'Pago provisional (Art. 14)', sub: 'Ingresos × coef. utilidad × 30%' },
                    { v: 'anual' as const, icon: '📊', label: 'ISR anual (Art. 9)', sub: 'Ingresos − deducciones − pérdidas × 30%' },
                ] as const).map(t => (
                    <button key={t.v} onClick={() => setModoCalculo(t.v)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${modoCalculo === t.v ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-xl mb-1">{t.icon}</p>
                        <p className="text-xs font-bold">{t.label}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">{t.sub}</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Actividad económica (coef. utilidad)</label>
                        <select value={actividad} onChange={e => setActividad(parseInt(e.target.value))}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {COEFICIENTES.map((c, i) => <option key={i} value={i}>{c.actividad} (CF {(c.cf * 100).toFixed(0)}%)</option>)}
                        </select>
                    </div>
                    {actividad === COEFICIENTES.length - 1 && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Coeficiente de utilidad (del ejercicio anterior)</label>
                            <input type="number" value={cfManual} onChange={e => setCfManual(e.target.value)} step="0.01" min="0.01" max="1"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        </div>
                    )}
                </div>

                {modoCalculo === 'provisional' ? (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos acumulados del período ($)</label>
                        <input type="number" value={ingresosMensual} onChange={e => setIngresosMensual(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Por mes o acumulado en el año. CF actual: {(cf * 100).toFixed(1)}%</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos acumulados del ejercicio ($)</label>
                            <input type="number" value={ingresosAnual} onChange={e => setIngresosAnual(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Deducciones autorizadas ($)</label>
                            <input type="number" value={deduccionesAnual} onChange={e => setDeduccionesAnual(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Pérdidas de ejercicios anteriores ($)</label>
                            <input type="number" value={perdidasAnteriores} onChange={e => setPerdidasAnteriores(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                    </div>
                )}
            </div>

            {resultado && rows.length > 0 && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">💰 ISR Persona Moral {modoCalculo === 'provisional' ? '— Provisional' : '— Anual'}</h2>
                    <div className="space-y-2 text-sm">
                        {rows.map((r, i) => (
                            <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : 'bg-white/5'}`}>
                                <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.l}</span>
                                <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-lg' : 'text-white text-xs'}`}>
                                    {r.v < 0 ? '-' : ''}${fmtMXN(Math.abs(r.v))}
                                </span>
                            </div>
                        ))}
                        <p className="text-[10px] text-white/30 text-right">Tasa efectiva sobre ingresos: {resultado.tasaEfectiva.toFixed(2)}%</p>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Art. 9 LISR 30% utilidad fiscal. Art. 14 pagos provisionales con coeficiente de utilidad. Estimador. No sustituye declaración contable formal.
            </p>
        </main>
    )
}
