'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraFeHechos() {
    const [tipoDiligencia, setTipoDiligencia] = useState<'notificacion' | 'fe_hechos' | 'inventario'>('fe_hechos')
    const [horasEstimadasFuera, setHorasEstimadasFuera] = useState('2') // Tiempo que le tomará al Notario (Salida + Retorno)
    const [fotografiasFojas, setFotografiasFojas] = useState('0') // Si anexan fotos al acta (cobran por anexo)

    const resultado = useMemo(() => {
        let tarifaBaseSalida = 5000 // Por el puro hecho de sacar al fedatario de su notaría
        let costoHoraAcumulada = 0
        let nombreServicio = ''

        const h = parseInt(horasEstimadasFuera) || 1
        const fFojas = parseInt(fotografiasFojas) || 0

        if (tipoDiligencia === 'notificacion') {
            tarifaBaseSalida = 4500
            nombreServicio = 'Notificación o Interpelación Notarial'
            // Se cobra extra por hora después de la primera
            if (h > 1) costoHoraAcumulada = (h - 1) * 2500
        } else if (tipoDiligencia === 'fe_hechos') {
            tarifaBaseSalida = 6000
            nombreServicio = 'Acta Permanente de Fe de Hechos (Despojos, Daños)'
            if (h > 1) costoHoraAcumulada = (h - 1) * 3500 // Más caro porque implica observación activa y levantamiento
        } else {
            tarifaBaseSalida = 7500
            nombreServicio = 'Fe de Inventario o Sorteos Especiales'
            if (h > 1) costoHoraAcumulada = (h - 1) * 4000 // Tarifas altas corporativas
        }

        // Fojas o Apéndices Fotográficos (Las copias certificadas valen aprox $150 c/u, pero adherirlas al protocolo principal es más alto)
        const costoAnexosGraficos = fFojas * 300 // $300 por cada fotografía impresa atada a protocolo

        const honorarios = tarifaBaseSalida + costoHoraAcumulada
        const impuestosIVA = honorarios * 0.16

        // Rango comercial 
        const estimacionMenor = honorarios + costoAnexosGraficos + impuestosIVA
        const estimacionMayor = estimacionMenor * 1.30 // Multiplicador de 30% más, típico de zonas premium (Polanco, San Pedro)

        return {
            nombreServicio,
            tarifaBaseSalida,
            costoHoraAcumulada,
            costoAnexosGraficos,
            honorarios,
            impuestosIVA,
            estimacionMenor,
            estimacionMayor
        }

    }, [tipoDiligencia, horasEstimadasFuera, fotografiasFojas])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>👁️</span><span>Fe Pública y Actos Extrarregistrales Notariales</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de Cuotas para <span className="gradient-gold">Diligencias y Fe de Hechos</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si necesitas que el Notario testifique para un juicio que alguien invadió tu terreno o rompió un contrato mercantil, aquí dimensionas el cobro por hora de "salida a campo".
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Actuación Solicitada (Salida)
                            </label>
                            <select value={tipoDiligencia} onChange={e => setTipoDiligencia(e.target.value as any)}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-[var(--color-accent)]">
                                <option value="fe_hechos">Dar Fe de un Hecho (Estado de una casa tras renta, humedades, bloqueos, invasión)</option>
                                <option value="notificacion">Interpelación a Domicilio (Requerir un pago a moroso u ofrecer una cosa y documentarlo)</option>
                                <option value="inventario">Lista de Inventarios (Bodegas con mercancía, herencias o asambleas corporativas)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">
                                Horas Totales Mínimas Requeridas
                            </label>
                            <input type="number" min="1" max="12" value={horasEstimadasFuera} onChange={e => setHorasEstimadasFuera(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600 text-white font-mono text-xl focus:border-[var(--color-accent)] outline-none" />
                            <p className="text-[10px] text-white/50 mt-1">El reloj empieza a correr desde que el Corredor o Notario sale en auto de su oficina hasta que vuelve.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                    <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">
                        Fotografías o Pruebas Anexas al Protocolo
                    </label>
                    <input type="number" min="0" value={fotografiasFojas} onChange={e => setFotografiasFojas(e.target.value)}
                        className="w-full lg:w-1/2 p-3 rounded-xl bg-black/30 border border-white/10 text-white font-mono focus:border-[var(--color-accent)] outline-none" />
                    <p className="text-[10px] text-[var(--color-accent)] font-bold mt-1">Sube el costo notoriamente porque aumentan las "fojas anexas" del libro final timbrado.</p>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="glass-card p-6 rounded-2xl flex items-center justify-between border-2 border-slate-700 bg-gradient-to-l from-slate-900 via-transparent to-black">
                        <div>
                            <p className="text-[10px] font-bold text-[var(--color-accent)] mb-1 uppercase tracking-widest text-wrap max-w-[200px]">{resultado.nombreServicio}</p>
                            <p className="text-3xl text-white mt-1 font-mono font-bold whitespace-nowrap">
                                ${fmtMXN(resultado.estimacionMenor)} <span className="opacity-40 text-xl font-sans">á</span> ${fmtMXN(resultado.estimacionMayor)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 space-y-3">
                        <span className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wide border-b border-white/10 pb-2">Arancel Detallado Analizado</span>

                        <div className="flex justify-between items-center text-[11px] text-white/80">
                            <span>Cobro Fijo de "1ra Hora" y Cierre de Acta Notarial (+ Salida):</span>
                            <span className="font-mono">${fmtMXN(resultado.tarifaBaseSalida)}</span>
                        </div>

                        {resultado.costoHoraAcumulada > 0 && (
                            <div className="flex justify-between items-center text-[11px] text-red-300">
                                <span>Cronómetro Activo ({parseInt(horasEstimadasFuera) - 1} Hora(s) Extra Fuera de Notaría):</span>
                                <span className="font-mono">+ ${fmtMXN(resultado.costoHoraAcumulada)}</span>
                            </div>
                        )}

                        {resultado.costoAnexosGraficos > 0 && (
                            <div className="flex justify-between items-center text-[11px] text-orange-300">
                                <span>Impresión / Certificación de Fotogramas al Apéndice ({fotografiasFojas}):</span>
                                <span className="font-mono">+ ${fmtMXN(resultado.costoAnexosGraficos)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-[11px] text-white/50 pb-2 border-b border-white/10">
                            <span>IVA Legal e Impuestos Trasladados:</span>
                            <span className="font-mono">${fmtMXN(resultado.impuestosIVA)}</span>
                        </div>

                    </div>
                </div>
            )}
        </main>
    )
}
