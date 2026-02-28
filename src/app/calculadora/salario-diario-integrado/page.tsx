import { Metadata } from 'next'
import CalculadoraSDI from './CalculadoraSDI'

export const metadata: Metadata = {
    title: 'Calculadora Salario Diario Integrado (SDI) México 2026 — IMSS, Infonavit, Indemnización',
    description:
        'Calcula tu Salario Diario Integrado (SDI) para IMSS, Infonavit y cálculos legales en México 2026. Factor de integración automático según antigüedad. Art. 84 LFT.',
    keywords: [
        'salario diario integrado', 'SDI calculadora', 'factor de integración',
        'IMSS cuotas', 'Infonavit SDI', 'Art 84 LFT', 'salario base de cotización',
        'calcular SDI México 2026', 'salario integrado fórmula',
    ],
    openGraph: {
        title: 'Calculadora SDI — Salario Diario Integrado México 2026',
        description: 'Calcula tu SDI para IMSS, Infonavit y cálculos legales. Factor de integración automático.',
        url: 'https://machoteslegales.mx/calculadora/salario-diario-integrado',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/salario-diario-integrado' },
}

export default function Page() {
    return <CalculadoraSDI />
}
