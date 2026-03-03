import { Metadata } from 'next'
import CalculadoraCreditoHipotecario from './CalculadoraCreditoHipotecario'

export const metadata: Metadata = {
    title: 'Calculadora de Crédito Hipotecario (Tabla de Amortización Mensual)',
    description: 'Simulador de préstamos hipotecarios. Calcula la mensualidad exacta de tu casa, capital vs intereses, plazo y enganche. Basado en tasas bancarias en México.',
    keywords: ['calculadora credito hipotecario', 'simulador de hipoteca', 'tabla amortizacion credito casa', 'cuanto pago de hipoteca', 'prestamo bancario casa'],
    openGraph: { title: 'Simulador y Calculadora de Crédito Hipotecario', description: 'Calcula mensualidades fijas y tabla de amortización para comprar casa.', url: 'https://machoteslegales.mx/calculadora/credito-hipotecario' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/credito-hipotecario' },
}
export default function Page() { return <CalculadoraCreditoHipotecario /> }
