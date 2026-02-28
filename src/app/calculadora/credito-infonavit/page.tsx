import { Metadata } from 'next'
import CalculadoraCreditoINFONAVIT from './CalculadoraCreditoINFONAVIT'

export const metadata: Metadata = {
    title: 'Calculadora Crédito INFONAVIT 2026 — Monto Máximo, Mensualidades y VSMDF',
    description: 'Estima cuánto crédito INFONAVIT puedes obtener según tu salario, puntos acumulados y VSM. Calcula mensualidades y capacidad de pago. Ley del INFONAVIT 2026.',
    keywords: ['calculadora credito INFONAVIT 2026', 'cuanto credito da INFONAVIT por salario', 'mensualidad INFONAVIT calculadora', 'puntos INFONAVIT credito', 'VSMDF INFONAVIT monto maximo'],
    openGraph: { title: 'Calculadora Crédito INFONAVIT 2026', description: 'Monto máximo de crédito INFONAVIT según salario, puntos y VSMDF. Mensualidades estimadas.', url: 'https://machoteslegales.mx/calculadora/credito-infonavit' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/credito-infonavit' },
}
export default function Page() { return <CalculadoraCreditoINFONAVIT /> }
