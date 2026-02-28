import { Metadata } from 'next'
import CalculadoraPension from './CalculadoraPension'

export const metadata: Metadata = {
    title: 'Calculadora Pensión Alimenticia México 2026 — ¿Cuánto Me Toca? | Arts. 308-323 CC',
    description:
        'Calcula la pensión alimenticia en México 2026. Porcentaje según número de hijos (15%-30% por hijo). Basada en tablas del Consejo de la Judicatura y Arts. 308-323 del Código Civil Federal.',
    keywords: [
        'calculadora pensión alimenticia México', 'cuánto de pensión por hijo',
        'porcentaje pensión alimenticia', 'pensión alimenticia 2026',
        'Art 308 Código Civil', 'calculadora pensión hijos México',
        'monto pensión alimenticia', 'tabla pensión alimenticia',
    ],
    openGraph: {
        title: 'Calculadora Pensión Alimenticia México 2026',
        description: 'Calcula tu pensión alimenticia. Porcentaje según hijos y situación. Tablas oficiales.',
        url: 'https://machoteslegales.mx/calculadora/pension-alimenticia',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pension-alimenticia' },
}

export default function Page() {
    return <CalculadoraPension />
}
