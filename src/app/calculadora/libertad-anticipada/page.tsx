import { Metadata } from 'next'
import CalculadoraLibertadAnticipada from './CalculadoraLibertadAnticipada'

export const metadata: Metadata = {
    title: 'Calculadora de Libertad Anticipada (Ejecución Penal)',
    description: 'Descubre en qué fecha o porcentaje de condena puedes solicitar tu Libertad Anticipada o Condicionada según la Ley Nacional de Ejecución Penal.',
    keywords: ['libertad anticipada calculadora', 'beneficios preliberacionales', 'cuando salgo de la carcel', 'libertad condicionada mexico', 'mitad de la condena'],
    openGraph: { title: 'Beneficios de Libertad Anticipada en México', description: 'Simula si cumples con el 50% o el 70% de tu condena para salir de prisión con un brazalete o bajo supervisión.', url: 'https://machoteslegales.mx/calculadora/libertad-anticipada' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/libertad-anticipada' },
}
export default function Page() { return <CalculadoraLibertadAnticipada /> }
