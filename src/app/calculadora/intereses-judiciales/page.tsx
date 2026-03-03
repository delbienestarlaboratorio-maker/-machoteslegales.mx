import { Metadata } from 'next'
import CalculadoraInteresesJudiciales from './CalculadoraInteresesJudiciales'

export const metadata: Metadata = {
    title: 'Calculadora de Intereses Judiciales (Civil y Mercantil)',
    description: 'Calcula cuánto debe pagar un deudor por atraso desde que se le ordenó en sentencia judicial o desde la fecha de mora. Tasa Civil (9%) o Mercantil (6%).',
    keywords: ['pago intereses judiciales', 'tasa legal mercantil 6', 'tasa civil 9', 'calculadora mora judicial', 'interes moratorio deudor mexico'],
    openGraph: { title: 'Tasas de Mora Judicial 9% y 6% (México)', description: 'Genera el cómputo de mora exacto que un juez exigirá en ejecución de sentencia.', url: 'https://machoteslegales.mx/calculadora/intereses-judiciales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/intereses-judiciales' },
}
export default function Page() { return <CalculadoraInteresesJudiciales /> }
