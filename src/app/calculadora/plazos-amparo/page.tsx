import { Metadata } from 'next'
import CalculadoraPlazosAmparo from './CalculadoraPlazosAmparo'

export const metadata: Metadata = {
    title: 'Calculadora Plazos de Amparo México 2026 | Amparo Directo e Indirecto | Ley de Amparo',
    description: 'Calcula los plazos para interponer un juicio de amparo en México 2026. Amparo directo: 15 días hábiles. Amparo indirecto: 15 días generales, excepciones. Arts. 17-18 LA.',
    keywords: ['plazos amparo México 2026', 'cuándo interponer amparo', 'plazo 15 días amparo', 'amparo directo indirecto plazo', 'Art 17 Ley de Amparo'],
    openGraph: { title: 'Calculadora Plazos de Amparo México 2026', description: '¿Se te vence el plazo? Calcula en qué fecha límite debes presentar el amparo.', url: 'https://machoteslegales.mx/calculadora/plazos-amparo' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/plazos-amparo' },
}
export default function Page() { return <CalculadoraPlazosAmparo /> }
