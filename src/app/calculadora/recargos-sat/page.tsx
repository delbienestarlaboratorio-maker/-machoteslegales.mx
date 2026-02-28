import { Metadata } from 'next'
import CalculadoraRecargosSAT from './CalculadoraRecargosSAT'

export const metadata: Metadata = {
    title: 'Calculadora Recargos SAT México 2026 — Art. 21 CFF + Actualización INPC',
    description: 'Calcula los recargos por omisión de pago de impuestos al SAT. Tasa mensual oficial Art. 21 CFF más actualización por inflación (INPC). Con y sin moratoria.',
    keywords: ['calculadora recargos SAT 2026', 'Art 21 CFF recargos fiscales', 'tasa recargos SAT mensual', 'actualizacion impuestos INPC SAT', 'contribuciones omitidas recargos'],
    openGraph: { title: 'Calculadora Recargos e IMPOSTACION SAT 2026', description: 'Recargos Art. 21 CFF + actualización INPC sobre contribuciones omitidas.', url: 'https://machoteslegales.mx/calculadora/recargos-sat' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/recargos-sat' },
}
export default function Page() { return <CalculadoraRecargosSAT /> }
