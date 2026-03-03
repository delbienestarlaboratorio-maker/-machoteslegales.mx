import { Metadata } from 'next'
import CalculadoraISRRAEP from './CalculadoraISRRAEP'

export const metadata: Metadata = {
    title: 'Calculadora ISR Actividad Empresarial (Régimen General PF) 2026',
    description: 'Calcula tu ISR provisional mensual bajo el Régimen de Actividades Empresariales y Profesionales (RAEP). Uso de tarifa acumulada Art 96 LISR.',
    keywords: ['calculadora isr raep', 'calculadora actividad empresarial pf', 'isr mensual honorarios pf', 'isr por ingresos acumulables', 'pago provisional isr raep'],
    openGraph: { title: 'Calculadora ISR Actividad Empresarial y Profesional', description: 'Calculadora para personas físicas en RAEP. Pagos provisionales mensuales.', url: 'https://machoteslegales.mx/calculadora/isr-actividad-empresarial' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-actividad-empresarial' },
}
export default function Page() { return <CalculadoraISRRAEP /> }
