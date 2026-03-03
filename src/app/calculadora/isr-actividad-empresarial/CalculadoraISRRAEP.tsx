'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

// Tarifa Mensual 2026 (Art. 96 LISR)
const TARIFA_MENSUAL_2026 = [
    { limiteInf: 0, limiteSup: 746.04, cuotaFija: 0, tasa: 0.0192 },
    { limiteInf: 746.05, limiteSup: 6332.05, cuotaFija: 14.32, tasa: 0.0640 },
    { limiteInf: 6332.06, limiteSup: 11128.01, cuotaFija: 371.83, tasa: 0.1088 },
    { limiteInf: 11128.02, limiteSup: 12935.82, cuotaFija: 893.63, tasa: 0.1600 },
    { limiteInf: 12935.83, limiteSup: 15487.71, cuotaFija: 1182.88, tasa: 0.1792 },
    { limiteInf: 15487.72, limiteSup: 31236.49, cuotaFija: 1640.18, tasa: 0.2136 },
    { limiteInf: 31236.50, limiteSup: 49233.00, cuotaFija: 5004.12, tasa: 0.2352 },
    { limiteInf: 49233.01, limiteSup: 93993.90, cuotaFija: 9236.89, tasa: 0.3000 },
    { limiteInf: 93993.91, limiteSup: 125325.20, cuotaFija: 22665.17, tasa: 0.3200 },
    { limiteInf: 125325.21, limiteSup: 375975.61, cuotaFija: 32691.18, tasa: 0.3400 },
    { limiteInf: 375975.62, limiteSup: Infinity, cuotaFija: 117912.32, tasa: 0.3500 },
]

function calcularISRMensual(base: number): number {
    const tramo = TARIFA_MENSUAL_2026.find(t => base >= t.limiteInf && base <= t.limiteSup)
    if (!tramo) return 0
    return tramo.cuotaFija + (base - tramo.limiteInf) * tramo.tasa
}

export default function CalculadoraISRRAEP() {
    const [mes, setMes] = useState('1')
    const [ingresosAcumulados, setIngresosAcumulados] = useState('50000')
    const [deduccionesAcumuladas, setDeduccionesAcumuladas] = useState('30000')
    const [ptuPagada, setPtuPagada] = useState('0')
    const [perdidasAnt, setPerdidasAnt] = useState('0')
    const [pagosProvisionalesAnt, setPagosProvisionalesAnt] = useState('0')
    const [retencionesAnt, setRetencionesAnt] = useState('1500') // 10% retenido si es PM

    const resultado = useMemo(() => {
        const ingresos = parseFloat(ingresosAcumulados) || 0
        const deducc = parseFloat(deduccionesAcumuladas) || 0
        const ptu = parseFloat(ptuPagada) || 0
        const perdidas = parseFloat(perdidasAnt) || 0
        const pp = parseFloat(pagosProvisionalesAnt) || 0
        const retenciones = parseFloat(retencionesAnt) || 0
        const mesInt = parseInt(mes)

        if (ingresos <= 0) return null

        // Utilidad fiscal antes disminuciones
        const utilidadFiscalBruta = Math.max(ingresos - deducc, 0)

        // Disminuciones (PTU y Perdidas de ejercicios anteriores)
        const disminuciones = ptu + perdidas

        // Base gravable (Acumulada al mes actual)
        let baseGravableAcumulada = Math.max(utilidadFiscalBruta - disminuciones, 0)

        // Tarifa Art 96 (acumulativa, requiere multiplicar la tarifa mensual por el mes, pero LISR Art 106 tiene tarifas específicas o factor. Forma simplificada real usada en portales: tarifa mensual multiplicada por meses, o aplicar la propia tabla mensual de pagos provisionales que eleva los rangos)
        // Por simplicidad estricta y uso estándar, multiplicaremos los límites y cuotas por el número del mes.

        const tarifaAcumulada = TARIFA_MENSUAL_2026.map(t => ({
            limiteInf: t.limiteInf * mesInt,
            limiteSup: t.limiteSup === Infinity ? Infinity : t.limiteSup * mesInt,
            cuotaFija: t.cuotaFija * mesInt,
            tasa: t.tasa // Tasa jamás se multiplica
        }))

        const tramo = tarifaAcumulada.find(t => baseGravableAcumulada >= t.limiteInf && baseGravableAcumulada <= t.limiteSup)
        let isrCausadoAcumulado = 0
        if (tramo) {
            isrCausadoAcumulado = tramo.cuotaFija + (baseGravableAcumulada - tramo.limiteInf) * tramo.tasa
        }

        // Impuesto a cargo del mes
        const abonos = pp + retenciones
        const isrAPagarMensual = Math.max(isrCausadoAcumulado - abonos, 0)

        return {
            ingresos, deducc, utilidadFiscalBruta, ptu, perdidas, baseGravableAcumulada,
            isrCausadoAcumulado, pp, retenciones, isrAPagarMensual, mesInt
        }
    }, [mes, ingresosAcumulados, deduccionesAcumuladas, ptuPagada, perdidasAnt, pagosProvisionalesAnt, retencionesAnt])

    const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🧾</span><span>Régimen General PF · RAEP Art. 106 LISR</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">ISR Actividad Empresarial (RAEP)</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Calcula tu <strong className="text-white">Pago Provisional Mensual</strong>. Este régimen acumula ingresos y deducciones desde enero hasta el mes de la declaración.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Mes a declarar</label>
                        <select value={mes} onChange={e => setMes(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            {mesesNombres.map((m, i) => <option key={i + 1} value={i + 1}>{m} (Mes {i + 1})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Ingresos acumulados (Ene a Mes)</label>
                        <input type="number" value={ingresosAcumulados} onChange={e => setIngresosAcumulados(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Deducciones acumuladas</label>
                        <input type="number" value={deduccionesAcumuladas} onChange={e => setDeduccionesAcumuladas(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1.5">PTU pagada en el ejercicio</label>
                        <input type="number" value={ptuPagada} onChange={e => setPtuPagada(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs text-white/50 mb-1.5">Pérdidas fiscales anteriores (Pendientes)</label>
                        <input type="number" value={perdidasAnt} onChange={e => setPerdidasAnt(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm focus:outline-none" />
                    </div>
                    <div className="col-span-1 border-t border-white/10 pt-2 lg:col-span-3 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Pagos provisionales meses ant.</label>
                            <input type="number" value={pagosProvisionalesAnt} onChange={e => setPagosProvisionalesAnt(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-sm focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Retenciones de ISR (10% PM)</label>
                            <input type="number" value={retencionesAnt} onChange={e => setRetencionesAnt(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-sm focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <h2 className="text-white font-bold text-lg mb-4">🧮 Determinación del ISR Mensual</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">Ingresos acumulables al mes {resultado.mesInt}</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.ingresos)}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">(-) Deducciones autorizadas acumuladas</span>
                            <span className="font-mono text-white">-${fmtMXN(resultado.deducc)}</span>
                        </div>
                        {resultado.ptu > 0 && <div className="flex justify-between p-2 rounded-lg bg-white/5"><span className="text-xs text-white/60">(-) PTU pagada</span><span className="font-mono text-white">-${fmtMXN(resultado.ptu)}</span></div>}
                        {resultado.perdidas > 0 && <div className="flex justify-between p-2 rounded-lg bg-white/5"><span className="text-xs text-white/60">(-) Pérdidas fiscales ant. actualizadas</span><span className="font-mono text-white">-${fmtMXN(resultado.perdidas)}</span></div>}
                        <div className="flex justify-between p-2 rounded-lg bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 font-bold">
                            <span className="text-xs text-white">(=) Base gravable pago provisional</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.baseGravableAcumulada)}</span>
                        </div>

                        <div className="flex justify-between p-2 rounded-lg bg-white/5 mt-4">
                            <span className="text-xs text-white/60">ISR causado (Tarifa acumulable)</span>
                            <span className="font-mono text-white">${fmtMXN(resultado.isrCausadoAcumulado)}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">(-) Pagos provisionales meses anteriores</span>
                            <span className="font-mono text-[var(--color-accent)]">-${fmtMXN(resultado.pp)}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-xs text-white/60">(-) ISR retenido por PM (10%)</span>
                            <span className="font-mono text-[var(--color-accent)]">-${fmtMXN(resultado.retenciones)}</span>
                        </div>
                        <div className="flex justify-between p-4 rounded-lg bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 mt-2">
                            <span className="text-sm text-[var(--color-accent)] font-bold">(=) ISR a pagar a cargo (Pago Provisional)</span>
                            <span className="font-mono text-[var(--color-accent)] font-bold text-xl">${fmtMXN(resultado.isrAPagarMensual)}</span>
                        </div>
                    </div>
                </div>
            )}
            <p className="text-[10px] text-white/30 text-center mt-6">Art. 106 LISR: Pagos provisionales mensuales a más tardar el día 17 del mes inmediato posterior. Tarifas ISR acumuladas generadas multiplicando factores del Art 96.</p>
        </main>
    )
}
