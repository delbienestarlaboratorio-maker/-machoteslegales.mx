import { Metadata } from 'next'
import CalculadoraNomina from './CalculadoraNomina'

export const metadata: Metadata = {
    title: 'Calculadora de Nómina Completa México 2026 — Bruto a Neto | ISR + IMSS',
    description: 'Calcula tu nómina neta mensual en México 2026: salario bruto, ISR, IMSS obrero, INFONAVIT. Desglose completo de percepciones y deducciones. Art. 96 LISR + LSS.',
    keywords: ['calculadora nómina completa México 2026', 'salario bruto a neto', 'ISR IMSS nómina', 'nómina mensual quincenal', 'percepciones deducciones nómina'],
    openGraph: { title: 'Calculadora Nómina Completa México 2026', description: 'Calcula tu neto: bruto → ISR → IMSS → INFONAVIT → lo que recibes.', url: 'https://machoteslegales.mx/calculadora/nomina-completa' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/nomina-completa' },
}
export default function Page() { return <CalculadoraNomina /> }
