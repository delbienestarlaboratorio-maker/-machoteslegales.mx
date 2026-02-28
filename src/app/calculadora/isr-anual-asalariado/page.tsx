import { Metadata } from 'next'
import CalculadoraISRAnualAsalariado from './CalculadoraISRAnualAsalariado'

export const metadata: Metadata = {
    title: 'Calculadora ISR Anual Persona Física Asalariada 2026 — Declaración Anual Saldo a Favor o a Pagar',
    description: 'Calcula el ISR anual de una persona física asalariada: compara el ISR del ejercicio con las retenciones del patrón. Determina si tienes saldo a favor o debes pagar. Art. 96 y 152 LISR.',
    keywords: ['calculadora ISR anual asalariado 2026', 'declaracion anual empleados SAT', 'saldo a favor ISR asalariado', 'ISR anual persona fisica salarios', 'Art 152 LISR tarifa anual'],
    openGraph: { title: 'Calculadora ISR Anual Asalariado 2026', description: 'Determina si tienes saldo a favor o adeudo en tu declaración anual. Art. 152 LISR.', url: 'https://machoteslegales.mx/calculadora/isr-anual-asalariado' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-anual-asalariado' },
}
export default function Page() { return <CalculadoraISRAnualAsalariado /> }
