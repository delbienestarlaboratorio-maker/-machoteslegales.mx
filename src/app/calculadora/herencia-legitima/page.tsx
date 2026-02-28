import { Metadata } from 'next'
import CalculadoraHerencia from './CalculadoraHerencia'

export const metadata: Metadata = {
    title: 'Calculadora Herencia Legítima México 2026 — Reparto de Bienes | Arts. 1599-1637 CCF',
    description:
        'Calcula cómo se reparte una herencia legítima (intestamentaria) en México. Distribución entre cónyuge, hijos, ascendientes y colaterales. Arts. 1599-1637 Código Civil Federal.',
    keywords: [
        'calculadora herencia legítima México', 'herencia intestamentaria', 'reparto bienes herencia',
        'sucesión legítima', 'herederos legítimos', 'Art 1599 CCF', 'porcentaje herencia hijos cónyuge',
    ],
    openGraph: {
        title: 'Calculadora Herencia Legítima México 2026',
        description: 'Calcula la distribución de una herencia intestamentaria entre herederos legítimos.',
        url: 'https://machoteslegales.mx/calculadora/herencia-legitima',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/herencia-legitima' },
}
export default function Page() { return <CalculadoraHerencia /> }
