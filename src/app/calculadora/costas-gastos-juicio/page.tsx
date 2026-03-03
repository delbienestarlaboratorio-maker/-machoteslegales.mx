import { Metadata } from 'next'
import CalculadoraCostasJuicio from './CalculadoraCostasJuicio'

export const metadata: Metadata = {
    title: 'Calculadora de Costas y Gastos del Juicio (Condena en Costas México)',
    description: 'Simula el cálculo de porcentaje sobre la suerte principal que el Juez impondrá a la parte que pierde totalmente el juicio (mala fe o doble instancia).',
    keywords: ['condena en costas', 'costas del juicio calculo', 'gastos abogado juicio', 'calculadora costas judiciales mexico', 'art 1084 codigo comercio'],
    openGraph: { title: 'Condena en Costas Judiciales en México', description: 'Revisa de cuánto será el golpe económico extra por perder un juicio mercantil o civil sumando las costas e indemnizaciones.', url: 'https://machoteslegales.mx/calculadora/costas-gastos-juicio' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costas-gastos-juicio' },
}
export default function Page() { return <CalculadoraCostasJuicio /> }
