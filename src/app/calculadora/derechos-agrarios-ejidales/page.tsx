import { Metadata } from 'next'
import CalculadoraIndemnizacionAgraria from './CalculadoraIndemnizacionAgraria'

export const metadata: Metadata = {
    title: 'Indemnización de Tierras y Derechos Agrarios (Expropiación Ejidal)',
    description: 'Calcula el valor comercial estimado para la expropiación o cesión de derechos parcelarios y agrarios según los lineamientos del INDAABIN.',
    keywords: ['derecho agrario calculadora', 'expropiacion ejidal pago', 'cuanto pagan por expropiar ejido', 'cesion derechos parcelarios precio', 'indaabin valuacion agraria'],
    openGraph: { title: 'Valuador de Tierras Ejidales (Derecho Agrario)', description: 'Conoce los parámetros legales bajo los que procede y se paga la ocupación y expropiación de tierras agrarias y parcelas en México.', url: 'https://machoteslegales.mx/calculadora/derechos-agrarios-ejidales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/derechos-agrarios-ejidales' },
}
export default function Page() { return <CalculadoraIndemnizacionAgraria /> }
