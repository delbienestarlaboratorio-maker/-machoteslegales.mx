import { Metadata } from 'next'
import CalculadoraMultaTransito from './CalculadoraMultaTransito'

export const metadata: Metadata = {
    title: 'Calculadora de Multas de Tránsito en UMAs (Reglamento Vial)',
    description: 'Calcula el costo en pesos de las multas de tránsito más comunes (alcoholímetro, pasarse un alto, exceso de velocidad) tasadas en Unidades de Medida y Actualización.',
    keywords: ['multa transito umas', 'costo alcoholimetro multa', 'cuanto cuesta pasarse un alto', 'calculadora infraccion transito', 'ums reglamento de transito'],
    openGraph: { title: 'Sanciones Viales Automotrices en Pesos', description: 'Transforma las infracciones de los policías de tránsito (tasadas en UMA) a pesos reales para saber cuánto te cobrarán en la boleta del estado.', url: 'https://machoteslegales.mx/calculadora/multa-transito-umas' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multa-transito-umas' },
}
export default function Page() { return <CalculadoraMultaTransito /> }
