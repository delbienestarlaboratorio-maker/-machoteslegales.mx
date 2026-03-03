'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraCostosDivorcio() {
    const [tipoDivorcio, setTipoDivorcio] = useState<'mutuo' | 'incausado' | 'notarial' | 'contencioso'>('incausado')
    const [hijosMenores, setHijosMenores] = useState(false)
    const [bienes, setBienes] = useState(false)
    const [nivelDespacho, setNivelDespacho] = useState<'economico' | 'estandar' | 'premium'>('estandar')

    const resultado = useMemo(() => {
        let honorariosAbogado = 0
        let honorariosNotario = 0
        let derechosRegistroCivil = 0
        let gastosExtra = 0
        let mesesEstimados = 0

        // Tarifas base (Estimación de mercado actual en México)
        const tarifasAbogado = {
            mutuo: { economico: 8000, estandar: 15000, premium: 35000 },
            incausado: { economico: 12000, estandar: 20000, premium: 50000 },
            contencioso: { economico: 25000, estandar: 45000, premium: 100000 },
            notarial: { economico: 0, estandar: 0, premium: 0 } // No requiere abogado forzoso, es trámite directo.
        }

        const multiplicadorBienes = bienes ? 1.5 : 1 // Si hay bienes se complica la liquidación de sociedad conyugal
        const multiplicadorHijos = hijosMenores ? 1.3 : 1 // Alimentos, custodia y visitas

        if (tipoDivorcio === 'notarial') {
            honorariosNotario = nivelDespacho === 'premium' ? 12000 : (nivelDespacho === 'estandar' ? 8000 : 5000)
            derechosRegistroCivil = 1800 // Anotación marginal y acta nueva
            mesesEstimados = 1
        } else {
            honorariosAbogado = tarifasAbogado[tipoDivorcio][nivelDespacho] * multiplicadorBienes * multiplicadorHijos
            derechosRegistroCivil = 2500 // Copias certificadas, exhortos, y acta
            gastosExtra = 3000 // Notificadores, peritos médicos/psicológicos si hay hijos, copias, pasajes

            if (tipoDivorcio === 'mutuo') mesesEstimados = 2
            if (tipoDivorcio === 'incausado') mesesEstimados = 4
            if (tipoDivorcio === 'contencioso') mesesEstimados = 12
        }

        const totalEstimado = honorariosAbogado + honorariosNotario + derechosRegistroCivil + gastosExtra

        return {
            honorariosAbogado, honorariosNotario, derechosRegistroCivil, gastosExtra,
            totalEstimado, mesesEstimados,
            esInviable: tipoDivorcio === 'notarial' && (hijosMenores || bienes)
        }

    }, [tipoDivorcio, hijosMenores, bienes, nivelDespacho])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>💔</span><span>Derecho Familiar · Estimador</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora de <span className="gradient-gold">Costos de Divorcio</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Conoce un presupuesto aproximado de los honorarios legales, aranceles y gastos de juzgado para disolver el vínculo matrimonial.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Tipo de Divorcio</label>
                        <select value={tipoDivorcio} onChange={e => setTipoDivorcio(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="mutuo">Mutuo Acuerdo (Voluntario Juzgado)</option>
                            <option value="incausado">Incausado (Exprés / Unilateral)</option>
                            <option value="contencioso">Contencioso (Causal / Pleito duro)</option>
                            <option value="notarial">Notarial o Administrativo (Rápido)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Nivel de Despacho / Abogado</label>
                        <select value={nivelDespacho} onChange={e => setNivelDespacho(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                            <option value="economico">Económico / Abogado Independiente</option>
                            <option value="estandar">Estándar / Despacho Mediano</option>
                            <option value="premium">Premium / Firma de Prestigio</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5 w-full justify-center">
                            <input type="checkbox" checked={hijosMenores} onChange={e => setHijosMenores(e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs font-bold text-white">Hay hijos menores</span>
                        </label>
                    </div>
                    <div className="flex items-center">
                        <label className="flex gap-2 p-3 rounded-xl bg-white/5 cursor-pointer border border-white/5 w-full justify-center">
                            <input type="checkbox" checked={bienes} onChange={e => setBienes(e.target.checked)} className="w-4 h-4" />
                            <span className="text-xs font-bold text-white">Hay bienes a dividir</span>
                        </label>
                    </div>
                </div>
            </div>

            {resultado && resultado.esInviable && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center font-bold text-sm">
                    ❌ El Divorcio Administrativo o Notarial está PROHIBIDO por ley si existen hijos menores de edad o bienes en sociedad conyugal sin liquidar. Debes elegir la vía judicial (Mutuo Acuerdo o Incausado).
                </div>
            )}

            {resultado && !resultado.esInviable && (
                <div className="mt-8 glass-card p-6 rounded-2xl">
                    <div className="flex flex-col items-center mb-6">
                        <p className="text-sm text-white/50 font-bold mb-1">Costo Total Estimado</p>
                        <p className="text-5xl font-mono font-bold text-[var(--color-accent)]">${fmtMXN(resultado.totalEstimado)}</p>
                        <p className="text-xs text-white/40 mt-2">Tiempo estimado de resolución: {resultado.mesesEstimados} - {resultado.mesesEstimados + 3} meses</p>
                    </div>

                    <h2 className="text-white font-bold text-lg mb-4">Desglose de Gastos</h2>
                    <div className="space-y-2 text-sm">
                        {tipoDivorcio !== 'notarial' && (
                            <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <div>
                                    <span className="block text-white font-bold">Honorarios del Abogado</span>
                                    <span className="text-[10px] text-white/50">Redacción demanda, audiencias, seguimiento. {hijosMenores || bienes ? '(Incluye recargo por complejidad de convenio, alimentos y bienes)' : ''}</span>
                                </div>
                                <span className="font-mono text-white font-bold self-center">${fmtMXN(resultado.honorariosAbogado)}</span>
                            </div>
                        )}
                        {tipoDivorcio === 'notarial' && (
                            <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <div>
                                    <span className="block text-white font-bold">Honorarios Notario / Oficialía</span>
                                    <span className="text-[10px] text-white/50">Trámite directo en Notaría Pública.</span>
                                </div>
                                <span className="font-mono text-white font-bold self-center">${fmtMXN(resultado.honorariosNotario)}</span>
                            </div>
                        )}
                        <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div>
                                <span className="block text-white font-bold">Derechos Registro Civil</span>
                                <span className="text-[10px] text-white/50">Anotación marginal en acta de matrimonio y copias certificadas.</span>
                            </div>
                            <span className="font-mono text-white font-bold self-center">${fmtMXN(resultado.derechosRegistroCivil)}</span>
                        </div>
                        {resultado.gastosExtra > 0 && (
                            <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <div>
                                    <span className="block text-white font-bold">Gastos Operativos (Juzgado)</span>
                                    <span className="text-[10px] text-white/50">Propinas al actuario/notificador, viáticos, copias de traslado, oficios.</span>
                                </div>
                                <span className="font-mono text-white font-bold self-center">${fmtMXN(resultado.gastosExtra)}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <p className="text-xs text-orange-400 font-bold mb-1">💡 Alternativa Gratis de Machotes Legales</p>
                        <p className="text-xs text-white/70">Puedes <a href="/plantillas/familiar" className="text-[var(--color-accent)] underline">descargar nuestra demanda de Divorcio Incausado</a> e ingresarla tú mismo por oficialía de partes o solicitar los servicios de la **Defensoría Pública de Oficio** de tu estado si no cuentas con los recursos para pagar un abogado privado.</p>
                    </div>
                </div>
            )}
            <p className="text-[10px] text-white/30 text-center mt-6">Las sumas son una estimación de mercado 2026. Los honorarios son de libre configuración entre cliente y abogado (Art. 2606 CCF). En juicios muy largos los costos pueden triplicarse por amparos e incidentes.</p>
        </main>
    )
}
