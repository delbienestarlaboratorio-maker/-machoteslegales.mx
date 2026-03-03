import { Metadata } from 'next'
import CalculadoraDanoMoral from './CalculadoraDanoMoral'

export const metadata: Metadata = {
    title: 'Calculadora de Estimación de Daño Moral 2026 (Art. 1916 CC)',
    description: 'Simulador jurídico de indemnización por daño moral en México. Calcula un parámetro económico según ingresos, gravedad del daño y criterios de la Suprema Corte.',
    keywords: ['calculadora daño moral mexico', 'indemnizacion daño moral', 'cuanto puedo cobrar por daño moral', 'art 1916 codigo civil', 'reparacion daño psicologico'],
    openGraph: { title: 'Calculadora y Estimador de Daño Moral (México)', description: 'Simula tabuladores jurisprudenciales para indemnizar afectaciones a sentimientos, honor y reputación.', url: 'https://machoteslegales.mx/calculadora/dano-moral' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/dano-moral' },
}
export default function Page() { return <CalculadoraDanoMoral /> }
