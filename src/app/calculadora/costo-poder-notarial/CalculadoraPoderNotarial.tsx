'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraPoderNotarial() {
    const [tipoPoder, setTipoPoder] = useState<'pleitos' | 'administracion' | 'dominio' | 'amplio' | 'especial'>('pleitos')
    const [esPersonaMoral, setEsPersonaMoral] = useState(false) // Si es empresa, cobran mucho más por revisar actas constitutivas
    const [estadoRep, setEstadoRep] = useState<'cdmx' | 'norte' | 'sur'>('cdmx') // CDMX / Nuevo Leon / Resto. Tarifas geográficas.

    const resultado = useMemo(() => {
        let costoBase = 0
        let nombrePoder = ''

        // Parámetros tarifarios referenciales (Aranceles promedios 2026)
        if (tipoPoder === 'especial') {
            costoBase = 2500
            nombrePoder = 'Poder Especial (Acto Único)'
        } else if (tipoPoder === 'pleitos') {
            costoBase = 3500
            nombrePoder = 'Poder General para Pleitos y Cobranzas'
        } else if (tipoPoder === 'administracion') {
            costoBase = 4500
            nombrePoder = 'Poder General para Actos de Administración'
        } else if (tipoPoder === 'dominio') {
            costoBase = 5800
            nombrePoder = 'Poder General para Actos de Dominio (Vender)'
        } else {
            costoBase = 7000
            nombrePoder = 'Poder General Amplísimo (Los 3 Juntos)'
        }

        // Multiplicador Geográfico
        let multiplicadorGeo = 1
        if (estadoRep === 'cdmx') multiplicadorGeo = 1.3 // Aranceles de la CDMX y Estado de México son más altos
        if (estadoRep === 'norte') multiplicadorGeo = 1.6 // Nuevo Loteon, Jalisco (Zonas Metropolitanas Plus)

        let costoTarifado = costoBase * multiplicadorGeo

        // Recargo por revisión de actas constitutivas si el Otorgante es Empresa (aprox +$3000 o 40%)
        const recargoPersonaMoral = esPersonaMoral ? (costoTarifado * 0.40) : 0
        const ivaGastos = (costoTarifado + recargoPersonaMoral) * 0.16 // Notarios siempre cobran el 16% del IVA más derechos de archivo

        const granTotal = costoTarifado + recargoPersonaMoral + ivaGastos

        // Rango de negociación para que el cliente no se sienta estafado
        const rangoInferior = granTotal * 0.85
        const rangoSuperior = granTotal * 1.20

        return {
            nombrePoder,
            costoTarifado,
            recargoPersonaMoral,
            ivaGastos,
            granTotal,
            rangoInferior,
            rangoSuperior
        }

    }, [tipoPoder, esPersonaMoral, estadoRep])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>✍️</span><span>Derecho Notarial Terrestre</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador Libre de <span className="gradient-gold">Honorarios de Poderes Notariales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Los aranceles notariales en México varían según el "análisis jurídico" requerido y el riesgo del mandato. Calcula el precio justo del mercado evitando cotizaciones usureras.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Tipo de Clausulado a Otorgar
                            </label>
                            <select value={tipoPoder} onChange={e => setTipoPoder(e.target.value as any)}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-[var(--color-accent)]">
                                <option value="especial">Poder Especial (Comprar 1 casa, Pagar 1 juicio, Retirar AFORE)</option>
                                <option value="pleitos">Para Pleitos y Cobranzas (Darlo a un Abogado Litigante)</option>
                                <option value="administracion">Para Actividades de Administración (Rentarla, cobros, bancos)</option>
                                <option value="dominio">Para Actos de Dominio (Habilitarlo para vender tu patrimonio entero)</option>
                                <option value="amplio">El Trío (Pleitos, Administración y Dominio a la vez)</option>
                            </select>
                            <p className="text-[10px] text-white/50 mt-1 pl-1">A mayor capacidad de afectar tu patrimonio (Dominio), más caro cobra el Notario por la responsabilidad solidaria de fe pública.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">
                                Región Sociodemográfica (Arancel Local)
                            </label>
                            <select value={estadoRep} onChange={e => setEstadoRep(e.target.value as any)}
                                className="w-full p-4 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-[var(--color-accent)]">
                                <option value="sur">Resto de los Estados (Ej. Chiapas, Tlaxcala, Nayarit, Hidalgo)</option>
                                <option value="cdmx">Área Metropolitana Central (CDMX y EdoMex)</option>
                                <option value="norte">Zonas Ejecutivas (Nuevo León, Jalisco, Querétaro)</option>
                            </select>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 transition-colors cursor-pointer mt-2" onClick={() => setEsPersonaMoral(!esPersonaMoral)}>
                            <input type="checkbox" checked={esPersonaMoral} readOnly className="mt-1 w-4 h-4 accent-purple-500 pointer-events-none" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-purple-300 block mb-1">El que da el Poder es una EMPRESA (Persona Moral)</label>
                                <p className="text-[10px] text-purple-200/60 leading-tight">Si eres Empresa, el Notario invertirá horas revisando quien es tu Representante Legal (Acta Constitutiva y Protocolizaciones). Te cobrará derechos de certificación extracurriculares.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    <div className="glass-card p-8 rounded-2xl text-center shadow-lg border border-slate-700 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-black">
                        <p className="text-[10px] font-bold text-[var(--color-accent)] mb-1 uppercase tracking-widest">{resultado.nombrePoder}</p>
                        <p className="text-2xl text-white/70 mt-2 font-mono">
                            ${fmtMXN(resultado.rangoInferior)} <span className="opacity-50">a</span> ${fmtMXN(resultado.rangoSuperior)}
                        </p>
                        <div className="text-[10px] bg-[var(--color-accent)] text-black px-2 py-0.5 rounded-full inline-block font-bold mt-2">
                            PRECIO JUSTO DEL MERCADO CON IMPUESTOS
                        </div>
                    </div>

                    <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 space-y-3">
                        <span className="text-xs font-bold text-white/50 block mb-2 uppercase tracking-wide border-b border-white/10 pb-2">Desglose Paramétrico</span>
                        <div className="flex justify-between items-center text-[12px] text-white/80">
                            <span>Mano de Obra (Redacción, Papel Testimonio y Análisis Legal):</span>
                            <span className="font-mono">${fmtMXN(resultado.costoTarifado)}</span>
                        </div>
                        {esPersonaMoral && (
                            <div className="flex justify-between items-center text-[12px] text-purple-300">
                                <span>Certificación y Compulsa de Actas Corporativas (Representación Legal):</span>
                                <span className="font-mono">${fmtMXN(resultado.recargoPersonaMoral)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-[12px] text-white/60 pb-2 border-b border-white/10">
                            <span>16% IVA y Derechos de Archivo General de Notarías:</span>
                            <span className="font-mono">${fmtMXN(resultado.ivaGastos)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-[var(--color-accent)] font-bold pt-2">
                            <span>TOTAL CON DERECHOS A PAGAR AL ABOGADO/NOTARIA:</span>
                            <span className="font-mono">${fmtMXN(resultado.granTotal)}</span>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
