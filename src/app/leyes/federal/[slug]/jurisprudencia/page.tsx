import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { federalLeyesMock } from '@/data/leyes';
import { jurisprudenciasMock } from '@/data/jurisprudencias';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

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
        title: `Jurisprudencia | ${leyInfo.nombre} | Suprema Corte`,
        description: `Consulta las tesis aisladas, amparos y sentencias vinculantes dictadas para ${leyInfo.nombre}. Archivo jurisprudencial.`,
    };
}

export default async function JurisprudenciaLeyIndexPage({ params }: Props) {
    const resolvedParams = await params;
    const leyInfo = federalLeyesMock.find(l => l.id === resolvedParams.slug);

    if (!leyInfo) {
        notFound();
    }

    const jurisprudenciasDeLey = jurisprudenciasMock.filter(j => j.ley_id === resolvedParams.slug && j.fuero === 'federal');

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumb Oculto Interactivo */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/leyes" className="hover:text-amber-400 transition-colors">Leyes</Link>
                <span>/</span>
                <Link href="/leyes/federales" className="hover:text-amber-400 transition-colors">Federal</Link>
                <span>/</span>
                <Link href={`/leyes/federal/${leyInfo.id}`} className="hover:text-amber-400 transition-colors truncate max-w-[150px] sm:max-w-none">{leyInfo.nombre}</Link>
                <span>/</span>
                <span className="text-white font-bold">Jurisprudencias</span>
            </nav>

            {/* Cabecera Jurisprudencial */}
            <div className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900 border border-amber-500/10 p-8 md:p-12 shadow-[0_0_40px_rgba(245,158,11,0.05)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-4">
                    <span className="w-16 h-16 flex items-center justify-center bg-black/50 text-amber-400 text-3xl font-black rounded-2xl border border-amber-500/30 shadow-inner">
                        ⚖️
                    </span>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight">
                            Jurisprudencias <span className="block text-xl md:text-3xl text-amber-500/80 mt-2">de {leyInfo.nombre}</span>
                        </h1>
                    </div>
                </div>

                <p className="text-[var(--color-text-muted)] max-w-3xl text-lg mt-6 leading-relaxed">
                    Catálogo de Tesis Aisladas y Jurisprudencias Firmes emitidas por los Tribunales Colegiados de Circuito y la Suprema Corte de Justicia de la Nación asociadas directamente a los preceptos de esta normativa.
                </p>
            </div>

            <div className="my-8 max-w-4xl mx-auto">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Listado Principal de Jurisprudencias */}
            {jurisprudenciasDeLey.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 mb-16">
                    {jurisprudenciasDeLey.map((juri) => (
                        <Link href={`/leyes/federal/${leyInfo.id}/jurisprudencia/${juri.id}`} key={juri.id} className="block group">
                            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 hover:border-amber-500/30 hover:bg-black/40 transition-all flex flex-col md:flex-row gap-6 items-start h-full group-hover:-translate-y-1 shadow-lg">
                                {/* Side Metadata */}
                                <div className="md:w-64 shrink-0 bg-[#0f172a] p-4 rounded-xl border border-white/5 shadow-inner self-stretch flex flex-col justify-center">
                                    <div className="text-xs text-amber-500/70 uppercase tracking-widest font-bold mb-1">{juri.tipo}</div>
                                    <div className="text-white font-bold mb-3">Reg. {juri.registro}</div>
                                    <div className="text-xs text-white/50 mb-1">Época:</div>
                                    <div className="text-sm font-medium text-white/90 mb-3">{juri.epoca}</div>
                                    <div className="text-xs text-white/50 mb-1">Instancia:</div>
                                    <div className="text-sm font-medium text-white/90">{juri.instancia}</div>
                                </div>

                                {/* Main Content Extract */}
                                <div className="flex-1">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors leading-snug">
                                        {juri.rubro}
                                    </h3>
                                    <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                                        {juri.resumen_seo}
                                    </p>
                                    <div className="flex items-center gap-2 text-amber-500 font-bold text-sm bg-amber-500/10 inline-flex px-4 py-2 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                                        Leer Juicio Completo
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900 border border-white/5 p-12 rounded-3xl text-center text-white/40 mb-16">
                    <span className="text-4xl mb-4 block">📚</span>
                    Aún no tenemos tesis capturadas específicamente para esta ley. El equipo editorial cargará sentencias de la SCJN próximamente.
                </div>
            )}

        </main>
    );
}
