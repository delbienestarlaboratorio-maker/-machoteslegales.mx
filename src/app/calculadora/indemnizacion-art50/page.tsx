import { Metadata } from 'next'
import CalculadoraIndemnizacion50 from './CalculadoraIndemnizacion50'

export const metadata: Metadata = {
    title: 'Calculadora Indemnización Art. 50 LFT — 20 Días por Año México 2026',
    description: 'Calcula la indemnización por rescisión patronal sin causa: 20 días de salario por año trabajado (Art. 50 LFT). Incluye 3 meses, 12 días y seniority premium.',
    keywords: ['indemnización 20 días año LFT', 'Art 50 LFT rescisión patronal', 'liquidación despido México 2026', '20 días por año trabajado', 'calculadora Art 50 LFT'],
    openGraph: { title: 'Calculadora Indemnización Art. 50 LFT 2026', description: '20 días de salario por año + 3 meses + prima antigüedad.', url: 'https://machoteslegales.mx/calculadora/indemnizacion-art50' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/indemnizacion-art50' },
}
export default function Page() { return <CalculadoraIndemnizacion50 /> }
