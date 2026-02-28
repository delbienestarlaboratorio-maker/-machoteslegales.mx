import { Metadata } from 'next'
import CalculadoraAguinaldo from './CalculadoraAguinaldo'

export const metadata: Metadata = {
    title: 'Calculadora Aguinaldo Neto México 2026 — ¿Cuánto me Queda? | Art. 87 LFT',
    description:
        'Calcula tu aguinaldo neto en México 2026. Descubre cuánto te quitan de ISR y cuánto te queda realmente. Exención 30 UMAs. Art. 87 LFT + Art. 93 LISR.',
    keywords: [
        'calculadora aguinaldo neto México 2026', 'cuánto me queda de aguinaldo',
        'ISR aguinaldo', 'aguinaldo exento', 'Art 87 LFT', '30 UMAs exentas',
        'aguinaldo 15 días', 'retención ISR aguinaldo', 'aguinaldo diciembre 2026',
    ],
    openGraph: {
        title: 'Calculadora Aguinaldo Neto México 2026',
        description: '¿Cuánto te queda de aguinaldo después de impuestos? Calcula el ISR y el neto real.',
        url: 'https://machoteslegales.mx/calculadora/aguinaldo-neto',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/aguinaldo-neto' },
}

export default function Page() {
    return <CalculadoraAguinaldo />
}
