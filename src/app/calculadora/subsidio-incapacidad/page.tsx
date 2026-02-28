import { Metadata } from 'next'
import CalculadoraSubsidioIncapacidad from './CalculadoraSubsidioIncapacidad'

export const metadata: Metadata = {
    title: 'Calculadora Subsidio Incapacidad IMSS 2026 — Art. 98-101 LSS | Días y Monto',
    description: 'Calcula el subsidio por incapacidad temporal que paga el IMSS: 60% del SDI del día 4 al 26, 70% del día 27 en adelante. Art. 98-101 Ley del Seguro Social.',
    keywords: ['subsidio incapacidad IMSS 2026', 'cuanto paga IMSS por incapacidad', 'Art 98 LSS subsidio incapacidad temporal', 'calcula dias incapacidad IMSS', 'porcentaje subsidio incapacidad seguro social'],
    openGraph: { title: 'Calculadora Subsidio por Incapacidad IMSS 2026', description: '60% SDI días 4-26, 70% SDI día 27+. Art. 98-101 LSS.', url: 'https://machoteslegales.mx/calculadora/subsidio-incapacidad' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/subsidio-incapacidad' },
}
export default function Page() { return <CalculadoraSubsidioIncapacidad /> }
