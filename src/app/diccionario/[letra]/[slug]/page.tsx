import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { diccionariJuridico } from '@/data/diccionario';
import CheckoutButton from '@/components/CheckoutButton';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

// Generar rutas estáticas para cada término en el diccionario
export async function generateStaticParams() {
    return diccionariJuridico.map((term) => ({
        letra: term.letra.toLowerCase(),
        slug: term.id,
    }));
}

type Props = {
    params: { letra: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const termino = diccionariJuridico.find(t => t.id === resolvedParams.slug);

    if (!termino) {
        return { title: 'Término no encontrado' };
    }

    return {
        title: `¿Qué es ${termino.termino} en México? | Diccionario Jurídico`,
        description: termino.definicion_corta,
        keywords: [termino.termino, 'significado legal', 'diccionario juridico mexico', 'ejemplo de', 'leyes mexicanas', params.slug],
        openGraph: {
            title: `Definición Jurídica: ${termino.termino}`,
            description: termino.definicion_corta,
            url: `https://machoteslegales.mx/diccionario/${termino.letra.toLowerCase()}/${termino.id}`,
            type: 'article',
        },
        alternates: { canonical: `https://machoteslegales.mx/diccionario/${termino.letra.toLowerCase()}/${termino.id}` }
    };
}

export default async function TerminoJuridicoPage({ params }: Props) {
    const resolvedParams = await params;
    const termino = diccionariJuridico.find(t => t.id === resolvedParams.slug && t.letra.toLowerCase() === resolvedParams.letra.toLowerCase());

    if (!termino) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb del Diccionario */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center text-[var(--color-text-muted)] space-x-2">
                <Link href="/diccionario" className="hover:text-[var(--color-accent)] transition-colors text-white/50">Diccionario Legal</Link>
                <span>/</span>
                <Link href={`/diccionario/${termino.letra.toLowerCase()}`} className="hover:text-[var(--color-accent)] transition-colors text-white/50">
                    Letra {termino.letra.toUpperCase()}
                </Link>
                <span>/</span>
                <span className="text-white font-bold">{termino.termino}</span>
            </nav>

            <article className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Elementos Decorativos */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex gap-4 items-center mb-6">
                    <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800 text-[var(--color-accent)] text-xl font-black border border-[var(--color-accent)]/30 font-[family-name:var(--font-outfit)] shadow-inner">
                        {termino.letra}
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight">
                        {termino.termino}
                    </h1>
                </div>

                <div className="prose prose-invert prose-lg max-w-none">

                    {/* Definición Corta - Destacada */}
                    <div className="text-lg md:text-xl text-white/90 leading-relaxed font-medium pl-4 border-l-4 border-[var(--color-accent)] bg-[var(--color-accent)]/5 py-3 pr-4 rounded-r-lg mb-8">
                        {termino.definicion_corta}
                    </div>

                    {/* Espacio para AdSense #1 (Top) */}
                    <div className="my-8">
                        <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Publicidad</div>
                        <AdBannerWrapper format="horizontal" />
                    </div>

                    {/* Síntesis Legal (Antes Análisis Detallado) */}
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-[var(--color-accent)]">⚖️</span> Síntesis Legal
                    </h2>
                    <p className="text-[var(--color-text-muted)] leading-loose mb-8 text-justify">
                        {termino.explicacion_detallada}
                    </p>

                    {/* Ficha Técnica / Ejemplo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                            <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Fundamento Legal
                            </h3>
                            <ul className="space-y-2 mt-4 text-sm text-[var(--color-text-muted)]">
                                {termino.fundamento_legal.map((ley, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-[var(--color-accent)]/50 mt-1">▸</span>
                                        <span>{ley}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/20 shadow-inner text-amber-50">
                            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-3 border-b border-amber-500/20 pb-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Ejemplo Práctico
                            </h3>
                            <p className="text-sm leading-relaxed mt-4 italic text-amber-200/80">
                                "{termino.ejemplo_uso}"
                            </p>
                        </div>
                    </div>

                    {/* Espacios Invocados para Monetización Transaccional (Cross-Selling) */}
                    {termino.plantillas_relacionadas.length > 0 && (
                        <div className="mt-12 bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 p-8 rounded-2xl border border-[var(--color-accent)]/20 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)]">
                                ¿Necesitas Documentos de <span className="text-[var(--color-accent)]">{termino.termino}</span>?
                            </h3>
                            <p className="text-sm text-white/50 mb-6">
                                Evita costosos errores. Descarga los formatos legales creados por abogados expertos y listos para usar en Word y PDF.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {termino.plantillas_relacionadas.map((slugRel) => (
                                    <div key={slugRel} className="flex flex-col gap-3 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[var(--color-accent)]/30 transition-colors">
                                        <div className="text-white text-sm font-medium line-clamp-1">{slugRel.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                                        <div className="flex gap-2">
                                            <Link href={`/plantillas/mercantil/${slugRel}`} className="flex-1 text-center bg-transparent border border-white/20 hover:border-white text-white text-xs py-2 rounded-lg transition-colors font-semibold">
                                                Ver Demo
                                            </Link>
                                            <div className="flex-1">
                                                <CheckoutButton
                                                    templateId={slugRel}
                                                    title={`Plantilla: ${slugRel}`}
                                                    price={79}
                                                    className="w-full h-full flex items-center justify-center text-center bg-[var(--color-accent)] hover:bg-yellow-400 text-black text-xs py-2 rounded-lg font-bold transition-colors"
                                                >
                                                    Comprar ($79)
                                                </CheckoutButton>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </article>

            {/* Espacio para AdSense #2 (Bottom) */}
            <div className="my-10 max-w-3xl mx-auto">
                <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Publicidad relacionada</div>
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Análisis Detallado (Textos Largos SEO de +500 palabras) */}
            <section className="glass-card p-6 md:p-10 rounded-3xl border border-white/5 mt-12 relative overflow-hidden">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
                    Análisis Detallado: <span className="text-[var(--color-accent)]">{termino.termino}</span>
                </h2>

                <div className="prose prose-invert prose-lg max-w-none text-[var(--color-text-muted)] leading-loose text-justify">
                    {/* Renderizamos el contenido SEO largo si existe, si no ponemos un placeholder indicando que está en construcción para el MVP */}
                    {termino.analisis_profundo_seo ? (
                        <div dangerouslySetInnerHTML={{ __html: termino.analisis_profundo_seo }} />
                    ) : (
                        <div>
                            <p>
                                El concepto de <strong>{termino.termino}</strong> es un pilar fundamental dentro de nuestro sistema normativo. A lo largo del desarrollo histórico del derecho en México, esta figura ha evolucionado para adaptarse a las necesidades sociales, económicas y de justicia de la población. Su comprensión no solo requiere el estudio de su definición literal, sino también de las implicaciones procesales que conlleva su aplicación práctica en los tribunales.
                            </p>
                            <h3>Antecedentes y Evolución</h3>
                            <p>
                                Desde el punto de vista doctrinario, la regulación sobre este rubro establece protecciones específicas para evitar abusos o discrepancias legales. Muchos doctrinarios coinciden en que la ambigüedad que en el pasado rodeó a esta figura obligó a los legisladores a emitir reformas precisas que delimitaran sus alcances. Es vital considerar que, como todo acto jurídico, se halla supeditado a principios generales de derecho.
                            </p>
                            <h3>Aplicación Jurisprudencial y Consideraciones Finales</h3>
                            <p>
                                Los Tribunales Colegiados y la Suprema Corte de Justicia de la Nación han emitido diversas tesis y jurisprudencias sobre el correcto alcance de este término, lo que ratifica su gran trascendencia procesal. Al redactar documentos o planear estrategias litigiosas relacionadas, omitir las exigencias de forma o de fondo suele resultar en resoluciones adversas, nulidades o sobreseimientos. De ahí la gran importancia de basar cualquier pretensión en modelos probados y asesoría especializada.
                            </p>
                            <div className="mt-8 p-4 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-xl text-sm text-[var(--color-accent)]">
                                <strong>Nota del Editor:</strong> Estamos actualizando nuestra base de datos para proveer un artículo enciclopédico de más de 500 palabras sobre este tema en los próximos días.
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Navegación al Índice */}
            <div className="mt-12 text-center pb-8 border-t border-white/5 pt-10">
                <Link href={`/diccionario/${termino.letra.toLowerCase()}`} className="inline-flex items-center text-sm font-semibold text-[var(--color-accent)] hover:text-white transition-colors gap-2 bg-[var(--color-accent)]/10 hover:bg-white/10 px-6 py-3 rounded-full border border-[var(--color-accent)]/20">
                    Ver más términos con la letra {termino.letra} →
                </Link>
            </div>
        </main>
    );
}
