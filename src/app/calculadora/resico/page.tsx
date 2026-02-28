import { Metadata } from 'next'
import CalculadoraRESICO from './CalculadoraRESICO'

export const metadata: Metadata = {
    title: 'Calculadora RESICO 2026 — Régimen Simplificado de Confianza | ISR Mensual SAT',
    description: 'Calcula tu ISR mensual en el RESICO 2026. Régimen Simplificado de Confianza: tasas del 1% al 2.5% sobre ingresos brutos. Art. 113-E y 113-G LISR. Persona física y moral.',
    keywords: ['calculadora RESICO 2026', 'Régimen Simplificado Confianza ISR', 'Art 113-E LISR RESICO', 'pago provisional RESICO', 'ISR RESICO persona física moral'],
    openGraph: { title: 'Calculadora RESICO 2026 — ISR Régimen Simplificado de Confianza', description: 'Calcula tu ISR mensual RESICO: tasas 1%-2.5% sobre ingresos brutos.', url: 'https://machoteslegales.mx/calculadora/resico' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/resico' },
}
export default function Page() { return <CalculadoraRESICO /> }
