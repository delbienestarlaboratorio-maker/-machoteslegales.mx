import { Metadata } from 'next'
import CalculadoraMultaAmbiental from './CalculadoraMultaAmbiental'

export const metadata: Metadata = {
    title: 'Calculadora de Multas Ambientales en UMAs (PROFEPA - LGEEPA)',
    description: 'Calcula matemáticamente las infracciones impuestas por dependencias ecológicas (PROFEPA, SEDEMA) en base a su equivalencia legal de Unidades de Medida y Actualización (UMA).',
    keywords: ['multa ambiental lgeepa', 'cuanto cobra profepa', 'multa umas ecologica', 'sanciones ambientales mexico', 'calculadora multa ecologia'],
    openGraph: { title: 'Riesgos Económicos por Multas Ambientales (PROFEPA)', description: 'Tabulador interactivo que tasa las infracciones por daño al ecosistema en México, que oscilan entre 30 y 50,000 UMAs.', url: 'https://machoteslegales.mx/calculadora/multa-ambiental' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multa-ambiental' },
}
export default function Page() { return <CalculadoraMultaAmbiental /> }
