import { Metadata } from 'next'
import CalculadoraDaniosPerjuicios from './CalculadoraDaniosPerjuicios'

export const metadata: Metadata = {
    title: 'Calculadora Daños y Perjuicios México 2026 — Art. 2108-2117 Código Civil | Responsabilidad Civil',
    description: 'Cuantifica daños y perjuicios: daño emergente + lucro cesante + daño moral (estimado). Art. 2108-2117 CCF. Incluye intereses moratorios e indexación por inflación.',
    keywords: ['calculadora danos perjuicios Mexico 2026', 'cuantificacion dano emergente lucro cesante', 'Art 2108 codigo civil federal danos', 'responsabilidad civil cuanto cobrar', 'dano moral estimacion Mexico'],
    openGraph: { title: 'Calculadora Daños y Perjuicios (Responsabilidad Civil) 2026', description: 'Daño emergente + lucro cesante + daño moral. Arts. 2108-2117 CCF.', url: 'https://machoteslegales.mx/calculadora/danos-perjuicios' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/danos-perjuicios' },
}
export default function Page() { return <CalculadoraDaniosPerjuicios /> }
