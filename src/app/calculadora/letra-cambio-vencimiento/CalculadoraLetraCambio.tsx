'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'
import { differenceInDays, parseISO, isValid, addDays, addMonths, format, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'

export default function CalculadoraLetraCambio() {
    const [monto, setMonto] = useState('120000')
    const [tipoVencimiento, setTipoVencimiento] = useState<'dia_fijo' | 'cierto_tiempo_fecha' | 'a_la_vista' | 'cierto_tiempo_vista'>('dia_fijo')
    const [fechaExpedicion, setFechaExpedicion] = useState(new Date().toISOString().split('T')[0])

    // Parámetros dinámicos según el tipo de vencimiento
    const [fechaFija, setFechaFija] = useState(addDays(new Date(), 30).toISOString().split('T')[0])
    const [diasPlazo, setDiasPlazo] = useState('60')
    const [fechaPresentacion, setFechaPresentacion] = useState(new Date().toISOString().split('T')[0])
    const [tasaConvencional, setTasaConvencional] = useState('')

    const resultado = useMemo(() => {
        const capital = parseFloat(monto) || 0
        const fExpedicion = parseISO(fechaExpedicion)
        let fVencimientoReal = new Date()
        let caduco = false
        let detalleExplicativo = ''

        if (!isValid(fExpedicion)) return null

        if (tipoVencimiento === 'dia_fijo') {
            const fFija = parseISO(fechaFija)
            if (isValid(fFija)) {
                fVencimientoReal = fFija
                detalleExplicativo = 'Vence exactamente el día especificado en el documento (Art 79 I LGTOC).'
            }
        } else if (tipoVencimiento === 'cierto_tiempo_fecha') {
            const plazo = parseInt(diasPlazo) || 0
            fVencimientoReal = addDays(fExpedicion, plazo)
            detalleExplicativo = `Vence ${plazo} días exactos después del momento en que se documentó el crédito.`
        } else if (tipoVencimiento === 'a_la_vista') {
            const fPresentada = parseISO(fechaPresentacion)
            if (isValid(fPresentada)) {
                fVencimientoReal = fPresentada // Vence el mismo día que se exhibe al deudor
                // Art. 128 LGTOC: A la vista debe presentarse dentro de los 6 meses siguientes a su expedición
                const seisMeses = addMonths(fExpedicion, 6)
                if (isAfter(fPresentada, seisMeses)) {
                    caduco = true
                    detalleExplicativo = `⚠️ Letra Caduco: Las letras a la vista prescriben si no se presentan dentro de los primeros 6 meses post-expedición (Art. 128 LGTOC). El plazo límite era: ${format(seisMeses, 'dd MMM yyyy', { locale: es })}.`
                } else {
                    detalleExplicativo = `Pagadera en el instante en que fue mostrada físicamente al girado/deudor: ${format(fPresentada, 'dd MMM yyyy', { locale: es })}.`
                }
            }
        } else if (tipoVencimiento === 'cierto_tiempo_vista') {
            const fPresentada = parseISO(fechaPresentacion)
            const plazo = parseInt(diasPlazo) || 0
            if (isValid(fPresentada)) {
                fVencimientoReal = addDays(fPresentada, plazo)
                detalleExplicativo = `Vence ${plazo} días exactos después de haberla presentado para su "vista" u aceptación.`
            }
        }

        let diasMora = 0
        const hoy = new Date()
        const vencida = isAfter(hoy, fVencimientoReal)

        if (vencida && !caduco) {
            diasMora = differenceInDays(hoy, fVencimientoReal)
            if (diasMora < 0) diasMora = 0
        }

        // Tasa de interés: 6% mercantil supletorio
        const tasaAnual = parseFloat(tasaConvencional) > 0 ? parseFloat(tasaConvencional) : 6.0
        const tasaDiaria = (tasaAnual / 100) / 365
        const interesMoratorio = caduco ? 0 : capital * tasaDiaria * diasMora

        return {
            fechaVencimientoCalculada: format(fVencimientoReal, "dd 'de' MMMM 'de' yyyy", { locale: es }),
            detalleExplicativo,
            caduco,
            vencida,
            diasMora,
            interesMoratorio,
            tasaAplicada: tasaAnual,
            totalDeuda: caduco ? capital : capital + interesMoratorio,
            capital
        }
    }, [monto, tipoVencimiento, fechaExpedicion, fechaFija, diasPlazo, fechaPresentacion, tasaConvencional])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📝</span><span>Títulos de Crédito · Letra de Cambio</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Vencimiento de <span className="gradient-gold">Letras de Cambio</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    A diferencia del Pagaré, la Letra de Cambio (Arts. 76-81 LGTOC) tiene 4 formas complejas de dictar cuándo se debe pagar. Calcula su fecha de ejecución exacta aquí.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Suerte Principal (Monto Capital $)</label>
                    <input type="number" value={monto} onChange={e => setMonto(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl focus:border-[var(--color-accent)] focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Forma de Vencimiento Escrita</label>
                        <select value={tipoVencimiento} onChange={e => setTipoVencimiento(e.target.value as any)}
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none">
                            <option value="dia_fijo">A Día Fijo (Ej. "Páguese el 3 de mayo")</option>
                            <option value="cierto_tiempo_fecha">A Cierto Tiempo Fecha (Ej. "A los 30 días de la fecha")</option>
                            <option value="a_la_vista">A la Vista (En el acto de presentación)</option>
                            <option value="cierto_tiempo_vista">A Cierto Tiempo Vista (Días post-aceptación)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Fecha de Expedición del Documento</label>
                        <input type="date" value={fechaExpedicion} onChange={e => setFechaExpedicion(e.target.value)}
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none [color-scheme:dark]" />
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 p-4 rounded-xl bg-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tipoVencimiento === 'dia_fijo' && (
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs text-white/70 mb-1.5 font-semibold">Selecciona la Fecha Pactada de Cobro</label>
                            <input type="date" value={fechaFija} onChange={e => setFechaFija(e.target.value)}
                                className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none [color-scheme:dark]" />
                        </div>
                    )}

                    {(tipoVencimiento === 'cierto_tiempo_fecha' || tipoVencimiento === 'cierto_tiempo_vista') && (
                        <div>
                            <label className="block text-xs text-white/70 mb-1.5 font-semibold">¿Cuántos "Ciertos Días"?</label>
                            <input type="number" value={diasPlazo} onChange={e => setDiasPlazo(e.target.value)} placeholder="Ej. 60 o 90"
                                className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none" />
                        </div>
                    )}

                    {(tipoVencimiento === 'a_la_vista' || tipoVencimiento === 'cierto_tiempo_vista') && (
                        <div>
                            <label className="block text-xs text-white/70 mb-1.5 font-semibold">Día en que Vio/Firmó de Aceptado</label>
                            <input type="date" value={fechaPresentacion} onChange={e => setFechaPresentacion(e.target.value)}
                                className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none [color-scheme:dark]" />
                        </div>
                    )}

                    <div className="col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Interés Penal / Moratorio Pactado (% Anual)</label>
                        <input type="number" value={tasaConvencional} onChange={e => setTasaConvencional(e.target.value)} placeholder="Vacío usa el 6% Legal de Comercio"
                            className="w-full p-3 flex-1 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:border-[var(--color-accent)] outline-none" />
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-2xl space-y-4">

                    <div className={`glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border ${resultado.caduco ? 'border-red-500/50' : 'border-blue-500/30'}`}>
                        <p className="text-sm font-bold text-white/50 mb-1">Día de Pago Legal Demandable (Vencimiento)</p>
                        <p className={`text-3xl font-bold uppercase tracking-wider ${resultado.caduco ? 'text-red-500' : 'text-blue-400'}`}>
                            {resultado.caduco ? 'CADUCIDAD DE LA ACCIÓN' : resultado.fechaVencimientoCalculada}
                        </p>
                        <p className="text-xs text-white/70 mt-2">{resultado.detalleExplicativo}</p>
                    </div>

                    {!resultado.caduco && resultado.vencida && (
                        <div className="glass-card p-6 rounded-2xl space-y-3 font-mono text-sm leading-relaxed text-white/80">

                            <div className="flex justify-between p-2">
                                <div>
                                    <span className="block font-bold">Capital Adeudado y Exigible</span>
                                </div>
                                <span className="text-white font-bold">${fmtMXN(resultado.capital)}</span>
                            </div>

                            <div className="flex justify-between p-2">
                                <div>
                                    <span className="block text-orange-300">Retraso Moratorio y Penalización</span>
                                    <span className="text-[10px] text-white/50">{resultado.diasMora} días de retraso usando Tasa Mercantil al {resultado.tasaAplicada}%</span>
                                </div>
                                <span className="text-orange-400 font-bold">+ ${fmtMXN(resultado.interesMoratorio)}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 border-t border-white/10 bg-white/5 rounded-b-xl mt-4">
                                <span className="font-bold text-white uppercase text-xs tracking-wider">Monto Total Sujeto a Embargo</span>
                                <span className="text-xl font-bold text-[var(--color-accent)]">${fmtMXN(resultado.totalDeuda)}</span>
                            </div>

                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mt-4 font-sans line-clamp-2 hover:line-clamp-none text-[11px] text-orange-200">
                                <strong>IMPORTANTE: </strong> Este cálculo corre el interés de mora asumiendo falta de pago. En Letras de Cambio, siempre es fundamental levantar "El Protesto" mediante Notario o Corredor Público para no perder la vía ejecutiva si esta no trae la leyenda "Sin Protesto".
                            </div>
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}
