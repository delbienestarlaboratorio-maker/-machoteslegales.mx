import { Metadata } from 'next'
import CalculadoraHonorariosMedicos from './CalculadoraHonorariosMedicos'

export const metadata: Metadata = {
    title: 'Calculadora Honorarios Médicos 2026 (Exento de IVA y Retenciones PM)',
    description: 'Calcula tus recibos de honorarios médicos. La medicina humana está exenta de IVA. Incluye cálculo automático de retenciones de ISR (10%) si le facturas a Personas Morales (Hospitales, Aseguradoras).',
    keywords: ['calculadora honorarios medicos 2026', 'recibo de honorarios medicos iva exento', 'retencion 10 isr medicos hospitales', 'como hacer recibo honorarios medicos', 'impuestos doctores mexico'],
    openGraph: { title: 'Calculadora Honorarios Médicos', description: 'Cotiza recibos exentos de IVA para doctores, psicólogos y dentistas. Con retenciones a PM.', url: 'https://machoteslegales.mx/calculadora/honorarios-medicos' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/honorarios-medicos' },
}
export default function Page() { return <CalculadoraHonorariosMedicos /> }
