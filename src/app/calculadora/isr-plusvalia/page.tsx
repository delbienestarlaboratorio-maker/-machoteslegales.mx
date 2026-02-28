import { Metadata } from 'next'
import CalculadoraPlusvaliaISR from './CalculadoraPlusvaliaISR'

export const metadata: Metadata = {
    title: 'Calculadora ISR por Venta de Inmueble (Plusvalía) México 2026 | Arts. 119-128 LISR',
    description:
        'Calcula el ISR por venta de casa, departamento o terreno en México 2026. Exención hasta 700,000 UDIS por vivienda habitual. Deducción ciega 20%. Arts. 119-128 LISR.',
    keywords: [
        'ISR venta inmueble México', 'plusvalía ISR', 'impuesto venta casa', 'exención 700000 UDIS',
        'calculadora ISR venta propiedad', 'Art 119 LISR', 'pago provisional notario',
    ],
    openGraph: {
        title: 'Calculadora ISR Plusvalía México 2026',
        description: 'ISR por venta de inmueble. Exención para vivienda habitual 700K UDIS.',
        url: 'https://machoteslegales.mx/calculadora/isr-plusvalia',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-plusvalia' },
}
export default function Page() { return <CalculadoraPlusvaliaISR /> }
