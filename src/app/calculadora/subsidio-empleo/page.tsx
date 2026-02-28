import { Metadata } from 'next'
import CalculadoraSubsidioEmpleo from './CalculadoraSubsidioEmpleo'

export const metadata: Metadata = {
    title: 'Calculadora Subsidio para el Empleo México 2026 — Art. 113 LISR | Trabajadores Bajos Salarios',
    description: 'Calcula el subsidio para el empleo de tus trabajadores en México 2026. Si el subsidio supera el ISR, el patrón paga la diferencia. Art. 113 LISR Tabla.',
    keywords: ['calculadora subsidio para el empleo 2026', 'Art 113 LISR subsidio empleo', 'subsidio empleo vs ISR', 'subsidio nómina trabajadores', 'subsidio patrón paga diferencia ISR'],
    openGraph: { title: 'Calculadora Subsidio para el Empleo 2026', description: 'Determina si el subsidio cubre el ISR del trabajador o si el patrón debe cubrir la diferencia.', url: 'https://machoteslegales.mx/calculadora/subsidio-empleo' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/subsidio-empleo' },
}
export default function Page() { return <CalculadoraSubsidioEmpleo /> }
