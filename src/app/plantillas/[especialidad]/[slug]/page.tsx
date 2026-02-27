import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import path from 'path'
import fs from 'fs'
import { allTemplates } from '@/data/templates'
import { SPECIALTIES } from '@/data/specialties'
import StatefulTemplateViewer from '@/components/StatefulTemplateViewer'
import AdBannerWrapper from '@/components/ads/AdBannerWrapper'
import LaboralCalculatorSlugWrapper from '@/components/calculators/LaboralCalculatorSlugWrapper'
import CheckoutButton from '@/components/CheckoutButton'
import TrustBadges from '@/components/TrustBadges'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'

interface Props {
    params: Promise<{ especialidad: string; slug: string }>
}

export function generateStaticParams() {
    return allTemplates.map((t) => ({
        especialidad: SPECIALTIES.find(s => s.code === t.specialty)?.slug ?? t.specialty,
        slug: t.slug,
    }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const spec = SPECIALTIES.find(s => s.slug === params.especialidad)
    const specCode = spec?.code ?? params.especialidad
    const template = allTemplates.find(
        (t) => t.specialty === specCode && t.slug === params.slug
    )
    if (!template) return {}

    return {
        title: `${template.title} — Formato Legal México 2026 | Machotes Legales`,
        description: template.description,
        keywords: template.keywords.join(', '),
        alternates: {
            canonical: `https://machoteslegales.mx/plantillas/${params.especialidad}/${params.slug}`,
        },
        openGraph: {
            title: template.title,
            description: template.description,
            type: 'article',
        },
    }
}

export default async function TemplatePage(props: Props) {
    const params = await props.params
    const spec = SPECIALTIES.find((s) => s.slug === params.especialidad)
    const specCode = spec?.code ?? params.especialidad
    const template = allTemplates.find(
        (t) => t.specialty === specCode && t.slug === params.slug
    )
    if (!template) notFound()

    // Cargar HTML desde el sistema de archivos en build time (server component)
    let htmlContent = ''
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'templates', template.file)
        const rawHtml = fs.readFileSync(filePath, 'utf-8')
        if (rawHtml) {
            // Limpiar bloques de control Jinja2 ({% ... %}) — por si quedan en V3
            htmlContent = rawHtml.replace(/{%[\s\S]*?%}/g, '')
            // Para V3: convertir {{ variable | default("texto") }} → span azul con solo el texto del default
            htmlContent = htmlContent.replace(
                /\{\{\s*[\w.]+\s*\|\s*default\(\s*["']([^"']+)["']\s*\)\s*\}\}/g,
                '<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">($1)</span>'
            )
            // Variables sin default
            htmlContent = htmlContent.replace(
                /\{\{\s*([\w.]+)\s*\}\}/g,
                '<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(completar)</span>'
            )
        }
    } catch {
        htmlContent = `<p style="color:#999;text-align:center;padding:40px;">Preview no disponible para esta plantilla.</p>`
    }

    const tierLabels = { v1: 'Básico', v2: 'Negocios', v3: 'Profesional' }
    const tierPrices = { v1: 'Gratis', v2: '$79 MXN', v3: 'Suscripción' }
    const isLaboral = specCode === 'laboral'
    const showAd = template.tier === 'v1'

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb + Schema */}
            <nav className="text-sm text-[var(--color-text-muted)] mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/plantillas" className="hover:text-white">Plantillas</Link>
                <span className="mx-2">/</span>
                <Link href={`/plantillas/${params.especialidad}`} className="hover:text-white">
                    {spec?.name ?? params.especialidad}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{template.title}</span>
            </nav>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Sidebar izquierdo */}
                <aside className="xl:col-span-1 space-y-5">
                    {/* Info Card */}
                    <div className="glass-card p-5">
                        <div className={`inline-block px-2.5 py-1 rounded text-xs font-bold mb-3 ${template.tier === 'v1' ? 'bg-white/10 text-white' :
                            template.tier === 'v2' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>
                            {template.tier.toUpperCase()} {tierLabels[template.tier]}
                        </div>
                        <h1 className="text-lg font-bold text-white mb-2">{template.title}</h1>
                        <p className="text-xs text-[var(--color-text-muted)] mb-4">{template.description}</p>

                        {/* Precio y CTA */}
                        <div className="text-2xl font-bold text-[var(--color-accent)] mb-3">
                            {tierPrices[template.tier]}
                        </div>

                        {template.tier === 'v1' ? (
                            <button
                                id="btn-download-free"
                                className="w-full py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black font-semibold text-sm transition-colors"
                            >
                                ↓ Descargar Gratis
                            </button>
                        ) : template.tier === 'v2' ? (
                            <CheckoutButton
                                templateId={template.id}
                                title={template.title}
                                price={template.price}
                                className="w-full py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-[var(--color-primary-dark)] font-bold text-sm transition-colors"
                            >
                                Comprar — ${template.price} MXN
                            </CheckoutButton>
                        ) : (
                            <button className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors">
                                Suscribirse — Ver planes
                            </button>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-4">
                        <TrustBadges />
                    </div>

                    {/* Fundamento Legal */}
                    <div className="glass-card p-5">
                        <h2 className="text-sm font-semibold text-white mb-3">Fundamento Legal</h2>
                        <ul className="space-y-1">
                            {template.legalBasis.map((law) => (
                                <li key={law} className="text-xs text-[var(--color-text-muted)] flex gap-2">
                                    <span className="text-[var(--color-accent)]">§</span>
                                    {law}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Keywords */}
                    <div className="glass-card p-5">
                        <h2 className="text-sm font-semibold text-white mb-3">Temas relacionados</h2>
                        <div className="flex flex-wrap gap-2">
                            {template.keywords.map((k) => (
                                <span key={k} className="text-xs px-2 py-1 rounded-full bg-white/5 text-[var(--color-text-muted)]">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Otras versiones */}
                    <div className="glass-card p-5">
                        <h2 className="text-sm font-semibold text-white mb-3">Versiones disponibles</h2>
                        {(['v1', 'v2', 'v3'] as const).map((tier) => {
                            const alt = allTemplates.find(
                                (t) => t.specialty === specCode &&
                                    t.slug.includes(params.slug.replace(/-completa/, '').replace(/-v[123]$/, '')) &&
                                    t.tier === tier
                            )
                            const active = tier === template.tier
                            return (
                                <div key={tier} className={`flex items-center justify-between py-2 border-b border-white/5 last:border-0 ${active ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${tier === 'v1' ? 'bg-white/10 text-white' :
                                        tier === 'v2' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>{tier.toUpperCase()}</span>
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        {tier === 'v1' ? 'Gratis' : tier === 'v2' ? '$79' : 'Suscripción'}
                                    </span>
                                    {alt && !active ? (
                                        <Link href={`/plantillas/${params.especialidad}/${alt.slug}`} className="text-xs text-[var(--color-accent)]">
                                            Ver →
                                        </Link>
                                    ) : active ? (
                                        <span className="text-xs text-white">Actual</span>
                                    ) : (
                                        <span className="text-xs text-[var(--color-text-muted)]">—</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Ad en V1 */}
                    {showAd && <AdBannerWrapper format="vertical" />}
                </aside>

                {/* Vista previa del template */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Calculadora Laboral (si aplica) */}
                    {isLaboral && <LaboralCalculatorSlugWrapper tier={template.tier as 'v1' | 'v2' | 'v3'} />}

                    <StatefulTemplateViewer
                        htmlContent={htmlContent}
                        title={template.title}
                        tier={template.tier}
                    />

                    {/* Ad horizontal en V1 */}
                    {showAd && <AdBannerWrapper format="horizontal" />}
                </div>
            </div>

            {/* SEO Content */}
            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">
                    Sobre este documento: {template.title}
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm">{template.description}</p>
                <p className="text-[var(--color-text-muted)] text-sm">
                    Fundamentado en: {template.legalBasis.join(', ')}.
                </p>
            </section>

            {/* Trust Building Sections */}
            <TestimonialsSection />
            <FAQSection />

        </main>
    )
}
