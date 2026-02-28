import { Metadata } from 'next'
import CalculadoraISRAcciones from './CalculadoraISRAcciones'

export const metadata: Metadata = {
    title: 'Calculadora ISR Enajenación de Acciones México 2026 — Art. 120 LISR Persona Física',
    description: 'Calcula el ISR por venta de acciones para persona física: precio de venta − costo de adquisición = ganancia. Tasa 10% (Art. 129 LISR). Incluye actualización por inflación.',
    keywords: ['ISR venta acciones persona fisica 2026', 'Art 120 LISR enajenacion acciones', 'calculadora ISR acciones Mexico', 'ganancia enajenacion acciones SAT', 'tasa 10% acciones LISR'],
    openGraph: { title: 'Calculadora ISR Enajenación de Acciones 2026', description: '10% sobre ganancia = (precio venta − costo adquisición actualizado).', url: 'https://machoteslegales.mx/calculadora/isr-acciones' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-acciones' },
}
export default function Page() { return <CalculadoraISRAcciones /> }
