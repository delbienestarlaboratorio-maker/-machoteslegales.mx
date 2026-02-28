import { Metadata } from 'next'
import CalculadoraIntereses from './CalculadoraIntereses'

export const metadata: Metadata = {
    title: 'Calculadora Interés Simple y Compuesto México 2026 — Tabla Amortización | Art. 1946 CC',
    description: 'Calcula intereses simples o compuestos sobre capital, con tabla de deuda mes a mes. Incluye intereses moratorios, interés legal 9% anual (Art. 2395 CC) y tasas personalizadas.',
    keywords: ['calculadora interes simple compuesto mexico 2026', 'tabla amortizacion interes', 'Art 2395 codigo civil interes legal', 'interes moratoria Mexico', 'interes sobre saldo insoluto'],
    openGraph: { title: 'Calculadora Interés Simple y Compuesto 2026', description: 'Interés simple vs compuesto con tabla de amortización mensual y tasa legal 9% Art. 2395 CC.', url: 'https://machoteslegales.mx/calculadora/intereses' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/intereses' },
}
export default function Page() { return <CalculadoraIntereses /> }
