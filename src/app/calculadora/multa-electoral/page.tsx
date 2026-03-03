import { Metadata } from 'next'
import CalculadoraMultaElectoral from './CalculadoraMultaElectoral'

export const metadata: Metadata = {
    title: 'Calculadora de Multas Electorales y Sanciones (INE / TEPJF)',
    description: 'Calcula montos de multas y reducción de financiamiento público para partidos y candidatos independientes por rebase de topes de campaña y afiliaciones indebidas.',
    keywords: ['multa inel electoral calculo', 'sancion pecuniaria tepjf', 'reduccion radicacion INE umas', 'multas partidos politicos ley'],
    openGraph: { title: 'Simulador de Castigos Electorales del INE (México)', description: 'Parametriza en Pesos la reducción de ministraciones y Unidades de Medida que la autoridad electoral asesta por jugar fuera del marco democrático.', url: 'https://machoteslegales.mx/calculadora/multa-electoral' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multa-electoral' },
}
export default function Page() { return <CalculadoraMultaElectoral /> }
