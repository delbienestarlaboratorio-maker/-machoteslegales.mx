import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { estadosRepublica } from '@/data/estados';
import { estadoLeyesMock } from '@/data/leyes';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

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
        return { title: 'No encontrada' };
    }

    return {
        title: `Jurisprudencia - ${leyInfo.nombre} de ${estadoInfo.nombre} | MachotesLegales`,
        description: `Tesis, Jurisprudencias y sentencias aplicables al ${leyInfo.nombre} emanadas por los Tribunales Colegiados de ${estadoInfo.nombre}.`,
        openGraph: {
            title: `Jurisprudencia | ${leyInfo.nombre}`,
            description: `Sentencias obligatorias para litigantes en ${estadoInfo.nombre}.`,
            url: `https://machoteslegales.mx/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia`,
            type: 'website',
        }
    };
}

export default async function IndexJurisprudenciaEstatalPage({ params }: Props) {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);
    const leyInfo = estadoLeyesMock.find(l => l.id === resolvedParams.slug);

    if (!estadoInfo || !leyInfo) {
        notFound();
    }

    const tesisLey = jurisprudenciasMock.filter(j => j.ley_id === resolvedParams.slug && j.estado_id === resolvedParams.estado);

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}`} className="hover:text-emerald-400 transition-colors truncate max-w-[100px] sm:max-w-none">{estadoInfo.nombre}</Link>
                <span>/</span>
                <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}`} className="hover:text-emerald-400 transition-colors truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</Link>
                <span>/</span>
                <span className="text-white font-bold">Jurisprudencia</span>
            </nav>

            <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] p-8 md:p-12 rounded-3xl border border-blue-500/20 shadow-2xl relative mb-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)] flex items-center gap-4">
                    <span className="text-4xl md:text-5xl">⚖️</span>
                    <div>
                        Jurisprudencia Aplicable
                        <div className="text-blue-400 text-lg md:text-xl font-medium mt-2">
                            {leyInfo.nombre} de {estadoInfo.nombre}
                        </div>
                    </div>
                </h1>
                <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-2xl">
                    Base de datos oficial que condensa las resoluciones relevantes y criterios vinculantes dictados por los Tribunales en favor de la interpretación del {leyInfo.nombre}.
                </p>
            </div>

            <div className="grid gap-6">
                {tesisLey.length > 0 ? (
                    tesisLey.map((tesis) => (
                        <Link href={`/leyes/${estadoInfo.id}/${leyInfo.id}/jurisprudencia/${tesis.id}`} key={tesis.id} className="block group">
                            <article className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all shadow-lg overflow-hidden relative">
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-bold tracking-widest uppercase">
                                    <span className={`px-3 py-1 rounded-full border ${tesis.tipo === 'Jurisprudencia' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                                        {tesis.tipo}
                                    </span>
                                    <span className="text-white/40">Registro {tesis.registro}</span>
                                    <span className="text-white/40 hidden sm:inline">•</span>
                                    <span className="text-white/40 truncate max-w-[150px]">{tesis.epoca}</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors mb-3 leading-tight">
                                    {tesis.rubro}
                                </h2>
                                <p className="text-[var(--color-text-muted)] text-sm line-clamp-2 md:line-clamp-3 mb-6">
                                    {tesis.resumen_seo}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
                                    Leer Resolución Completa
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </article>
                        </Link>
                    ))
                ) : (
                    <div className="bg-slate-900 border border-white/5 p-12 rounded-3xl text-center text-white/50">
                        <div className="text-6xl mb-4 opacity-50">📂</div>
                        <h3 className="text-xl text-white font-bold mb-2">No se encontraron tesis</h3>
                        <p>Nuestro equipo legal aún se encuentra transcribiendo e indexando las jurisprudencias relacionadas a esta ley.</p>
                    </div>
                )}
            </div>

            <div className="my-12">
                <AdBannerWrapper format="horizontal" />
            </div>
        </main>
    );
}
