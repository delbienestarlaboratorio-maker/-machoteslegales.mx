import { Metadata } from 'next'
import CalculadoraPrimaAntiguedad from './CalculadoraPrimaAntiguedad'

export const metadata: Metadata = {
    title: 'Calculadora Prima de Antigüedad México 2026 | Art. 162 LFT — 12 Días por Año',
    description: 'Calcula la prima de antigüedad que te corresponde al renunciar o ser despedido. Art. 162 LFT: 12 días de salario por año trabajado, tope 2 × SMG diario.',
    keywords: ['prima antigüedad México', 'Art 162 LFT', '12 días por año trabajado', 'tope SMG prima antigüedad', 'renunciar prima antigüedad', 'despido prima antigüedad'],
    openGraph: { title: 'Calculadora Prima de Antigüedad México 2026', description: 'Art. 162 LFT: 12 días de salario por año trabajado.', url: 'https://machoteslegales.mx/calculadora/prima-antiguedad' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/prima-antiguedad' },
}
export default function Page() { return <CalculadoraPrimaAntiguedad /> }
