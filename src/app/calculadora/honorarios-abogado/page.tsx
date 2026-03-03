import { Metadata } from 'next'
import CalculadoraHonorariosAbogado from './CalculadoraHonorariosAbogado'

export const metadata: Metadata = {
    title: 'Calculadora de Honorarios de Abogado y Costas Judiciales',
    description: 'Calcula cuánto cobra un abogado según los aranceles de Ley, o simula las Costas Judiciales a las que será condenado la parte perdedora del juicio (20% del monto total).',
    keywords: ['honorarios abogado', 'cuanto cobra un abogado', 'calculadora costas judiciales', 'condena en costas porcentaje', 'arancel honorarios legales'],
    openGraph: { title: 'Tarifador de Honorarios Legales y Costas (México)', description: 'Simula el cobro estándar de los litigantes según el monto del juicio, o calcula la condena en costas por litigar de mala fe.', url: 'https://machoteslegales.mx/calculadora/honorarios-abogado' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/honorarios-abogado' },
}
export default function Page() { return <CalculadoraHonorariosAbogado /> }
