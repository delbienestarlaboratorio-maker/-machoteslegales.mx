'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tipos de sociedad con sus características
const TIPOS_SOCIEDAD = [
    {
        tipo: 'SA de CV',
        nombre: 'Sociedad Anónima de Capital Variable',
        capitalMinimo: 50000,
        sociosMin: 2,
        responsabilidad: 'Limitada al capital aportado',
        regimen: 'Régimen General',
        ventajas: ['Más conocida / credibilidad', 'Puede emitir acciones', 'Sin tope de socios'],
        desventajas: ['Más costosa de constituir', 'Requiere notario', 'Más obligaciones formales'],
    },
    {
        tipo: 'SAS',
        nombre: 'Sociedad por Acciones Simplificada',
        capitalMinimo: 1,
        sociosMin: 1,
        responsabilidad: 'Limitada al capital aportado',
        regimen: 'General o RESICO PM',
        ventajas: ['Constitución online gratuita', 'Capital mínimo $1', 'Puede ser unipersonal'],
        desventajas: ['Ingresos anuales máx. $5M', 'Menor reputación comercial', 'Restricciones legales'],
    },
    {
        tipo: 'SC',
        nombre: 'Sociedad Civil',
        capitalMinimo: 0,
        sociosMin: 2,
        responsabilidad: 'Solidaria entre socios',
        regimen: 'Régimen de Actividades Profesionales',
        ventajas: ['Ideal para despachos y profesionistas', 'Sin capital mínimo', 'Flexible'],
        desventajas: ['No puede hacer actos de comercio', 'Socios responden solidariamente', 'Limitada a servicios'],
    },
    {
        tipo: 'SAPI',
        nombre: 'Sociedad Anónima Promotora de Inversión',
        capitalMinimo: 50000,
        sociosMin: 2,
        responsabilidad: 'Limitada al capital aportado',
        regimen: 'Régimen General',
        ventajas: ['Ideal para startups con inversionistas', 'Acciones con derechos especiales', 'Acuerdos de socios permitidos'],
        desventajas: ['Más costosa de estructurar', 'Requiere asesoría legal especializada'],
    },
]

export default function CalculadoraConstitucionEmpresa() {
    const [tipoIdx, setTipoIdx] = useState(0)
    const [capitalSocial, setCapitalSocial] = useState('100000')
    const [numSocios, setNumSocios] = useState('2')
    const [estado, setEstado] = useState('cdmx')

    const tipo = TIPOS_SOCIEDAD[tipoIdx]

    // Aranceles notariales estimados por estado (parte variable)
    const arancelesEstado: Record<string, { honorarioBase: number; pctCapital: number; rpp: number }> = {
        cdmx: { honorarioBase: 8000, pctCapital: 0.004, rpp: 3500 },
        jalisco: { honorarioBase: 6000, pctCapital: 0.005, rpp: 2800 },
        nl: { honorarioBase: 7000, pctCapital: 0.0045, rpp: 3000 },
        edomex: { honorarioBase: 6500, pctCapital: 0.005, rpp: 2500 },
        otro: { honorarioBase: 5500, pctCapital: 0.004, rpp: 2000 },
    }

    const resultado = useMemo(() => {
        const capital = parseFloat(capitalSocial) || 0
        const socios = parseInt(numSocios) || 2
        if (capital < 0) return null

        const arancel = arancelesEstado[estado]
        const isSAS = tipo.tipo === 'SAS'

        // SAS es gratuita vía portal SE
        const honorariosNotario = isSAS ? 0 : arancel.honorarioBase + (capital * arancel.pctCapital)
        const ivaNotario = honorariosNotario * 0.16
        const rpp = isSAS ? 0 : arancel.rpp
        const tramiteSE = isSAS ? 0 : 2500  // inscripción SE
        const sat = 0   // alta en SAT gratuita
        const aperturaCuenta = 5000  // estimado apertura cuenta bancaria

        const totalSinCapital = honorariosNotario + ivaNotario + rpp + tramiteSE + aperturaCuenta
        const totalConCapital = totalSinCapital + Math.max(capital, tipo.capitalMinimo)

        return {
            capital: Math.max(capital, tipo.capitalMinimo),
            honorariosNotario, ivaNotario, rpp, tramiteSE, sat, aperturaCuenta,
            totalSinCapital, totalConCapital, isSAS
        }
    }, [capitalSocial, numSocios, estado, tipoIdx])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏗️</span><span>Constitución Empresa · LGSM / LSC</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Constitución de Empresa</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima el costo total de constituir tu empresa en México:
                    <strong className="text-[var(--color-accent)]"> notario + RPP + SAT + capital mínimo</strong>. Compara SA de CV, SAS y SC.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {TIPOS_SOCIEDAD.map((t, i) => (
                    <button key={t.tipo} onClick={() => setTipoIdx(i)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${tipoIdx === i ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                        <p className="text-sm font-bold">{t.tipo}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">${fmtMXN(t.capitalMinimo)} mín.</p>
                    </button>
                ))}
            </div>

            <div className="glass-card p-4 rounded-2xl mb-6 text-xs">
                <p className="text-white font-bold mb-1">{tipo.nombre}</p>
                <div className="grid grid-cols-3 gap-2 text-white/60">
                    <span>Socios mínimos: <strong className="text-white">{tipo.sociosMin}</strong></span>
                    <span>Capital mín.: <strong className="text-white">${fmtMXN(tipo.capitalMinimo)}</strong></span>
                    <span>Régimen: <strong className="text-white">{tipo.regimen}</strong></span>
                </div>
            </div>

            <div className="w-full min-h-[90px] my-4">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Capital social ($)</label>
                        <input type="number" value={capitalSocial} onChange={e => setCapitalSocial(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        {tipo.capitalMinimo > 0 && <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Mínimo legal: ${fmtMXN(tipo.capitalMinimo)}</p>}
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Estado / entidad</label>
                        <select value={estado} onChange={e => setEstado(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="cdmx">Ciudad de México</option>
                            <option value="jalisco">Jalisco</option>
                            <option value="nl">Nuevo León</option>
                            <option value="edomex">Estado de México</option>
                            <option value="otro">Otro estado</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de socios</label>
                        <input type="number" value={numSocios} onChange={e => setNumSocios(e.target.value)} min={tipo.sociosMin}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-6 space-y-4">
                    {resultado.isSAS && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold">
                            ✅ La SAS se constituye GRATIS a través del portal de la Secretaría de Economía (SE). Solo necesitas CURP y RFC.
                        </div>
                    )}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-white font-bold text-lg mb-4">💰 Estimado de gastos</h2>
                        <div className="space-y-2 text-sm">
                            {[
                                { l: 'Honorarios notariales', v: resultado.honorariosNotario },
                                { l: 'IVA 16% sobre honorarios', v: resultado.ivaNotario },
                                { l: 'Registro Público de Comercio (RPP)', v: resultado.rpp },
                                { l: 'Trámite SE / Permiso denominación', v: resultado.tramiteSE },
                                { l: 'Alta fiscal SAT (RFC)', v: resultado.sat },
                                { l: 'Apertura cuenta bancaria (estimado)', v: resultado.aperturaCuenta },
                                { l: 'Subtotal costos de apertura', v: resultado.totalSinCapital, accent: false, sub: true },
                                { l: `Capital social aportado (${tipo.tipo})`, v: resultado.capital },
                                { l: 'TOTAL DESEMBOLSO INICIAL', v: resultado.totalConCapital, accent: true },
                            ].map((r, i) => (
                                <div key={i} className={`flex justify-between p-3 rounded-lg ${r.accent ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30' : r.sub ? 'bg-white/10 border border-white/15' : 'bg-white/5'}`}>
                                    <span className={`text-xs ${r.accent ? 'text-[var(--color-accent)] font-bold' : r.sub ? 'text-white font-semibold' : 'text-white/60'}`}>{r.l}</span>
                                    <span className={`font-mono font-bold ${r.accent ? 'text-[var(--color-accent)] text-xl' : r.sub ? 'text-white' : 'text-white text-xs'}`}>${fmtMXN(r.v)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-4 rounded-2xl">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <p className="text-emerald-400 font-bold mb-2">✅ Ventajas {tipo.tipo}</p>
                                {tipo.ventajas.map((v, i) => <p key={i} className="text-white/60 mb-1">• {v}</p>)}
                            </div>
                            <div>
                                <p className="text-red-400 font-bold mb-2">⚠️ Consideraciones</p>
                                {tipo.desventajas.map((d, i) => <p key={i} className="text-white/60 mb-1">• {d}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full min-h-[90px] mt-6">
                <div className="w-full h-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center px-4 py-3">
                    <span className="text-white/15 text-xs font-mono">728×90 — Espacio publicitario</span>
                </div>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-6 text-center">
                * Costos estimados. Aranceles notariales varían por estado y valor del acto. SAS gratuita Art. 260 LGSM (vía portal SE). Capital social es recuperable.
            </p>
        </main>
    )
}
