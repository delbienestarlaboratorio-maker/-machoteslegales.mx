import { Metadata } from 'next'
import CalculadoraPrescripcionFiscal from './CalculadoraPrescripcionFiscal'

export const metadata: Metadata = {
    title: 'Calculadora de Prescripción de Créditos Fiscales (SAT / IMSS)',
    description: 'Descubre en qué fecha legal exacta prescribe y se cancela por ley una deuda al SAT, IMSS o finanzas estatales (Regla de los 5 años).',
    keywords: ['prescripcion fiscal calculadora', 'cuando caduca deuda sat', 'prescripcion creditos fiscales', 'art 146 cff', 'fecha prescripcion sat'],
    openGraph: { title: '¿Cuándo Prescribe una Deuda Fiscal en México?', description: 'Calculadora basada en el Art. 146 del CFF para estimar la prescripción y extinción de créditos de autoridades fiscales.', url: 'https://machoteslegales.mx/calculadora/prescripcion-creditos-fiscales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/prescripcion-creditos-fiscales' },
}
export default function Page() { return <CalculadoraPrescripcionFiscal /> }
