import { Metadata } from 'next'
import CalculadoraISRFiniquito from './CalculadoraISRFiniquito'

export const metadata: Metadata = {
    title: 'Calculadora ISR Finiquito y Liquidación México 2026 — ¿Cuánto me Quitan de Impuestos?',
    description:
        'Calcula el ISR de tu finiquito o liquidación laboral en México 2026. Descubre cuánto te quitan de impuestos y cuál es tu monto NETO real. Basada en Arts. 95-96 LISR y tablas SAT vigentes.',
    keywords: [
        'calculadora ISR finiquito',
        'ISR liquidación México',
        'impuestos finiquito México 2026',
        'cuánto me quitan de mi liquidación',
        'ISR por despido',
        'retención ISR finiquito',
        'finiquito neto México',
        'calculadora impuestos liquidación laboral',
        'Art 95 LISR',
        'Art 96 LISR',
        'tabla ISR SAT 2026',
        'exención finiquito',
        'cuánto me queda de mi liquidación',
    ],
    openGraph: {
        title: 'Calculadora ISR Finiquito y Liquidación México 2026',
        description:
            '¿Cuánto te quitan de impuestos de tu finiquito? Calcula el ISR exacto y descubre tu monto NETO real. Tablas SAT 2026 actualizadas.',
        url: 'https://machoteslegales.mx/calculadora/isr-liquidacion',
        siteName: 'Machotes Legales',
        type: 'website',
    },
    alternates: {
        canonical: 'https://machoteslegales.mx/calculadora/isr-liquidacion',
    },
}

export default function Page() {
    return <CalculadoraISRFiniquito />
}
