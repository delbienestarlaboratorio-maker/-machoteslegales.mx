import { Metadata } from 'next'
import CalculadoraClausulaPenal from './CalculadoraClausulaPenal'

export const metadata: Metadata = {
    title: 'Calculadora Cláusula Penal (Pena Convencional) México 2026 | Art. 1840 CCF',
    description: 'Calcula la pena convencional pactada en tus contratos en México 2026. Art. 1840 CCF: la cláusula penal sustituye a la indemnización de daños. ¿Cuánto debes cobrar por incumplimiento?',
    keywords: ['cláusula penal México', 'pena convencional contrato', 'Art 1840 CCF', 'indemnización incumplimiento contrato', 'calcular pena convencional'],
    openGraph: { title: 'Calculadora Cláusula Penal / Pena Convencional México 2026', description: 'Calcula la pena convencional por incumplimiento de contrato.', url: 'https://machoteslegales.mx/calculadora/clausula-penal' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/clausula-penal' },
}
export default function Page() { return <CalculadoraClausulaPenal /> }
