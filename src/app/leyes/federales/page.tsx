import Link from 'next/link';
import { Metadata } from 'next';
import { federalLeyesMock } from '@/data/leyes';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const metadata: Metadata = {
    title: 'Leyes Federales de México | WikipediALeyes',
    description: 'Directorio completo de las Leyes Federales vigentes en México. Consulta la Constitución, Códigos y Regulaciones Federales en la WikipediALeyes.',
    openGraph: {
        title: 'Leyes Federales de México | WikipediALeyes',
        description: 'Directorio completo y actualizado de la legislación federal mexicana.',
        url: 'https://machoteslegales.mx/leyes/federales'
    }
};

export default function LeyesFederalesPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm font-medium flex items-center text-[var(--color-text-muted)] space-x-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Directorio de Leyes</Link>
                <span>/</span>
                <span className="text-white font-bold">Fuero Federal</span>
            </nav>

            {/* Cabecera */}
            <div className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="flex flex-col items-center gap-4 mb-4 text-center md:flex-row md:items-start md:text-left">
                    <span className="text-5xl md:text-6xl">🇲🇽</span>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight">
                            <span className="text-emerald-400">WikipediALeyes</span> Federales
                        </h1>
                        <p className="text-emerald-500/80 font-medium mt-1 uppercase tracking-widest text-sm">Legislación de Aplicación Nacional</p>
                    </div>
                </div>
                <p className="text-[var(--color-text-muted)] max-w-3xl text-lg mt-6 leading-relaxed">
                    Estas leyes, códigos y reglamentos son expedidos por el Congreso de la Unión y tienen validez obligatoria en los 32 Estados de la República Mexicana.
                </p>
            </div>

            {/* AdSense Top */}
            <div className="my-10 max-w-4xl mx-auto">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Grid de Leyes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {federalLeyesMock.map((ley) => (
                    <Link href={`/leyes/federal/${ley.id}`} key={ley.id} className="block group h-full">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-all h-full shadow-lg relative flex flex-col justify-between">
                            <div>
                                <div className="text-emerald-500/80 font-bold text-xs mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Vigente
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-snug">
                                    {ley.nombre}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-6">
                                    {ley.descripcion_seo}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 group-hover:text-white/80 transition-colors">
                                <span>{ley.articulos_totales} Artículos</span>
                                <span>Ref: {ley.ultima_reforma}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* AdSense Bottom */}
            <div className="mt-16 mb-8 max-w-4xl mx-auto">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Call to Action Plantillas */}
            <div className="mt-12 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 border border-emerald-500/20 p-8 rounded-3xl text-center shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <h3 className="text-2xl font-bold text-white mb-3">¿Buscas aplicar esta ley?</h3>
                <p className="text-[var(--color-text-muted)] mb-6 max-w-2xl mx-auto">
                    No empieces desde cero. Descarga demandas, contratos y amparos redactados por abogados expertos basándose en esta exacta legislación.
                </p>
                <Link href="/plantillas" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    Ver Catálogo de Plantillas
                </Link>
            </div>
        </main>
    );
}
