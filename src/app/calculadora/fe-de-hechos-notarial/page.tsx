import { Metadata } from 'next'
import CalculadoraFeHechos from './CalculadoraFeHechos'

export const metadata: Metadata = {
    title: 'Cotizador de Fe de Hechos Notarial y Fe Pública',
    description: 'Calcula los honorarios notariales promedio por solicitar una Fe de Hechos, Notificaciones y Requerimientos de Pago a domicilio con Notario Público.',
    keywords: ['costo fe de hechos notario', 'fe publica notario precio', 'notificar con notario', 'honorarios fedatario hechos', 'requerimiento de pago notarial'],
    openGraph: { title: 'Arancel de Diligencias y Fe de Hechos Notarial', description: 'Simula el costo de sacar al Notario de su oficina para dar fe pública de un despojo, asamblea, inventario o notificación prejudicial.', url: 'https://machoteslegales.mx/calculadora/fe-de-hechos-notarial' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/fe-de-hechos-notarial' },
}
export default function Page() { return <CalculadoraFeHechos /> }
