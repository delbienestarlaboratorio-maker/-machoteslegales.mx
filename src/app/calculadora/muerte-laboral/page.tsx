import { Metadata } from 'next'
import CalculadoraMuerteLaboralComponent from './CalculadoraMuerteLaboral'

export const metadata: Metadata = {
    title: 'Calculadora Indemnización por Muerte Laboral México 2026 | Art. 502 LFT',
    description:
        'Calcula la indemnización que deben recibir los beneficiarios cuando un trabajador fallece por riesgo de trabajo en México 2026. Art. 502 LFT: 730 días de salario + gastos funerarios.',
    keywords: [
        'indemnización muerte laboral México', 'Art 502 LFT', 'muerte por riesgo trabajo',
        '730 días salario fallecimiento', 'beneficiarios trabajador fallecido', 'gastos funerarios LFT',
    ],
    openGraph: {
        title: 'Calculadora Indemnización por Muerte Laboral México 2026',
        description: '730 días de salario + gastos funerarios 60 días SMG si el trabajador fallece por riesgo laboral.',
        url: 'https://machoteslegales.mx/calculadora/muerte-laboral',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/muerte-laboral' },
}
export default function Page() { return <CalculadoraMuerteLaboralComponent /> }
