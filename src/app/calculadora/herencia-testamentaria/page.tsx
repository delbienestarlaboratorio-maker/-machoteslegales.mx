import { Metadata } from 'next'
import CalculadoraHerenciaTestamentaria from './CalculadoraHerenciaTestamentaria'

export const metadata: Metadata = {
    title: 'Calculadora de Herencia Testamentaria y Legítima',
    description: 'Calcula cómo se reparte una herencia según si hay testamento o es intestada. Simula legítima, mejoras, libre disposición y legados según el Código Civil Federal.',
    keywords: ['calculadora herencia', 'como se reparte herencia', 'testamentaria', 'intestado', 'art 1599 codigo civil', 'quien hereda si no hay testamento'],
    openGraph: { title: 'Simulador de Reparto de Herencias (México)', description: 'Simula a quién le toca qué porcentaje de la herencia ya sea intestada (legítima) o con testamento válido.', url: 'https://machoteslegales.mx/calculadora/herencia-testamentaria' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/herencia-testamentaria' },
}
export default function Page() { return <CalculadoraHerenciaTestamentaria /> }
