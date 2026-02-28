import { Metadata } from 'next'
import CalculadoraPTU from './CalculadoraPTU'

export const metadata: Metadata = {
    title: 'Calculadora PTU México 2026 — Reparto de Utilidades | Arts. 117-131 LFT',
    description:
        'Calcula cuánto te toca de PTU (Participación de los Trabajadores en las Utilidades) en México 2026. Incluye tope de 3 meses de salario. Arts. 117-131 LFT.',
    keywords: [
        'calculadora PTU México 2026', 'reparto de utilidades', 'cuánto me toca de PTU',
        'PTU tope 3 meses', 'Art 117 LFT', 'participación utilidades trabajadores',
        'cómo se calcula el PTU', 'PTU mayo 2026', 'reparto utilidades empresa',
    ],
    openGraph: {
        title: 'Calculadora PTU — Reparto de Utilidades México 2026',
        description: 'Calcula tu PTU con el tope de 3 meses. Arts. 117-131 LFT actualizada.',
        url: 'https://machoteslegales.mx/calculadora/ptu-utilidades',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/ptu-utilidades' },
}

export default function Page() {
    return <CalculadoraPTU />
}
