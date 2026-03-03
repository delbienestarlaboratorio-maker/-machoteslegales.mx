import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { federalLeyesMock } from '@/data/leyes';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return jurisprudenciasMock
        .filter(j => j.fuero === 'federal')
        .map((juri) => ({
            slug: juri.ley_id,
            jurisprudencia: juri.id,
        }));
}

type Props = {
    params: Promise<{ slug: string; jurisprudencia: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);
    const juriInfo = jurisprudenciasMock.find(j => j.id === resolvedParams.jurisprudencia && j.ley_id === resolvedParams.slug);

    if (!leyInfo || !juriInfo) {
        return { title: 'Tesis no encontrada' };
    }

    return {
        title: `✅ ${juriInfo.tipo} Reg. ${juriInfo.registro} | ${leyInfo.nombre}`,
        description: juriInfo.resumen_seo,
        keywords: [`jurisprudencia ${juriInfo.registro}`, `tesis ${leyInfo.nombre.toLowerCase()}`, 'amparo scjn', 'juicio completo', 'precedente obligatorio'],
        openGraph: {
            title: `${juriInfo.tipo} - Reg. ${juriInfo.registro}`,
            description: juriInfo.resumen_seo,
            url: `https://machoteslegales.mx/leyes/federal/${leyInfo.id}/jurisprudencia/${juriInfo.id}`,
            type: 'article',
        }
    };
}

export default async function LecturaJurisprudenciaPage({ params }: Props) {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);
    const juriInfo = jurisprudenciasMock.find(j => j.id === resolvedParams.jurisprudencia && j.ley_id === resolvedParams.slug);

    if (!leyInfo || !juriInfo) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb Oculto Interactivo */}
            <nav className="mb-6 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-amber-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href="/leyes/federales" className="hover:text-amber-400 transition-colors">Federal</Link>
                <span>/</span>
                <Link href={`/leyes/federal/${leyInfo.id}`} className="hover:text-amber-400 transition-colors truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</Link>
                <span>/</span>
                <Link href={`/leyes/federal/${leyInfo.id}/jurisprudencia`} className="hover:text-amber-400 transition-colors">Jurisprudencias</Link>
                <span>/</span>
                <span className="text-white font-bold">Reg. {juriInfo.registro}</span>
            </nav>

            <article className="glass-card p-6 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Encabezado Judicial */}
                <div className="border-b border-white/10 pb-10 mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-amber-900/40 text-xs text-amber-500 font-bold tracking-widest uppercase border border-amber-500/30">
                            {juriInfo.tipo}
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-slate-800 text-xs text-white/70 tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {juriInfo.epoca}
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-slate-800 text-xs text-white/50 tracking-widest">
                            Registro: {juriInfo.registro}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-white font-[family-name:var(--font-outfit)] tracking-tight leading-tight mb-6">
                        {juriInfo.rubro}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)] font-serif italic bg-black/30 p-4 rounded-xl border border-white/5">
                        <svg className="w-5 h-5 shrink-0 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        Instancia Emisora: {juriInfo.instancia}
                    </div>
                </div>

                {/* AdSense Top */}
                <div className="my-8">
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Resumen SEO (Interpretación Fácil) */}
                <div className="bg-amber-900/10 border-l-4 border-amber-500 p-6 md:p-8 rounded-r-3xl shadow-inner mb-12">
                    <h3 className="text-lg font-bold text-amber-500 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Resumen y Aplicación Práctica
                    </h3>
                    <p className="text-amber-100/90 leading-loose text-justify text-lg font-medium">
                        {juriInfo.resumen_seo}
                    </p>
                </div>

                {/* Texto Formal de la Ejecutoria */}
                <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-muted)] leading-loose text-justify font-serif mb-16">
                    <div className="flex items-center justify-center mb-10 pb-10 border-b border-white/5 text-xs text-white/30 uppercase tracking-widest">
                        — Inicio de la Sentencia —
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: juriInfo.texto_juicio_html }} className="space-y-6" />

                    <div className="flex items-center justify-center mt-10 pt-10 border-t border-white/5 text-xs text-white/30 uppercase tracking-widest">
                        — Extracto Validado del Sistema Integral —
                    </div>
                </div>

                {/* Correlaciones a Artículos (Si los hay) */}
                {juriInfo.articulos_relacionados && juriInfo.articulos_relacionados.length > 0 && (
                    <div className="bg-[#0f172a] p-6 md:p-8 rounded-2xl border border-white/5 shadow-inner mb-12">
                        <h3 className="text-lg font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
                            Artículos Invocados de la {leyInfo.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {juriInfo.articulos_relacionados.map((artId, idx) => (
                                <Link href={`/leyes/federal/${leyInfo.id}/${artId}`} key={idx} className="group inline-flex items-center gap-3 px-5 py-3 bg-slate-900 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all font-bold text-white shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                                        📄
                                    </div>
                                    <span className="capitalize">{artId.replace('-', ' ')}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call To Action - Generador */}
                <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 border border-amber-500/30 p-8 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Escritos Jurídicos Alineados a la Corte</h3>
                    <p className="text-white/60 text-sm mb-6">Todos nuestros machotes, amparos y demandas son actualizados para cumplir <strong>estrictamente con esta corriente jurisprudencial</strong>. Olvídate de sufrir prevenciones del juzgado.</p>
                    <Link href={`/generador`} className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        Explorar Catálogo de Escritos
                    </Link>
                </div>

            </article>

            {/* AdSense Bottom */}
            <div className="mt-12 mb-8 max-w-3xl mx-auto">
                <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Contenido Patrocinado</div>
                <AdBannerWrapper format="horizontal" />
            </div>

            <div className="text-center opacity-50 text-xs flex justify-center mt-6">
                <Link href={`/leyes/federal/${leyInfo.id}/jurisprudencia`} className="text-amber-500 hover:text-amber-400 underline transition-colors">
                    Regresar al archivo judicial de esta ley
                </Link>
            </div>
        </main>
    );
}
