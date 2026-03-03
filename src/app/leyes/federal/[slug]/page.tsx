import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { federalLeyesMock } from '@/data/leyes';
import { articulosMock } from '@/data/articulos';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';
import BuscadorArticulos from '@/components/leyes/BuscadorArticulos';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return federalLeyesMock.map((ley) => ({
        slug: ley.id,
    }));
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);

    if (!leyInfo) {
        return { title: 'Ley no encontrada' };
    }

    return {
        title: `${leyInfo.nombre} | Directorio de Leyes Federales`,
        description: leyInfo.descripcion_seo,
        keywords: [leyInfo.nombre.toLowerCase(), 'leyes federales mexico', 'camara de diputados', 'leyes actualizadas'],
        openGraph: {
            title: leyInfo.nombre,
            description: leyInfo.descripcion_seo,
            url: `https://machoteslegales.mx/leyes/federal/${leyInfo.id}`,
            type: 'article',
        },
        alternates: { canonical: `https://machoteslegales.mx/leyes/federal/${leyInfo.id}` }
    };
}

export default async function LeyFederalLecturaPage({ params }: Props) {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);
    const articulosDeLey = articulosMock.filter(a => a.ley_id === resolvedParams.slug && a.fuero === 'federal');

    if (!leyInfo) {
        notFound();
    }

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center text-[var(--color-text-muted)] space-x-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href="/leyes/federales" className="hover:text-emerald-400 transition-colors">Federal</Link>
                <span>/</span>
                <span className="text-white font-bold truncate max-w-[200px] sm:max-w-none">{leyInfo.nombre}</span>
            </nav>

            <article className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8 border-b border-white/10 pb-8">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 text-[10px] sm:text-xs text-emerald-400 font-bold tracking-widest uppercase mb-4 shadow-inner border border-emerald-500/20">
                            Ordenamiento Federal
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight leading-tight">
                            {leyInfo.nombre}
                        </h1>
                        <p className="text-lg text-[var(--color-text-muted)] mt-4 leading-relaxed max-w-3xl">
                            {leyInfo.descripcion_seo}
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 min-w-[200px]">
                        <div className="text-xs text-white/50 mb-1 uppercase tracking-widest">Estado Jurídico</div>
                        <div className="font-bold text-emerald-400 flex items-center gap-2 mb-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            Vigente
                        </div>
                        <div className="text-xs text-white/40 mb-1">Última Reforma Publicada:</div>
                        <div className="text-sm text-white/90 font-medium mb-3">{leyInfo.ultima_reforma}</div>

                        <div className="text-xs text-white/40 mb-1">Estructura:</div>
                        <div className="text-sm text-white/90 font-medium">{leyInfo.articulos_totales} Artículos</div>
                    </div>
                </div>

                {/* AdSense Top Article */}
                <div className="my-8">
                    <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Publicidad</div>
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Motor de Búsqueda Interno (Placeholder visual para UX) */}
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 mb-12 shadow-inner">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Buscar Artículo en esta Ley
                    </h2>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Ej. Artículo 123 o 'Despido'" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" disabled />
                        <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold border border-white/5 hover:bg-slate-700 transition-colors" disabled>Buscar</button>
                    </div>
                </div>

                {/* Síntesis SEO (Texto +500 palabras) */}
                <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-muted)] leading-loose text-justify mb-16">
                    <h3 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
                        Análisis y Objeto de la Ley
                    </h3>

                    {leyInfo.analisis_profundo_seo ? (
                        <div dangerouslySetInnerHTML={{ __html: leyInfo.analisis_profundo_seo }} />
                    ) : (
                        <div>
                            <p>
                                La <strong>{leyInfo.nombre}</strong> constituye un pilar central del marco jurídico de los Estados Unidos Mexicanos. A través de sus disposiciones, el Estado asume la responsabilidad de regular los comportamientos, atribuciones y esferas de competencia en este rubro particular, dotando de certeza y seguridad a los gobernados.
                            </p>
                            <h4>Orígenes e Importancia</h4>
                            <p>
                                Desde su expedición por el Congreso de la Unión, este compendio normativo ha sido sujeto a diversas adiciones y derogaciones para adaptarse a la cambiante realidad social del país. Todo operador jurídico, estudiante y ciudadano tiene el imperativo de conocer su arquitectura fundamental. Es importante recalcar que su observancia es general y, acorde a nuestro sistema constitucional, nadie puede alegar la ignorancia de la ley como excusa para su incumplimiento.
                            </p>
                            <h4>Estructura Aplicativa</h4>
                            <p>
                                Con sus <strong>{leyInfo.articulos_totales} artículos</strong> (acompañados usualmente de sus disposiciones transitorias), se divide en títulos y capítulos que previenen lagunas jurídicas y otorgan las herramientas a los tribunales federales para ejercer jurisdicción. Ya sea protegiendo patrimonio, castigando tipicidades penales, o regulando comercio, la lectura sistémica de la ley jamás debe darse en aislamiento, sino en plena concordancia con la Constitución y los Tratados Internacionales vigentes.
                            </p>
                            <p className="text-sm mt-8 italic border-l-2 border-emerald-500 pl-4 py-2 bg-emerald-500/5">
                                *Nota del Editor: Nuestro equipo jurídico publicará pronto el análisis enciclopédico de más de 500 palabras exclusivo para este ordenamiento.*
                            </p>
                        </div>
                    )}
                </div>

                {/* Motor Frontend de Búsqueda y Grilla de Artículos */}
                <BuscadorArticulos
                    articulos={articulosDeLey}
                    leyId={leyInfo.id}
                />

                {/* Sección Temática de Jurisprudencia */}
                <div className="bg-gradient-to-r from-blue-900/40 to-[#0f172a] p-8 md:p-10 rounded-3xl border border-blue-500/30 shadow-2xl mb-12 relative overflow-hidden mt-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <span className="text-3xl">⚖️</span> Jurisprudencia y Tesis Aisladas
                            </h3>
                            <p className="text-blue-100/70 text-sm max-w-xl">
                                Consulta la interpretación oficial y vinculante que los Tribunales Federales y la SCJN han emitido sobre los preceptos de esta ley. Fundamental para litigar casos complejos.
                            </p>
                        </div>
                        <Link href={`/leyes/federal/${leyInfo.id}/jurisprudencia`} className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] whitespace-nowrap">
                            Ver {leyInfo.nombre} Jurisprudencial
                        </Link>
                    </div>
                </div>

                {/* Leyes Correlacionadas (Cross-Linking SEO) */}
                {leyInfo.correlaciones && leyInfo.correlaciones.length > 0 && (
                    <div className="bg-amber-900/10 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-inner mb-12">
                        <h3 className="text-lg font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            Leyes Correlacionadas
                        </h3>
                        <p className="text-amber-100/70 text-sm mb-6">
                            Para una correcta interpretación jurídica, esta normativa debe analizarse en concordancia con los siguientes ordenamientos:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {leyInfo.correlaciones.map((correlacion, idx) => (
                                <li key={idx}>
                                    <Link href={correlacion.url} className="flex items-center gap-3 p-4 bg-black/40 border border-amber-500/10 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors group/link">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 group-hover/link:bg-amber-500 group-hover/link:text-black transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-amber-50">{correlacion.nombre}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Banner Plantillas Venta Directa */}
                <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-8 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Aplica esta ley de inmediato con las Plantillas de Machotes Legales</h3>
                    <p className="text-white/60 text-sm mb-6">Nuestros escritos y demandas pre-formuladas ya contienen los artículos exactos de esta ley invocados por abogados expertos.</p>
                    <Link href="/plantillas" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        Ir al Catálogo de Plantillas
                    </Link>
                </div>

            </article>

            {/* AdSense Bottom */}
            <div className="my-10 max-w-3xl mx-auto">
                <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Avisos Patrocinados</div>
                <AdBannerWrapper format="horizontal" />
            </div>

            <div className="text-center mt-12 opacity-50 text-xs">
                Directorio actualizado constantemente en base al Diario Oficial de la Federación.
            </div>
        </main>
    );
}
