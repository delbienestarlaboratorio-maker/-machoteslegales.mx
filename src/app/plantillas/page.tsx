import { Metadata } from "next";
import { SPECIALTIES, TOTAL_TEMPLATES } from "@/data/specialties";
import SearchBarWrapper from "@/components/SearchBarWrapper";

export const metadata: Metadata = {
    title: "Plantillas Legales México 2026 — Catálogo Completo | Machotes Legales",
    description: `Explora más de ${TOTAL_TEMPLATES} plantillas legales profesionales organizadas en 14 especialidades del derecho mexicano. Demandas, contratos, amparos, querellas y más. Búsqueda inteligente tolerante a errores.`,
    alternates: { canonical: "https://machoteslegales.mx/plantillas" },
};

export default function PlantillasPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="text-sm text-[var(--color-text-muted)] mb-6">
                <a href="/" className="hover:text-white">Inicio</a>
                <span className="mx-2">/</span>
                <span className="text-white">Plantillas</span>
            </nav>

            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)]">
                    Catálogo de Plantillas Legales
                </h1>
                <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
                    Más de {TOTAL_TEMPLATES} formatos y plantillas organizados por especialidad.
                    Descarga gratis las versiones básicas o accede a documentos profesionales con jurisprudencia.
                </p>
            </div>

            {/* Buscador inteligente */}
            <div className="mb-10 max-w-xl">
                <SearchBarWrapper variant="page" />
            </div>

            {/* Specialty Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {SPECIALTIES.map((spec) => (
                    <a
                        key={spec.code}
                        href={`/plantillas/${spec.slug}`}
                        className="glass-card p-6 glow-hover group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{ backgroundColor: `${spec.color}15` }}
                            >
                                {spec.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">
                                    {spec.name}
                                </h2>
                                <p className="text-xs text-[var(--color-text-muted)]">{spec.templateCount} plantillas</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-4">
                            {spec.description}
                        </p>
                        <div
                            className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                            style={{ color: spec.color }}
                        >
                            Ver plantillas
                            <span>→</span>
                        </div>
                    </a>
                ))}
            </div>

            {/* SEO Content */}
            <section className="mt-16 prose prose-invert max-w-3xl">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">
                    ¿Qué son las plantillas legales?
                </h2>
                <p className="text-[var(--color-text-muted)]">
                    Las plantillas legales son formatos prediseñados de documentos jurídicos que facilitan la
                    elaboración de escritos, demandas, contratos, querellas y otros instrumentos legales. En Machotes Legales
                    ofrecemos plantillas actualizadas conforme a la legislación mexicana vigente, fundamentadas
                    en los códigos y leyes federales aplicables a cada materia.
                </p>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mt-8">
                    ¿Por qué usar plantillas legales profesionales?
                </h2>
                <p className="text-[var(--color-text-muted)]">
                    Utilizar una plantilla profesional garantiza que tu documento incluya todos los elementos
                    procesales requeridos: proemio correcto, fundamentación legal precisa, estructura adecuada
                    de hechos y derecho, ofrecimiento de pruebas y puntos petitorios bien formulados. Nuestras
                    plantillas V2 y V3 incluyen jurisprudencia citada y desarrollo argumentativo que marca la
                    diferencia en la práctica legal.
                </p>
            </section>
        </main>
    );
}
