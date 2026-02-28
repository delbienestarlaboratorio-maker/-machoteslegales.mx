import { Metadata } from 'next'
import CalculadoraNotarial from './CalculadoraNotarial'

export const metadata: Metadata = {
    title: 'Calculadora Honorarios Notariales México 2026 — Compraventa y Escrituración',
    description: 'Estima los honorarios del notario para tu escritura de compraventa en México 2026. Gastos notariales incluyen: honorarios, ISR adquisición, derechos registro, ISAI y CFDI.',
    keywords: ['honorarios notariales México 2026', 'gastos escrituración compraventa', 'cuánto cobra el notario', 'ISAI escrituración', 'gastos notario casa México'],
    openGraph: { title: 'Calculadora Honorarios Notariales México 2026', description: 'Estima todos los gastos de escrituración: notario + impuestos + derechos registro.', url: 'https://machoteslegales.mx/calculadora/honorarios-notariales' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/honorarios-notariales' },
}
export default function Page() { return <CalculadoraNotarial /> }
