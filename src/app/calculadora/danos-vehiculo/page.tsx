import { Metadata } from 'next'
import CalculadoraDanosVehiculo from './CalculadoraDanosVehiculo'

export const metadata: Metadata = {
    title: 'Calculadora Daños por Accidente de Tránsito México 2026 | Vehículo + Lesiones',
    description: 'Calcula la indemnización por accidente vehicular en México 2026: daños al vehículo, gastos médicos, días de incapacidad en UMAs y perjuicios. Art. 1915 CCF.',
    keywords: ['indemnización accidente tránsito México', 'daños vehículo seguro accidente', 'Art 1915 CCF daños', 'días incapacidad UMA accidente', 'reclamar daños accidente México'],
    openGraph: { title: 'Calculadora Indemnización Accidente de Tránsito México 2026', description: 'Calcula daños al vehículo + lesiones + incapacidad en un accidente.', url: 'https://machoteslegales.mx/calculadora/danos-vehiculo' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/danos-vehiculo' },
}
export default function Page() { return <CalculadoraDanosVehiculo /> }
