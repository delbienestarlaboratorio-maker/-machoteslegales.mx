import { Metadata } from 'next'
import CalculadoraIMSS from './CalculadoraIMSS'

export const metadata: Metadata = {
    title: 'Calculadora Cuotas IMSS Obrero-Patronales México 2026 | Ley del Seguro Social',
    description:
        'Calcula las cuotas IMSS que paga el patrón y el trabajador en México 2026. Desglose por ramo de seguro. Tope 25 UMAs. Arts. 29-40 LSS.',
    keywords: [
        'calculadora cuotas IMSS México 2026', 'cuotas obrero patronales', 'IMSS patrón trabajador',
        'aportaciones IMSS desglose', 'tope 25 UMAs IMSS', 'Art 29 LSS',
    ],
    openGraph: {
        title: 'Calculadora Cuotas IMSS Obrero-Patronales 2026',
        description: 'Desglose completo de cuotas IMSS por ramo: EyM, IV, CEAV, Guarderías, RT, Retiro, Infonavit.',
        url: 'https://machoteslegales.mx/calculadora/cuotas-imss',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/cuotas-imss' },
}
export default function Page() { return <CalculadoraIMSS /> }
