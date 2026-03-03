import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { estadosRepublica } from '@/data/estados';
import { estadoLeyesMock } from '@/data/leyes';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return jurisprudenciasMock
        .filter(j => j.fuero === 'estatal')
        .map((j) => ({
            estado: j.estado_id,
            slug: j.ley_id,
            jurisprudencia: j.id,
        }));
}

type Props = {
    params: Promise<{ estado: string; slug: string; jurisprudencia: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = estadoLeyesMock.find(l => l.id === resolvedParams.slug);
    const tesis = jurisprudenciasMock.find(j => j.id === resolvedParams.jurisprudencia && j.estado_id === resolvedParams.estado);

    if (!estadoInfo || !leyInfo || !tesis) {
        return { title: 'Tesis no encontrada' };
    }

    return {
        title: `${tesis.tipo} Reg. ${tesis.registro} | ${leyInfo.nombre} de ${estadoInfo.nombre}`,
        description: `Lectura completa del texto de rubro: ${tesis.rubro}. Resoluciones aplicables en ${estadoInfo.nombre}.`,
        keywords: [tesis.registro, 'jurisprudencia', tesis.tipo.toLowerCase(), estadoInfo.nombre.toLowerCase(), leyInfo.nombre.toLowerCase()],
        openGraph: {
            title: `${tesis.tipo} en ${estadoInfo.nombre} - Reg. ${tesis.registro}`,
            description: tesis.resumen_seo,
            url: `https://machoteslegales.mx/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia/${tesis.id}`,
            type: 'article',
        }
    };
}

export default async function LecturaJurisprudenciaEstatalPage({ params }: Props) {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = estadoLeyesMock.find(l => l.id === resolvedParams.slug);
    const tesis = jurisprudenciasMock.find(j => j.id === resolvedParams.jurisprudencia && j.estado_id === resolvedParams.estado);

    if (!estadoInfo || !leyInfo || !tesis) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb Oculto Interactivo */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}`} className="hover:text-emerald-400 transition-colors truncate max-w-[100px] sm:max-w-none">{estadoInfo.nombre}</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}`} className="hover:text-emerald-400 transition-colors truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia`} className="hover:text-emerald-400 transition-colors">Jurisprudencia</Link>
                <span>/</span>
                <span className="text-white font-bold">Registro {tesis.registro}</span>
            </nav>

            <article className="glass-card p-6 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-slate-900/80">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Metadata Header */}
                <header className="mb-10 pb-8 border-b border-white/10">
                    <div className="flex flex-wrap items-center gap-3 mb-6 text-xs md:text-sm font-bold tracking-widest uppercase">
                        <span className={`px-4 py-1.5 rounded-full border ${tesis.tipo === 'Jurisprudencia' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                            {tesis.tipo}
                        </span>
                        <div className="flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-full border border-white/5">
                            <span className="text-white/40">Registro Digital:</span>
                            <span className="text-white">{tesis.registro}</span>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-white font-[family-name:var(--font-outfit)] leading-snug mb-6 text-justify">
                        {tesis.rubro}
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                        <div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Época</div>
                            <div className="text-sm text-white/90 font-medium">{tesis.epoca}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Instancia</div>
                            <div className="text-sm text-white/90 font-medium">{tesis.instancia}</div>
                        </div>
                        <div className="col-span-2">
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Materia y Ley</div>
                            <div className="text-sm text-blue-400 font-medium">{leyInfo.nombre} ({estadoInfo.nombre})</div>
                        </div>
                    </div>
                </header>

                {/* AdSense Top */}
                <div className="my-8">
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Resumen SEO */}
                <div className="bg-[#0f172a] p-6 lg:p-8 rounded-2xl border-l-4 border-blue-500 mb-12 shadow-inner">
                    <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Síntesis Legal (Lenguaje Ciudadano)
                    </h3>
                    <p className="text-[var(--color-text-muted)] leading-relaxed text-lg">
                        {tesis.resumen_seo}
                    </p>
                </div>

                {/* Texto de la Sentencia (HTML) */}
                <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-p:text-justify prose-h4:text-2xl prose-h4:font-bold prose-h4:text-white prose-h4:mb-6 prose-p:leading-loose text-[var(--color-text-muted)] mb-16">
                    <div dangerouslySetInnerHTML={{ __html: tesis.texto_juicio_html }} className="bg-black/20 p-6 md:p-12 rounded-3xl border border-white/5" />
                </div>

                {/* AdSense In-Article */}
                <div className="my-10 max-w-3xl mx-auto">
                    <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Contenido Patrocinado</div>
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Relaciones con Artículos de la Ley */}
                {tesis.articulos_relacionados && tesis.articulos_relacionados.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6">Artículos Directamente Afectados</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tesis.articulos_relacionados.map((artId) => (
                                <Link
                                    href={`/leyes/${estadoInfo.id}/${leyInfo.id}/${artId}`}
                                    key={artId}
                                    className="flex items-center justify-between p-4 bg-slate-900 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group"
                                >
                                    <span className="font-bold text-emerald-400 text-sm">Artículo {artId.replace('articulo-', '')}</span>
                                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Back to Index Nav */}
            <div className="mt-8 text-center">
                <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all font-medium text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Regresar al Índice de Jurisprudencias
                </Link>
            </div>
        </main>
    );
}
