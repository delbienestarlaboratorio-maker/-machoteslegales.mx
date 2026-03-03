'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getSMG } from '@/data/legal-constants'

export default function CalculadoraIndemnizacionMuerteLaboral() {
    const [salarioDiario, setSalarioDiario] = useState('350')
    const [zonaFronteriza, setZonaFronteriza] = useState(false)
    const [tipoSiniestro, setTipoSiniestro] = useState<'muerte' | 'incapacidad_permanente_total' | 'incapacidad_permanente_parcial'>('muerte')
    const [porcentajeParcial, setPorcentajeParcial] = useState('30') // Tabla 514 LFT

    const resultado = useMemo(() => {
        const sdi = parseFloat(salarioDiario) || 0
        const smgData = getSMG()
        const minSMG = zonaFronteriza ? smgData.fronteraNorte : smgData.general

        // Regla LFT Art. 486: El salario base para calcular indemnizaciones de LFT NO podrá ser inferior al mínimo ni superior al doble del salario mínimo de la zona.
        const dobleSMG = minSMG * 2

        let salarioTopado = sdi
        if (sdi < minSMG) salarioTopado = minSMG
        if (sdi > dobleSMG) salarioTopado = dobleSMG

        let indemnizacionDestino = 0
        let gastosFunerarios = 0
        let desglose = ''

        if (tipoSiniestro === 'muerte') {
            // Art 500 y 502 LFT: 2 meses de salario (funerario) + 5,000 días de salario
            indemnizacionDestino = salarioTopado * 5000
            gastosFunerarios = salarioTopado * 60 // 2 meses = 60 dias
            desglose = '5,000 días de salario indemnizatorio (Art. 502 LFT)'
        }
        else if (tipoSiniestro === 'incapacidad_permanente_total') {
            // Art 495 LFT: 1095 días de salario
            indemnizacionDestino = salarioTopado * 1095
            desglose = '1,095 días de salario indemnizatorio (Art. 495 LFT)'
        }
        else if (tipoSiniestro === 'incapacidad_permanente_parcial') {
            // Art 492 LFT: El porcentaje fijado por la tabla del 514, calculado sobre la base de 1095 días (Incapacidad total).
            const pct = parseFloat(porcentajeParcial) || 0
            const topePct = pct > 100 ? 100 : pct
            const indemnizacionBaseTotal = salarioTopado * 1095
            indemnizacionDestino = indemnizacionBaseTotal * (topePct / 100)
            desglose = `Aplicación del ${topePct}% sobre 1,095 días de incapacidad total (Art. 492 LFT)`
        }

        return {
            salarioBase: sdi,
            salarioTopado,
            topeAplicado: sdi > dobleSMG ? 'Tope 2 veces SMG' : (sdi < minSMG ? 'Elevado a SMG Mínimo' : 'Salario Real no topado'),
            minSMG, dobleSMG,
            indemnizacionDestino,
            gastosFunerarios,
            total: indemnizacionDestino + gastosFunerarios,
            desglose
        }
    }, [salarioDiario, zonaFronteriza, tipoSiniestro, porcentajeParcial])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🚑</span><span>Derecho Laboral · Riesgos de Trabajo</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Riesgos de Trabajo (LFT)</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si sufres un accidente laboral o falleces desempeñando tu labor (sin IMSS que cubra integralmente), la Ley Federal del Trabajo dicta cuotas rígidas a cargo total del patrón usando la regla del tope salarial.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Salario Diario (SD o SDI) $</label>
                        <input type="number" value={salarioDiario} onChange={e => setSalarioDiario(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                        <label className="flex items-center mt-3 gap-2 cursor-pointer">
                            <input type="checkbox" checked={zonaFronteriza} onChange={e => setZonaFronteriza(e.target.checked)} className="w-4 h-4 text-[var(--color-accent)]" />
                            <span className="text-xs text-white/50">Trabajo en Zona Frontera Norte</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Consecuencia del Siniestro Laboral</label>
                        <select value={tipoSiniestro} onChange={e => setTipoSiniestro(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="muerte">Muerte del Trabajador</option>
                            <option value="incapacidad_permanente_total">Incapacidad Permanente Total (Pérdida al 100%)</option>
                            <option value="incapacidad_permanente_parcial">Incapacidad Parcial (Pérdida de dedos, visión unilateral, etc)</option>
                        </select>
                        {tipoSiniestro === 'incapacidad_permanente_parcial' && (
                            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <label className="block text-[10px] text-blue-300 mb-1 font-semibold uppercase">Tasa Tabla Art 514 LFT (%)</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={porcentajeParcial} onChange={e => setPorcentajeParcial(e.target.value)} className="w-20 p-1.5 bg-black/30 border border-blue-500/50 text-white text-sm text-center rounded focus:outline-none" />
                                    <span className="text-blue-200">% de pérdida de facultad.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-3xl mx-auto">
                    <div className="flex flex-col items-center mb-6 border-b border-white/10 pb-6">
                        <p className="text-sm text-white/50 font-bold mb-1">Monto Total Mandatado por Juez a cargo del Patrón</p>
                        <p className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.total)}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3 text-sm">
                            <h3 className="text-white font-bold opacity-80">Parámetros de Cálculo (Art 486 LFT)</h3>
                            <div className="flex justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-white/60">Salario Diario Ganado</span>
                                <span className="font-mono text-white/80">${fmtMXN(resultado.salarioBase)}</span>
                            </div>
                            <div className="flex justify-between p-2 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30">
                                <span className="text-[var(--color-accent)] font-bold">Salario Base Utilizado OBLIGATORIO</span>
                                <span className="font-mono text-[var(--color-accent)] font-bold">${fmtMXN(resultado.salarioTopado)}</span>
                            </div>
                            <p className="text-[10px] text-white/40 italic">Regla: El salario usado NO puede ser más grande que el doble del salario mínimo (${fmtMXN(resultado.dobleSMG)}), y no inferior al mínimo (${fmtMXN(resultado.minSMG)}). Estatus aplicad: {resultado.topeAplicado}.</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="text-white font-bold opacity-80">Desglose Indemnizatorio</h3>
                            <div className="flex justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <span className="text-red-400 font-bold">Indemnización Principal</span>
                                <span className="font-mono text-red-400 font-bold">${fmtMXN(resultado.indemnizacionDestino)}</span>
                            </div>
                            <p className="text-[10px] text-red-400/60 mt-0">{resultado.desglose}</p>

                            {resultado.gastosFunerarios > 0 && (
                                <div className="flex justify-between p-2 rounded-lg bg-gray-500/20 mt-2">
                                    <span className="text-gray-300 font-bold">Gastos Funerarios (2 Meses / 60 días)</span>
                                    <span className="font-mono text-gray-300 font-bold">${fmtMXN(resultado.gastosFunerarios)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <p className="text-[10px] text-white/30 text-center mt-6 max-w-xl mx-auto">
                ATENCIÓN: Si la empresa o patrón tenía al trabajador debidamente inscrito en el Seguro Social (IMSS) pagando cuotas, el patrón se LIBERA de pagar esta millonaria cifra, siendo el Instituto quien subroga y paga la pensión vitalicia correspondiente por riesgo laboral (Inciso II Art 53 LSS). Por eso no asegurar es el riesgo más grave de quiebra empresarial en México.
            </p>
        </main>
    )
}
