import { Metadata } from "next";
import { SPECIALTIES, TOTAL_TEMPLATES } from "@/data/specialties";
import { templateStats } from "@/data/templates";
import SearchBarWrapper from "@/components/SearchBarWrapper";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Machotes Legales — Plantillas y Formatos Legales México 2026 | Descarga Gratis",
  description: "La plataforma #1 de plantillas legales en México. Más de 400 formatos: demandas, contratos, amparos, querellas, divorcios, poderes y más. Descarga gratis o accede a versiones profesionales con jurisprudencia SCJN.",
  keywords: [
    "plantillas legales México",
    "formatos jurídicos gratis",
    "machotes legales descargar",
    "demanda formato PDF",
    "contrato arrendamiento plantilla",
    "querella penal formato",
    "divorcio incausado formato México",
    "demanda laboral plantilla gratis",
    "amparo indirecto formato",
    "poder notarial formato",
    "documentos legales México 2026",
  ],
  alternates: { canonical: "https://machoteslegales.mx" },
  openGraph: {
    title: "Machotes Legales — Plantillas Legales Profesionales México",
    description: "Más de 400 plantillas legales profesionales. Descarga gratis o accede a versiones premium con auto-llenado por IA.",
    url: "https://machoteslegales.mx",
    type: "website",
    locale: "es_MX",
    images: ["/og-image.png"],
  },
};


export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-6 badge-shimmer">
              <span>⚡</span>
              <span>+{TOTAL_TEMPLATES} plantillas legales disponibles</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-outfit)] leading-tight">
              Plantillas Legales
              <br />
              <span className="gradient-gold">Profesionales de México</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Demandas, contratos, amparos, querellas y más.
              Formatos actualizados al 2026 con fundamento legal.
              Calculadoras integradas y asistentes interactivos.
            </p>

            {/* Buscador global en el hero */}
            <div className="mt-10 flex justify-center">
              <SearchBarWrapper variant="hero" placeholder="Buscar plantilla... ej: divorcio, amparo, despido" />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <a
                href="/plantillas"
                className="px-8 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-all shadow-lg shadow-[var(--color-accent)]/20"
              >
                Ver Plantillas Gratis
              </a>
              <a
                href="/precios"
                className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all"
              >
                Ver Planes Pro
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {[
              { value: `${TOTAL_TEMPLATES}+`, label: "Plantillas Totales" },
              { value: "14", label: "Especialidades" },
              { value: "3", label: "Niveles de Calidad" },
              { value: "2026", label: "Actualizado" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-gold">{stat.value}</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* Comparativa V1 vs V2 vs V3  ═══════════════ */}
      {/* ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)]">
            Tres Niveles, <span className="gradient-gold">Una Plataforma</span>
          </h2>
          <p className="mt-4 text-[var(--color-text-muted)] max-w-xl mx-auto">
            Desde plantillas básicas gratuitas hasta documentos de elite generados por IA.
            Elige el nivel que necesitas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* ── V1 Básico ── */}
          <div className="glass-card p-8 glow-hover flex flex-col">
            <div className="text-sm font-semibold text-green-400 mb-2">GRATUITO</div>
            <h3 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">V1 Básico</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-[var(--color-text-muted)]"> / siempre</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{templateStats.totalV1} plantillas disponibles</div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)] flex-1">
              <li className="flex gap-2"><span className="text-green-400">✓</span> Plantillas funcionales con campos editables</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Artículos de ley citados</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Calculadora laboral básica (3 conceptos)</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Descarga PDF con marca de agua</li>
              <li className="flex gap-2"><span className="text-green-400">✓</span> Asistente legal de navegación</li>
              <li className="flex gap-2"><span className="text-[var(--color-text-muted)]">✗</span> Sin jurisprudencia SCJN</li>
              <li className="flex gap-2"><span className="text-[var(--color-text-muted)]">✗</span> Sin cálculos avanzados</li>
            </ul>
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-xs font-semibold text-white mb-2">Ejemplos de plantillas V1:</p>
              <ul className="text-xs text-[var(--color-text-muted)] space-y-1">
                <li>• Demanda laboral por despido injustificado</li>
                <li>• Querella por fraude (básica)</li>
                <li>• Pagaré con requisitos LGTOC</li>
                <li>• Amparo directo</li>
                <li>• Poder general para pleitos y cobranzas</li>
              </ul>
            </div>
            <a href="/plantillas" className="mt-6 block w-full text-center py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
              Explorar Gratis
            </a>
          </div>

          {/* ── V2 Negocios ── */}
          <div className="glass-card p-8 glow-hover border-[var(--color-accent)]/30 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-primary-dark)] text-xs font-bold">
              POPULAR
            </div>
            <div className="text-sm font-semibold text-[var(--color-accent)] mb-2">NEGOCIOS</div>
            <h3 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">V2 Mejorado</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$79</span>
              <span className="text-[var(--color-text-muted)]"> / plantilla</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{templateStats.totalV2} plantillas premium</div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)] flex-1">
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">✓</span> Todo de V1 Básico</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">✓</span> Fundamentación legal exhaustiva</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">✓</span> 2-3 tesis SCJN citadas por plantilla</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">✓</span> Calculadora avanzada (7+ conceptos)</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">✓</span> PDF limpio sin marca de agua</li>
              <li className="flex gap-2"><span className="text-[var(--color-accent)]">✓</span> Variaciones por tipo de caso</li>
              <li className="flex gap-2"><span className="text-[var(--color-text-muted)]">✗</span> Sin auto-llenado IA</li>
            </ul>
            <div className="mt-5 pt-4 border-t border-[var(--color-accent)]/10">
              <p className="text-xs font-semibold text-[var(--color-accent)] mb-2">Ejemplos de plantillas V2:</p>
              <ul className="text-xs text-[var(--color-text-muted)] space-y-1">
                <li>• Amparo Indirecto + 3 tesis SCJN + suspensión</li>
                <li>• Querella Fraude + elementos del tipo penal</li>
                <li>• Despido Injustificado + cálculos detallados</li>
                <li>• Divorcio Incausado + propuesta de convenio</li>
                <li>• Contrato Arrendamiento + cláusulas blindadas</li>
              </ul>
            </div>
            <a href="/precios" className="mt-6 block w-full text-center py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold hover:bg-[var(--color-accent-light)] transition-all">
              Comprar Plantilla
            </a>
          </div>

          {/* ── V3 Profesional ── */}
          <div className="glass-card p-8 glow-hover flex flex-col">
            <div className="text-sm font-semibold text-purple-400 mb-2">PROFESIONAL</div>
            <h3 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">V3 Elite</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$499</span>
              <span className="text-[var(--color-text-muted)]"> / mes</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Todas las plantillas ilimitadas</div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)] flex-1">
              <li className="flex gap-2"><span className="text-purple-400">✓</span> Todo de V2 Negocios</li>
              <li className="flex gap-2"><span className="text-purple-400">✓</span> Asistentes inteligentes (Wizards IA)</li>
              <li className="flex gap-2"><span className="text-purple-400">✓</span> Cuestionarios que generan el documento</li>
              <li className="flex gap-2"><span className="text-purple-400">✓</span> Miles de sub-tipos específicos</li>
              <li className="flex gap-2"><span className="text-purple-400">✓</span> Jurisprudencia + tesis aisladas</li>
              <li className="flex gap-2"><span className="text-purple-400">✓</span> Auto-llenado con IA (20/mes)</li>
              <li className="flex gap-2"><span className="text-purple-400">✓</span> PDF con tu logo personalizado</li>
            </ul>
            <div className="mt-5 pt-4 border-t border-purple-500/10">
              <p className="text-xs font-semibold text-purple-400 mb-2">Lo que incluye V3:</p>
              <ul className="text-xs text-[var(--color-text-muted)] space-y-1">
                <li>• Te pregunta: {"\"¿Qué tipo de divorcio? ¿Hay hijos?\""}</li>
                <li>• Genera la demanda completa a la medida</li>
                <li>• Selecciona jurisprudencia automáticamente</li>
                <li>• Calcula montos con tus datos específicos</li>
                <li>• Acceso ilimitado a todas las especialidades</li>
              </ul>
            </div>
            <a href="/precios" className="mt-6 block w-full text-center py-3 rounded-lg border border-purple-400/30 text-purple-300 font-semibold hover:bg-purple-400/10 transition-all">
              Comenzar Prueba
            </a>
          </div>
        </div>

        {/* Tabla comparativa rápida */}
        <div className="mt-12 glass-card p-6 overflow-x-auto">
          <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-outfit)]">Comparativa Rápida</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Característica</th>
                <th className="text-center py-2 text-green-400 font-medium">V1 Gratis</th>
                <th className="text-center py-2 text-[var(--color-accent)] font-medium">V2 $79</th>
                <th className="text-center py-2 text-purple-400 font-medium">V3 $499/mes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-muted)]">
              {[
                ["Plantillas con fundamento legal", "✓", "✓", "✓"],
                ["Calculadoras integradas", "Básica", "Avanzada", "IA"],
                ["Jurisprudencia SCJN citada", "✗", "2-3 tesis", "Automática"],
                ["Asistente legal (Wizard)", "Navegación", "Navegación", "Genera documento"],
                ["PDF sin marca de agua", "✗", "✓", "✓"],
                ["Sub-tipos por caso (divorcio, delito)", "✗", "Variaciones", "Ilimitado"],
                ["Auto-llenado con IA", "✗", "✗", "20/mes"],
                ["Logo personalizado en PDF", "✗", "✗", "✓"],
                ["Anuncios", "Sí (no invasivos)", "Sin anuncios", "Sin anuncios"],
              ].map(([feat, v1, v2, v3]) => (
                <tr key={feat} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-2.5 text-white">{feat}</td>
                  <td className="py-2.5 text-center">{v1}</td>
                  <td className="py-2.5 text-center">{v2}</td>
                  <td className="py-2.5 text-center">{v3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)]">
            14 Especialidades del Derecho Mexicano
          </h2>
          <p className="mt-4 text-[var(--color-text-muted)] max-w-xl mx-auto">
            Plantillas profesionales para cada rama del derecho. Todas fundamentadas en legislación vigente.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SPECIALTIES.map((spec) => (
            <a
              key={spec.code}
              href={`/plantillas/${spec.slug}`}
              className="glass-card p-5 glow-hover group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{spec.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {spec.description}
                  </p>
                  <div className="mt-2 text-xs font-medium" style={{ color: spec.color }}>
                    {spec.templateCount} plantillas →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)]">
              ¿Cómo Funciona?
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", icon: "🔍", title: "Busca tu plantilla", desc: "Explora por especialidad o usa el buscador inteligente (tolera errores ortográficos)." },
              { step: "2", icon: "🧭", title: "Usa el asistente", desc: "Responde preguntas como tipo de divorcio, delito o etapa procesal para llegar al documento exacto." },
              { step: "3", icon: "🧮", title: "Calcula montos", desc: "Nuestra calculadora estima indemnizaciones, pensiones y liquidaciones al instante." },
              { step: "4", icon: "📄", title: "Descarga el PDF", desc: "Obtén tu documento listo para firmar e imprimir en formato profesional." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface-card)] mb-4 text-3xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Social Proof */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-outfit)]">
          Empieza a Usar Machotes Legales <span className="gradient-gold">Hoy</span>
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)] max-w-xl mx-auto">
          Más de {TOTAL_TEMPLATES} plantillas legales profesionales. Actualizadas. Con fundamento legal.
          Calculadoras, asistentes y búsqueda inteligente incluidos.
        </p>
        <a
          href="/plantillas"
          className="inline-block mt-8 px-10 py-4 rounded-xl bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold text-lg hover:bg-[var(--color-accent-light)] transition-all shadow-lg shadow-[var(--color-accent)]/20"
        >
          Explorar Plantillas Gratis →
        </a>
      </section>
    </main>
  );
}
