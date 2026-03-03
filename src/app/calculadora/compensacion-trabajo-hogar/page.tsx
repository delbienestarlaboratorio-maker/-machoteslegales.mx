import { Metadata } from 'next'
import CalculadoraCompensacionHogar from './CalculadoraCompensacionHogar'

export const metadata: Metadata = {
    title: 'Calculadora de Compensación por Trabajo del Hogar al Divorciarse',
    description: 'Calcula la indemnización de hasta el 50% de los bienes si te casaste por separación de bienes y te dedicaste al hogar o al cuidado de los hijos (Art 267 CC).',
    keywords: ['compensacion por trabajo del hogar', 'indemnizacion separacion de bienes', 'me divorcio y no trabaje', 'hasta 50 por ciento bienes divorcio', 'art 267 codigo civil'],
    openGraph: { title: 'Compensación de Bienes por Trabajo del Hogar (México)', description: 'Simula la indemnización que te toca al divorciarte por separación de bienes si te dedicaste a cuidar el hogar.', url: 'https://machoteslegales.mx/calculadora/compensacion-trabajo-hogar' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/compensacion-trabajo-hogar' },
}
export default function Page() { return <CalculadoraCompensacionHogar /> }
