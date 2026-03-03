import { Metadata } from 'next'
import CalculadoraPenaContractual from './CalculadoraPenaContractual'

export const metadata: Metadata = {
    title: 'Calculadora de Pena Convencional y Moratoria en Contratos (Límites de Usura)',
    description: 'Calcula la pena convencional máxima por retraso o incumplimiento de un contrato. Analiza el límite legal civil (que no exceda la suerte principal) y evita la usura.',
    keywords: ['pena convencional contrato', 'limite usura mexico', 'intereses moratorios abusivos', 'calculadora penas contrato', 'suerte principal topes'],
    openGraph: { title: 'Validador Legal de Intereses y Penas Convencionales', description: 'Introduce el importe de tu pagaré o contrato y descubre hasta cuánto te pueden cobrar de intereses moratorios y penas convencionales sin caer en la Usura.', url: 'https://machoteslegales.mx/calculadora/pena-convencional-contrato' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pena-convencional-contrato' },
}
export default function Page() { return <CalculadoraPenaContractual /> }
