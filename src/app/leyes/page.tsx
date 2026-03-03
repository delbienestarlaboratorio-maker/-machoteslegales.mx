import Link from 'next/link';
import { Metadata } from 'next';
import { estadosRepublica } from '@/data/estados';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const metadata: Metadata = {
    title: 'WikipediALeyes | Directorio de Leyes Federales y Estatales',
    description: 'Consulta más de 4,500 leyes y códigos vigentes en México en la WikipediALeyes. Encuentra tu legislación federal o estatal al instante.',
    keywords: ['wikipedia leyes', 'leyes de mexico', 'leyes federales', 'codigo civil por estado', 'leyes estatales mexico', 'legislacion mexicana'],
    openGraph: {
        title: 'WikipediALeyes de México',
        description: 'Directorio oficial estructurado por Fuero Federal y por los 32 Estados de la República.',
        url: 'https://machoteslegales.mx/leyes'
    }
};

export default function LeyesIndexPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

            {/* Cabecera Principal */}
            <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 text-sm text-emerald-400 mb-4 bg-emerald-500/5">
                    <span>🏛️</span><span>La Enciclopedia Legal de México</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] mb-6 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">WikipediALeyes</span>
                </h1>
                <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
                    Consulta el acervo jurídico más rápido de México. Encuentra de inmediato las normativas vigentes a nivel Federal o selecciona tu Entidad Federativa para explorar la legislación local.
                </p>

                {/* Botón Principal - Leyes Federales */}
                <Link href="/leyes/federales" className="group inline-flex items-center justify-center relative w-full sm:w-auto overflow-hidden rounded-2xl p-1 transition-all">
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-70 group-hover:opacity-100 animate-pulse-slow"></span>
                    <div className="relative flex items-center gap-4 bg-slate-900 px-8 py-6 rounded-xl transition-all group-hover:bg-slate-800/80 w-full sm:w-auto justify-center">
                        <span className="text-4xl">🇲🇽</span>
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-outfit)]">Leyes Federales</h2>
                            <p className="text-emerald-400 text-sm font-medium">~315 Leyes Vigentes en Todo el País →</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Publicidad Top SEO */}
            <div className="my-10 max-w-4xl mx-auto">
                <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Publicidad</div>
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Separador */}
            <div className="flex items-center justify-center gap-4 mb-16 opacity-50">
                <div className="h-px bg-gradient-to-r from-transparent to-white/20 w-32"></div>
                <span className="text-white/40 uppercase tracking-widest text-sm font-bold">O selecciona por Estado</span>
                <div className="h-px bg-gradient-to-l from-transparent to-white/20 w-32"></div>
            </div>

            {/* Grilla de los 32 Estados */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {estadosRepublica.map((estado) => (
                    <Link href={`/leyes/${estado.id}`} key={estado.id} className="block group">
                        <div className="glass-card p-5 rounded-2xl border border-white/5 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all h-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_4px_30px_rgba(16,185,129,0.15)] group-hover:-translate-y-1 relative overflow-hidden">
                            {/* Brillo en esquina superior */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                    {estado.abreviatura}
                                </span>
                            </div>

                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-emerald-300 transition-colors leading-tight">
                                {estado.nombre}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] font-medium">
                                ~{estado.cantidad_leyes} Leyes Locales
                            </p>

                            {/* Flecha inferior */}
                            <div className="absolute bottom-4 right-4 text-emerald-500/0 group-hover:text-emerald-400 transition-colors transform translate-x-4 group-hover:translate-x-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Banner Adicional de SEO/Contenido Inferior */}
            <div className="mt-24 text-center max-w-3xl mx-auto p-8 rounded-3xl border border-white/5 bg-slate-900/50 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                <h4 className="text-white font-bold mb-3">¿Por qué usar nuestro directorio?</h4>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    A diferencia de los portales gubernamentales que caen constantemente o son difíciles de navegar desde un celular, nuestra base de datos está prerrenderizada para velocidad extrema. Puedes buscar en el Código de Comercio o en la Ley Federal del Trabajo en fracciones de segundo y generar plantillas legales basadas en los artículos exactos que estás leyendo.
                </p>
            </div>

        </main>
    );
}
