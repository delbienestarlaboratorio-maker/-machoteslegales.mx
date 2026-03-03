import { Metadata } from 'next'
import CalculadoraISN from './CalculadoraISN'

export const metadata: Metadata = {
    title: 'Calculadora Impuesto Sobre Nómina (ISN) 2026 Estado x Estado',
    description: 'Calcula el Impuesto Sobre Nómina (ISN) que pagan las empresas por estado en México (CDMX 3%, Edomex 3%, Nuevo León 3%, etc.). Conoce tu carga fiscal patronal.',
    keywords: ['calculadora ISN 2026', 'impuesto sobre nomina estados mexico', 'ISN CDMX 3%', 'ISN Estado de Mexico', 'carga fiscal nomina mexico'],
    openGraph: { title: 'Calculadora Impuesto Sobre Nómina (ISN)', description: 'Calculadora de ISN por estados en México para nómina empresarial.', url: 'https://machoteslegales.mx/calculadora/impuesto-sobre-nomina' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/impuesto-sobre-nomina' },
}
export default function Page() { return <CalculadoraISN /> }
