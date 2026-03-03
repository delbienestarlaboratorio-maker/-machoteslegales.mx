'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getSMG, getUMA } from '@/data/legal-constants'

export default function CalculadoraReparacionDanoPenal() {
    // Parámetros
    const [danoMaterialFisico, setDanoMaterialFisico] = useState('150000') // Cosas destruidas o robadas, gastos funerarios
    const [gastosMedicosFuturos, setGastosMedicosFuturos] = useState('50000') // Hospitalización, de rehabilitación, psicológicos
    const [lucroCesante, setLucroCesante] = useState('0') // Lo que dejará de ganar mientras está incapacitado (sueldo no pagado)
    const [gravedadDelito, setGravedadDelito] = useState<'leve' | 'medio' | 'grave' | 'homicidio'>('grave')
    const [ingresoVictima, setIngresoVictima] = useState('15000') // Útil para daños morales punitivos o lucro cesante subsidiario

    const resultado = useMemo(() => {
        const dmgMaterial = parseFloat(danoMaterialFisico) || 0
        const dmgMedico = parseFloat(gastosMedicosFuturos) || 0
        const lucro = parseFloat(lucroCesante) || 0
        const ingreso = parseFloat(ingresoVictima) || getSMG(2026).general * 30

        const totalEconomicoPuro = dmgMaterial + dmgMedico + lucro

        // Daño Moral Punitivo (Dolor, Afectación a proyecto de vida, etc)
        // La SCJN ha establecido que para una verdadera reparación integral, el daño moral no tiene un tope matemático en la ley.
        // Se califica según la gravedad, situación de la víctima y capacidad económica del victimario.
        // Haremos una estimación prudencial (basada en meses de ingreso * multiplicador de crueldad)

        let multiplicadorMoral = 0
        let descripcionMoral = ''
        let factorVidaLaboral = 1 // En homicidios se usa la tabla de LFT 5002 días
        let indemnizacionMuerte = 0

        if (gravedadDelito === 'leve') {
            // Daños culposos básicos (Choques sin lesionados, robos menores)
            multiplicadorMoral = 1 // 1 mes de sueldo a manera compensatoria
            descripcionMoral = 'Compensatoria básica (Susto, pérdida de tiempo)'
        } else if (gravedadDelito === 'medio') {
            // Lesiones menores, abusos, fraudes medianos
            multiplicadorMoral = 6 // 6 meses
            descripcionMoral = 'Afectación mediana al círculo social y psique'
        } else if (gravedadDelito === 'grave') {
            // Secuestros, violaciones, lesiones permanentes (músculo-esqueléticas)
            multiplicadorMoral = 24 // 2 años
            descripcionMoral = 'Daño Psicoemocional Severo, proyecto de vida mutilado'
        } else if (gravedadDelito === 'homicidio') {
            const smgActual = getSMG(2026).general
            factorVidaLaboral = 5000 // Art. 502 LFT aplicable por analogía supletorio para Homicidios Penales. Son 5000 días de salario general.
            indemnizacionMuerte = smgActual * factorVidaLaboral
            multiplicadorMoral = 36 // Plus indemnizatorio moral para los deudos de 3 años de ingresos
            descripcionMoral = 'Loss of Consortium (Pérdida de lazos afectivos directos por muerte) + Baremo LFT'
        }

        let danoMoralGenerado = (ingreso) * multiplicadorMoral

        if (gravedadDelito === 'homicidio') {
            // En homicidio sumamos la regla jurisprudencial del Baremo Federal (Art 500 LFT) a lo moral, porque es reparación objetiva directa.
            // Para simplificar, la etiquetaremos bajo el paraguas de indemnización base de vida.
            danoMoralGenerado = indemnizacionMuerte + ((ingreso) * 12) // Añadimos solo 1 año de sueldo por daño afectivo a este monto inmenso para no distorsionar de más.
            descripcionMoral = `Baremo LFT (5,000 días SMG = ${fmtMXN(indemnizacionMuerte)}) + Agravio Moral Punitivo (${fmtMXN(ingreso * 12)})`
        }

        const granTotal = totalEconomicoPuro + danoMoralGenerado

        return {
            dmgMaterial,
            dmgMedico,
            lucro,
            totalEconomicoPuro,
            danoMoralGenerado,
            descripcionMoral,
            granTotal
        }

    }, [danoMaterialFisico, gastosMedicosFuturos, lucroCesante, gravedadDelito, ingresoVictima])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>⚖️</span><span>Sentencias Condenatorias · CNPP</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Reparación del Daño Penal</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Cuando un Juez Penal dicta sentencia condenatoria, obligará al culpable a pagar la **Reparación Íntegra**, la cual suele ser requisitoria para otorgar sustitutivos de prisión o libertad anticipada.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            ⚖️ Daños Materiales / Cosas Robadas ($)
                        </label>
                        <input type="number" value={danoMaterialFisico} onChange={e => setDanoMaterialFisico(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">El valor del auto chocado, del celular robado, de los muros quemados, o gastos de funeral.</p>
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            🩺 Tratos Médicos y Psicológicos ($)
                        </label>
                        <input type="number" value={gastosMedicosFuturos} onChange={e => setGastosMedicosFuturos(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Hospital, prótesis, terapias psiquiátricas pasadas y estimadas futuras originadas en el delito.</p>
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            📉 Lucro Cesante (Dejó de Ganar) ($)
                        </label>
                        <input type="number" value={lucroCesante} onChange={e => setLucroCesante(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Ej: Si el agraviado era taxista y por las lesiones o robo estuvo sin vehículo 6 meses.</p>
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">
                            💵 Ingreso Mensual Bruto de la Víctima ($)
                        </label>
                        <input type="number" value={ingresoVictima} onChange={e => setIngresoVictima(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-lg focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[10px] text-white/40 mt-1">Usa su nómina (o Salario Mínimo si no labora). Obligatorio para parametrizar el componente Moral.</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <label className="block text-xs text-[var(--color-text-muted)] mb-3 font-semibold text-center">Clasificación Subjetiva del Daño (Mecanismo Punitivo e Inmaterial)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { val: 'leve', label: 'Culposo/Leve' },
                            { val: 'medio', label: 'Clasif. Media' },
                            { val: 'grave', label: 'Grave/Violento' },
                            { val: 'homicidio', label: 'Homicidio' }
                        ].map(opt => (
                            <div key={opt.val} onClick={() => setGravedadDelito(opt.val as any)}
                                className={`p-3 rounded-xl cursor-pointer border text-center transition-all ${gravedadDelito === opt.val ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                <span className={`block font-bold text-sm ${gravedadDelito === opt.val ? 'text-red-400' : 'text-white'}`}>{opt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4">

                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-amber-500/30">
                        <p className="text-sm font-bold text-white/50 mb-1">Monto Líquido de Reparación Condenatoria</p>
                        <p className="text-5xl md:text-6xl font-mono font-bold text-amber-500 my-2">${fmtMXN(resultado.granTotal)}</p>
                        <p className="text-xs text-amber-200/60 font-bold">Si el convicto se niega a pagar esta suma, puede NO gozar de beneficios preliminares en ejecución de su pena.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/10 flex flex-col justify-center">
                            <span className="text-xs font-bold text-white/50 block mb-2 uppercase">📊 Daños Objetivos (Sumatoria Física)</span>
                            <span className="text-2xl font-mono text-white block">${fmtMXN(resultado.totalEconomicoPuro)}</span>
                            <div className="mt-2 text-[10px] text-white/40 space-y-1">
                                <p>Material / Cosas: ${fmtMXN(resultado.dmgMaterial)}</p>
                                <p>Salud / Medicina: ${fmtMXN(resultado.dmgMedico)}</p>
                                <p>Cese Ganancias: ${fmtMXN(resultado.lucro)}</p>
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-5 rounded-xl border border-purple-500/20 flex flex-col justify-center">
                            <span className="text-xs font-bold text-purple-400 block mb-2 uppercase">🎭 Compensación del Daño Moral (Inmaterial)</span>
                            <span className="text-2xl font-mono text-purple-300 block">${fmtMXN(resultado.danoMoralGenerado)}</span>
                            <span className="text-[10px] text-purple-200/60 block mt-2 border-t border-purple-500/20 pt-2 break-words">
                                Valoración cualitativa Suprema Corte: {resultado.descripcionMoral}.
                            </span>
                        </div>
                    </div>

                </div>
            )}
        </main>
    )
}
