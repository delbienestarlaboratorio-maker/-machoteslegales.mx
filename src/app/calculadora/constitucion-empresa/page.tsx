import { Metadata } from 'next'
import CalculadoraConstitucionEmpresa from './CalculadoraConstitucionEmpresa'

export const metadata: Metadata = {
    title: 'Calculadora Gastos Constitución de Empresa México 2026 — SA de CV, SAS, SC',
    description: 'Estima el costo de constituir una empresa en México: honorarios notariales, RPP, inscripción SAT, capital social mínimo. SA de CV, SAS y Sociedad Civil.',
    keywords: ['costo constituir empresa Mexico 2026', 'gastos notariales SA de CV', 'constituir SAS Mexico costo', 'capital social minimo SA Mexico', 'como crear empresa Mexico costos'],
    openGraph: { title: 'Calculadora Constitución de Empresa México 2026', description: 'Costo total de abrir tu empresa: notario + RPP + SAT + capital social mínimo.', url: 'https://machoteslegales.mx/calculadora/constitucion-empresa' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/constitucion-empresa' },
}
export default function Page() { return <CalculadoraConstitucionEmpresa /> }
