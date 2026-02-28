import { Metadata } from 'next'
import CalculadoraArrendamientoComercial from './CalculadoraArrendamientoComercial'

export const metadata: Metadata = {
    title: 'Calculadora Arrendamiento Comercial México 2026 — Renta + IVA + Depósito + Ajuste INPC',
    description: 'Calcula la renta de local comercial con IVA 16%, depósito, fianza y ajuste anual por INPC. Compara meses de gracia y proyección a 3-5 años. Art. 2398 CCF.',
    keywords: ['calculadora arrendamiento comercial México', 'renta local comercial IVA', 'ajuste INPC arrendamiento', 'depósito renta comercial', 'contrato arrendamiento local 2026'],
    openGraph: { title: 'Calculadora Arrendamiento Comercial México 2026', description: 'Renta mensual + IVA + depósito + proyección ajuste INPC anual.', url: 'https://machoteslegales.mx/calculadora/arrendamiento-comercial' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/arrendamiento-comercial' },
}
export default function Page() { return <CalculadoraArrendamientoComercial /> }
