'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraHonorariosNotariales() {
    const [tipoTramite, setTipoTramite] = useState<'escritura' | 'poder' | 'testamento' | 'copias'>('escritura')
    const [valorOperacion, setValorOperacion] = useState('1500000')
    const [hojas, setHojas] = useState('5')

    const resultado = useMemo(() => {
        let honorarios = 0
        let impuestos = 0 // ISAI aprox
        let derechosRegistro = 0
        let gestoria = 0

        const valor = parseFloat(valorOperacion) || 0

        if (tipoTramite === 'escritura') {
            // Arancel notarial escalonado simplificado (promedio CDMX/Edomex)
            if (valor <= 500000) honorarios = valor * 0.015 // 1.5%
            else if (valor <= 1500000) honorarios = 7500 + ((valor - 500000) * 0.012)
            else honorarios = 19500 + ((valor - 1500000) * 0.008)

            // Derechos de inscripción al RPP (aprox 0.8% - 1%)
            derechosRegistro = valor * 0.008

            // ISAI o Traslado de dominio (depende el municipio, varía del 2% al 6%) Promedio 3.5%
            impuestos = valor * 0.035

            gestoria = 3500 // certificados de libertad de gravamen, no adeudo predial/agua
        }
        else if (tipoTramite === 'poder') {
            honorarios = 3500 // Poder general simple
            derechosRegistro = 0 // No se inscribe, solo se archiva en la notaría
            impuestos = 0
            gestoria = 1000
        }
        else if (tipoTramite === 'testamento') {
            honorarios = 4500 // Septiembre mes del testamento baja a 2000-2500, pero normal es 4500.
            derechosRegistro = 1200 // Aviso de testamento
            impuestos = 0
            gestoria = 800
        }
        else if (tipoTramite === 'copias') {
            const numHojas = parseInt(hojas) || 1
            honorarios = 150 + (numHojas * 30) // Cotejo y primer hoja, + 30 x hoja extra.
            derechosRegistro = 0
            impuestos = 0
            gestoria = 0
        }

        const subtotal = honorarios + gestoria
        const ivaHonorarios = subtotal * 0.16
        const total = subtotal + ivaHonorarios + impuestos + derechosRegistro // Impuestos y derechos NO llevan IVA.

        return {
            honorarios,
            gestoria,
            ivaHonorarios,
            impuestos,
            derechosRegistro,
            total
        }

    }, [tipoTramite, valorOperacion, hojas])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏛️</span><span>Derecho Notarial · Simulador de Arancel</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Honorarios Notariales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Estima los gastos totales para firmar ante Notario Público. En escrituras de compraventa, el costo notarial <strong className="text-white">incluye impuestos locales (ISAI)</strong> que el Notario solo retiene y paga al Estado.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-2xl mx-auto">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tipo de Trámite Notarial</label>
                    <select value={tipoTramite} onChange={e => setTipoTramite(e.target.value as any)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none mb-4">
                        <option value="escritura">Escrituración de Inmueble (Compraventa / Donación)</option>
                        <option value="poder">Poder Notarial (Pleitos y Cobranzas / Actos de Dominio)</option>
                        <option value="testamento">Testamento Público Abierto</option>
                        <option value="copias">Copias Certificadas o Cotejo de Documentos</option>
                    </select>
                </div>

                {tipoTramite === 'escritura' && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Valor de la Propiedad o Avalúo Catastral ($)</label>
                        <input type="number" value={valorOperacion} onChange={e => setValorOperacion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] focus:outline-none" />
                        <p className="text-[10px] text-[var(--color-accent)] mt-1">Regla fiscal: Paga impuestos sobre el valor que resulte MAYOR entre Precio de Venta, Avalúo Comercial y Valor Catastral.</p>
                    </div>
                )}

                {tipoTramite === 'copias' && (
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Número de hojas a certificar</label>
                        <input type="number" value={hojas} onChange={e => setHojas(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                    </div>
                )}
            </div>

            {resultado && (
                <div className="mt-8 glass-card p-6 rounded-2xl max-w-2xl mx-auto">

                    <div className="flex flex-col items-center mb-6 border-b border-white/10 pb-6">
                        <p className="text-sm text-white/50 font-bold mb-1">Costo Total Estimado</p>
                        <p className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.total)}</p>
                        {tipoTramite === 'escritura' && (
                            <p className="text-xs text-orange-400 font-bold mt-2">Equivale al {((resultado.total / (parseFloat(valorOperacion) || 1)) * 100).toFixed(2)}% del valor del inmueble.</p>
                        )}
                    </div>

                    <h2 className="text-white font-bold text-lg mb-4 text-center">Desglose (Notario vs Gastos)</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                            <div>
                                <span className="block text-[var(--color-accent)] font-bold">Honorarios del Notario</span>
                                <span className="text-[10px] text-[var(--color-accent)]/60">Servicio profesional por elaboración {tipoTramite === 'escritura' ? 'del protocolo' : 'del instrumento'}.</span>
                            </div>
                            <span className="font-mono text-[var(--color-accent)] font-bold self-center">${fmtMXN(resultado.honorarios)}</span>
                        </div>

                        {resultado.gestoria > 0 && (
                            <div className="flex justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-white/80">Gastos de Gestoría y Pre-preventivos</span>
                                <span className="font-mono text-white/80">${fmtMXN(resultado.gestoria)}</span>
                            </div>
                        )}

                        <div className="flex justify-between p-3 rounded-lg bg-white/5">
                            <span className="text-white/80">IVA (16% solo sobre Honorarios/Gestoría)</span>
                            <span className="font-mono text-white/80">${fmtMXN(resultado.ivaHonorarios)}</span>
                        </div>

                        {tipoTramite === 'escritura' && (
                            <>
                                <div className="mt-4 mb-2">
                                    <span className="block text-xs font-bold text-red-400 uppercase tracking-widest text-center">Impuestos y Derechos (Para el Gobierno)</span>
                                </div>
                                <div className="flex justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <div>
                                        <span className="block text-red-400 font-bold">Impuesto Estatal (ISAI / Traslado de Dominio)</span>
                                        <span className="text-[10px] text-red-400/60">Estimado promedio del 3.5%. El notario NO se queda este dinero.</span>
                                    </div>
                                    <span className="font-mono text-red-400 font-bold self-center">${fmtMXN(resultado.impuestos)}</span>
                                </div>
                                <div className="flex justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <div>
                                        <span className="block text-red-400 font-bold">Derechos Registro Público de la Propiedad</span>
                                        <span className="text-[10px] text-red-400/60">Estimado 0.8%. Pago para inscribirte como nuevo dueño (RPP).</span>
                                    </div>
                                    <span className="font-mono text-red-400 font-bold self-center">${fmtMXN(resultado.derechosRegistro)}</span>
                                </div>
                            </>
                        )}

                        {tipoTramite === 'testamento' && (
                            <div className="flex justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 mt-2">
                                <div>
                                    <span className="block text-red-400 font-bold">Derechos Archivo General</span>
                                    <span className="text-[10px] text-red-400/60">Aviso Nacional de Testamento (RENAT).</span>
                                </div>
                                <span className="font-mono text-red-400 font-bold self-center">${fmtMXN(resultado.derechosRegistro)}</span>
                            </div>
                        )}

                    </div>
                    {tipoTramite === 'escritura' && (
                        <p className="text-[10px] text-white/40 mt-6 text-justify">
                            * Ojo: Esta calculadora <strong>solo contempla los gastos del Comprador</strong>. Si eres el Vendedor, además deberás pagar el <strong>ISR por enajenación de Inmuebles</strong> (el notario te retiene hasta un 35% de la ganancia al instante), a menos que exentes el impuesto por tratarse de tu casa habitación comprobable.
                        </p>
                    )}
                </div>
            )}
        </main>
    )
}
