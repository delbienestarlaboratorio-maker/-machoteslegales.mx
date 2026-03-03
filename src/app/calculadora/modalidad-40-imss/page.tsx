import { Metadata } from 'next'
import CalculadoraModalidad40 from './CalculadoraModalidad40'

export const metadata: Metadata = {
    title: 'Calculadora Modalidad 40 IMSS 2026 — Costo Mensual y Tope Salarial',
    description: 'Calcula el costo mensual de la Modalidad 40 del IMSS en 2026 (cuota 14.438%). Proyecta tu inversión para mejorar tu pensión Ley 73 con el tope de 25 UMAs.',
    keywords: ['calculadora modalidad 40 2026', 'costo modalidad 40 IMSS', 'continuacion voluntaria regimen obligatorio', 'inversion modalidad 40 25 umas', 'cuanto cuesta la modalidad 40 al mes'],
    openGraph: { title: 'Calculadora Costo Modalidad 40 IMSS 2026', description: 'Costo de 14.438% en 2026 para Continuación Voluntaria (Modalidad 40).', url: 'https://machoteslegales.mx/calculadora/modalidad-40-imss' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/modalidad-40-imss' },
}
export default function Page() { return <CalculadoraModalidad40 /> }
