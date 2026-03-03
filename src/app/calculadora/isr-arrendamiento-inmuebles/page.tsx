import { Metadata } from 'next'
import CalculadoraISRArrendamiento from './CalculadoraISRArrendamiento'

export const metadata: Metadata = {
    title: 'Calculadora ISR Arrendamiento Inmuebles 2026 (Deducción Ciega vs Comprobada)',
    description: 'Calcula el ISR por renta de inmuebles (casa habitación o local). Compara la opción de Deducción Ciega (35% sin comprobantes) con Deducciones Autorizadas reales.',
    keywords: ['calculadora isr arrendamiento 2026', 'deduccion ciega 35%', 'isr renta casa', 'retencion 10 isr arrendamiento', 'impuestos por rentar inmueble'],
    openGraph: { title: 'Calculadora ISR Arrendamiento (Renta Inmuebles)', description: 'Simula tu ISR con deducción ciega vs deducciones reales. Retención 10%.', url: 'https://machoteslegales.mx/calculadora/isr-arrendamiento-inmuebles' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-arrendamiento-inmuebles' },
}
export default function Page() { return <CalculadoraISRArrendamiento /> }
