import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { federalLeyesMock } from '@/data/leyes';
import { articulosMock } from '@/data/articulos';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';
import BuscadorArticuloNav from '@/components/leyes/BuscadorArticuloNav';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return articulosMock
        .filter(a => a.fuero === 'federal')
        .map((art) => ({
            slug: art.ley_id,
            articulo: art.id,
        }));
}

type Props = {
    params: Promise<{ slug: string; articulo: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);
    const artInfo = articulosMock.find(a => a.id === resolvedParams.articulo && a.ley_id === resolvedParams.slug);

    if (!leyInfo || !artInfo) {
        return { title: 'Artículo no encontrado' };
    }

    return {
        title: `Artículo ${artInfo.numero} | ${leyInfo.nombre} | Explicación Legal`,
        description: `Explicación, análisis y jurisprudencia del Artículo ${artInfo.numero} de la ${leyInfo.nombre} vigente en México.`,
        keywords: [`articulo ${artInfo.numero}`, leyInfo.nombre.toLowerCase(), 'leyes federales', 'analisis juridico'],
        openGraph: {
            title: `Art. ${artInfo.numero} - ${leyInfo.nombre}`,
            description: `Texto vigente y análisis legal profundo del Artículo ${artInfo.numero}.`,
            url: `https://machoteslegales.mx/leyes/federal/${leyInfo.id}/${artInfo.id}`,
            type: 'article',
        }
    };
}

export default async function LecturaArticuloFederalPage({ params }: Props) {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);

    // Obtener todos los artículos de esta ley ordenados como vengan en la Base de Datos
    const todosLosArticulos = articulosMock.filter(a => a.ley_id === resolvedParams.slug && a.fuero === 'federal');

    // Encontrar el índice del artículo actual
    const indexActual = todosLosArticulos.findIndex(a => a.id === resolvedParams.articulo);
    const artInfo = todosLosArticulos[indexActual];

    if (!leyInfo || !artInfo) {
        notFound();
    }

    // Calcular Anterior y Siguiente
    const artAnterior = indexActual > 0 ? todosLosArticulos[indexActual - 1] : null;
    const artSiguiente = indexActual < todosLosArticulos.length - 1 ? todosLosArticulos[indexActual + 1] : null;

    // Buscar Jurisprudencias Aplicables a este artículo en particular
    const jurisprudenciasAplicables = jurisprudenciasMock.filter(j =>
        j.ley_id === resolvedParams.slug &&
        j.articulos_relacionados &&
        j.articulos_relacionados.includes(artInfo.id)
    );

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb Oculto Interactivo */}
            <nav className="mb-6 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href="/leyes/federales" className="hover:text-emerald-400 transition-colors">Federal</Link>
                <span>/</span>
                <Link href={`/leyes/federal/${leyInfo.id}`} className="hover:text-emerald-400 transition-colors truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</Link>
                <span>/</span>
                <span className="text-white font-bold">Artículo {artInfo.numero}</span>
            </nav>

            {/* Paginación Superior Rápida Siguiente / Anterior */}
            <div className="flex justify-between items-center mb-6 font-bold text-sm">
                {artAnterior ? (
                    <Link href={`/leyes/federal/${leyInfo.id}/${artAnterior.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:-translate-x-1 shadow-inner shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="hidden sm:inline">Artículo Anterior</span>
                        <span className="sm:hidden">Anterior</span>
                    </Link>
                ) : (
                    <div></div>
                )}

                {/* Buscador de Salto Rápido central */}
                <div className="hidden sm:block flex-1 mx-4 max-w-sm">
                    <BuscadorArticuloNav articulos={todosLosArticulos} leyId={leyInfo.id} />
                </div>

                {artSiguiente ? (
                    <Link href={`/leyes/federal/${leyInfo.id}/${artSiguiente.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:translate-x-1 shadow-inner shrink-0">
                        <span className="hidden sm:inline">Siguiente Artículo</span>
                        <span className="sm:hidden">Siguiente</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                ) : (
                    <Link href={`/leyes/federal/${leyInfo.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all shrink-0">
                        Volver al Índice
                    </Link>
                )}
            </div>

            {/* Buscador de Salto Rápido móvil */}
            <div className="sm:hidden mb-6">
                <BuscadorArticuloNav articulos={todosLosArticulos} leyId={leyInfo.id} />
            </div>

            <article className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-4 border border-emerald-500/20">
                        {leyInfo.nombre}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white font-[family-name:var(--font-outfit)] tracking-tight">
                        Artículo {artInfo.numero}
                    </h1>
                </div>

                {/* AdSense Top */}
                <div className="my-8">
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Texto de la Ley (Modo Formal) */}
                <div className="bg-[#0f172a] p-8 md:p-12 rounded-3xl border-l-4 border-emerald-500 shadow-inner mb-12 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border-4 border-emerald-500 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    </div>
                    <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-serif italic text-justify">
                        "{artInfo.contenido}"
                    </p>
                </div>

                {/* Análisis de +500 Palabras (SEO Core) */}
                <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-muted)] leading-loose text-justify mb-16">
                    <h3 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)] flex items-center gap-3">
                        <span className="text-3xl">🧠</span> Análisis Práctico Legal
                    </h3>
                    <div dangerouslySetInnerHTML={{ __html: artInfo.explicacion_seo }} className="bg-slate-900/50 p-6 md:p-10 rounded-2xl border border-white/5" />
                </div>

                {/* AdSense In-Article */}
                <div className="my-10 max-w-3xl mx-auto">
                    <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Contenido Patrocinado</div>
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Jurisprudencia Aplicable DIRECTAMENTE al Artículo */}
                {jurisprudenciasAplicables.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-900/40 to-[#0f172a] p-6 md:p-8 rounded-2xl border border-blue-500/30 shadow-inner mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3 relative z-10">
                            <span className="text-2xl">⚖️</span> Jurisprudencia Aplicable al Artículo {artInfo.numero}
                        </h3>
                        <p className="text-blue-100/70 text-sm mb-6 relative z-10">
                            La Suprema Corte y Tribunales Colegiados han emitido las siguientes sentencias vinculantes para la correcta aplicación de este precepto:
                        </p>
                        <div className="grid gap-4 relative z-10">
                            {jurisprudenciasAplicables.map((juri) => (
                                <Link href={`/leyes/federal/${leyInfo.id}/jurisprudencia/${juri.id}`} key={juri.id} className="block group">
                                    <div className="bg-black/40 border border-blue-500/20 rounded-xl p-5 hover:bg-blue-900/40 hover:border-blue-500/50 transition-all">
                                        <div className="flex items-center gap-3 mb-2 text-xs font-bold tracking-widest uppercase">
                                            <span className="text-blue-400">{juri.tipo}</span>
                                            <span className="text-white/40">• Reg. {juri.registro}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-2">
                                            {juri.rubro}
                                        </h4>
                                        <div className="text-sm text-blue-200/60 flex items-center gap-2 font-medium">
                                            Leer Juicio Completo <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Leyes Correlacionadas Específicas del Artículo */}
                {artInfo.correlaciones && artInfo.correlaciones.length > 0 && (
                    <div className="bg-amber-900/10 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-inner mb-12">
                        <h3 className="text-lg font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            Correlaciones de este Artículo
                        </h3>
                        <p className="text-amber-100/70 text-sm mb-6">
                            Los tribunales y juzgados exigen que este artículo se interprete estrictamente en concordancia con:
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {artInfo.correlaciones.map((correlacion, idx) => (
                                <Link href={correlacion.url} key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-amber-500/10 rounded-xl hover:bg-amber-500/20 hover:border-amber-500/50 transition-colors text-amber-50 text-sm font-medium">
                                    <span>⚖️</span> {correlacion.nombre}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call To Action Plantillas Cross-selling */}
                <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-[#0f172a] border border-emerald-500/30 p-8 rounded-2xl text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                    <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Usa este Artículo a tu favor</h3>
                    <p className="text-emerald-100/70 text-sm mb-8 max-w-xl mx-auto relative z-10">
                        Nuestros abogados ya han redactado solicitudes, demandas y amparos invocando formalmente el <strong>Artículo {artInfo.numero}</strong>. Descarga el formato que necesitas, rellena tus datos e imprímelo hoy.
                    </p>
                    <Link href="/plantillas" className="relative z-10 inline-block bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-4 text-lg rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-[0_4px_30px_rgba(16,185,129,0.3)]">
                        Generar Escrito Legal
                    </Link>
                </div>

            </article>

            {/* Paginación Real Siguiente / Anterior */}
            <div className="flex justify-between items-center mt-12 px-4 font-bold text-sm">
                {artAnterior ? (
                    <Link href={`/leyes/federal/${leyInfo.id}/${artAnterior.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:-translate-x-1 shadow-inner">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="hidden sm:inline">Artículo Anterior</span>
                        <span className="sm:hidden">Anterior</span>
                    </Link>
                ) : (
                    <div></div>
                )}

                {artSiguiente ? (
                    <Link href={`/leyes/federal/${leyInfo.id}/${artSiguiente.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:translate-x-1 shadow-inner">
                        <span className="hidden sm:inline">Siguiente Artículo</span>
                        <span className="sm:hidden">Siguiente</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                ) : (
                    <Link href={`/leyes/federal/${leyInfo.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all">
                        Volver al Índice
                    </Link>
                )}
            </div>
        </main>
    );
}
