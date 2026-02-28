import { Metadata } from 'next'
import CalculadoraMultasUMA from './CalculadoraMultasUMA'

export const metadata: Metadata = {
    title: 'Calculadora Multas en UMAs México 2026 — Convertir Días Multa a Pesos',
    description: 'Convierte multas en días de UMA a pesos en México 2026. Multas de tránsito, fiscales, administrativas y penales. Historial UMA desde 2016. Arts. 21 CPEUM y 29 CFF.',
    keywords: ['calculadora multas UMA México', 'convertir días multa pesos', 'multa UMA 2026', 'multas tránsito UMA México', 'UMA días multa pesos MXN'],
    openGraph: { title: 'Calculadora Multas en UMAs México 2026', description: 'Convierte días-multa en pesos con el valor histórico de la UMA.', url: 'https://machoteslegales.mx/calculadora/multas-uma' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multas-uma' },
}
export default function Page() { return <CalculadoraMultasUMA /> }
