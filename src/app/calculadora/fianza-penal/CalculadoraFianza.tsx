'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ANIO_ACTUAL, getUMA, fmtMXN, getAniosDisponibles } from '@/data/legal-constants'

const RANGOS_FIANZA = [
    { delito: 'Robo simple', umasMin: 50, umasMax: 200, articulo: 'Art. 371 CPF' },
    { delito: 'Robo con violencia', umasMin: 200, umasMax: 750, articulo: 'Art. 372 CPF' },
    { delito: 'Fraude menor', umasMin: 100, umasMax: 500, articulo: 'Art. 386 CPF' },
    { delito: 'Fraude mayor', umasMin: 500, umasMax: 2000, articulo: 'Art. 386 CPF' },
    { delito: 'Lesiones leves', umasMin: 30, umasMax: 100, articulo: 'Art. 289 CPF' },
    { delito: 'Lesiones graves', umasMin: 100, umasMax: 500, articulo: 'Art. 290-292 CPF' },
    { delito: 'Amenazas', umasMin: 20, umasMax: 80, articulo: 'Art. 282 CPF' },
    { delito: 'Daño en propiedad ajena', umasMin: 30, umasMax: 150, articulo: 'Art. 399 CPF' },
    { delito: 'Abuso de confianza', umasMin: 100, umasMax: 500, articulo: 'Art. 382 CPF' },
    { delito: 'Despojo', umasMin: 50, umasMax: 300, articulo: 'Art. 395 CPF' },
    { delito: 'Delito fiscal (defraudación)', umasMin: 500, umasMax: 5000, articulo: 'Art. 108 CFF' },
    { delito: 'Contrabando', umasMin: 300, umasMax: 3000, articulo: 'Art. 102 CFF' },
]

export default function CalculadoraFianza() {
    const [umasCustom, setUmasCustom] = useState('200')
    const [anioCalculo, setAnioCalculo] = useState(String(ANIO_ACTUAL))
    const [showInfo, setShowInfo] = useState(false)

    const uma = getUMA(parseInt(anioCalculo))

    const resultado = useMemo(() => {
        const n = parseFloat(umasCustom) || 0
        return {
            umas: n,
            total: n * uma.diaria,
        }
    }, [umasCustom, anioCalculo])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Calculadora Fianza Penal · Art. 166 CNPP</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Fianza Penal</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula el monto de una <strong className="text-white">garantía económica</strong> (fianza) en pesos mexicanos.
                    Es una medida cautelar para garantizar la libertad del imputado mientras dura el proceso.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Calcular fianza</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Cantidad de UMAs diarias</label>
                        <input type="number" value={umasCustom} onChange={e => setUmasCustom(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">📅 Año</label>
                        <select value={anioCalculo} onChange={e => setAnioCalculo(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                            {getAniosDisponibles().map(a => (
                                <option key={a} value={a}>{a} — UMA ${fmtMXN(getUMA(a).diaria)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {resultado && (
                    <div className="bg-[var(--color-accent)]/10 rounded-xl p-6 text-center border border-[var(--color-accent)]/30 mt-4">
                        <p className="text-sm text-[var(--color-accent)] mb-1">{resultado.umas} × UMA diaria (${fmtMXN(uma.diaria)})</p>
                        <p className="text-3xl font-bold text-[var(--color-accent)] font-mono">${fmtMXN(resultado.total)}</p>
                        <p className="text-xs text-[var(--color-accent)]/60 mt-1">Monto de la garantía económica ({uma.anio})</p>
                    </div>
                )}

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo funciona la fianza penal en México? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <p className="text-white/80">
                            La <strong className="text-blue-400">garantía económica</strong> (Art. 166 CNPP) es una medida cautelar que permite al imputado
                            seguir el proceso en libertad. El juez la fija considerando:
                        </p>
                        <ul className="text-white/60 space-y-1 list-disc pl-4">
                            <li>Gravedad del delito y la pena esperada</li>
                            <li>Capacidad económica del imputado</li>
                            <li>Arraigo (domicilio, trabajo, familia)</li>
                            <li>Antecedentes penales</li>
                            <li>Que el delito NO sea de prisión preventiva oficiosa (Art. 19 CPEUM)</li>
                        </ul>
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 font-bold">🚫 Delitos SIN fianza (prisión preventiva oficiosa)</p>
                            <p className="text-white/60 mt-1">Homicidio doloso, secuestro, violación, trata de personas, delincuencia organizada, delitos fiscales con montos elevados, portación de armas exclusivas del Ejército, entre otros (Art. 19 CPEUM).</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla de rangos por delito */}
            <div className="mt-8 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-3">📋 Rangos de fianza por delito (referencia)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-2 text-[var(--color-text-muted)]">Delito</th>
                                <th className="text-center py-2 text-[var(--color-text-muted)]">UMAs</th>
                                <th className="text-right py-2 text-[var(--color-accent)]">Rango en $ ({uma.anio})</th>
                                <th className="text-right py-2 text-[var(--color-text-muted)]">Art.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RANGOS_FIANZA.map((r, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => setUmasCustom(String(Math.round((r.umasMin + r.umasMax) / 2)))}>
                                    <td className="py-2 text-white">{r.delito}</td>
                                    <td className="text-center py-2 text-white/60 font-mono">{r.umasMin}-{r.umasMax}</td>
                                    <td className="text-right py-2 text-[var(--color-accent)] font-mono">
                                        ${fmtMXN(r.umasMin * uma.diaria)} — ${fmtMXN(r.umasMax * uma.diaria)}
                                    </td>
                                    <td className="text-right py-2 text-[var(--color-text-muted)]">{r.articulo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-2">
                    * Haz clic en un delito para calcular su fianza promedio. El monto final depende del juez.
                </p>
            </div>

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es la fianza penal en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La fianza penal (garantía económica) es una <strong>medida cautelar personal</strong> establecida en el
                    <strong> Art. 166 del Código Nacional de Procedimientos Penales (CNPP)</strong>. Permite al imputado
                    enfrentar su proceso en libertad depositando una suma de dinero. No aplica para delitos de
                    <strong> prisión preventiva oficiosa</strong> (Art. 19 CPEUM).
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Multas y montos en UMAs' },
                        { title: 'Plantillas Penales', href: '/plantillas/penal', desc: 'Denuncias y querellas' },
                        { title: 'Calculadora Intereses Moratorios', href: '/calculadora/intereses-moratorios', desc: 'Para juicios de cobro' },
                        { title: 'Plantillas de Amparo', href: '/plantillas/amparo', desc: 'Protección de derechos' },
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
                * Art. 166 CNPP. UMA {uma.anio}: ${fmtMXN(uma.diaria)}. Los rangos son referenciales; el monto exacto lo fija el juez. No aplica a delitos con prisión preventiva oficiosa.
            </p>
        </main>
    )
}
