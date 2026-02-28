import { Metadata } from 'next'
import CalculadoraFiniquitoLiquidacion from './CalculadoraFiniquitoLiquidacion'

export const metadata: Metadata = {
    title: 'Comparador Finiquito vs Liquidación México 2026 — Cuándo aplica cada uno | LFT',
    description: 'Calcula y compara el finiquito (renuncia voluntaria) vs la liquidación (despido injustificado). Muestra exactamente qué conceptos incluye cada uno. Arts. 46-52 y 76-87 LFT.',
    keywords: ['finiquito vs liquidacion mexico 2026', 'diferencia finiquito liquidacion LFT', 'calculadora finiquito renuncia', 'calculadora liquidacion despido', 'cuanto me toca si renuncio Mexico'],
    openGraph: { title: 'Comparador Finiquito vs Liquidación México 2026', description: 'Finiquito = renuncia (partes prop.). Liquidación = despido (3 meses + 20 días/año + prima).', url: 'https://machoteslegales.mx/calculadora/finiquito-vs-liquidacion' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/finiquito-vs-liquidacion' },
}
export default function Page() { return <CalculadoraFiniquitoLiquidacion /> }
