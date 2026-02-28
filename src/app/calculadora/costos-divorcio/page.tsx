import { Metadata } from 'next'
import CalculadoraDivorcio from './CalculadoraDivorcio'

export const metadata: Metadata = {
    title: 'Calculadora Costos Divorcio México 2026 — Gastos Notariales y Pensión | CCF',
    description: 'Estima los costos de un divorcio en México 2026: honorarios abogado, gastos notariales, pensión alimenticia, división de bienes. Divorcio incausado y por mutuo acuerdo.',
    keywords: ['costo divorcio México 2026', 'divorcio incausado costos', 'gastos divorcio notarial', 'pensión alimenticia divorcio', 'división bienes matrimoniales'],
    openGraph: { title: 'Calculadora Costos Divorcio México 2026', description: 'Estima honorarios, gastos notariales y pensión en un divorcio mexicano.', url: 'https://machoteslegales.mx/calculadora/costos-divorcio' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costos-divorcio' },
}
export default function Page() { return <CalculadoraDivorcio /> }
