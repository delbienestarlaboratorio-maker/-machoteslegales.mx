import { Metadata } from 'next'
import CalculadoraISAIHerencia from './CalculadoraISAIHerencia'

export const metadata: Metadata = {
    title: 'Calculadora de ISAI e Impuestos por Herencia Específica',
    description: 'Calcula el Impuesto sobre Adjudicación o Traslación de Dominio (ISAI/ISABI) y gastos notariales al heredar una casa o terreno en México.',
    keywords: ['isai herencia', 'impuesto traslado dominio herencia', 'isabi adjudicacion testamentaria', 'costo escriturar herencia', 'gastos adquirir inmueble intestado'],
    openGraph: { title: 'Gastos Notariales e ISAI por Herencia (México)', description: 'Simula los impuestos locales (ISAI) y los costos de notario por adquirir un inmueble proveniente de una herencia (adjudicación).', url: 'https://machoteslegales.mx/calculadora/isai-herencia' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isai-herencia' },
}
export default function Page() { return <CalculadoraISAIHerencia /> }
