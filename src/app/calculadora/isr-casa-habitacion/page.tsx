import { Metadata } from 'next'
import CalculadoraISRCasaHabitacion from './CalculadoraISRCasaHabitacion'

export const metadata: Metadata = {
    title: 'Calculadora ISR Venta Casa Habitación México 2026 — Exención 700,000 UMAs Art. 93 LISR',
    description: 'Calcula si tu venta de casa habitación está exenta de ISR. Exención de hasta 700,000 UMAs aplicable una vez cada 3 años (Art. 93 fracción XIX LISR). Incluye plusvalía y retención notario.',
    keywords: ['ISR venta casa habitacion 2026', 'exencion ISR casa habitacion 700000 UMAs', 'Art 93 LISR venta inmueble', 'calculadora ISR venta casa Mexico', 'cuanto pago ISR al vender mi casa'],
    openGraph: { title: 'Calculadora ISR Venta Casa Habitación 2026', description: 'Exención hasta 700,000 UMAs. Solo aplica si fue tu casa los últimos 2 años.', url: 'https://machoteslegales.mx/calculadora/isr-casa-habitacion' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/isr-casa-habitacion' },
}
export default function Page() { return <CalculadoraISRCasaHabitacion /> }
