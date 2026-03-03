import { Metadata } from 'next'
import CalculadoraPoderNotarial from './CalculadoraPoderNotarial'

export const metadata: Metadata = {
    title: 'Costo de un Poder Notarial en México (Pleitos, Cobranzas, Dominio)',
    description: 'Calcula el tabulador arancelario promedio de los Notarios Públicos en México por la redacción, firmas y escritura de un Poder General o Especial.',
    keywords: ['costo poder notarial', 'cuanto cobra un notario por un poder', 'pleitos y cobranzas precio', 'poder actos de dominio', 'escritura poder mexico'],
    openGraph: { title: 'Cotizador Histórico de Poderes Notariales', description: 'Evita cobros excesivos al darle poder legal a un abogado o familiar. Descubre el rango tarifario exacto de los Notarios Públicos.', url: 'https://machoteslegales.mx/calculadora/costo-poder-notarial' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costo-poder-notarial' },
}
export default function Page() { return <CalculadoraPoderNotarial /> }
