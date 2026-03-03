import { Metadata } from 'next'
import CalculadoraLiquidacionSociedadConyugal from './CalculadoraLiquidacionSociedadConyugal'

export const metadata: Metadata = {
    title: 'Calculadora de Liquidación de Sociedad Conyugal (Divorcio Bienes Mancomunados)',
    description: 'Calcula cómo se dividen los bienes gananciales a 50\% si adquiriste propiedades y deudas durante tu matrimonio por Sociedad Conyugal o Bienes Mancomunados.',
    keywords: ['liquidacion sociedad conyugal', 'divorcio bienes mancomunados calculadora', 'gananciales divorcio', 'como dividir lo de la casa al divorciarse', 'art 189 codigo civil bienes'],
    openGraph: { title: 'División de Bienes al Divorciarse (Bienes Mancomunados)', description: 'Suma los activos, resta los pasivos y calcula la partición legal 50-50 obligatoria para tu divorcio.', url: 'https://machoteslegales.mx/calculadora/liquidacion-sociedad-conyugal' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/liquidacion-sociedad-conyugal' },
}
export default function Page() { return <CalculadoraLiquidacionSociedadConyugal /> }
