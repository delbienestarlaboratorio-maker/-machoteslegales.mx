import { Metadata } from 'next'
import CalculadoraMutaIMPI from './CalculadoraMultaIMPI'

export const metadata: Metadata = {
    title: 'Calculadora de Infracciones IMPI y Reparación del Daño (Ley Federal de Protección a la Propiedad Industrial)',
    description: 'Calcula multas del IMPI por uso de marca sin registro, piratería y la base histórica del 40% de indemnización por daños y perjuicios comerciales.',
    keywords: ['multa impi marca', 'indemnizacion pirateria mexico', 'art 344 LFPI', 'cuanto cobra impi infraccion', 'daños perjuicios marca registrada'],
    openGraph: { title: 'Daños y Perjuicios por Invasión de Marca (IMPI)', description: 'Simula el golpe millonario que aplica la Ley de Propiedad Industrial cuando alquien roba o comercializa con el nombre de tu marca registrada (Base del 40%).', url: 'https://machoteslegales.mx/calculadora/multa-impi-pirateria' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/multa-impi-pirateria' },
}
export default function Page() { return <CalculadoraMutaIMPI /> }
