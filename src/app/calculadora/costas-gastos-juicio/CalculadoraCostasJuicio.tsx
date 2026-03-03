'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

export default function CalculadoraCostasJuicio() {
    const [suertePrincipal, setSuertePrincipal] = useState('500000') // Deuda base sentenciada
    const [materia, setMateria] = useState<'mercantil' | 'civil' | 'laboral' | 'familiar'>('mercantil')
    const [dobleInstancia, setDobleInstancia] = useState(false) // Perdió en 1ra y en 2da instancia (Art 1084)

    const resultado = useMemo(() => {
        const principal = parseFloat(suertePrincipal) || 0
        let porcentajeAplicable = 0
        let esCondenable = true
        let fundacionLey = ''
        let extraNotas = ''

        // Reglas generales Arancelarias y Códigos (Mercantil, Civil Federal, Entidades)
        if (materia === 'mercantil') {
            // Art 1084 del Código de Comercio (Quien pierde dos sentencias paga costas y el que actúe de mala fe). 
            // Y conforme a aranceles locales de abogados, se estila fijar la condena por default entre 6%, 8% o 10% del negocio (primera instancia) o 10-12% (segunda instancia).
            fundacionLey = 'Art. 1084 Código de Comercio y Aranceles Locales'
            if (dobleInstancia) {
                porcentajeAplicable = 12 // Se agravan 
                extraNotas = 'Condena Obligatoria (Fracción IV): Perdiste y te sentenciaron en el Juzgado y luego fuiste a apelar a una Sala y volviste a perder. Es forzoso pagarle a tu rival su desgaste.'
            } else {
                porcentajeAplicable = 8 // Media nacional para 1ra instancia
                extraNotas = 'Condena Subjetiva (Temeridad / Mala Fe): En litigios de una sola etapa donde te negaste a pagar cínicamente, el Juez condena las costas (aprox 8% de lo peleado).'
            }
        } else if (materia === 'civil') {
            fundacionLey = 'Código de Procedimientos Civiles Local'
            if (dobleInstancia) {
                porcentajeAplicable = 10
                extraNotas = 'Se condena en costas por ambas instancias perdidas bajo presunción legal de agotamiento procedimental abusivo.'
            } else {
                porcentajeAplicable = 6
                extraNotas = 'Suele castigarse sólo bajo el criterio de mala fe procesal o por regla tasada del código estatal donde se emita la sentencia.'
            }
        } else if (materia === 'familiar') {
            esCondenable = false // SCJN prohíbe costas
            porcentajeAplicable = 0
            fundacionLey = 'Jurisprudencia de la SCJN (Materia Familiar)'
            extraNotas = '🚫 En juicios de Divorcio, Alimentos o Custodia NO PROCEDE LA CONDENA EN COSTAS, ya que esto entorpecería el acceso a la justicia al tratarse de núcleos vulnerables y valores no netamente patrimoniales.'
        } else if (materia === 'laboral') {
            esCondenable = false // LFT no tiene costas como en lo civil
            porcentajeAplicable = 0
            fundacionLey = 'Ley Federal del Trabajo (Inexistencia Analógica)'
            extraNotas = '🚫 En la jurisdicción laboral mexicana NO se condena en costas al trabajador perdedor ni al patrón (salvo multas por amparos dilatorios). Cada quién asume la carga de su defensor.'
        }

        const montoCostas = principal * (porcentajeAplicable / 100)
        const granTotalSentenciado = principal + montoCostas

        return {
            principal,
            porcentajeAplicable,
            montoCostas,
            esCondenable,
            fundacionLey,
            extraNotas,
            granTotalSentenciado
        }

    }, [suertePrincipal, materia, dobleInstancia])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏛️</span><span>Ejecución de Sentencias y Liquidación</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Condena en Costas</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    Si pierdes un juicio litigando de mala fe, el Juez no solo te ordenará pagar la deuda original, sino que te sumará las "Costas", castigándote para reembolsar los honorarios del Abogado que contrató tu rival.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs uppercase text-[var(--color-text-muted)] mb-1.5 font-bold">Monto del Litigio (Suerte Principal Condenada)</label>
                        <input type="number" value={suertePrincipal} onChange={e => setSuertePrincipal(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-3xl focus:border-[var(--color-accent)] outline-none" />
                        <p className="text-[10px] text-white/50 mt-1">Suele excluirse el pago de Intereses previos para sacar la base del cálculo de esta pura multa procesal.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase text-[var(--color-text-muted)] font-bold mb-1.5">Materia del Juicio Originario</label>
                            <select value={materia} onChange={e => setMateria(e.target.value as any)}
                                className="w-full p-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none">
                                <option value="mercantil">Mercantil (Pagarés, Contratos de Empresas)</option>
                                <option value="civil">Civil (Arrendamientos, Deudas Civiles, Hipotecas)</option>
                                <option value="familiar">Familiar (Divorcios, Pensión Alimenticia)</option>
                                <option value="laboral">Laboral (Despidos Injustificados, Huelgas)</option>
                            </select>
                        </div>

                        <div className={`p-3 rounded-xl border transition-all cursor-pointer ${dobleInstancia ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/10'} ${!['mercantil', 'civil'].includes(materia) ? 'opacity-30 pointer-events-none' : ''}`} onClick={() => setDobleInstancia(!dobleInstancia)}>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={dobleInstancia} readOnly className="w-4 h-4 accent-red-500" />
                                <span className={`text-sm font-bold ${dobleInstancia ? 'text-red-300' : 'text-white/70'}`}>Condena en Ambas Instancias (2 Rondas)</span>
                            </div>
                            <p className="text-[9px] text-white/40 mt-1 pl-6 line-clamp-2">Activa esto si la contraparte ganó el juicio inicial, apelaste a segunda instancia y volviste a perder fulminantemente (Art 1084 Fracc IV).</p>
                        </div>
                    </div>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 mx-auto max-w-3xl space-y-4 animate-fade-in">

                    {!resultado.esCondenable ? (
                        <div className="glass-card p-6 rounded-2xl text-center border-2 border-green-500/30 bg-green-900/10">
                            <p className="text-4xl form-mono mb-2">🚫</p>
                            <p className="text-xl font-bold text-green-400 capitalize mb-1">Costas Inaplicables en Materia {materia}</p>
                            <p className="text-xs text-green-200/80 mt-2 px-4 shadow-inner">
                                {resultado.extraNotas}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className={`glass-card p-6 rounded-2xl text-center border-2 border-red-500/30 bg-red-900/10`}>
                                <p className="text-[10px] font-bold text-red-500 mb-1 uppercase tracking-widest flex justify-center items-center gap-2">
                                    Adicional por Conceptos de Costas ({resultado.porcentajeAplicable}% Estimado)
                                </p>
                                <p className={`text-5xl font-mono font-bold my-2 text-red-400`}>
                                    +${fmtMXN(resultado.montoCostas)}
                                </p>
                                <div className="mt-2 text-[10px] text-red-200/60 font-mono">
                                    Sanción que absorberá para reembolsar los gastos de la contraparte.
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-2xl text-center custom-pattern bg-[url('/grid.svg')] border border-[var(--color-accent)]/20 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-accent)]/10 blur-xl rounded-full"></div>
                                <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-widest relative z-10">Monto Finalizado de Ejecución Forzosa</p>
                                <p className="text-3xl font-mono text-[var(--color-accent)] mt-2 font-bold relative z-10">
                                    ${fmtMXN(resultado.granTotalSentenciado)}
                                </p>
                                <div className="mt-2 text-[10px] text-white/40 border-t border-white/10 pt-2 break-words relative z-10">
                                    (Deuda Base ${fmtMXN(resultado.principal)}) + (Condena Extra de Costas ${fmtMXN(resultado.montoCostas)}). Con fundamento en {resultado.fundacionLey}.
                                </div>
                            </div>
                        </div>
                    )}

                    {resultado.esCondenable && (
                        <div className="bg-[#0f172a] p-5 rounded-xl border border-white/5 text-center mt-4">
                            <span className="text-xs font-bold text-purple-400 block mb-2 uppercase tracking-wide">La Regla Implacable de la Doble Sentencia</span>
                            <p className="text-[11px] text-white/70 italic leading-relaxed">
                                {resultado.extraNotas}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}
