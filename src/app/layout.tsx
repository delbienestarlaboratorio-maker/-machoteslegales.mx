import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import UserNav from "@/components/UserNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "Machotes Legales — Plantillas Legales México 2026",
    template: "%s | Machotes Legales",
  },
  description:
    "La plataforma #1 de plantillas y formatos legales en México. Demandas, contratos, amparos, querellas y más. Descarga gratis o accede a versiones profesionales.",
  keywords: [
    "plantillas legales México",
    "formatos jurídicos",
    "demanda de amparo formato",
    "contrato arrendamiento plantilla",
    "querella penal formato",
    "divorcio incausado formato",
    "demanda laboral plantilla",
    "documentos legales gratis",
  ],
  metadataBase: new URL("https://machoteslegales.mx"),
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Machotes Legales",
    title: "Machotes Legales — Plantillas Legales Profesionales México",
    description:
      "Más de 1,500 plantillas legales profesionales. Descarga gratis o accede a versiones premium con auto-llenado por IA.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Machotes Legales — Plantillas Legales México",
    description: "La plataforma #1 de documentos legales en México.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://machoteslegales.mx",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f172a" />
        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              name: "Machotes Legales",
              description:
                "Plataforma de plantillas legales profesionales para México",
              url: "https://machoteslegales.mx",
              areaServed: { "@type": "Country", name: "Mexico" },
              serviceType: "Legal Document Templates",
              priceRange: "Gratis - $499/mes",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <Providers>
          {/* Navigation */}
          <nav className="sticky top-0 z-50 glass-card border-b border-white/5 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <a href="/" className="flex items-center gap-2">
                  <img
                    src="/Logo/logo-optimized.webp"
                    alt="Machotes Legales Logo"
                    className="h-10 w-auto object-contain"
                    width={40}
                    height={40}
                    loading="eager"
                  />
                </a>
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <a href="/plantillas" className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                    Plantillas
                  </a>
                  <a href="/precios" className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                    Precios
                  </a>

                  <UserNav />
                </div>
              </div>
            </div>
          </nav>

          {children}


          {/* Footer */}
          <footer className="border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Especialidades</h4>
                  <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                    <li><a href="/plantillas/civil" className="hover:text-white transition-colors">Derecho Civil</a></li>
                    <li><a href="/plantillas/penal" className="hover:text-white transition-colors">Derecho Penal</a></li>
                    <li><a href="/plantillas/laboral" className="hover:text-white transition-colors">Derecho Laboral</a></li>
                    <li><a href="/plantillas/familiar" className="hover:text-white transition-colors">Derecho Familiar</a></li>
                    <li><a href="/plantillas/amparo" className="hover:text-white transition-colors">Juicio de Amparo</a></li>
                    <li><a href="/plantillas/fiscal" className="hover:text-white transition-colors">Derecho Fiscal</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Más Áreas</h4>
                  <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                    <li><a href="/plantillas/mercantil" className="hover:text-white transition-colors">Mercantil</a></li>
                    <li><a href="/plantillas/administrativo" className="hover:text-white transition-colors">Administrativo</a></li>
                    <li><a href="/plantillas/agrario" className="hover:text-white transition-colors">Agrario</a></li>
                    <li><a href="/plantillas/ambiental" className="hover:text-white transition-colors">Ambiental</a></li>
                    <li><a href="/plantillas/migratorio" className="hover:text-white transition-colors">Migratorio</a></li>
                    <li><a href="/plantillas/transito" className="hover:text-white transition-colors">Tránsito</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Planes</h4>
                  <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                    <li><a href="/precios" className="hover:text-white transition-colors">Gratuito</a></li>
                    <li><a href="/precios" className="hover:text-white transition-colors">Negocios</a></li>
                    <li><a href="/precios" className="hover:text-white transition-colors">Profesional</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                    <li><a href="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</a></li>
                    <li><a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                    <li><a href="/confidencialidad" className="hover:text-white transition-colors">Confidencialidad</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/5 mt-8 pt-8 text-center text-sm text-[var(--color-text-muted)]">
                <p>© 2026 Machotes Legales. Todos los derechos reservados.</p>
                <p className="mt-1 text-xs">Las plantillas no sustituyen asesoría legal profesional.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
