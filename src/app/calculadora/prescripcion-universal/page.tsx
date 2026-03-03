import { Metadata } from 'next'
import CalculadoraPrescripcionUniversal from './CalculadoraPrescripcionUniversal'

export const metadata: Metadata = {
    title: 'Calculadora de Prescripción Legal (Universal)',
    description: '¿Tu derecho a demandar o tu deuda ya caducó? Calculadora de plazos de prescripción para Pagarés, Deudas Civiles, Delitos Penales, Fiscal y Laboral en México.',
    keywords: ['calculadora de prescripcion legal', 'cuando prescribe una deuda en mexico', 'prescripcion pagare mercantil', 'prescripcion delito penal', 'caducidad demanda laboral'],
    openGraph: { title: 'Calculadora Universal de Prescripción Legal', description: 'Descubre si una deuda judicial o delito ya prescribió (caducó) en México.', url: 'https://machoteslegales.mx/calculadora/prescripcion-universal' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/prescripcion-universal' },
}
export default function Page() { return <CalculadoraPrescripcionUniversal /> }
