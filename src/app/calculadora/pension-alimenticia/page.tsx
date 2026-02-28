import { Metadata } from 'next'
import CalculadoraPensionAlimenticia from './CalculadoraPensionAlimenticia'

export const metadata: Metadata = {
    title: 'Calculadora Pensión Alimenticia México 2026 — Tabla % por Número de Hijos | Código Civil',
    description: 'Calcula la pensión alimenticia sugerida según los ingresos del deudor y el número de hijos. Basada en criterios judiciales y tabla de porcentajes. Art. 308 CC.',
    keywords: ['calculadora pension alimenticia mexico 2026', 'cuanto es la pension alimentaria por hijo', 'pension alimenticia porcentaje ingresos', 'Art 308 codigo civil pension', 'pension alimenticia tabla porcentajes'],
    openGraph: { title: 'Calculadora Pensión Alimenticia México 2026', description: 'Pensión alimenticia: tabla de porcentajes sobre ingresos netos por número de hijos y gastos médicos.', url: 'https://machoteslegales.mx/calculadora/pension-alimenticia' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pension-alimenticia' },
}
export default function Page() { return <CalculadoraPensionAlimenticia /> }
