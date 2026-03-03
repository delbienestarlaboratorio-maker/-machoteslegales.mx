import { Metadata } from 'next'
import CalculadoraApostilla from './CalculadoraApostilla'

export const metadata: Metadata = {
    title: 'Cotizador de Apostilla de La Haya y Legalización (SRE y SEGOB)',
    description: 'Calcula el tabulador de cobro de derechos para Apostillar o Legalizar actas de nacimiento mexicanas, títulos universitarios y poderes para uso internacional.',
    keywords: ['costo apostilla de la haya', 'apostillar acta de nacimiento', 'tarifas segob apostilla', 'donde se apostilla en mexico', 'precio legalizacion documentos internacionales'],
    openGraph: { title: 'Derechos de Apostilla Internacional México', description: 'Realiza el desglose de lo que tendrás que pagar en ventanillas de Gobernación (SEGOB) para certificar la firma de tus documentos para el extranjero. Y el cobro de intermediarios gestores.', url: 'https://machoteslegales.mx/calculadora/apostilla-la-haya' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/apostilla-la-haya' },
}
export default function Page() { return <CalculadoraApostilla /> }
