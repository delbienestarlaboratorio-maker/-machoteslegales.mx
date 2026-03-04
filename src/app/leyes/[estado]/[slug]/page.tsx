import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { estadosRepublica } from '@/data/estados';
import { estadoLeyesMock, federalLeyesMock } from '@/data/leyes';
import { articulosMock } from '@/data/articulos';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';
import BuscadorArticulos from '@/components/leyes/BuscadorArticulos';

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

// Genera todas las combinaciones estáticas de Estado + Ley
export async function generateStaticParams() {
    const params = [];
    for (const estado of estadosRepublica) {
        for (const ley of estadoLeyesMock) {
            params.push({
                estado: estado.id,
                slug: ley.id,
            });
        }
    }
    return params;
}

type Props = {
    params: Promise<{ estado: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = estadoLeyesMock.find(l => l.id === resolvedParams.slug);

    if (!estadoInfo || !leyInfo) {
        return { title: 'Ley no encontrada' };
    }

    return {
        title: `${leyInfo.nombre} de ${estadoInfo.nombre} | Directorio Legal`,
        description: leyInfo.descripcion_seo,
        keywords: [leyInfo.nombre.toLowerCase(), `leyes ${estadoInfo.nombre}`, 'codigo civil estado', 'legislacion local vigente'],
        openGraph: {
            title: `${leyInfo.nombre} - ${estadoInfo.nombre}`,
            description: leyInfo.descripcion_seo,
            url: `https://machoteslegales.mx/leyes/${estadoInfo.id}/${leyInfo.id}`,
            type: 'article',
        },
        alternates: { canonical: `https://machoteslegales.mx/leyes/${estadoInfo.id}/${leyInfo.id}` }
    };
}

export default async function LeyEstatalLecturaPage({ params }: Props) {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = [...estadoLeyesMock, ...federalLeyesMock].find(l => l.id === resolvedParams.slug);

    if (!estadoInfo || !leyInfo) {
        notFound();
    }

    let articulosDeLey = articulosMock
        .filter(a => a.ley_id === resolvedParams.slug && a.estado_id === resolvedParams.estado);

    // Cargar JSON masivo
    try {
        const dbPath = path.join(process.cwd(), 'src', 'data', 'db_leyes', resolvedParams.estado, `${resolvedParams.slug}.json`);
        if (fs.existsSync(dbPath)) {
            const content = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(content);
            if (parsed && parsed.length > 0) {
                articulosDeLey = parsed.map((a: any) => ({
                    id: `articulo-${a.id}`,
                    numero: a.etiqueta.replace(/[^0-9.]/g, ''),
                    contenido: a.texto,
                    ley_id: resolvedParams.slug,
                    estado_id: resolvedParams.estado,
                    explicacion_seo: "",
                    fuero: "estatal"
                } as any));
            }
        }
    } catch (e) { }
    articulosDeLey = articulosDeLey.sort((a, b) => {
        const numA = typeof a.numero === 'string' ? parseFloat(a.numero.replace(/[^0-9.]/g, '')) || 0 : a.numero;
        const numB = typeof b.numero === 'string' ? parseFloat(b.numero.replace(/[^0-9.]/g, '')) || 0 : b.numero;
        return numA - numB;
    });

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb con navegación multinivel */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}`} className="hover:text-emerald-400 transition-colors">{estadoInfo.nombre}</Link>
                <span>/</span>
                <span className="text-white font-bold truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</span>
            </nav>

            <article className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8 border-b border-white/10 pb-8">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 text-[10px] sm:text-xs text-emerald-400 font-bold tracking-widest uppercase mb-4 shadow-inner border border-emerald-500/20">
                            Fuero Común • {estadoInfo.abreviatura}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight leading-tight">
                            {leyInfo.nombre} <span className="block text-2xl md:text-3xl text-emerald-500/80 mt-2">de {estadoInfo.nombre}</span>
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

                        <div className="text-xs text-white/40 mb-1">Estructura de la Ley:</div>
                        <div className="text-sm text-white/90 font-medium">{leyInfo.articulos_totales} Artículos</div>
                    </div>
                </div>

                {/* AdSense Top Article */}
                <div className="my-8">
                    <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Publicidad</div>
                    <AdBannerWrapper format="horizontal" />
                </div>

                {/* Motor Frontend de Búsqueda y Grilla de Artículos */}
                <BuscadorArticulos
                    articulos={articulosDeLey}
                    leyId={leyInfo.id}
                    baseUrl={`/leyes/${estadoInfo.id}`}
                />

                {/* Sección Temática de Jurisprudencia */}
                <div className="bg-gradient-to-r from-blue-900/40 to-[#0f172a] p-8 md:p-10 rounded-3xl border border-blue-500/30 shadow-2xl mb-12 relative overflow-hidden mt-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <span className="text-3xl">⚖️</span> Jurisprudencia Local
                            </h3>
                            <p className="text-blue-100/70 text-sm max-w-xl">
                                Consulta la jurisprudencia firme emitida por los Tribunales Colegiados referida expresamente a los preceptos de esta legislación estatal.
                            </p>
                        </div>
                        <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia`} className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] whitespace-nowrap">
                            Ver {leyInfo.nombre} Jurisprudencial
                        </Link>
                    </div>
                </div>

                {/* Leyes Correlacionadas (Cross-Linking SEO Interlocal/Federal) */}
                {leyInfo.correlaciones && leyInfo.correlaciones.length > 0 && (
                    <div className="bg-amber-900/10 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-inner mb-12">
                        <h3 className="text-lg font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            Leyes Correlacionadas
                        </h3>
                        <p className="text-amber-100/70 text-sm mb-6">
                            Este ordenamiento local debe analizarse en conjunto con las siguientes normas supletorias o de competencia conexa:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {leyInfo.correlaciones.map((correlacion, idx) => (
                                <li key={idx}>
                                    <Link href={`/leyes/${estadoInfo.id}/${correlacion.url.replace('/leyes/federal/', '')}`} className="flex items-center gap-3 p-4 bg-black/40 border border-amber-500/10 rounded-xl hover:bg-amber-500/10 hover:border-amber-500/30 transition-colors group/link">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 group-hover/link:bg-amber-500 group-hover/link:text-black transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-amber-50">{correlacion.nombre}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Call to Action - Monetización */}
                <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-8 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Resoluciones Válidas para {estadoInfo.nombre}</h3>
                    <p className="text-white/60 text-sm mb-6">Genera un contrato, demanda o solicitud basada en este ordenamiento redactada por peritos en la materia y validada en juzgados de tu estado.</p>
                    <Link href={`/generador`} className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        Crear Machote Autorellenable
                    </Link>
                </div>

            </article>

            {/* AdSense Bottom */}
            <div className="my-10 max-w-3xl mx-auto">
                <div className="text-[10px] text-white/20 text-center mb-1 uppercase tracking-widest">Publicidad Patrocinada</div>
                <AdBannerWrapper format="horizontal" />
            </div>

            <div className="text-center mt-12 opacity-50 text-xs">
                La legislación de cada Estado se actualiza periodicamente según los Periódicos Oficiales Locales.
            </div>
        </main >
    );
}
