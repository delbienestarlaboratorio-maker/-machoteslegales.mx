import { Metadata } from 'next'
import CalculadoraVacaciones from './CalculadoraVacaciones'

export const metadata: Metadata = {
    title: 'Calculadora Vacaciones México 2026 — ¿Cuántos Días Me Tocan? | Art. 76 LFT Reforma 2023',
    description:
        'Calcula tus días de vacaciones según tu antigüedad con la tabla actualizada de la reforma 2023. Art. 76 LFT. Incluye prima vacacional 25%.',
    keywords: [
        'calculadora vacaciones México 2026', 'días de vacaciones por antigüedad',
        'reforma vacaciones 2023', 'Art 76 LFT', 'tabla vacaciones LFT',
        'cuántos días de vacaciones me tocan', 'prima vacacional 25%',
    ],
    openGraph: {
        title: 'Calculadora Vacaciones México 2026 — Reforma 2023',
        description: 'Tabla completa de días de vacaciones por antigüedad con la reforma 2023.',
        url: 'https://machoteslegales.mx/calculadora/vacaciones-antiguedad',
    },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/vacaciones-antiguedad' },
}

export default function Page() {
    return <CalculadoraVacaciones />
}
