import { Metadata } from 'next'
import CalculadoraISRPersonaMoral from './CalculadoraISRPersonaMoral'

export const metadata: Metadata = {
    title: 'Calculadora ISR Personas Morales México 2026 — 30% Utilidad Fiscal | Art. 9 LISR',
    description: 'Calcula el ISR anual de tu empresa en México 2026. Tasa 30% sobre utilidad fiscal (ingresos − deducciones). Pagos provisionales mensuales Art. 14 LISR.',
    keywords: ['ISR personas morales México 2026', 'calculadora ISR empresa 30%', 'Art 9 LISR tasa personas morales', 'pago provisional empresa ISR', 'utilidad fiscal empresa México'],
    openGraph: { title: 'Calculadora ISR Personas Morales México 2026', description: 'ISR empresa: 30% sobre utilidad fiscal con pagos provisionales Art. 14.', url: 'https://machoteslegales.mx/calculadora/isr-persona-moral' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-persona-moral' },
}
export default function Page() { return <CalculadoraISRPersonaMoral /> }
