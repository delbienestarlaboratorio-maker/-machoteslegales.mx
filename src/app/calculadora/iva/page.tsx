import { Metadata } from 'next'
import CalculadoraIVA from './CalculadoraIVA'

export const metadata: Metadata = {
    title: 'Calculadora IVA México 2026 — Agregar, Desglosar y Retención | Art. 1 LIVA',
    description: 'Calcula el IVA en México 2026: agrega el 16%, desglosalo, o calcula la retención de IVA. Frontera norte 8%. Arts. 1-6 LIVA.',
    keywords: ['calculadora IVA México 2026', 'agregar IVA 16%', 'desglosar IVA', 'retención IVA', 'IVA frontera norte 8%', 'Art 1 LIVA'],
    openGraph: { title: 'Calculadora IVA México 2026 — 16% y Frontera Norte 8%', description: 'Agrega, desglosá o calcula retención del IVA en segundos.', url: 'https://machoteslegales.mx/calculadora/iva' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/iva' },
}
export default function Page() { return <CalculadoraIVA /> }
