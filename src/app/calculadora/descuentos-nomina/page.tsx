import { Metadata } from 'next'
import CalculadoraDescuentoNomina from './CalculadoraDescuentoNomina'

export const metadata: Metadata = {
    title: 'Calculadora Descuentos de Nómina Permitidos México 2026 | Art. 110 LFT',
    description:
        'Calcula los descuentos legales permitidos en tu nómina: IMSS, ISR, INFONAVIT, pensión alimenticia, préstamos. Límites Art. 110 LFT. ¿Qué pueden descontarte legalmente?',
    keywords: [
        'descuentos nómina permitidos México', 'descuentos legales salario', 'Art 110 LFT',
        'qué pueden descontarme nómina', 'IMSS ISR INFONAVIT descuento', 'límite descuento nómina',
    ],
    openGraph: {
        title: 'Calculadora Descuentos de Nómina Legales México 2026',
        description: 'Cuánto pueden descontarte legalmente y qué no pueden descontarte según la LFT.',
        url: 'https://machoteslegales.mx/calculadora/descuentos-nomina',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/descuentos-nomina' },
}
export default function Page() { return <CalculadoraDescuentoNomina /> }
