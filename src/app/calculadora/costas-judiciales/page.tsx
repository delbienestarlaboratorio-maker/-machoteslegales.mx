import { Metadata } from 'next'
import CalculadoraCostas from './CalculadoraCostas'

export const metadata: Metadata = {
    title: 'Calculadora Costas Judiciales México 2026 — ¿Cuánto Cobrar al Perdedor? | Art. 139 CFPC',
    description: 'Calcula las costas judiciales (honorarios del abogado ganador) en México 2026. Art. 139 CFPC: entre el 10% y 25% del valor del litigio. Procedimiento civil y mercantil.',
    keywords: ['costas judiciales México 2026', 'Art 139 CFPC', 'honorarios abogado ganador', 'calcular costas juicio', 'condenado costas procesales'],
    openGraph: { title: 'Calculadora Costas Judiciales México 2026', description: 'Calcula cuánto cobrar en costas si ganas un juicio.', url: 'https://machoteslegales.mx/calculadora/costas-judiciales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costas-judiciales' },
}
export default function Page() { return <CalculadoraCostas /> }
