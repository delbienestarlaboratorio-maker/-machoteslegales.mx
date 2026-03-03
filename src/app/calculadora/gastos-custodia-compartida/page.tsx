import { Metadata } from 'next'
import CalculadoraGastosCustodiaCompartida from './CalculadoraGastosCustodiaCompartida'

export const metadata: Metadata = {
    title: 'Calculadora de Gastos Compartidos (Custodia y Pensión Alimenticia)',
    description: 'Calcula cómo deben dividirse los gastos de los hijos entre el padre y la madre basados en sus ingresos netos, respetando el principio de proporcionalidad (Art. 311 CC).',
    keywords: ['gastos custodia compartida', 'calculadora division de pensión alimenticia', 'que paga el padre que paga la madre', 'proporcionalidad pension alimenticia', 'reparto gastos hijos divorcio'],
    openGraph: { title: 'Reparto Proporcional de Gastos de Hijos (México)', description: 'Simula quién debe aportar más a la pensión de los hijos según sus salarios y la regla de proporcionalidad.', url: 'https://machoteslegales.mx/calculadora/gastos-custodia-compartida' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/gastos-custodia-compartida' },
}
export default function Page() { return <CalculadoraGastosCustodiaCompartida /> }
