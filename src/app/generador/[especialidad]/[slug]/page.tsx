import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import path from 'path'
import fs from 'fs'
import { allTemplates } from '@/data/templates'
import { SPECIALTIES } from '@/data/specialties'
import GeneradorContratoClient from './GeneradorContratoClient'

interface Props {
    params: Promise<{ especialidad: string; slug: string }>
}

export function generateStaticParams() {
    // Solo generamos rutas estáticas para las V2 para el piloto del generador
    return allTemplates
        .filter(t => t.tier === 'v2')
        .map((t) => ({
            especialidad: SPECIALTIES.find(s => s.code === t.specialty)?.slug ?? t.specialty,
            slug: t.slug,
        }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const spec = SPECIALTIES.find(s => s.slug === params.especialidad)
    const specCode = spec?.code ?? params.especialidad
    const template = allTemplates.find(
        (t) => t.specialty === specCode && t.slug === params.slug && t.tier === 'v2'
    )
    if (!template) return {}

    return {
        title: `Generar ${template.title} | Tool Interactiva México`,
        description: `Crea tu ${template.title} en 5 minutos. Llena el formulario fácil y obtén el PDF blindado al instante.`,
        robots: { index: false, follow: false }, // Por ahora no indexamos el generador hasta que salga de beta piloto
    }
}

export default async function GeneradorPage(props: Props) {
    const params = await props.params
    const spec = SPECIALTIES.find((s) => s.slug === params.especialidad)
    const specCode = spec?.code ?? params.especialidad
    const template = allTemplates.find(
        (t) => t.specialty === specCode && t.slug === params.slug && t.tier === 'v2'
    )

    if (!template) notFound()

    // 1. Cargar el HTML del Machote Maestro
    let htmlContent = ''
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'templates', template.file)
        htmlContent = fs.readFileSync(filePath, 'utf-8')
    } catch {
        return <div className="p-10 text-center text-white">Error cargando el motor de ensamblaje. Intente más tarde.</div>
    }

    // 2. Extraer los estilos de base_v2.html para inyectarlos en la vista de impresión
    let baseStyles = ''
    try {
        const basePath = path.join(process.cwd(), 'src', 'data', 'templates-v2', 'base_v2.html')
        const baseHtml = fs.readFileSync(basePath, 'utf-8')
        const styleMatch = baseHtml.match(/<style>([\s\S]*?)<\/style>/)
        if (styleMatch) {
            baseStyles = styleMatch[1]
        }
    } catch {
        console.warn("No se pudo cargar base_v2.html styles")
    }

    return (
        <main className="min-h-screen bg-[var(--color-bg)]">
            <GeneradorContratoClient
                template={template}
                htmlRaw={htmlContent}
                baseStyles={baseStyles}
            />
        </main>
    )
}
