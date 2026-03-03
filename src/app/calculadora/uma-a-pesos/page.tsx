import { Metadata } from 'next'
import CalculadoraUMA from './CalculadoraUMA'

export const metadata: Metadata = {
    title: 'Calculadora de Conversión UMA a Pesos (Unidad de Medida y Actualización)',
    description: 'Convierte fácil y rápido de UMAs a Pesos Mexicanos (o viceversa) con el valor oficial actualizado a 2026. Útil para pagar fianzas, multas y obligaciones.',
    keywords: ['uma a pesos', 'valor uma 2026', 'cuanto vale una uma', 'calculadora uma', 'conversion uma pesos mexicanos', 'uma diaria mensual anual'],
    openGraph: { title: 'Conversor Oficial UMA a Pesos Mexicanos', description: 'Introduce la cantidad de UMAs de tu multa o sanción y descubre a cuánto equivale en pesos reales al día de hoy.', url: 'https://machoteslegales.mx/calculadora/uma-a-pesos' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/uma-a-pesos' },
}
export default function Page() { return <CalculadoraUMA /> }
