import { Metadata } from 'next'
import CalculadoraIntereses from './CalculadoraIntereses'

export const metadata: Metadata = {
    title: 'Calculadora Intereses Moratorios México 2026 — Pagaré, Deuda, Juicio | Art. 362 C.Com',
    description:
        'Calcula intereses moratorios legales en México 2026. Tasa legal 6%, TIIE, convencional. Para pagarés, deudas mercantiles y juicios. Art. 362 Código de Comercio.',
    keywords: [
        'calculadora intereses moratorios México', 'interés legal 6%', 'interés moratorio pagaré',
        'Art 362 Código de Comercio', 'TIIE intereses', 'intereses judiciales México',
        'cómo se calculan los intereses moratorios', 'calculadora intereses deuda',
    ],
    openGraph: {
        title: 'Calculadora Intereses Moratorios México 2026',
        description: 'Calcula intereses moratorios: tasa legal 6%, TIIE o convencional. Para pagarés y deudas.',
        url: 'https://machoteslegales.mx/calculadora/intereses-moratorios',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/intereses-moratorios' },
}

export default function Page() {
    return <CalculadoraIntereses />
}
