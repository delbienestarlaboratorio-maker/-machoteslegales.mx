import { Metadata } from 'next'
import CalculadoraRESICO from './CalculadoraRESICO'

export const metadata: Metadata = {
    title: 'Calculadora ISR RESICO 2026 (Régimen Simplificado de Confianza)',
    description: 'Calcula tu pago mensual de ISR bajo el Régimen Simplificado de Confianza (RESICO). Tasas preferenciales del 1% al 2.5% sobre ingresos facturados.',
    keywords: ['calculadora isr resico 2026', 'is resico personas fisicas', 'calculadora regimen simplificado confianza', 'tasas resico 1 a 2.5%', 'pago impuestos resico'],
    openGraph: { title: 'Calculadora ISR RESICO (Simplificado de Confianza)', description: 'Simula el pago de ISR con las tasas hiper-reducidas de RESICO.', url: 'https://machoteslegales.mx/calculadora/isr-resico' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-resico' },
}
export default function Page() { return <CalculadoraRESICO /> }
