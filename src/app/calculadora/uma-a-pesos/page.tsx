import { Metadata } from 'next'
import CalculadoraUMA from './CalculadoraUMA'

export const metadata: Metadata = {
    title: 'Convertidor UMA a Pesos México 2026 — Multas, Fianzas, Montos Legales',
    description:
        'Convierte UMAs a pesos mexicanos 2026. UMA diaria $113.14, mensual $3,439.46, anual $41,273.52. Para multas, fianzas, pensiones y montos legales.',
    keywords: [
        'UMA a pesos 2026', 'valor UMA 2026', 'convertidor UMA pesos México',
        'UMA diaria mensual anual', 'multas en UMAs a pesos', 'fianza en UMAs',
        'unidad de medida y actualización 2026',
    ],
    openGraph: {
        title: 'Convertidor UMA a Pesos México 2026',
        description: 'UMA 2026: $113.14 diaria. Convierte multas, fianzas y montos legales.',
        url: 'https://machoteslegales.mx/calculadora/uma-a-pesos',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/uma-a-pesos' },
}

export default function Page() {
    return <CalculadoraUMA />
}
