'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { TABLA_ISR_MENSUAL, fmtMXN, calcularISR } from '@/data/legal-constants'

type TipoDeduccion = 'ciega' | 'reales'

export default function CalculadoraISRRenta() {
    const [rentaMensual, setRentaMensual] = useState('15000')
    const [tipoDeduccion, setTipoDeduccion] = useState<TipoDeduccion>('ciega')
    const [deduccionesReales, setDeduccionesReales] = useState('3000')
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const renta = parseFloat(rentaMensual) || 0
        if (renta <= 0) return null

        // Deducción ciega: 35% Art. 115 LISR
        const dedCiega = renta * 0.35
        const dedReales = parseFloat(deduccionesReales) || 0
        const deduccion = tipoDeduccion === 'ciega' ? dedCiega : dedReales

        const baseGravable = Math.max(renta - deduccion, 0)
        const isrMensual = calcularISR(baseGravable)
        const isrAnual = isrMensual * 12
        const rentaNeta = renta - isrMensual
        const tasaEfectiva = renta > 0 ? (isrMensual / renta) * 100 : 0

        // Comparativa ciega vs reales
        const baseConCiega = Math.max(renta - dedCiega, 0)
        const isrConCiega = calcularISR(baseConCiega)
        const baseConReales = Math.max(renta - dedReales, 0)
        const isrConReales = calcularISR(baseConReales)
        const ahorro = isrConReales - isrConCiega // positivo = ciega ahorra más

        return {
            renta, deduccion, baseGravable, isrMensual, isrAnual,
            rentaNeta, tasaEfectiva, dedCiega, dedReales,
            isrConCiega, isrConReales, ahorro
        }
    }, [rentaMensual, tipoDeduccion, deduccionesReales])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏠</span><span>ISR Arrendamiento · Arts. 114-118 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora ISR por <span className="gradient-gold">Renta de Inmuebles</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Rentas un departamento o local? Calcula tu <strong className="text-white">pago provisional de ISR</strong> mensual.
                    Compara la <strong className="text-emerald-400">deducción ciega (35%)</strong> vs deducciones reales.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos</h2>
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Renta mensual cobrada ($)</label>
                    <input type="number" value={rentaMensual} onChange={e => setRentaMensual(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setTipoDeduccion('ciega')}
                        className={`p-4 rounded-xl border text-sm text-center transition-all cursor-pointer ${tipoDeduccion === 'ciega'
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="font-bold">✅ Deducción ciega 35%</p>
                        <p className="text-xs mt-1 opacity-70">Sin comprobar gastos (Art. 115 LISR)</p>
                    </button>
                    <button onClick={() => setTipoDeduccion('reales')}
                        className={`p-4 rounded-xl border text-sm text-center transition-all cursor-pointer ${tipoDeduccion === 'reales'
                            ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="font-bold">📄 Deducciones reales</p>
                        <p className="text-xs mt-1 opacity-70">Predial, mantenimiento, seguros, etc.</p>
                    </button>
                </div>

                {tipoDeduccion === 'reales' && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Total deducciones mensuales ($)</label>
                        <input type="number" value={deduccionesReales} onChange={e => setDeduccionesReales(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Incluye: predial, mantenimiento, seguros, intereses hipoteca, depreciación 5% anual, comisiones inmobiliaria</p>
                    </div>
                )}

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Qué puedo deducir como arrendador? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <h5 className="text-emerald-400 font-bold mb-1">✅ Deducción ciega (35%)</h5>
                                <p className="text-white/60"><strong>Art. 115 LISR</strong>: Sin comprobantes. Se puede deducir 35% de los ingresos más el predial pagado. Recomendada cuando tus gastos son menores al 35%.</p>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <h5 className="text-blue-400 font-bold mb-1">📄 Deducciones autorizadas (Art. 115 LISR)</h5>
                                <ul className="text-white/60 space-y-0.5 list-disc pl-4">
                                    <li>Predial y derechos de agua</li>
                                    <li>Mantenimiento y reparaciones</li>
                                    <li>Seguros del inmueble</li>
                                    <li>Intereses reales de hipoteca</li>
                                    <li>Depreciación (5% anual del inmueble)</li>
                                    <li>Comisiones inmobiliaria</li>
                                    <li>Salarios de conserje/vigilante</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Tu ISR por arrendamiento</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-xs text-[var(--color-text-muted)] mb-1">Renta cobrada</p>
                                <p className="text-lg font-bold text-white font-mono">${fmtMXN(resultado.renta)}</p>
                            </div>
                            <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 mb-1">Deducción ({tipoDeduccion === 'ciega' ? '35%' : 'reales'})</p>
                                <p className="text-lg font-bold text-emerald-400 font-mono">-${fmtMXN(resultado.deduccion)}</p>
                            </div>
                            <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">ISR mensual</p>
                                <p className="text-lg font-bold text-red-400 font-mono">${fmtMXN(resultado.isrMensual)}</p>
                                <p className="text-[10px] text-red-400/60">{resultado.tasaEfectiva.toFixed(1)}% efectiva</p>
                            </div>
                            <div className="bg-[var(--color-accent)]/10 rounded-xl p-4 text-center border border-[var(--color-accent)]/30">
                                <p className="text-xs text-[var(--color-accent)] mb-1">Neto que recibes</p>
                                <p className="text-2xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.rentaNeta)}</p>
                            </div>
                        </div>

                        {/* Comparativa ciega vs reales */}
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <h4 className="text-white font-bold text-sm mb-3">📊 Comparativa: Ciega vs Reales</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-3 rounded-lg text-center ${resultado.isrConCiega <= resultado.isrConReales ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                                    <p className="text-xs text-[var(--color-text-muted)]">ISR con ciega 35%</p>
                                    <p className="text-white font-mono font-bold text-lg">${fmtMXN(resultado.isrConCiega)}</p>
                                    {resultado.isrConCiega <= resultado.isrConReales && <p className="text-emerald-400 text-[10px] font-bold">✅ MEJOR</p>}
                                </div>
                                <div className={`p-3 rounded-lg text-center ${resultado.isrConReales < resultado.isrConCiega ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                                    <p className="text-xs text-[var(--color-text-muted)]">ISR con reales</p>
                                    <p className="text-white font-mono font-bold text-lg">${fmtMXN(resultado.isrConReales)}</p>
                                    {resultado.isrConReales < resultado.isrConCiega && <p className="text-emerald-400 text-[10px] font-bold">✅ MEJOR</p>}
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--color-text-muted)] mt-2 text-center">
                                Diferencia: ${fmtMXN(Math.abs(resultado.ahorro))}/mes · ${fmtMXN(Math.abs(resultado.ahorro) * 12)}/año
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-3">📋 Detalle del cálculo</h3>
                        <div className="space-y-2 text-sm">
                            {[
                                { label: 'Ingreso mensual', valor: resultado.renta },
                                { label: `(−) Deducción ${tipoDeduccion === 'ciega' ? 'ciega 35%' : 'real'}`, valor: -resultado.deduccion },
                                { label: '(=) Base gravable', valor: resultado.baseGravable },
                                { label: '(−) ISR Art. 96 LISR', valor: -resultado.isrMensual },
                                { label: '(=) NETO mensual', valor: resultado.rentaNeta },
                            ].map((r, i) => (
                                <div key={i} className={`flex justify-between p-3 rounded-lg ${i === 4 ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20' : 'bg-white/5'}`}>
                                    <span className={`${i === 4 ? 'text-[var(--color-accent)] font-bold' : 'text-white/60'}`}>{r.label}</span>
                                    <span className={`font-mono ${i === 4 ? 'text-[var(--color-accent)] font-bold' : 'text-white'}`}>${fmtMXN(r.valor)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Cómo pago ISR si rento un inmueble?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Si eres arrendador (rentas un departamento, casa o local), debes pagar <strong>ISR por arrendamiento</strong> (Arts. 114-118 LISR).
                    Puedes elegir entre la <strong className="text-emerald-400">deducción ciega del 35%</strong> (sin comprobantes) o
                    <strong>deducciones autorizadas</strong> (predial, mantenimiento, seguros). El pago provisional se presenta a más tardar
                    el día 17 del mes siguiente.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Contrato de Arrendamiento', href: '/plantillas/inmobiliario', desc: 'Plantilla lista para firmar' },
                        { title: 'Calculadora ISR Finiquito', href: '/calculadora/isr-liquidacion', desc: 'ISR de tu liquidación laboral' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Multas y montos en UMAs' },
                        { title: 'Calculadora Intereses Moratorios', href: '/calculadora/intereses-moratorios', desc: 'Intereses por renta impaga' },
                    ].map(t => (
                        <Link key={t.href + t.title} href={t.href}
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
                * Arts. 114-118 LISR. Deducción ciega 35% (Art. 115). Tabla ISR Art. 96 LISR. No sustituye asesoría fiscal.
            </p>
        </main>
    )
}
