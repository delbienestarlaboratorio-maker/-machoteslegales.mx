import { Metadata } from 'next'
import CalculadoraIncapacidadParcial from './CalculadoraIncapacidadParcial'

export const metadata: Metadata = {
    title: 'Calculadora Incapacidad Permanente Parcial México 2026 — Tabla Art. 514 LFT / IMSS',
    description: 'Calcula la indemnización por incapacidad permanente parcial por accidente o enfermedad de trabajo. Tabla de valuación Art. 514 LFT, porcentaje de inhabilitación × sueldo.',
    keywords: ['incapacidad permanente parcial LFT', 'tabla Art 514 LFT valuación', 'indemnización incapacidad trabajo', '% inhabilitación IMSS accidente', 'calculadora incapacidad permanente'],
    openGraph: { title: 'Calculadora Incapacidad Permanente Parcial 2026', description: '% de incapacidad × salario × tiempo = indemnización.', url: 'https://machoteslegales.mx/calculadora/incapacidad-parcial' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/incapacidad-parcial' },
}
export default function Page() { return <CalculadoraIncapacidadParcial /> }
