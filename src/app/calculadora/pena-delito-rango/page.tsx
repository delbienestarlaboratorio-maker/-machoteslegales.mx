import { Metadata } from 'next'
import CalculadoraPenaDelito from './CalculadoraPenaDelito'

export const metadata: Metadata = {
    title: 'Calculadora de Pena por Delito (Rangos de Prisión)',
    description: 'Explorador y simulador interactivo de rangos de penas (mínimas y máximas) para los delitos más comunes en México según el Código Penal Federal.',
    keywords: ['pena por delito', 'cuantos años de carcel por robo', 'pena por homicidio', 'calculadora años de prision mexico', 'codigo penal federal penas'],
    openGraph: { title: 'Simulador de Penas de Prisión (Código Penal)', description: 'Descubre el rango mínimo y máximo de años de cárcel que impone la ley por delitos como Homicidio, Robo, Fraude, Secuestro, etc.', url: 'https://machoteslegales.mx/calculadora/pena-delito-rango' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/pena-delito-rango' },
}
export default function Page() { return <CalculadoraPenaDelito /> }
