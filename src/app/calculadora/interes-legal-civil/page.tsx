import { Metadata } from 'next'
import CalculadoraInteresCivil from './CalculadoraInteresCivil'

export const metadata: Metadata = {
    title: 'Calculadora Interés Legal Civil México 2026 — 9% Anual | Art. 2395 CCF',
    description:
        'Calcula intereses legales civiles al 9% anual en México 2026. Para préstamos entre particulares, contratos civiles y sentencias judiciales. Art. 2395 CCF.',
    keywords: [
        'interés legal civil México', 'interés legal 9%', 'Art 2395 Código Civil',
        'calculadora interés civil', 'préstamo entre particulares', 'interés por sentencia judicial',
    ],
    openGraph: {
        title: 'Calculadora Interés Legal Civil 9% México 2026',
        description: 'Interés legal civil: 9% anual. Para préstamos, contratos y sentencias.',
        url: 'https://machoteslegales.mx/calculadora/interes-legal-civil',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/interes-legal-civil' },
}
export default function Page() { return <CalculadoraInteresCivil /> }
