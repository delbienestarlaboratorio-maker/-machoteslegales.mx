import { Metadata } from 'next'
import CalculadoraIndemnizacionMuerteLaboral from './CalculadoraIndemnizacionMuerteLaboral'

export const metadata: Metadata = {
    title: 'Calculadora Indemnización por Riesgo de Trabajo y Muerte Laboral',
    description: 'Calcula lo que marca la Ley Federal del Trabajo (Art 500 y 514) para indemnizaciones por riesgo de trabajo, pérdida de miembros o fallecimiento del trabajador.',
    keywords: ['indemnizacion muerte laboral', 'calculadora riesgo de trabajo LFT', 'cuanto pagan por perder un dedo', 'indemnizacion art 500 lft'],
    openGraph: { title: 'Calculadora Indemnización Riesgo de Trabajo / Muerte LFT', description: 'Simula la cantidad a pagar por 5000 días (Muerte) o la tabla de valuación de incapacidades parciales.', url: 'https://machoteslegales.mx/calculadora/indemnizacion-muerte-laboral' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/indemnizacion-muerte-laboral' },
}
export default function Page() { return <CalculadoraIndemnizacionMuerteLaboral /> }
