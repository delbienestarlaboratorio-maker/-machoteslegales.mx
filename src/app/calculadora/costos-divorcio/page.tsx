import { Metadata } from 'next'
import CalculadoraCostosDivorcio from './CalculadoraCostosDivorcio'

export const metadata: Metadata = {
    title: 'Calculadora de Costos de Divorcio 2026 (Honorarios y Trámites)',
    description: 'Estima cuánto cuesta un divorcio en México. Calcula honorarios de abogados, gastos de juzgado, actas y copias certificadas según el tipo de divorcio (Mutuo acuerdo, incausado, notarial).',
    keywords: ['cuanto cuesta un divorcio en mexico 2026', 'calculadora costo divorcio', 'honorarios abogado divorcio', 'divorcio incausado precio', 'divorcio notarial costo'],
    openGraph: { title: 'Calculadora de Costos de Divorcio', description: 'Cotiza los gastos legales y notariales para divorciarte en México.', url: 'https://machoteslegales.mx/calculadora/costos-divorcio' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costos-divorcio' },
}
export default function Page() { return <CalculadoraCostosDivorcio /> }
