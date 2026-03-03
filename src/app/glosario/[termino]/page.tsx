import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { glosarioMock } from '@/data/glosario';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return glosarioMock.map((termino) => ({
        termino: termino.id,
    }));
}

type Props = {
    params: Promise<{ termino: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const terminoInfo = glosarioMock.find(t => t.id === resolvedParams.termino);

    if (!terminoInfo) {
        return { title: 'Término no encontrado' };
    }

    return {
        title: `¿Qué es ${terminoInfo.termino}? Significado Jurídico | MachotesLegales`,
        description: terminoInfo.definicion_corta,
        keywords: [terminoInfo.id, `que significa ${terminoInfo.id.replace(/-/g, ' ')}`, 'materia ' + terminoInfo.materia.toLowerCase(), ...(terminoInfo.sinonimos || [])],
        openGraph: {
            title: `Definición de ${terminoInfo.termino}`,
            description: terminoInfo.definicion_corta,
            url: `https://machoteslegales.mx/glosario/${terminoInfo.id}`,
            type: 'article',
        }
    };
}

export default async function DetalleGlosarioPage({ params }: Props) {
    const resolvedParams = await params;
    const terminoInfo = glosarioMock.find(t => t.id === resolvedParams.termino);

    if (!terminoInfo) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb Oculto Interactivo */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/glosario" className="hover:text-cyan-400 transition-colors">Glosario Jurídico A-Z</Link>
                <span>/</span>
                <Link href={`/glosario#letra-${terminoInfo.letras_clave}`} className="hover:text-cyan-400 transition-colors">{terminoInfo.letras_clave}</Link>
                <span>/</span>
                <span className="text-white font-bold">{terminoInfo.termino}</span>
            </nav>

            <article className="glass-card p-6 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-slate-900/80">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="border-b border-white/10 pb-8 mb-8">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-slate-800 border-l-2 border-cyan-500 text-xs text-white/60 uppercase tracking-widest font-bold">
                            Diccionario Enciclopédico
                        </span>
                        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-bold uppercase tracking-widest">
                            {terminoInfo.materia}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white font-[family-name:var(--font-outfit)] tracking-tight leading-tight">
                        <span className="text-2xl md:text-4xl block text-cyan-400/80 mb-2 font-serif italic">Concepto:</span>
                        {terminoInfo.termino}
                    </h1>

                    {terminoInfo.sinonimos && terminoInfo.sinonimos.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <span className="text-white/40 text-sm font-bold">También conocido como:</span>
                            {terminoInfo.sinonimos.map((sin, idx) => (
                                <span key={idx} className="bg-black/40 border border-white/5 px-3 py-1 rounded-full text-xs text-var(--color-text-muted) italic">
                                    {sin}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* AdSense Top */}
                <div className="my-8">
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Resumen Flash */}
                <div className="bg-[#0f172a] p-6 lg:p-8 rounded-2xl border-l-4 border-cyan-500 mb-12 shadow-inner">
                    <h2 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 focus:outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Definición Rápida
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-xl leading-relaxed italic border-l-2 border-white/10 pl-6">
                        "{terminoInfo.definicion_corta}"
                    </p>
                </div>

                {/* Texto Expansivo SEO */}
                <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-[var(--color-text-muted)] prose-headings:text-white prose-a:text-cyan-400 prose-p:text-justify mb-16">
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] border-b border-white/10 pb-4 mb-6">
                        Análisis Legal Completo
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: terminoInfo.explicacion_larga }} />
                </div>

                {/* AdSense In-Article */}
                <div className="my-10 max-w-3xl mx-auto">
                    <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Contenido Patrocinado</div>
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Referencias Cruzadas */}
                {terminoInfo.enlaces_relacionados && terminoInfo.enlaces_relacionados.length > 0 && (
                    <div className="mt-12 bg-cyan-900/10 border border-cyan-500/20 p-8 rounded-2xl shadow-inner">
                        <h3 className="text-lg font-bold text-cyan-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            ¿Dónde se Regula este Concepto?
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {terminoInfo.enlaces_relacionados.map((link, idx) => (
                                <Link href={link.url} key={idx} className="flex items-center gap-3 p-4 bg-black/40 border border-cyan-500/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-colors shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                    <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {link.texto}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Back to Index Nav */}
            <div className="mt-8 text-center">
                <Link href="/glosario" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all font-medium text-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:-translate-y-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Seguir explorando el Directorio A-Z
                </Link>
            </div>
        </main>
    );
}
