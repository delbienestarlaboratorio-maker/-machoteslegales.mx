import { Metadata } from 'next'
import CalculadoraSueldoNetoBruto from './CalculadoraSueldoNetoBruto'

export const metadata: Metadata = {
    title: 'Calculadora Sueldo Neto a Bruto (Ingeniería Inversa IMSS / LISR 2026)',
    description: 'Transforma el salario mensual que quieres ganar (Neto Libre) a Salario Bruto Patronal. Calculamos al revés ISR, Cuotas IMSS Obreros y Subsidio para encontrar el bruto exacto.',
    keywords: ['calculadora sueldo neto a bruto 2026', 'ingenieria inversa salario neto', 'cuanto debo pedir de sueldo bruto', 'calcular sueldo bruto desde neto', 'subsidio e ISR inverso'],
    openGraph: { title: 'Calculadora Sueldo Neto a Bruto', description: 'De lo que te depositan en tarjeta a lo que debe decir tu contrato.', url: 'https://machoteslegales.mx/calculadora/sueldo-neto-bruto' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/sueldo-neto-bruto' },
}
export default function Page() { return <CalculadoraSueldoNetoBruto /> }
