'use client'
import { useState, useMemo } from 'react'
import { fmtMXN, getUMA } from '@/data/legal-constants'

const RANGOS_AMBIENTALES = [
    { id: 'leve', nombre: 'Infracción Menor / Administrativa', min: 30, max: 1000, desc: 'Falta de reportes técnicos, omisiones de papeleo u avisos a dependencias sin desastre ecológico materializado.' },
    { id: 'flora_fauna', nombre: 'Afectación a Flora/Fauna Protegida', min: 50, max: 50000, desc: 'Tala clandestina de árboles protegidos, comercio ilegal de especies de la NOM-059, caza.' },
    { id: 'residuos_peligrosos', nombre: 'Mal Manejo de Residuos Peligrosos', min: 300, max: 50000, desc: 'Tirar fluidos tóxicos al drenaje, descargas sin planta de tratamiento, desastre químico (PROFEPA).' },
    { id: 'impacto_ambiental', nombre: 'Obra Sin Licencia de Impacto (MIA)', min: 100, max: 50000, desc: 'Construir hoteles, fraccionamientos o naves industriales sin Resolutivo de Impacto Ambiental Federal.' }
]

export default function CalculadoraMultaAmbiental() {
    const [tipoMulta, setTipoMulta] = useState(RANGOS_AMBIENTALES[3].id)
    const [agravanteReincidencia, setAgravanteReincidencia] = useState(false)
    const [clausuraTemporal, setClausuraTemporal] = useState(false)

    const resultado = useMemo(() => {
        const umasHoy = getUMA(2026).diaria
        const categoria = RANGOS_AMBIENTALES.find(r => r.id === tipoMulta)!

        let sumaMinUmas = categoria.min
        let sumaMaxUmas = categoria.max

        // Art. 171 LGEEPA - Sanciones Generales. La reincidencia (Art 173 LGEEPA) puede DUPLICAR el monto de la infracción originalmente señalada.
        if (agravanteReincidencia) {
            sumaMinUmas *= 2
            sumaMaxUmas *= 2
            // Ocasionalmente las leyes limitan la multa agravada máxima a 100,000 UMAs (limite superior). Nos quedamos con el doble directo.
            if (sumaMaxUmas > 100000) sumaMaxUmas = 100000
        }

        const mnxtMin = sumaMinUmas * umasHoy
        const mnxtMax = sumaMaxUmas * umasHoy

        return {
            ...categoria,
            sumaMinUmas,
            sumaMaxUmas,
            mnxtMin,
            mnxtMax,
            umasHoy,
            anioUso: 2026
        }

    }, [tipoMulta, agravanteReincidencia, clausuraTemporal])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🌿</span><span>Derecho Ecológico y LGEEPA (PROFEPA)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Simulador de <span className="gradient-gold">Multas Ambientales</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    México es el país con los peores correctivos y multas más castigadoras a la industria por temas de contaminación y biodiversidad. Convierta su acta de inspección en costo real.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-1/2 overflow-y-auto max-h-[500px] pr-2 space-y-2 custom-scrollbar">
                    <label className="block text-xs uppercase tracking-widest text-[var(--color-accent)] mb-3 font-bold sticky top-0 bg-[#020817] py-2 z-10">
                        Ramas Sancionatorias Federales (Art 171 LGEEPA)
                    </label>
                    {RANGOS_AMBIENTALES.map(d => (
                        <div key={d.id} onClick={() => setTipoMulta(d.id)}
                            className={`p-3 rounded-xl cursor-pointer border transition-all text-sm group
                                ${tipoMulta === d.id ? 'bg-green-500/20 border-green-500 backdrop-blur-sm' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                            <div className={`font-bold ${tipoMulta === d.id ? 'text-green-400' : 'text-white'}`}>{d.nombre}</div>
                            <div className={`text-[10px] ${tipoMulta === d.id ? 'text-green-200/80' : 'text-white/50'} mt-1`}>{d.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/2 flex flex-col space-y-6">
                    <div className="glass-card p-6 rounded-2xl text-center shadow-lg border-2 border-green-500/30 bg-gradient-to-t from-green-900/40 to-black">
                        <p className="text-[10px] font-bold text-green-300 mb-1 uppercase tracking-widest">Espectro Punible Pecuniario</p>
                        <h2 className="text-sm text-white mb-4 line-clamp-1">{resultado.nombre}</h2>

                        <div className="flex flex-col items-center justify-center gap-2 my-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/50 uppercase w-12 text-right">MIN</span>
                                <span className="text-3xl font-mono font-bold text-white">${fmtMXN(resultado.mnxtMin)}</span>
                            </div>
                            <div className="w-full h-px bg-white/10 my-1"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-green-400/80 font-bold uppercase w-12 text-right">MAX TOPE</span>
                                <span className="text-4xl font-mono font-bold text-green-400">${fmtMXN(resultado.mnxtMax)}</span>
                            </div>
                        </div>

                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded border border-white/10 text-[10px] text-white/60 font-mono">
                            Rango Base UMA: <b>{resultado.sumaMinUmas} a {resultado.sumaMaxUmas.toLocaleString()}</b> Días UMA.
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] uppercase tracking-widest text-[var(--color-accent)] mb-1 font-bold">Filtros Jurisdiccionales de Acta de Inspección</label>

                        <div className="flex items-start gap-3 p-3 rounded-lg border border-red-500/20 bg-red-500/5 transition-colors cursor-pointer" onClick={() => setAgravanteReincidencia(!agravanteReincidencia)}>
                            <input type="checkbox" checked={agravanteReincidencia} readOnly className="mt-1 w-5 h-5 accent-red-500 cursor-pointer pointer-events-none" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-red-300 block mb-1">Empresa Infractora Reincidente</label>
                                <p className="text-[10px] text-red-200/60 leading-tight">Si profepa te atrapa por el MISMO concepto en los últimos 2 años, tiene facultad para sancionarte al doble del máximo permitido por la LGEEPA.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5 transition-colors cursor-pointer" onClick={() => setClausuraTemporal(!clausuraTemporal)}>
                            <input type="checkbox" checked={clausuraTemporal} readOnly className="mt-1 w-5 h-5 accent-orange-500 cursor-pointer pointer-events-none" />
                            <div className="flex-1">
                                <label className="text-sm font-bold text-orange-300 block mb-1">Clausura y Decomiso Simultanéo</label>
                                <p className="text-[10px] text-orange-200/60 leading-tight">Adicional a la mega-multa, proceden los enormes "Sellos de Prohibición" sobre la maquinaria y paralización de actividades madereras o productivas. No hay dinero que compense el Cierre Legal de Operaciones.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}
