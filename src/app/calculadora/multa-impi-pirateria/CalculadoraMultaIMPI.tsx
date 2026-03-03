'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

export default function CalculadoraMultaIMPI() {
    const [mesesVentaIlegal, setMesesVentaIlegal] = useState('12')
    const [ventasMensualesIlegales, setVentasMensualesIlegales] = useState('200000') // $200k MXN mensuales en ventas pirata
    const [clausuraActivada, setClausuraActivada] = useState(false)

    const resultado = useMemo(() => {
        const meses = parseInt(mesesVentaIlegal) || 0
        const ventasMens = parseFloat(ventasMensualesIlegales) || 0
        const umasHoy = getUMA(2026).diaria

        // 1. Multa Administrativa del IMPI: Puede ir de 2,000 hasta 250,000 UMAs según la gravedad (Art. 388). Haremos un escenario medio bajo/alto.
        const umasSancionAprox = 10000 // Infracción base para Pymes (10k UMAs)
        const multaAdministrativaEstado = umasSancionAprox * umasHoy

        // 2. Reparación del Daño por lucro cesante y daño material a favor del titular de la marca.
        // Art. 344 de la LFPPI (antes art 221 bis): La indemnización nunca será menor al 40% del precio de las ventas al público.
        const ventasTotalesPirata = meses * ventasMens
        const indemnizacionVictima40 = ventasTotalesPirata * 0.40

        const granTotalPerdidaInfractor = multaAdministrativaEstado + indemnizacionVictima40

        return {
            meses,
            ventasMens,
            ventasTotalesPirata,
            multaAdministrativaEstado,
            indemnizacionVictima40,
            granTotalPerdidaInfractor,
            umasHoy,
            clausuraActivada
        }

    }, [mesesVentaIlegal, ventasMensualesIlegales, clausuraActivada])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>®️</span><span>Instituto Mexicano de la Propiedad Industrial</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Indemnización por <span className="gradient-gold">Piratería y Robo de Marca</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    ¿Alguien está usando tu nombre comercial o logo sin permiso? Calcula el golpe legal usando el histórico "Piso del 40% de Daños y Perjuicios" de la Ley Federal de Protección a la Propiedad Industrial (LFPPI).
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/10 pb-6">
                    <div>
                        <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">
                            Meses de Venta / Exhibición Ilegal
                        </label>
                        <input type="number" value={mesesVentaIlegal} onChange={e => setMesesVentaIlegal(e.target.value)}
                            className="w-full p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-100 font-mono text-3xl focus:border-indigo-500 outline-none" />
                        <p className="text-[10px] text-white/50 mt-1">Tiempo que duró la violación de derechos explotando los productos/servicios apócrifos.</p>
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">
                            Ingresos Mensuales Promedio del Infractor
                        </label>
                        <input type="number" value={ventasMensualesIlegales} onChange={e => setVentasMensualesIlegales(e.target.value)}
                            className="w-full p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-100 font-mono text-3xl focus:border-indigo-500 outline-none" />
                        <p className="text-[10px] text-white/50 mt-1">¿Cuánto generó o está logrando facturar la competencia usando tu logotipo robado?</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-red-500/20 bg-red-500/5 transition-colors cursor-pointer" onClick={() => setClausuraActivada(!clausuraActivada)}>
                    <input type="checkbox" checked={clausuraActivada} readOnly className="mt-1 w-5 h-5 accent-red-500 pointer-events-none" />
                    <div className="flex-1">
                        <label className="text-sm font-bold text-red-300 block mb-1">El IMPI ya aplicó medida preventiva de Clausura</label>
                        <p className="text-[10px] text-red-200/60 leading-tight">Si el IMPI ejecutó operativo, inmovilizará mercancía e impondrá sanción económica extraída a favor del Estado (Tesorería), independientemente del pago que tiene que hacer a la víctima.</p>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass-card p-6 rounded-2xl text-center border-2 border-indigo-500/30 bg-indigo-900/10 relative overflow-hidden shadow-lg shadow-indigo-500/10">
                            <p className="text-[10px] font-bold text-indigo-400 mb-1 uppercase tracking-widest flex justify-center items-center gap-2">
                                Indemnización Obligada a favor de la Víctima (Art. 344)
                            </p>
                            <p className={`text-4xl md:text-5xl font-mono font-bold my-4 text-indigo-300`}>
                                ${fmtMXN(resultado.indemnizacionVictima40)}
                            </p>
                            <div className="mt-2 text-[10px] text-indigo-200/50">
                                El infractor facturó un total de ${fmtMXN(resultado.ventasTotalesPirata)}. <b>La ley obliga a pagar, como mínimo, el equivalente al 40% de eso.</b>
                            </div>
                        </div>

                        {resultado.clausuraActivada ? (
                            <div className="glass-card p-6 rounded-2xl text-center border-2 border-red-500/30 bg-red-900/10">
                                <p className="text-[10px] font-bold text-red-400 mb-1 uppercase tracking-widest flex justify-center items-center gap-2">
                                    Multa Estatal del IMPI (Promedio Base)
                                </p>
                                <p className={`text-4xl font-mono font-bold my-4 text-red-400`}>
                                    ${fmtMXN(resultado.multaAdministrativaEstado)}
                                </p>
                                <div className="mt-2 text-[10px] text-red-200/50">
                                    Estimación conservadora (10,000 UMAs) como multa a la Tesorería de la Federación por Infracción Clandestina, más el decomiso.
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center text-center border border-white/5 opacity-50">
                                <span className="text-3xl mb-2 grayscale">💼</span>
                                <p className="text-xs text-white/50">Si demandas por la vía civil, te evitas que el Estado (IMPI) cobre su propia multa. Solo recuperas tú el lucro cesante.</p>
                            </div>
                        )}
                    </div>

                    <div className="glass-card p-5 rounded-xl border border-white/10 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Riesgo Total de Quiebra (Sumatoria)</span>
                            <p className="text-2xl font-mono font-bold text-white mt-1">${fmtMXN(resultado.granTotalPerdidaInfractor)}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
