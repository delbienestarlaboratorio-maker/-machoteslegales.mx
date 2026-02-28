import { Metadata } from 'next'
import CalculadoraPensionIMSS from './CalculadoraPensionIMSS'

export const metadata: Metadata = {
    title: 'Calculadora Pensión IMSS Vejez/Cesantía 2026 — Ley 97 AFORE | Semanas Cotizadas',
    description: 'Estima tu pensión de vejez o cesantía bajo la Ley 97 (AFORE) del IMSS. Calcula con base en semanas cotizadas y saldo estimado de AFORE. Art. 154 LSS.',
    keywords: ['calculadora pension IMSS 2026', 'pension vejez cesantia IMSS Ley 97', 'semanas cotizadas pension IMSS', 'AFORE cuanto me toca', 'pensión IMSS Ley 1997'],
    openGraph: { title: 'Calculadora Pensión IMSS Vejez/Cesantía 2026', description: 'Estima tu pensión mensual bajo Ley 97 con saldo AFORE y semanas cotizadas.', url: 'https://machoteslegales.mx/calculadora/pension-imss' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pension-imss' },
}
export default function Page() { return <CalculadoraPensionIMSS /> }
