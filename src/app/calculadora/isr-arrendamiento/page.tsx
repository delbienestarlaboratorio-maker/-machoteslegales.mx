import { Metadata } from 'next'
import CalculadoraISRRenta from './CalculadoraISRRenta'

export const metadata: Metadata = {
    title: 'Calculadora ISR por Renta de Inmuebles México 2026 — ¿Cuánto Pago? | Art. 114-118 LISR',
    description:
        'Calcula el ISR por arrendamiento de inmuebles en México 2026. Deducción ciega 35% vs deducciones reales. Pago provisional mensual. Art. 114-118 LISR.',
    keywords: [
        'ISR renta inmueble México 2026', 'impuesto arrendamiento', 'deducción ciega 35%',
        'calculadora ISR renta', 'pago provisional arrendamiento', 'Art 114 LISR',
    ],
    openGraph: {
        title: 'Calculadora ISR Renta Inmuebles México 2026',
        description: 'Calcula tu ISR mensual por arrendamiento. Deducción ciega 35% o deducciones autorizadas.',
        url: 'https://machoteslegales.mx/calculadora/isr-arrendamiento',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-arrendamiento' },
}
export default function Page() { return <CalculadoraISRRenta /> }
