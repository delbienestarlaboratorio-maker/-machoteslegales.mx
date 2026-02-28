import { Metadata } from 'next'
import CalculadoraEmbargoNomina from './CalculadoraEmbargoNomina'

export const metadata: Metadata = {
    title: 'Calculadora Embargo / Retención en Nómina México 2026 — Art. 110 LFT y Art. 20 CFF',
    description: 'Calcula cuánto se puede descontar del salario por embargo judicial, deudas al IMSS, pensión alimenticia, INFONAVIT o crédito. Límites Art. 110 LFT y Art. 20 CFF.',
    keywords: ['calculadora embargo nomina Mexico 2026', 'maximo descuento salario embargo', 'Art 110 LFT descuentos nomina', 'pension alimenticia descuento salario', 'cuanto puede embargar SAT nomina'],
    openGraph: { title: 'Calculadora Embargo y Retención en Nómina 2026', description: 'Límites legales de descuento en nómina: embargo judicial, SAT, IMSS, pensión alimenticia. Art. 110 LFT.', url: 'https://machoteslegales.mx/calculadora/embargo-nomina' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/embargo-nomina' },
}
export default function Page() { return <CalculadoraEmbargoNomina /> }
