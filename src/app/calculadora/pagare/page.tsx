import { Metadata } from 'next'
import CalculadoraPagarePage from './CalculadoraPagare'

export const metadata: Metadata = {
    title: 'Calculadora Pagaré con Intereses México 2026 — Monto y Vencimiento | LGTOC',
    description:
        'Calcula el monto total de un pagaré con intereses ordinarios y moratorios en México 2026. Incluye TIIE o tasa pactada. Arts. 170-174 LGTOC.',
    keywords: [
        'calculadora pagaré México', 'pagaré con intereses', 'monto pagaré vencido',
        'Art 170 LGTOC', 'intereses pagaré TIIE', 'título de crédito pagaré',
    ],
    openGraph: {
        title: 'Calculadora Pagaré con Intereses México 2026',
        description: 'Calcula el total de un pagaré vencido con intereses ordinarios y moratorios.',
        url: 'https://machoteslegales.mx/calculadora/pagare',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pagare' },
}
export default function Page() { return <CalculadoraPagarePage /> }
