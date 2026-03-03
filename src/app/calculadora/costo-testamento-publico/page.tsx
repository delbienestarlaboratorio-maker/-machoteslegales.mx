import { Metadata } from 'next'
import CalculadoraTestamento from './CalculadoraTestamento'

export const metadata: Metadata = {
    title: 'Cotizador de Testamento Público Abierto ante Notario',
    description: 'Calcula el tabulador arancelario promedio por dictar tus bienes a herederos de forma legal ante un fedatario. Evalúa la promoción de Septiembre.',
    keywords: ['costo testamento mexico', 'cuanto cobra notario por testamento', 'mes del testamento precio', 'escribir testamento honorarios', 'testamento publico abierto cdmx'],
    openGraph: { title: 'Honorarios Notariales por Heredar (Testamento Público)', description: 'Descubre el gasto promedio real que cobrará una Notaría por sentar y blindar jurada tu última voluntad. Incluye calculadora del mes patrio.', url: 'https://machoteslegales.mx/calculadora/costo-testamento-publico' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costo-testamento-publico' },
}
export default function Page() { return <CalculadoraTestamento /> }
