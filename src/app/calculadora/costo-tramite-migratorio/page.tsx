import { Metadata } from 'next'
import CalculadoraTramiteMigratorio from './CalculadoraTramiteMigratorio'

export const metadata: Metadata = {
    title: 'Calculadora de Derechos y Trámites Migratorios 2026 (INM México)',
    description: 'Calcula el pago de derechos federales por residencia temporal, permanente, visas, regularización y naturalización en el Instituto Nacional de Migración.',
    keywords: ['costo residencia permanente mexico', 'cuanto cuesta fm3', 'tarifas inm mexico', 'precio ciudadania mexicana', 'multas de migracion mexico'],
    openGraph: { title: 'Tarifario de Trámites Migratorios en México', description: 'Cotizador oficial de derechos y cuotas del INM para extranjeros (renovación de estancia, cambios de condición y permisos de trabajo).', url: 'https://machoteslegales.mx/calculadora/costo-tramite-migratorio' },
    alternates: { canonical: 'https://machoteslegales.mx/calculadora/costo-tramite-migratorio' },
}
export default function Page() { return <CalculadoraTramiteMigratorio /> }
