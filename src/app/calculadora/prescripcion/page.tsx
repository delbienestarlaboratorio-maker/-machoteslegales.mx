import { Metadata } from 'next'
import CalculadoraPrescripcion from './CalculadoraPrescripcion'

export const metadata: Metadata = {
    title: 'Calculadora Plazos de Prescripción México 2026 | Civil, Penal, Mercantil y Laboral',
    description: 'Calcula cuándo prescribe tu deuda o acción legal en México. Prescripción civil 10 años, mercantil 10 años, laboral 1 año. Tabla completa por materia y fundamento legal.',
    keywords: ['prescripción deudas México', 'plazo prescripción civil mercantil', 'cuándo prescribe deuda México', 'prescripción laboral 1 año', 'Art 1159 CCF prescripción'],
    openGraph: { title: 'Calculadora Plazos de Prescripción México 2026', description: 'Calcula la fecha exacta en que prescriben tus deudas o acciones legales.', url: 'https://machoteslegales.mx/calculadora/prescripcion' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/prescripcion' },
}
export default function Page() { return <CalculadoraPrescripcion /> }
