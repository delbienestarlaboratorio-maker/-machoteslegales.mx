import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { estadosRepublica } from '@/data/estados';
import { estadoLeyesMock } from '@/data/leyes';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return estadosRepublica.map((estado) => ({
        estado: estado.id,
    }));
}

type Props = {
    params: { estado: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);

    if (!estadoInfo) {
        return { title: 'Estado no encontrado' };
    }

    return {
        title: `Leyes y Códigos de ${estadoInfo.nombre} | Directorio Jurídico`,
        description: `Consulta el Código Civil, Penal y todas las leyes locales vigentes del estado de ${estadoInfo.nombre}. Legislación estatal en México.`,
        keywords: [`leyes ${estadoInfo.nombre}`, `codigo civil ${estadoInfo.nombre}`, `congreso ${estadoInfo.nombre}`, 'leyes estatales mexico'],
        openGraph: {
            title: `Legislación del Estado de ${estadoInfo.nombre}`,
            description: `Legislación local vigente en ${estadoInfo.nombre}.`,
            url: `https://machoteslegales.mx/leyes/${estadoInfo.id}`,
        }
    };
}

export default async function EstadoLeyesPage({ params }: Props) {
    const resolvedParams = await params;
    const estadoInfo = estadosRepublica.find(e => e.id === resolvedParams.estado);

    if (!estadoInfo) {
        notFound();
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm font-medium flex items-center text-[var(--color-text-muted)] space-x-2">
                <Link href="/leyes" className="hover:text-emerald-400 transition-colors">Directorio de Leyes</Link>
                <span>/</span>
                <span className="text-white font-bold">{estadoInfo.nombre}</span>
            </nav>

            {/* Cabecera */}
            <div className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 p-8 md:p-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-4">
                    <span className="w-16 h-16 flex items-center justify-center bg-slate-800 text-emerald-400 text-2xl font-black rounded-2xl border border-emerald-500/20 shadow-inner">
                        {estadoInfo.abreviatura}
                    </span>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight">
                            Leyes de <span className="text-emerald-400">{estadoInfo.nombre}</span>
                        </h1>
                        <p className="text-emerald-500/80 font-medium mt-1 uppercase tracking-widest text-sm">Legislación del Fuero Común</p>
                    </div>
                </div>

                <p className="text-[var(--color-text-muted)] max-w-3xl text-lg mt-6 leading-relaxed">
                    Normatividad expedida por el Congreso del Estado de {estadoInfo.nombre}. Estas leyes rigen exclusivamente dentro de la jurisdicción territorial de esta entidad federativa.
                </p>
            </div>

            {/* AdSense Top */}
            <div className="my-10 max-w-4xl mx-auto">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Grid de Leyes Estatales */}
            <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">
                Códigos y Leyes Locales Destacadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {estadoLeyesMock.map((ley) => (
                    // La URL en un futuro sería: /leyes/nuevo-leon/codigo-civil
                    <Link href={`/leyes/${estadoInfo.id}/${ley.id}`} key={ley.id} className="block group h-full">
                        <div className="glass-card p-6 rounded-2xl border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all h-full shadow-lg relative flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-snug">
                                    {ley.nombre} de {estadoInfo.nombre}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-6">
                                    {ley.descripcion_seo}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 group-hover:text-white/70 transition-colors">
                                <span>{ley.articulos_totales} Artículos</span>
                                <span>Reformada: {ley.ultima_reforma}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* AdSense Bottom */}
            <div className="mt-16 mb-8 max-w-4xl mx-auto">
                <AdBannerWrapper format="horizontal" />
            </div>

        </main>
    );
}
