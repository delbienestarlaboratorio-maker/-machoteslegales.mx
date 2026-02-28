import { Metadata } from 'next'
import CalculadoraHonorariosExtranjeros from './CalculadoraHonorariosExtranjeros'

export const metadata: Metadata = {
    title: 'Calculadora Honorarios Extranjeros México 2026 — Retención Art. 167 LISR | 25% o Tasa Convenio',
    description: 'Calcula la retención de ISR sobre pagos a personas físicas o morales extranjeras por servicios independientes. Tasa general 25% (Art. 167 LISR) o tasa reducida por convenio fiscal.',
    keywords: ['retencion honorarios extranjeros Mexico 2026', 'Art 167 LISR pagos extranjeros', 'ISR retencion servicios extranjeros', 'wothholding tax Mexico honorarios', 'convenio fiscal Mexico reduccion retencion'],
    openGraph: { title: 'Calculadora Retención Honorarios Extranjeros 2026', description: 'ISR 25% (o convenio) sobre honorarios pagados a personas residentes en el extranjero. Art. 167 LISR.', url: 'https://machoteslegales.mx/calculadora/honorarios-extranjeros' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/honorarios-extranjeros' },
}
export default function Page() { return <CalculadoraHonorariosExtranjeros /> }
