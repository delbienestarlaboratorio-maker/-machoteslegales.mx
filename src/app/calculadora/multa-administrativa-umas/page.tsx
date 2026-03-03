import { Metadata } from 'next'
import CalculadoraMultaAdministrativa from './CalculadoraMultaAdministrativa'

export const metadata: Metadata = {
    title: 'Sanciones Administrativas y Multas Federales en UMAs',
    description: 'Calcula cualquier multa gubernamental (PROFECO, COFEPRIS, Municipales) basadas en Unidades de Medida y Actualización según la Ley Federal de Procedimiento.',
    keywords: ['multa administrativa uma', 'multa profeco calculadora', 'cofepris multa umas', 'lfpa multas calculadora'],
    openGraph: { title: 'Multas Gubernamentales (PROFECO, COFEPRIS) en Pesos', description: 'Transpola cualquier citatorio del Estado, clausura, o revisión hacendaria tasada en UMAs a Pesos exactos.', url: 'https://machoteslegales.mx/calculadora/multa-administrativa-umas' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multa-administrativa-umas' },
}
export default function Page() { return <CalculadoraMultaAdministrativa /> }
