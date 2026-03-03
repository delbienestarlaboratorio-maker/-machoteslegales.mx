import { Metadata } from 'next'
import CalculadoraHonorariosNotariales from './CalculadoraHonorariosNotariales'

export const metadata: Metadata = {
    title: 'Calculadora de Honorarios Notariales 2026 (Escrituras, Poderes y Testamentos)',
    description: 'Estima los honorarios notariales, impuestos (ISAI/ISR) y derechos registrales para escrituración de inmuebles, poderes y testamentos en México.',
    keywords: ['calculadora honorarios notariales', 'cuanto cobra un notario por escriturar', 'gastos notariales compraventa', 'costo poder notarial', 'costo testamento'],
    openGraph: { title: 'Calculadora de Honorarios Notariales (Escrituras)', description: 'Cotiza escrituras, poderes y testamentos según el arancel notarial.', url: 'https://machoteslegales.mx/calculadora/honorarios-notariales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/honorarios-notariales' },
}
export default function Page() { return <CalculadoraHonorariosNotariales /> }
