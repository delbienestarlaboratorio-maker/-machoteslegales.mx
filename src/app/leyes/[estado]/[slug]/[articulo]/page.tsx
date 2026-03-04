import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { estadoLeyesMock, federalLeyesMock } from '@/data/leyes';
import { articulosMock } from '@/data/articulos';
import { estadosRepublica } from '@/data/estados';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';
import BuscadorArticuloNav from '@/components/leyes/BuscadorArticuloNav';
import { generarAnalisisJuridico } from '@/lib/analisis-juridico';

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    let params: { estado: string; slug: string; articulo: string }[] = [];

    // 1. Cargar Mock Original
    const mockParams = articulosMock
        .filter(art => art.fuero === 'estatal')
        .map((art) => ({
            estado: art.estado_id || '',
            slug: art.ley_id,
            articulo: art.id,
        }));
    params = [...mockParams];

    // 2. Cargar DB Fragmentada (Dynamic Scraped)
    try {
        const dbBase = path.join(process.cwd(), 'src', 'data', 'db_leyes');
        if (fs.existsSync(dbBase)) {
            const estados = fs.readdirSync(dbBase);
            for (const estado of estados) {
                const leyes = fs.readdirSync(path.join(dbBase, estado));
                for (const ley of leyes) {
                    if (ley.endsWith('.json')) {
                        const leySlug = ley.replace('.json', '');
                        const content = fs.readFileSync(path.join(dbBase, estado, ley), 'utf8');
                        const parsed = JSON.parse(content);
                        const arr = parsed.map((a: any) => ({
                            estado: estado,
                            slug: leySlug,
                            articulo: `articulo-${a.id}`
                        }));
                        // Añadir los dinámicos
                        params = [...params, ...arr];
                    }
                }
            }
        }
    } catch (e) {
        console.warn("No se pudo cargar la DB Fragmentada en generateStaticParams");
    }

    return params;
}

type Props = {
    params: Promise<{ estado: string; slug: string; articulo: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = [...estadoLeyesMock, ...federalLeyesMock].find(l => l.id === resolvedParams.slug);
    let artInfo = articulosMock.find(a => a.id === resolvedParams.articulo && a.ley_id === resolvedParams.slug && a.estado_id === resolvedParams.estado);

    // Intentar buscar en DB Fragmentada si no existe en mock
    if (!artInfo) {
        try {
            const dbPath = path.join(process.cwd(), 'src', 'data', 'db_leyes', resolvedParams.estado, `${resolvedParams.slug}.json`);
            if (fs.existsSync(dbPath)) {
                const content = fs.readFileSync(dbPath, 'utf8');
                const parsed = JSON.parse(content);
                const articuloNumero = resolvedParams.articulo.replace('articulo-', '');
                const found = parsed.find((a: any) => a.id.toString() === articuloNumero);
                if (found) {
                    artInfo = {
                        id: found.id.toString(),
                        numero: found.etiqueta.replace(/[^0-9.]/g, ''),
                        contenido: found.texto,
                        ley_id: resolvedParams.slug,
                        estado_id: resolvedParams.estado,
                        explicacion_seo: "Explicación legal completa de este artículo legislativo del Estado.",
                        fuero: "estatal"
                    } as any;
                }
            }
        } catch (e) { }
    }

    if (!estadoInfo || !leyInfo || !artInfo) {
        return { title: 'Artículo no encontrado' };
    }

    return {
        title: `Artículo ${artInfo.numero} | ${leyInfo.nombre} de ${estadoInfo.nombre}`,
        description: `Explicación, jurisprudencia y texto vigente del Artículo ${artInfo.numero} del ${leyInfo.nombre} para ${estadoInfo.nombre}.`,
        keywords: [`articulo ${artInfo.numero} ${leyInfo.nombre.toLowerCase()} ${estadoInfo.nombre.toLowerCase()}`, 'leyes estatales', 'explicacion de la ley', estadoInfo.nombre.toLowerCase()],
        openGraph: {
            title: `Artículo ${artInfo.numero} - ${leyInfo.nombre}`,
            description: `Explicación legal completa y actualizada del Artículo ${artInfo.numero} en ${estadoInfo.nombre}.`,
            url: `https://machoteslegales.mx/leyes/${estadoInfo.id}/${leyInfo.id}/${artInfo.id}`,
            type: 'article',
        }
    };
}

export default async function ArtículoEstatalPage({ params }: Props) {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = [...estadoLeyesMock, ...federalLeyesMock].find(l => l.id === resolvedParams.slug);
    let todosLosArticulos = articulosMock
        .filter(a => a.ley_id === resolvedParams.slug && a.estado_id === resolvedParams.estado);

    // Reemplazar con DB si existe
    try {
        const dbPath = path.join(process.cwd(), 'src', 'data', 'db_leyes', resolvedParams.estado, `${resolvedParams.slug}.json`);
        if (fs.existsSync(dbPath)) {
            const content = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(content);
            if (parsed && parsed.length > 0) {
                todosLosArticulos = parsed.map((a: any) => ({
                    id: `articulo-${a.id}`,
                    numero: a.etiqueta.replace(/[^0-9.]/g, ''),
                    contenido: a.texto,
                    ley_id: resolvedParams.slug,
                    estado_id: resolvedParams.estado,
                    explicacion_seo: "<p>Este precepto se desprende directamente de la normatividad local estructurada en la base de datos legislativa primaria. Su interpretación requiere concordancia jurisprudencial.</p>",
                    fuero: "estatal"
                } as any));
            }
        }
    } catch (e) { }

    todosLosArticulos = todosLosArticulos.sort((a, b) => {
        const numA = typeof a.numero === 'string' ? parseFloat(a.numero.replace(/[^0-9.]/g, '')) || 0 : a.numero;
        const numB = typeof b.numero === 'string' ? parseFloat(b.numero.replace(/[^0-9.]/g, '')) || 0 : b.numero;
        return numA - numB;
    });

    const artInfo = todosLosArticulos.find(a => a.id === resolvedParams.articulo);

    if (!estadoInfo || !leyInfo || !artInfo) {
        notFound();
    }

    const indexActual = todosLosArticulos.findIndex(a => a.id === artInfo.id);

    if (indexActual === -1) {
        notFound();
    }

    // Calcular Anterior y Siguiente
    const artAnterior = indexActual > 0 ? todosLosArticulos[indexActual - 1] : null;
    const artSiguiente = indexActual < todosLosArticulos.length - 1 ? todosLosArticulos[indexActual + 1] : null;

    // Buscar Jurisprudencias Aplicables a este artículo en particular
    const jurisprudenciasAplicables = jurisprudenciasMock.filter(j =>
        j.ley_id === resolvedParams.slug &&
        j.estado_id === resolvedParams.estado &&
        j.articulos_relacionados &&
        j.articulos_relacionados.includes(artInfo.id)
    );

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb Oculto Interactivo */}
            <nav className="mb-6 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}`} className="hover:text-emerald-400 transition-colors">{estadoInfo.nombre}</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}`} className="hover:text-emerald-400 transition-colors truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</Link>
                <span>/</span>
                <span className="text-white font-bold">Artículo {artInfo.numero}</span>
            </nav>

            {/* Paginación Superior Rápida Siguiente / Anterior */}
            <div className="flex justify-between items-center mb-6 font-bold text-sm">
                {artAnterior ? (
                    <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/${artAnterior.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:-translate-x-1 shadow-inner shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="hidden sm:inline">Artículo Anterior</span>
                        <span className="sm:hidden">Anterior</span>
                    </Link>
                ) : (
                    <div></div>
                )}

                {/* Buscador de Salto Rápido central (Pasamos leyId original como viene en la ruta) */}
                <div className="hidden sm:block flex-1 mx-4 max-w-sm">
                    {/* Reutilizamos el buscador asumiendo que la ruta será reconstruida, pero el BuscadorArticuloNav actual apunta a /leyes/federal. Modificaremos BuscadorArticuloNav o crearemos uno estatal. Para este caso rápido, adaptaremos en el futuro. */}
                    <div className="text-center text-xs text-white/40">Navegación Intraley</div>
                </div>

                {artSiguiente ? (
                    <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/${artSiguiente.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:translate-x-1 shadow-inner shrink-0">
                        <span className="hidden sm:inline">Siguiente Artículo</span>
                        <span className="sm:hidden">Siguiente</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                ) : (
                    <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all shrink-0">
                        Volver al Índice
                    </Link>
                )}
            </div>

            <article className="glass-card p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-4 border border-emerald-500/20">
                        {leyInfo.nombre} de {estadoInfo.nombre}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white font-[family-name:var(--font-outfit)] tracking-tight mb-6">
                        Artículo {artInfo.numero}
                        <span className="block text-xl md:text-2xl text-[var(--color-text-muted)] mt-2 font-normal">
                            Precepto Vigente Estatal
                        </span>
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
                    <div
                        dangerouslySetInnerHTML={{
                            __html: (artInfo.explicacion_seo && artInfo.explicacion_seo.length > 80)
                                ? artInfo.explicacion_seo
                                : generarAnalisisJuridico(
                                    artInfo.contenido,
                                    artInfo.numero?.toString() ?? '',
                                    `Artículo ${artInfo.numero}`,
                                    leyInfo!.nombre,
                                    estadoInfo!.nombre
                                )
                        }}
                        className="bg-slate-900/50 p-6 md:p-10 rounded-2xl border border-white/5"
                    />
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
                            Tribunales Colegiados Locales han emitido las siguientes sentencias vinculantes para la correcta aplicación de este precepto:
                        </p>
                        <div className="grid gap-4 relative z-10">
                            {jurisprudenciasAplicables.map((juri) => (
                                <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia/${juri.id}`} key={juri.id} className="block group">
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

                {/* Call To Action - Generador */}
                <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-8 rounded-2xl text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Aplica este Artículo Correctamente en {estadoInfo.nombre}</h3>
                    <p className="text-white/60 text-sm mb-6">Utiliza nuestro motor inteligente para redactar un escrito legal que se apoye perfectamente en la legislación de {estadoInfo.nombre}.</p>
                    <Link href={`/generador`} className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-xl font-bold transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        Crear Machote Relacionado
                    </Link>
                </div>

            </article>

            {/* Paginación Inferior */}
            <div className="flex justify-between items-center mt-12 px-4 font-bold text-sm">
                {artAnterior ? (
                    <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/${artAnterior.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:-translate-x-1 shadow-inner">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="hidden sm:inline">Artículo Anterior</span>
                        <span className="sm:hidden">Anterior</span>
                    </Link>
                ) : (
                    <div></div>
                )}

                {artSiguiente ? (
                    <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/${artSiguiente.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all hover:translate-x-1 shadow-inner">
                        <span className="hidden sm:inline">Siguiente Artículo</span>
                        <span className="sm:hidden">Siguiente</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                ) : (
                    <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all">
                        Volver al Índice
                    </Link>
                )}
            </div>
        </main>
    );
}
