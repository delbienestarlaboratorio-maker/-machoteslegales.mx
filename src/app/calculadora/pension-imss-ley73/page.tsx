import { Metadata } from 'next'
import CalculadoraPensionLey73 from './CalculadoraPensionLey73'

export const metadata: Metadata = {
    title: 'Calculadora Pensión IMSS Ley 73 (2026) — Cuantía Básica e Incrementos',
    description: 'Calcula tu pensión del IMSS bajo el régimen Ley 1973. Usa salario promedio de últimas 250 semanas, años cotizados, edad de retiro y asignaciones familiares.',
    keywords: ['calculadora pension imss ley 73', 'cuanto me toca de pension imss', 'promedio salarial 250 semanas', 'estimacion pension ley 73', 'cuantia basica incrementos IMSS'],
    openGraph: { title: 'Calculadora de Pensión IMSS Ley 73', description: 'Calcula tu pensión mensual Ley 73: salario promedio de últimos 5 años + incrementos + edad.', url: 'https://machoteslegales.mx/calculadora/pension-imss-ley73' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pension-imss-ley73' },
}
export default function Page() { return <CalculadoraPensionLey73 /> }
