import { Metadata } from 'next'
import CalculadoraChequeSinFondos from './CalculadoraChequeSinFondos'

export const metadata: Metadata = {
    title: 'Calculadora de Indemnización por Cheque sin Fondos (Rebotado)',
    description: 'Conoce cuánto puedes demandarle legalmente a quien te dio un cheque sin fondos. Calcula el 20% de penalización obligatoria + interés moratorio mercantil (Art. 193 LGTOC).',
    keywords: ['cheque rebotado', 'cheque sin fondos', 'demanda cheque sin fondos', 'penalizacion cheque', 'art 193 lgtoc', 'indemnizacion 20 cheque'],
    openGraph: { title: 'Calculadora Legal para Cheques sin Fondos (México)', description: 'Simula el capital, la multa del 20% y el interés moratorio por cobrar un cheque rebotado.', url: 'https://machoteslegales.mx/calculadora/cheque-sin-fondos' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/cheque-sin-fondos' },
}
export default function Page() { return <CalculadoraChequeSinFondos /> }
