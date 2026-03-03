'use client'
import { useState, useMemo } from 'react'
import { fmtMXN } from '@/data/legal-constants'

const TASAS_ESTADOS: Record<string, number> = {
    'CDMX / Ciudad de México': 3.0,
    'Estado de México': 3.0,
    'Jalisco': 3.0, // Subió escalonado a 3%
    'Nuevo León': 3.0,
    'Yucatán': 3.0,
    'Quintana Roo': 3.0,
    'Querétaro': 3.0, // 3%
    'Chihuahua': 3.0, // Con fideicomisos subió al 4% en algunos rangos, tomaremos tasa base 3% para calc simplificado
    'Guanajuato': 3.0, // Subió a 3% recientemente
    'Puebla': 3.0,
    'Baja California': 4.25, // Tiene sobretasas de educación sumadas
    'Sonora': 3.0,
    'Coahuila': 3.0,
    'Veracruz': 3.0,
    'Sinaloa': 3.0,
    'Oaxaca': 3.0,
    'Otro (2.5%)': 2.5,
    'Otro (2.0%)': 2.0,
}

export default function CalculadoraISN() {
    const [nominaMensual, setNominaMensual] = useState('500000')
    const [estado, setEstado] = useState('CDMX / Ciudad de México')

    const resultado = useMemo(() => {
        const nomina = parseFloat(nominaMensual) || 0
        const pct = TASAS_ESTADOS[estado] || 3.0
        const isn = nomina * (pct / 100)

        return { nomina, pct, isn, anual: isn * 12 }
    }, [nominaMensual, estado])

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>🏢</span><span>Impuesto Estatal · ISN</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                    Calculadora <span className="gradient-gold">Impuesto Sobre Nómina (ISN)</span>
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl mx-auto">
                    El ISN es un gravamen estatal que paga el **patrón** sobre las remuneraciones a sus trabajadores. La tasa varía por estado y Códigos Financieros Locales.
                </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4 max-w-xl mx-auto">
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Total de tu nómina mensual bruta ($)</label>
                    <input type="number" value={nominaMensual} onChange={e => setNominaMensual(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-mono focus:border-[var(--color-accent)] focus:outline-none" />
                </div>
                <div>
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1.5 font-semibold">Estado de la República</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[var(--color-accent)] focus:outline-none">
                        {Object.entries(TASAS_ESTADOS).map(([k, v]) => <option key={k} value={k}>{k} (Tasa: {v}%)</option>)}
                    </select>
                </div>
            </div>

            {resultado && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                    <div className="p-6 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-center">
                        <p className="text-xs text-[var(--color-accent)] font-bold mb-2">ISN A Pagar (Mensual)</p>
                        <p className="text-4xl font-mono font-bold text-white">${fmtMXN(resultado.isn)}</p>
                        <p className="text-[10px] text-white/50 mt-2">Corresponde al {resultado.pct}% sobre ${resultado.nomina}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-xs text-white/50 font-bold mb-2">Proyección Anualizada (x 12)</p>
                        <p className="text-3xl font-mono font-bold text-white/80">${fmtMXN(resultado.anual)}</p>
                        <p className="text-[10px] text-white/30 mt-3">Gasto hundido no recuperable para la empresa.</p>
                    </div>
                </div>
            )}
            <p className="text-[10px] text-center text-white/20 mt-8">Nota: Algunas entidades tienen sobretasas (Educación, Fideicomisos). Tasa base mostrada. El ISN es deducible de ISR para personas morales.</p>
        </main>
    )
}
