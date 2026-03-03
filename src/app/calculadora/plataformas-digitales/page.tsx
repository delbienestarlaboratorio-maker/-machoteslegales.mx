import { Metadata } from 'next'
import CalculadoraPlataformasDigitales from './CalculadoraPlataformasDigitales'

export const metadata: Metadata = {
    title: 'Calculadora Retenciones Plataformas Digitales 2026 (ISR e IVA)',
    description: 'Calcula las retenciones de ISR (Uber 2.1%, Airbnb 4%, MercadoLibre 1%) e IVA (8%) para ingresos mediante plataformas tecnológicas (Art. 113-A LISR).',
    keywords: ['calculadora retencion plataformas digitales', 'ISR Uber Airbnb MercadoLibre', 'Art 113-A LISR', 'retencion IVA plataformas', 'impuestos plataformas tecnologicas mexico'],
    openGraph: { title: 'Calculadora de Impuestos Plataformas Digitales', description: 'Cálculo de retenciones ISR e IVA por ingresos en apps como Uber, DiDi, Airbnb o Amazon.', url: 'https://machoteslegales.mx/calculadora/plataformas-digitales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/plataformas-digitales' },
}
export default function Page() { return <CalculadoraPlataformasDigitales /> }
