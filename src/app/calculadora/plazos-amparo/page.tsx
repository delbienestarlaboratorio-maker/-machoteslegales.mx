import { Metadata } from 'next'
import CalculadoraPlazosAmparo from './CalculadoraPlazosAmparo'

export const metadata: Metadata = {
    title: 'Calculadora de Plazos para Juicio de Amparo (Indirecto y Directo)',
    description: 'Calcula tu fecha fatal para presentar una demanda de Amparo (15 días, 30 días o cualquier momento) según la Ley de Amparo, descontando fines de semana.',
    keywords: ['plazos amparo', 'calculadora amparo indirecto', 'dias presentar amparo', 'ley de amparo 15 dias', 'fecha fatal amparo'],
    openGraph: { title: 'Tiempos para Demandar Amparo en México', description: 'Simula el reloj procesal para interponer tu demanda de Garantías o Recursos (Revisión, Queja).', url: 'https://machoteslegales.mx/calculadora/plazos-amparo' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/plazos-amparo' },
}
export default function Page() { return <CalculadoraPlazosAmparo /> }
