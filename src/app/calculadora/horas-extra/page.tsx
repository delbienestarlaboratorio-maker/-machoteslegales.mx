import { Metadata } from 'next'
import CalculadoraHorasExtra from './CalculadoraHorasExtra'

export const metadata: Metadata = {
    title: 'Calculadora Horas Extra México 2026 — Pago Doble y Triple | Arts. 66-68 LFT',
    description:
        'Calcula el pago correcto de horas extra en México 2026. Primeras 9 horas al doble, excedentes al triple. Basada en Arts. 66-68 de la Ley Federal del Trabajo.',
    keywords: [
        'calculadora horas extra México', 'pago horas extras LFT', 'horas extra doble triple',
        'Art 66 LFT', 'Art 67 LFT', 'Art 68 LFT', 'horas extraordinarias 2026',
        'cómo se pagan las horas extra en México', 'tiempo extra laboral',
    ],
    openGraph: {
        title: 'Calculadora Horas Extra México 2026 — Pago Doble y Triple',
        description: 'Calcula el pago correcto de horas extra: doble las primeras 9, triple las excedentes.',
        url: 'https://machoteslegales.mx/calculadora/horas-extra',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/horas-extra' },
}

export default function Page() {
    return <CalculadoraHorasExtra />
}
