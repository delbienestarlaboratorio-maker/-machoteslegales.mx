'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fmtMXN } from '@/data/legal-constants'

type RegimenMatrimonial = 'sociedad' | 'separacion' | 'noaplica'

interface Heredero {
    tipo: string
    nombre: string
    porcentaje: number
    monto: number
    fundamento: string
}

export default function CalculadoraHerencia() {
    const [valorBienes, setValorBienes] = useState('2000000')
    const [tieneConyugeSuperviviente, setTieneConyugeSuperviviente] = useState(true)
    const [regimen, setRegimen] = useState<RegimenMatrimonial>('sociedad')
    const [numHijos, setNumHijos] = useState('3')
    const [tienePadresVivos, setTienePadresVivos] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const resultado = useMemo(() => {
        const total = parseFloat(valorBienes) || 0
        if (total <= 0) return null

        const hijos = parseInt(numHijos) || 0
        let masaHereditaria = total

        // Si hay sociedad conyugal, primero se separa el 50% del cónyuge
        let porcionConyugalSociedad = 0
        if (tieneConyugeSuperviviente && regimen === 'sociedad') {
            porcionConyugalSociedad = total * 0.50
            masaHereditaria = total * 0.50 // Solo la mitad del difunto se reparte
        }

        const herederos: Heredero[] = []

        if (porcionConyugalSociedad > 0) {
            herederos.push({
                tipo: '💍', nombre: 'Cónyuge (sociedad conyugal — su 50%)',
                porcentaje: 50, monto: porcionConyugalSociedad,
                fundamento: 'Art. 183 CCF — Bienes de la sociedad conyugal',
            })
        }

        if (hijos > 0) {
            // Art. 1607 CCF: Hijos y cónyuge heredan en partes iguales
            const totalPartes = hijos + (tieneConyugeSuperviviente ? 1 : 0)
            const montoPorParte = masaHereditaria / totalPartes

            if (tieneConyugeSuperviviente) {
                const pctConyuge = (1 / totalPartes) * (masaHereditaria / total) * 100
                herederos.push({
                    tipo: '💍', nombre: 'Cónyuge (parte hereditaria)',
                    porcentaje: parseFloat(pctConyuge.toFixed(2)),
                    monto: montoPorParte,
                    fundamento: 'Art. 1624 CCF — Cónyuge hereda como un hijo más',
                })
            }

            for (let i = 0; i < hijos; i++) {
                const pctHijo = (1 / totalPartes) * (masaHereditaria / total) * 100
                herederos.push({
                    tipo: '👶', nombre: `Hijo ${i + 1}`,
                    porcentaje: parseFloat(pctHijo.toFixed(2)),
                    monto: montoPorParte,
                    fundamento: 'Art. 1607 CCF — Hijos heredan en partes iguales',
                })
            }
        } else if (tieneConyugeSuperviviente && !tienePadresVivos) {
            // Sin hijos, sin padres: cónyuge hereda todo
            herederos.push({
                tipo: '💍', nombre: 'Cónyuge (hereda toda la masa)',
                porcentaje: (masaHereditaria / total) * 100,
                monto: masaHereditaria,
                fundamento: 'Art. 1627 CCF — A falta de descendientes y ascendientes',
            })
        } else if (tieneConyugeSuperviviente && tienePadresVivos) {
            // Sin hijos, padres vivos: cónyuge 50%, padres 50%
            herederos.push({
                tipo: '💍', nombre: 'Cónyuge',
                porcentaje: (masaHereditaria * 0.5 / total) * 100,
                monto: masaHereditaria * 0.5,
                fundamento: 'Art. 1626 CCF — Concurrencia con ascendientes',
            })
            herederos.push({
                tipo: '👴', nombre: 'Padres (ascendientes)',
                porcentaje: (masaHereditaria * 0.5 / total) * 100,
                monto: masaHereditaria * 0.5,
                fundamento: 'Art. 1615 CCF — Ascendientes heredan a falta de descendientes',
            })
        } else if (!tieneConyugeSuperviviente && tienePadresVivos) {
            // Sin cónyuge, sin hijos, padres vivos
            herederos.push({
                tipo: '👴', nombre: 'Padres (ascendientes)',
                porcentaje: 100, monto: masaHereditaria,
                fundamento: 'Art. 1615 CCF — Ascendientes heredan todo a falta de descendientes',
            })
        } else {
            // Sin cónyuge, sin hijos, sin padres
            herederos.push({
                tipo: '👫', nombre: 'Hermanos/colaterales o Beneficencia',
                porcentaje: 100, monto: masaHereditaria,
                fundamento: 'Arts. 1630-1637 CCF — Colaterales hasta 4° grado, o Beneficencia Pública',
            })
        }

        return { herederos, masaHereditaria, total, porcionConyugalSociedad }
    }, [valorBienes, tieneConyugeSuperviviente, regimen, numHijos, tienePadresVivos])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Calculadora Herencia · Arts. 1599-1637 CCF</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Herencia Legítima</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando no hay testamento, la ley determina cómo se reparten los bienes (<strong className="text-white">sucesión intestamentaria</strong>).
                    Calcula cuánto le corresponde a cada heredero según el Código Civil Federal.
                </p>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-2 px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-5">
                <h2 className="text-white font-bold text-lg">📋 Datos de la sucesión</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor total de los bienes ($)</label>
                        <input type="number" value={valorBienes} onChange={e => setValorBienes(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de hijos</label>
                        <input type="number" value={numHijos} onChange={e => setNumHijos(e.target.value)} min="0"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={tieneConyugeSuperviviente} onChange={e => setTieneConyugeSuperviviente(e.target.checked)}
                            className="w-4 h-4 rounded border border-white/20" />
                        <span className="text-sm text-white/80">¿Hay cónyuge sobreviviente?</span>
                    </label>

                    {tieneConyugeSuperviviente && (
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Régimen matrimonial</label>
                            <select value={regimen} onChange={e => setRegimen(e.target.value as RegimenMatrimonial)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors">
                                <option value="sociedad">Sociedad conyugal (50% es del cónyuge)</option>
                                <option value="separacion">Separación de bienes</option>
                            </select>
                        </div>
                    )}

                    {parseInt(numHijos) === 0 && (
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={tienePadresVivos} onChange={e => setTienePadresVivos(e.target.checked)}
                                className="w-4 h-4 rounded border border-white/20" />
                            <span className="text-sm text-white/80">¿Hay padres (ascendientes) vivos?</span>
                        </label>
                    )}
                </div>

                <button type="button" onClick={() => setShowInfo(!showInfo)}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition-colors flex items-center gap-1 cursor-pointer">
                    💡 ¿Cómo se reparte una herencia sin testamento? <span className={`transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-3">
                        <h4 className="text-white font-bold text-sm">📖 Orden de sucesión legítima (CCF)</h4>
                        <div className="space-y-2">
                            {[
                                { orden: '1°', quien: 'Hijos (descendientes)', art: 'Art. 1607-1614', nota: 'Heredan en partes iguales. Si hay cónyuge, hereda como un hijo más.' },
                                { orden: '2°', quien: 'Padres (ascendientes)', art: 'Art. 1615-1623', nota: 'A falta de descendientes. Si concurren con cónyuge, se reparte por mitad.' },
                                { orden: '3°', quien: 'Cónyuge', art: 'Art. 1624-1629', nota: 'A falta de descendientes y ascendientes, hereda todo.' },
                                { orden: '4°', quien: 'Hermanos y colaterales', art: 'Art. 1630-1637', nota: 'Hasta el 4° grado. A falta de todos los anteriores.' },
                                { orden: '5°', quien: 'Beneficencia Pública', art: 'Art. 1636', nota: 'Si no hay herederos de ningún grado.' },
                            ].map(o => (
                                <div key={o.orden} className="flex gap-3 p-2 rounded-lg bg-white/5">
                                    <span className="text-[var(--color-accent)] font-bold text-sm w-8">{o.orden}</span>
                                    <div>
                                        <p className="text-white font-bold text-xs">{o.quien} <span className="text-blue-400 font-normal">({o.art})</span></p>
                                        <p className="text-white/60 text-[10px]">{o.nota}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-white/60 border-t border-white/10 pt-2">
                            <strong className="text-orange-400">Importante:</strong> En sociedad conyugal, primero se separa el 50% que le pertenece al cónyuge (Art. 183 CCF). Solo el otro 50% se reparte como herencia.
                        </p>
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">📊 Distribución de la herencia</h2>

                        {resultado.porcionConyugalSociedad > 0 && (
                            <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs">
                                <p className="text-purple-400 font-bold">💍 Sociedad conyugal</p>
                                <p className="text-white/60 mt-1">
                                    Del total de ${fmtMXN(resultado.total)}, el 50% (${fmtMXN(resultado.porcionConyugalSociedad)}) le pertenece al cónyuge por sociedad conyugal.
                                    Solo ${fmtMXN(resultado.masaHereditaria)} se reparte como herencia.
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {resultado.herederos.map((h, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors border border-white/5">
                                    <span className="text-2xl">{h.tipo}</span>
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-sm">{h.nombre}</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)]">{h.fundamento}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[var(--color-accent)] font-mono font-bold text-lg">${fmtMXN(h.monto)}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{h.porcentaje.toFixed(1)}% del total</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Barra visual */}
                        <div className="mt-4 h-6 rounded-full overflow-hidden bg-white/5 flex">
                            {resultado.herederos.map((h, i) => {
                                const colors = ['bg-purple-500', 'bg-[var(--color-accent)]', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-red-500']
                                return (
                                    <div key={i} className={`${colors[i % colors.length]} h-full transition-all`}
                                        style={{ width: `${(h.monto / resultado.total) * 100}%` }}
                                        title={`${h.nombre}: ${h.porcentaje.toFixed(1)}%`} />
                                )
                            })}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {resultado.herederos.map((h, i) => {
                                const colors = ['text-purple-400', 'text-[var(--color-accent)]', 'text-blue-400', 'text-emerald-400', 'text-orange-400', 'text-red-400']
                                return <span key={i} className={`text-[10px] ${colors[i % colors.length]}`}>● {h.nombre}</span>
                            })}
                        </div>
                    </div>
                </div>
            )}

            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">¿Qué es la herencia legítima en México?</h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    La <strong>sucesión legítima</strong> (o herencia intestamentaria) es el proceso legal que determina cómo se
                    reparten los bienes de una persona que falleció <strong>sin dejar testamento</strong>. Los Arts. 1599-1637 del
                    Código Civil Federal establecen un orden de prelación: primero descendientes, luego ascendientes, después cónyuge
                    y finalmente colaterales. Si el matrimonio era en sociedad conyugal, el 50% de los bienes se separa primero.
                </p>
            </section>

            <section className="mt-10 glass-card p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">📚 Plantillas Relacionadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { title: 'Testamento Público', href: '/plantillas/familiar', desc: 'Evita la sucesión intestamentaria' },
                        { title: 'Calculadora Pensión Alimenticia', href: '/calculadora/pension-alimenticia', desc: 'Obligación de alimentos' },
                        { title: 'Calculadora de Liquidación', href: '/calculadora-laboral', desc: 'Derechos laborales' },
                        { title: 'Convertidor UMA a Pesos', href: '/calculadora/uma-a-pesos', desc: 'Para gastos notariales' },
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
                * Arts. 1599-1637 Código Civil Federal. El reparto puede variar según el código civil estatal. No sustituye asesoría notarial.
            </p>
        </main>
    )
}
