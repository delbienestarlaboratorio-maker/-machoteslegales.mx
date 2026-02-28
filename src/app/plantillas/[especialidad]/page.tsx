import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SPECIALTIES } from '@/data/specialties'
import { allTemplates } from '@/data/templates'
import LegalWizardWrapper from '@/components/wizards/LegalWizardWrapper'
import LaboralCalculatorWrapper from '@/components/calculators/LaboralCalculatorWrapper'

interface Props {
    params: Promise<{ especialidad: string }>
}

export function generateStaticParams() {
    return SPECIALTIES.map((s) => ({ especialidad: s.slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const spec = SPECIALTIES.find((s) => s.slug === params.especialidad)
    if (!spec) return {}
    const count = allTemplates.filter(t => t.specialty === spec.code).length
    return {
        title: `Plantillas de ${spec.name} — ${count} Formatos Legales México 2026 | Machotes Legales`,
        description: `Descarga ${count} plantillas y formatos de ${spec.name} en México. ${spec.description}. Versiones gratuitas y profesionales con jurisprudencia SCJN actualizadas 2026.`,
        keywords: [
            `plantillas ${spec.name.toLowerCase()}`,
            `formatos ${spec.name.toLowerCase()} México`,
            `${spec.name.toLowerCase()} formato PDF`,
            `${spec.name.toLowerCase()} documento gratis`,
            `machotes ${spec.name.toLowerCase()}`,
        ],
        alternates: { canonical: `https://machoteslegales.mx/plantillas/${spec.slug}` },
        openGraph: {
            title: `${spec.name} — Plantillas Legales México`,
            description: `${count} plantillas profesionales de ${spec.name}. Descarga gratis o accede a versiones V2 con jurisprudencia.`,
            url: `https://machoteslegales.mx/plantillas/${spec.slug}`,
        },
    }
}

export default async function EspecialidadPage(props: Props) {
    const params = await props.params
    const spec = SPECIALTIES.find((s) => s.slug === params.especialidad)
    if (!spec) notFound()

    // Mapear slug a código interno
    const codeMap: Record<string, string> = {}
    SPECIALTIES.forEach(s => { codeMap[s.slug] = s.code })
    const specCode = codeMap[params.especialidad] || params.especialidad

    const templates = allTemplates.filter((t) => t.specialty === specCode)
    const v1 = templates.filter((t) => t.tier === 'v1')
    const v2 = templates.filter((t) => t.tier === 'v2')
    const v3 = templates.filter((t) => t.tier === 'v3')
    const showCalculator = specCode === 'laboral'

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="text-sm text-[var(--color-text-muted)] mb-6">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/plantillas" className="hover:text-white">Plantillas</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{spec.name}</span>
            </nav>

            {/* Header */}
            <div className="mb-10 flex items-center gap-5">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${spec.color}20` }}
                >
                    {spec.icon}
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">
                        Plantillas de {spec.name}
                    </h1>
                    <p className="text-[var(--color-text-muted)] mt-1">
                        {templates.length} plantillas disponibles · {v1.length} gratuitas · {v2.length} V2 · {v3.length} V3
                    </p>
                </div>
            </div>

            {/* Asistente Legal (Wizard) */}
            <div className="mb-10">
                <LegalWizardWrapper specialty={specCode} />
            </div>

            {/* Calculadora Laboral (solo para laboral) */}
            {showCalculator && (
                <div className="mb-10">
                    <LaboralCalculatorWrapper />
                </div>
            )}

            {/* V1 — Gratuitas */}
            {v1.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold font-[family-name:var(--font-outfit)] bg-white/10 text-white">
                            V1 BÁSICO — GRATIS
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {v1.map((t) => (
                            <Link
                                key={t.id}
                                href={`/plantillas/${params.especialidad}/${t.slug}`}
                                className="glass-card p-5 glow-hover group"
                            >
                                <h2 className="font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors mb-2">
                                    {t.title}
                                </h2>
                                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">
                                    {t.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1 flex-wrap">
                                        {t.keywords.slice(0, 2).map((k) => (
                                            <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--color-text-muted)]">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[var(--color-accent)] text-xs font-semibold">Gratis →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* V2 — Negocios */}
            {v2.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold font-[family-name:var(--font-outfit)] bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                            V2 NEGOCIOS — $79 MXN
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {v2.map((t) => (
                            <Link
                                key={t.id}
                                href={`/plantillas/${params.especialidad}/${t.slug}`}
                                className="glass-card p-5 glow-hover group border-[var(--color-accent)]/20"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors flex-1 pr-2">
                                        {t.title}
                                    </h2>
                                    <span className="text-[var(--color-accent)] font-bold text-sm flex-shrink-0">
                                        $79
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">
                                    {t.description}
                                </p>
                                <div className="text-xs text-[var(--color-text-muted)]">
                                    ✨ Jurisprudencia SCJN · Argumentación completa
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* V3 — Profesional */}
            {v3.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-5">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold font-[family-name:var(--font-outfit)] bg-blue-500/20 text-blue-400">
                            V3 PROFESIONAL — SUSCRIPCIÓN
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {v3.map((t) => (
                            <Link
                                key={t.id}
                                href={`/plantillas/${params.especialidad}/${t.slug}`}
                                className="glass-card p-5 glow-hover group border-blue-500/20"
                            >
                                <h2 className="font-semibold text-white mb-2">{t.title}</h2>
                                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">{t.description}</p>
                                <div className="text-xs text-blue-400">🤖 IA Autollenado · Análisis de caso</div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* SEO Content */}
            <section className="mt-10 prose prose-invert max-w-3xl">
                <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">
                    Plantillas legales de {spec.name} en México
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm">
                    Nuestras plantillas de derecho {spec.name.toLowerCase()} están fundamentadas en la legislación mexicana vigente
                    y actualizadas conforme a las últimas reformas. Las versiones V2 incluyen jurisprudencia de la Suprema
                    Corte de Justicia de la Nación (SCJN) y argumentación legal desarrollada por especialistas.
                    {showCalculator && ' Además, incluyen una calculadora de indemnización laboral que estima montos de liquidación según la Ley Federal del Trabajo.'}
                </p>
            </section>
        </main>
    )
}
