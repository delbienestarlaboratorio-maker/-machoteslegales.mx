import { Metadata } from 'next'
import CalculadoraDiasHabilesNaturales from './CalculadoraDiasHabilesNaturales'

export const metadata: Metadata = {
    title: 'Calculadora de Días Hábiles Judiciales a Naturales',
    description: 'Convierte plazos de días hábiles procesales a fechas reales o viceversa. Calcula cuándo vence tu término legal descontando sábados y domingos.',
    keywords: ['calculadora dias habiles', 'sumar dias habiles', 'plazo procesal calculadora', 'dias habiles a naturales', 'fecha vencimiento juzgado'],
    openGraph: { title: 'Cómputo de Plazos y Días Hábiles Judiciales', description: 'Introduce los días que te dio el Juez y descubre exactamente qué día del calendario cae tu vencimiento procesal.', url: 'https://machoteslegales.mx/calculadora/dias-habiles-naturales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/dias-habiles-naturales' },
}
export default function Page() { return <CalculadoraDiasHabilesNaturales /> }
