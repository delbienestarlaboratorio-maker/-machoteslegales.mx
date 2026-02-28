import { Metadata } from 'next'
import CalculadoraFianza from './CalculadoraFianza'

export const metadata: Metadata = {
    title: 'Calculadora Fianza Penal en UMAs México 2026 — ¿Cuánto Cuesta la Libertad? | Art. 166 CNPP',
    description:
        'Calcula el monto de una fianza penal en México 2026. Convierte UMAs a pesos. Medida cautelar para garantizar libertad. Art. 166 CNPP + Art. 19 CPEUM.',
    keywords: [
        'calculadora fianza penal México', 'fianza penal en UMAs', 'cuánto cuesta fianza penal',
        'medida cautelar garantía', 'Art 166 CNPP', 'Art 19 Constitución', 'libertad bajo caución',
    ],
    openGraph: {
        title: 'Calculadora Fianza Penal en UMAs México 2026',
        description: 'Calcula cuánto cuesta una fianza penal según el delito. Convierte UMAs a pesos.',
        url: 'https://machoteslegales.mx/calculadora/fianza-penal',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/fianza-penal' },
}
export default function Page() { return <CalculadoraFianza /> }
