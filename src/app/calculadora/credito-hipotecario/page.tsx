import { Metadata } from 'next'
import CalculadoraHipotecario from './CalculadoraHipotecario'

export const metadata: Metadata = {
    title: 'Calculadora Crédito Hipotecario México 2026 — Mensualidad y Tabla de Amortización',
    description: 'Simula tu crédito hipotecario en México 2026: mensualidad, intereses totales y tabla de amortización. Compatible con INFONAVIT, FOVISSSTE y crédito bancario.',
    keywords: ['calculadora crédito hipotecario México', 'mensualidad hipoteca', 'tabla amortización hipoteca', 'INFONAVIT simulador crédito', 'crédito vivienda México 2026'],
    openGraph: { title: 'Calculadora Crédito Hipotecario México 2026', description: 'Mensualidad, intereses totales y tabla de amortización de tu hipoteca.', url: 'https://machoteslegales.mx/calculadora/credito-hipotecario' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/credito-hipotecario' },
}
export default function Page() { return <CalculadoraHipotecario /> }
