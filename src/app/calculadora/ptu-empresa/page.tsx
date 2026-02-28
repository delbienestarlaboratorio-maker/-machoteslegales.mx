import { Metadata } from 'next'
import CalculadoraPTUEmpresa from './CalculadoraPTUEmpresa'

export const metadata: Metadata = {
    title: 'Calculadora PTU para Empresas México 2026 — 10% Utilidades Distribuibles | Art. 123 CPEUM',
    description: 'Calcula cuánto PTU debe pagar tu empresa a sus trabajadores en México 2026. 10% de la utilidad fiscal, dos factores: días trabajados y salarios percibidos. Arts. 120-131 LFT.',
    keywords: ['calculadora PTU empresa México 2026', 'cálculo PTU patrón', 'utilidades trabajadores empresa', 'Art 120 LFT PTU', 'reparto utilidades empresa'],
    openGraph: { title: 'Calculadora PTU Empresa México 2026', description: 'Cuánto PTU paga tu empresa: 10% utilidad dividida en días y salarios.', url: 'https://machoteslegales.mx/calculadora/ptu-empresa' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/ptu-empresa' },
}
export default function Page() { return <CalculadoraPTUEmpresa /> }
