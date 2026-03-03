import { Metadata } from 'next'
import CalculadoraReparacionDanoPenal from './CalculadoraReparacionDanoPenal'

export const metadata: Metadata = {
    title: 'Calculadora de Reparación del Daño Penal en México',
    description: 'Simula el cálculo monetario que impone el Juez Penal por la vía civil como "Reparación del Daño", abarcando daños materiales, tratamientos y el daño moral punitivo.',
    keywords: ['reparacion daño penal', 'cuanto se paga de reparacion del daño', 'calculadora daño moral penal', 'codigo nacional procedimientos penales'],
    openGraph: { title: 'Reparación del Daño (Materia Penal)', description: 'Simula cómo computan los juzgados penales el pago forzoso del victimario hacia la víctima tras una sentencia condenatoria.', url: 'https://machoteslegales.mx/calculadora/reparacion-dano-penal' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/reparacion-dano-penal' },
}
export default function Page() { return <CalculadoraReparacionDanoPenal /> }
