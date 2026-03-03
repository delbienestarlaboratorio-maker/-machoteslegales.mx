'use client'
import { useState, useMemo } from 'react'
import { ANIO_ACTUAL, getUMA, fmtMXN, getSMG } from '@/data/legal-constants'

export default function CalculadoraPensionLey73() {
    const [semanasCotizadas, setSemanasCotizadas] = useState('1500')
    const [salarioPromedio, setSalarioPromedio] = useState('1500')
    const [edadRetiro, setEdadRetiro] = useState('60')
    const [esposa, setEsposa] = useState(true)
    const [hijos, setHijos] = useState('0')
    const anioCalculo = ANIO_ACTUAL
    const uma = getUMA(anioCalculo)
    const smg = getSMG(anioCalculo)

    const resultado = useMemo(() => {
        const semanas = parseInt(semanasCotizadas) || 0
        const salario = parseFloat(salarioPromedio) || 0
        const edad = parseFloat(edadRetiro) || 60
        const numHijos = parseInt(hijos) || 0
        if (semanas < 500) return null // Ley 73: min 500 semanas

        // Grupo de salario en función de las UMAs/SMG (simplificado a tablas de LSS Art 167 relativas al DF)
        // Actualmente el cálculo se hace en UMAs.
        const vecesUMA = salario / uma.diaria

        // Porcentajes Art. 167 LSS (aproximación para > 6 UMAs, que es donde caen la mayoría de cálculos Mod 40/Altos)
        let pctCuantiaBasica = 0.13
        let pctIncrementoAnual = 0.0245

        if (vecesUMA <= 1) { pctCuantiaBasica = 0.80; pctIncrementoAnual = 0.00563; }
        else if (vecesUMA <= 1.25) { pctCuantiaBasica = 0.7711; pctIncrementoAnual = 0.00814; }
        else if (vecesUMA <= 1.5) { pctCuantiaBasica = 0.5818; pctIncrementoAnual = 0.01178; }
        else if (vecesUMA <= 1.75) { pctCuantiaBasica = 0.4923; pctIncrementoAnual = 0.01430; }
        else if (vecesUMA <= 2.0) { pctCuantiaBasica = 0.4267; pctIncrementoAnual = 0.01615; }
        else if (vecesUMA <= 2.25) { pctCuantiaBasica = 0.3765; pctIncrementoAnual = 0.01756; }
        else if (vecesUMA <= 2.5) { pctCuantiaBasica = 0.3368; pctIncrementoAnual = 0.01868; }
        else if (vecesUMA <= 2.75) { pctCuantiaBasica = 0.3048; pctIncrementoAnual = 0.01958; }
        else if (vecesUMA <= 3.0) { pctCuantiaBasica = 0.2783; pctIncrementoAnual = 0.02033; }
        else if (vecesUMA <= 3.25) { pctCuantiaBasica = 0.2558; pctIncrementoAnual = 0.02096; }
        // ... (tabla real interpolada) por simplificación para topes altos (>6.01):
        else if (vecesUMA >= 6) { pctCuantiaBasica = 0.13; pctIncrementoAnual = 0.0245; }
        else { pctCuantiaBasica = 0.16; pctIncrementoAnual = 0.023; } // Rango medio estimado

        // 1. Cuantía Básica Anual
        const cuantiaBasicaDiaria = salario * pctCuantiaBasica
        const cuantiaBasicaAnual = cuantiaBasicaDiaria * 365

        // 2. Incrementos Anuales
        // Por cada 52 semanas arriba de 500
        const semanasExcedentes = Math.max(0, semanas - 500)
        const anosExcedentes = semanasExcedentes / 52
        const cuantiaIncrementosDiaria = salario * pctIncrementoAnual
        const incrementosAnualesTotales = cuantiaIncrementosDiaria * 365 * anosExcedentes

        // 3. Cuantía Total Anual
        let cuantiaTotal = cuantiaBasicaAnual + incrementosAnualesTotales

        // 4. Asignaciones Familiares
        let pctAsignaciones = 0
        if (esposa) pctAsignaciones += 0.15
        pctAsignaciones += (numHijos * 0.10)
        if (pctAsignaciones === 0) pctAsignaciones = 0.15 // Ayuda asistencial mínima por soledad

        const asignacionesFix = cuantiaTotal * pctAsignaciones
        cuantiaTotal += asignacionesFix

        // 5. Factor Fox (Decreto 2004, aumento 11%)
        cuantiaTotal = cuantiaTotal * 1.11

        // 6. Porcentaje por Edad de Retiro (Art. 171)
        let pctEdad = 1
        if (edad === 60) pctEdad = 0.75
        else if (edad === 61) pctEdad = 0.80
        else if (edad === 62) pctEdad = 0.85
        else if (edad === 63) pctEdad = 0.90
        else if (edad === 64) pctEdad = 0.95
        else if (edad >= 65) pctEdad = 1.00
        else pctEdad = 0.75

        cuantiaTotal = cuantiaTotal * pctEdad

        // Pensión Mensual
        let pensionMensual = cuantiaTotal / 12

        // Garantizada Mínima (1 SMG mensual, Ley 73)
        const pensionGarantizada = smg.general * 30.4
        if (pensionMensual < pensionGarantizada) {
            pensionMensual = pensionGarantizada
        }

        return {
            semanas, salario, edad, vecesUMA, pctCuantiaBasica, pctIncrementoAnual,
            cuantiaBasicaAnual, incrementosAnualesTotales, asignacionesFix,
            pctEdad, pensionMensual, pensionGarantizada,
            topadaMínimo: pensionMensual === pensionGarantizada
        }
    }, [semanasCotizadas, salarioPromedio, edadRetiro, esposa, hijos])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>👴</span><span>Pensión Ley 73 · Regímenes de Transición IMSS</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Pensión IMSS Ley 73</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si te registraste en el IMSS <strong className="text-white">antes del 1° de julio de 1997</strong>, tienes derecho al Régimen 73.
                    Esta pensión toma en cuenta el <strong className="text-[var(--color-accent)]">promedio salarial de tus últimas 250 semanas</strong> y tus semanas totales.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Total de semanas cotizadas</label>
                        <input type="number" value={semanasCotizadas} onChange={e => setSemanasCotizadas(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Mínimo legal: 500 semanas</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario base promedio (últimas 250 semanas) $/día</label>
                        <input type="number" value={salarioPromedio} onChange={e => setSalarioPromedio(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Suma del SDI de los últimos 5 años / 1825 días</p>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Edad al momento de tramitar (Cesantía/Vejez)</label>
                        <select value={edadRetiro} onChange={e => setEdadRetiro(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="60">60 años (75%)</option>
                            <option value="61">61 años (80%)</option>
                            <option value="62">62 años (85%)</option>
                            <option value="63">63 años (90%)</option>
                            <option value="64">64 años (95%)</option>
                            <option value="65">65+ años (100%)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5 items-center">
                            <input type="checkbox" checked={esposa} onChange={e => setEsposa(e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs font-bold text-white">Esposa(o) (+15%)</span>
                        </label>
                        <div>
                            <label className="block text-[10px] text-[var(--color-text-muted)] mb-1">Hijos menores 16a (+10% c/u)</label>
                            <input type="number" min="0" value={hijos} onChange={e => setHijos(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {parseInt(semanasCotizadas) < 500 && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center font-bold text-sm">
                    ❌  No cumples con las 500 semanas mínimas para pensionarte bajo la Ley 73.
                </div>
            )}

            {resultado && parseInt(semanasCotizadas) >= 500 && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-xl mb-4 text-center">🏦 Pensión Estimada Mensual</h2>
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-center px-12">
                            <p className="text-[var(--color-accent)] text-4xl font-mono font-bold">${fmtMXN(resultado.pensionMensual)}</p>
                            <p className="text-white/50 text-xs mt-1">MNX / Mes</p>
                            {resultado.topadaMínimo && (
                                <p className="text-[10px] text-orange-400 mt-2 border border-orange-500/30 rounded px-2 py-1">Topada al mínimo legal (1 SMG)</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 text-xs text-white/80">
                        <p className="font-bold border-b border-white/10 pb-1 mb-2">Desglose simplificado (Valores Anualizados)</p>
                        <div className="flex justify-between pb-1"><span>Veces UMA del salario prom.</span> <span className="font-mono">{resultado.vecesUMA.toFixed(2)} UMAs</span></div>
                        <div className="flex justify-between pb-1"><span>Cuantía Básica ({(resultado.pctCuantiaBasica * 100).toFixed(1)}% SDI)</span> <span className="font-mono">${fmtMXN(resultado.cuantiaBasicaAnual)}/año</span></div>
                        <div className="flex justify-between pb-1"><span>Incrementos (+500 semanas)</span> <span className="font-mono">${fmtMXN(resultado.incrementosAnualesTotales)}/año</span></div>
                        <div className="flex justify-between pb-1"><span>Asignaciones Familiares / Ayuda</span> <span className="font-mono">+ ${fmtMXN(resultado.asignacionesFix)}</span></div>
                        <div className="flex justify-between pb-1"><span>Decreto Fox (11%)</span> <span className="text-emerald-400 font-mono">Aumento Integrado</span></div>
                        <div className="flex justify-between p-2 mt-2 border-t border-white/10 bg-white/5 rounded-lg">
                            <span className="font-bold text-white">Castigo por pensión anticipada (Edad {resultado.edad})</span>
                            <span className="font-mono font-bold text-[var(--color-accent)]">x {(resultado.pctEdad * 100)}%</span>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-[10px] text-white/30 text-center mt-6">*Cálculo orientativo según tablas simplificadas del Art 167 LSS (1973). El cálculo oficial del IMSS puede variar por decimales de semanas, años bisiestos e INPC.</p>
        </main>
    )
}
