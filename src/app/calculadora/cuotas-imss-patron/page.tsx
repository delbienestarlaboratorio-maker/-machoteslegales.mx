import { Metadata } from 'next'
import CalculadoraCuotasIMSS from './CalculadoraCuotasIMSS'

export const metadata: Metadata = {
    title: 'Calculadora Cuotas IMSS Patrón 2026 — Desglose por Ramo Ley del Seguro Social',
    description: 'Calcula las cuotas patronales al IMSS por trabajador: enfermedad y maternidad, invalidez, vejez, retiro y cesantía, guarderías e INFONAVIT. Ley del Seguro Social y Ley INFONAVIT 2026.',
    keywords: ['calculadora cuotas IMSS patron 2026', 'cuotas patronales IMSS por trabajador', 'cuanto paga el patron al IMSS', 'desglose cuotas IMSS ramos 2026', 'IMSS INFONAVIT patron LSS'],
    openGraph: { title: 'Calculadora Cuotas IMSS Patrón 2026', description: 'Desglose completo de cuotas patronales al IMSS por ramo (enfermedad, retiro, guarderías, INFONAVIT).', url: 'https://machoteslegales.mx/calculadora/cuotas-imss-patron' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/cuotas-imss-patron' },
}
export default function Page() { return <CalculadoraCuotasIMSS /> }
