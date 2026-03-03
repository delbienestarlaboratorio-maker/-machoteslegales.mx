import { Metadata } from 'next'
import CalculadoraCaucionAmparo from './CalculadoraCaucionAmparo'

export const metadata: Metadata = {
    title: 'Calculadora de Caución / Garantía en Suspensión de Amparo',
    description: 'Calcula matemáticamente el monto que el Juez de Distrito de Amparo te pedirá de garantía prendaria (Billete de Depósito) para concederte la Suspensión del Acto Reclamado.',
    keywords: ['caucion amparo', 'garantia suspension acto reclamado', 'calculadora fianza amparo', 'cuanto piden de fianza en amparo', 'billete deposito amparo'],
    openGraph: { title: 'Garantía Económica para Suspensión de Amparo', description: 'Simula la caución (fianza judicial) que necesitas exhibir para paralizar un embargo, clausura o mandamiento judicial en lo que se resuelve el amparo.', url: 'https://machoteslegales.mx/calculadora/caucion-amparo' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/caucion-amparo' },
}
export default function Page() { return <CalculadoraCaucionAmparo /> }
