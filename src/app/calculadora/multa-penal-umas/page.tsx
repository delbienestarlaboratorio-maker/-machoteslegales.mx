import { Metadata } from 'next'
import CalculadoraMultaPenal from './CalculadoraMultaPenal'

export const metadata: Metadata = {
    title: 'Calculadora de Multa Penal en UMAs (Sanción Pecuniaria)',
    description: 'Transforma y simula la Multa de "Días" que imponen los Jueces Penales en base a las Unidades de Medida y Actualización (UMA) conforme al Código Penal.',
    keywords: ['multa penal umas', 'días multa penal', 'multa codigo penal federal calculadora', 'cuanto equivale un dia multa penal', 'sancion pecuniaria penal'],
    openGraph: { title: 'Días Multa a Pesos (Materia Penal)', description: 'Simula el componente pecuniario de la Sentencia Penal que acompaña años de prisión. Transforma los "Días Multa" en la penalidad real cobrable.', url: 'https://machoteslegales.mx/calculadora/multa-penal-umas' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multa-penal-umas' },
}
export default function Page() { return <CalculadoraMultaPenal /> }
