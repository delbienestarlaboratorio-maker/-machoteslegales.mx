import { Metadata } from 'next'
import CalculadoraLetraCambio from './CalculadoraLetraCambio'

export const metadata: Metadata = {
    title: 'Calculadora de Vencimiento de Letra de Cambio',
    description: 'Calcula el vencimiento (A la vista, a cierto tiempo fecha, día fijo) de una letra de cambio y sus intereses moratorios en caso de impago según la LGTOC.',
    keywords: ['vencimiento letra de cambio', 'cobro letra de cambio vencida', 'intereses letra de cambio', 'tipos vencimiento lgtoc', 'demanda ejecutiva mercantil letra'],
    openGraph: { title: 'Vencimiento e Intereses Letra de Cambio (LGTOC)', description: 'Descubre en qué fecha exacta caduca tu Letra de Cambio y calcula los créditos moratorios según el tipo de presentación.', url: 'https://machoteslegales.mx/calculadora/letra-cambio-vencimiento' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/letra-cambio-vencimiento' },
}
export default function Page() { return <CalculadoraLetraCambio /> }
