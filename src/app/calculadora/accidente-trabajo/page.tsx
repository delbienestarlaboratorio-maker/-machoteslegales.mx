import { Metadata } from 'next'
import CalculadoraAccidenteTrabajo from './CalculadoraAccidenteTrabajo'

export const metadata: Metadata = {
    title: 'Calculadora Indemnización Accidente de Trabajo México 2026 | Arts. 487-500 LFT',
    description:
        'Calcula la indemnización por accidente de trabajo o enfermedad profesional en México 2026. Incapacidad temporal, permanente parcial y total. Arts. 487-500 LFT + Art. 58 LSS.',
    keywords: [
        'indemnización accidente trabajo México', 'incapacidad temporal permanente LFT',
        'riesgo de trabajo', 'Art 487 LFT', 'incapacidad IMSS accidente', 'enfermedad profesional indemnización',
    ],
    openGraph: {
        title: 'Calculadora Indemnización Accidente de Trabajo 2026',
        description: 'Calcula tu indemnización por accidente laboral o enfermedad profesional.',
        url: 'https://machoteslegales.mx/calculadora/accidente-trabajo',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/accidente-trabajo' },
}
export default function Page() { return <CalculadoraAccidenteTrabajo /> }
