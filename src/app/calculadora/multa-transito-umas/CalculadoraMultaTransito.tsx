'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

const CATALOGO_INFRACCIONES = [
    { id: 'alto', nombre: 'Pasarse la Luz Roja (Alto)', umas: 20, desc: 'Ignorar semáforo en rojo o señal de ALTO restrictiva.', corralon: false },
    { id: 'celular', nombre: 'Usar Celular al Conducir', umas: 35, desc: 'Hablar o mensajear con dispositivo móvil sin manos libres.', corralon: false },
    { id: 'velocidad', nombre: 'Exceso de Velocidad', umas: 20, desc: 'Rebasar el límite establecido en vías primarias o escolares.', corralon: false },
    { id: 'alcoholimetro', nombre: 'Conducir Ebrio (Alcoholímetro / Torito)', umas: 60, desc: 'Superar límite de grados de alcohol en sangre. Arresto inconmutable de 20 a 36 horas.', corralon: true },
    { id: 'estacionamiento', nombre: 'Estacionarse en Lugar Prohibido', umas: 15, desc: 'Obstruir rampas, banquetas, hidrantes o zonas exclusivas.', corralon: true },
    { id: 'licencia', nombre: 'Manejar sin Licencia o Vigencia', umas: 20, desc: 'No portar documento oficial o estar vencido.', corralon: true },
    { id: 'cinturon', nombre: 'No usar Cinturón de Seguridad', umas: 10, desc: 'Conductor o pasajeros sin cinturón.', corralon: false },
    { id: 'seguro', nombre: 'No tener Seguro de Auto', umas: 40, desc: 'Falta de póliza de responsabilidad civil vigente.', corralon: false },
]

export default function CalculadoraMultaTransito() {
    const [infraccionActiva, setInfraccionActiva] = useState(CATALOGO_INFRACCIONES[0].id)
    const [prontoPago, setProntoPago] = useState(true)

    const resultado = useMemo(() => {
        const umasHoy = getUMA(2026).diaria
        const infraccion = CATALOGO_INFRACCIONES.find(i => i.id === infraccionActiva)!

        const multaBase = infraccion.umas * umasHoy
        let porcentajeDescuento = 0
        let ahorro = 0
        let multaFinal = multaBase

        // Reglas urbanas estándar (CDMX y Estados): 50% si se paga en primeros 15-30 días
        if (prontoPago) {
            porcentajeDescuento = 50
            ahorro = multaBase * (porcentajeDescuento / 100)
            multaFinal = multaBase - ahorro
        }

        // Si hay corralón, sumar grúa gruesa estandar
        const costoGrua = infraccion.corralon ? (10 * umasHoy) : 0 // Arrastre genérico de 10 UMAS estandar en grueros.
        const costoPisoDia = infraccion.corralon ? (1 * umasHoy) : 0

        const totalAdeudadoLiberacion = multaFinal + costoGrua + costoPisoDia

        return {
            ...infraccion,
            multaBase,
            multaFinal,
            porcentajeDescuento,
            ahorro,
            costoGrua,
            costoPisoDia,
            totalAdeudadoLiberacion,
            umasHoy
        }

    }, [infraccionActiva, prontoPago])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🚗</span><span>Reglamentos de Tránsito Locales y Policía Vial</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Costo de Sanciones e <span className="gradient-gold">Infracciones de Tránsito</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Conoce el equivalente exacto en pesos de las boletas de infracción marcadas en UMAs por los oficiales de tránsito. Simulador promediado nacional y CDMX.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-1/2 overflow-y-auto max-h-[500px] pr-2 space-y-2 custom-scrollbar">
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-accent)] mb-3 font-bold sticky top-0 bg-[#020817] py-2 z-10">
                        Catálogo de Faltas Comunes
                    </label>
                    {CATALOGO_INFRACCIONES.map(d => (
                        <div key={d.id} onClick={() => setInfraccionActiva(d.id)}
                            className={`p-3 rounded-xl cursor-pointer border transition-all text-sm group
                                ${infraccionActiva === d.id ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] backdrop-blur-sm' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                            <div className="flex justify-between items-center">
                                <span className={`font-bold ${infraccionActiva === d.id ? 'text-[var(--color-accent)]' : 'text-white'}`}>{d.nombre}</span>
                                {d.corralon && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">CORRALÓN</span>}
                            </div>
                            <div className="text-[10px] text-white/50 mt-1 line-clamp-1">{d.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/2 flex flex-col space-y-6">
                    <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-amber-500/20 shadow-lg relative">
                        <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest">Infracción Seleccionada (Boleta Física)</p>
                        <h2 className="text-sm font-bold text-amber-500 mb-4">{resultado.nombre}</h2>

                        <div className="my-2">
                            <div className={`text-5xl font-mono font-bold ${prontoPago ? 'text-green-400' : 'text-amber-400'}`}>
                                ${fmtMXN(resultado.multaFinal)}
                            </div>
                            {prontoPago && (
                                <div className="text-[10px] text-white/40 mt-1 line-through">Monto Normal Sin Descuento: ${fmtMXN(resultado.multaBase)}</div>
                            )}
                        </div>

                        <div className="mt-4 px-3 py-1 bg-black/50 rounded border border-white/10 text-[10px] text-white/60 font-mono inline-block">
                            Tarifa Oficial: <b>{resultado.umas} UMAS Diarias</b>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] uppercase tracking-widest text-[var(--color-accent)] mb-1 font-bold">Modificadores de Retención</label>

                        <div className="flex items-start gap-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5 transition-colors cursor-pointer" onClick={() => setProntoPago(!prontoPago)}>
                            <input type="checkbox" checked={prontoPago} readOnly className="mt-1 w-5 h-5 accent-green-500 pointer-events-none" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-green-300 block mb-1">Pagaré en los primeros 15 a 30 días</label>
                                <p className="text-[10px] text-green-200/60 leading-tight">La ley de tesorería te otorga un 50% de descuento automático en el pago de la boleta para incentivar la recaudación veloz. (Ahorras ${fmtMXN(resultado.ahorro)}).</p>
                            </div>
                        </div>
                    </div>

                    {resultado.corralon && (
                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl animate-fade-in shadow-inner">
                            <h3 className="text-xs font-bold text-red-400 uppercase mb-2">🚨 Gastos Anexos: Remisión a Corralón / Depósito Vehicular</h3>
                            <ul className="text-[11px] text-red-200/80 space-y-1 font-mono">
                                <li className="flex justify-between"><span>+ Arrastre de Grúa (Est. 10 UMAs)</span><span>${fmtMXN(resultado.costoGrua)}</span></li>
                                <li className="flex justify-between"><span>+ Derecho de Piso 1 Día (Est. 1 UMA)</span><span>${fmtMXN(resultado.costoPisoDia)}</span></li>
                                <li className="flex justify-between font-bold pt-2 border-t border-red-500/30 text-red-300">
                                    <span>SUBTOTAL PARA SACAR EL AUTO HOY:</span>
                                    <span>${fmtMXN(resultado.totalAdeudadoLiberacion)}</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="p-3 text-[10px] text-white/30 text-center leading-relaxed italic">
                        El número exacto de UMAs puede variar ligeramente según el Estado y su Ley de Ingresos, este tabulador refleja los promedios mayoritarios de los Bandos de Policía y Buen Gobierno nacionales (CDMX y Áreas Metropolitanas).
                    </div>
                </div>

            </div>
        </main>
    )
}
