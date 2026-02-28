import { Metadata } from 'next'
import CalculadoraISRHonorarios from './CalculadoraISRHonorarios'

export const metadata: Metadata = {
    title: 'Calculadora ISR Honorarios Profesionales México 2026 | Arts. 100-109 LISR',
    description: 'Calcula el ISR de tus honorarios como abogado, médico o contador en México 2026. Persona física actividad profesional: pagos provisionales, deducciones autorizadas y tasa Art. 96 LISR.',
    keywords: ['ISR honorarios profesionales México', 'pago provisional honorarios', 'Art 100 LISR', 'ISR abogado médico contador', 'persona física servicios profesionales 2026'],
    openGraph: { title: 'Calculadora ISR Honorarios Profesionales México 2026', description: 'Calcula tu pago provisional de ISR como profesionista independiente.', url: 'https://machoteslegales.mx/calculadora/isr-honorarios' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-honorarios' },
}
export default function Page() { return <CalculadoraISRHonorarios /> }
