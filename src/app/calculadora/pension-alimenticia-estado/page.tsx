import { Metadata } from 'next'
import CalculadoraPensionAlimenticiaEstado from './CalculadoraPensionAlimenticiaEstado'

export const metadata: Metadata = {
    title: 'Calculadora de Pensión Alimenticia por Estado (Topes Legales 2026)',
    description: 'Conoce el porcentaje mínimo y máximo de Pensión Alimenticia sugerido por los Códigos Civiles Familiares de cada estado de México.',
    keywords: ['calculadora pension alimenticia por estado', 'porcentaje pension alimenticia estado de mexico', 'cuanto es la pension en cdmx', 'tabla pensiones mexico'],
    openGraph: { title: 'Pensión Alimenticia por Estado (México)', description: 'Simula el porcentaje o monto base de pensión según el estado donde radiques y el número de hijos.', url: 'https://machoteslegales.mx/calculadora/pension-alimenticia-estado' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pension-alimenticia-estado' },
}
export default function Page() { return <CalculadoraPensionAlimenticiaEstado /> }
