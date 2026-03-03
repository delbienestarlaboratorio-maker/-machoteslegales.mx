import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { abogadosMock } from '@/data/abogados';
import { estadosRepublica } from '@/data/estados';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    // Generate unique combinations of state + specialty
    const paths: { estado: string, especialidad: string }[] = [];

    abogadosMock.forEach(abogado => {
        abogado.especialidades.forEach(esp => {
            const espStr = esp.toLowerCase();
            const exists = paths.find(p => p.estado === abogado.estado_id && p.especialidad === espStr);
            if (!exists) {
                paths.push({
                    estado: abogado.estado_id,
                    especialidad: espStr,
                });
            }
        });
    });

    return paths;
}

type Props = {
    params: Promise<{ estado: string; especialidad: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const estadoObj = estadosRepublica.find(e => e.id === resolvedParams.estado);

    if (!estadoObj) {
        return { title: 'Directorio no encontrado' };
    }

    const especialidadFormat = resolvedParams.especialidad.charAt(0).toUpperCase() + resolvedParams.especialidad.slice(1);

    return {
        title: `Los Mejores Abogados ${especialidadFormat}es en ${estadoObj.nombre} | Directorio Legal`,
        description: `Encuentra despachos especializados en materia ${especialidadFormat} en ${estadoObj.nombre}. Consulta reseñas, años de experiencia y agenda tu cita hoy mismo.`,
        keywords: [`abogados ${resolvedParams.especialidad} ${estadoObj.nombre}`, `mejor abogado ${resolvedParams.especialidad} en ${estadoObj.nombre}`, 'asesoria juridica', 'despacho'],
        openGraph: {
            title: `Abogados ${especialidadFormat}s en ${estadoObj.nombre}`,
            description: `Lista verificada de especialistas en ${resolvedParams.especialidad} en ${estadoObj.nombre}.`,
            url: `https://machoteslegales.mx/abogados/${resolvedParams.estado}/${resolvedParams.especialidad}`,
            type: 'website',
        }
    };
}

export default async function ListadoEspecialidadEstadoPage({ params }: Props) {
    const resolvedParams = await params;
    const estadoObj = estadosRepublica.find(e => e.id === resolvedParams.estado);

    if (!estadoObj) {
        notFound();
    }

    const especialidadFormat = resolvedParams.especialidad.charAt(0).toUpperCase() + resolvedParams.especialidad.slice(1);

    // Filtrar abogados por Estado Y Especialidad
    const abogadosFiltrados = abogadosMock.filter(a =>
        a.estado_id === resolvedParams.estado &&
        a.especialidades.some(esp => esp.toLowerCase() === resolvedParams.especialidad)
    );

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumbs */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/abogados" className="hover:text-amber-400 transition-colors">Directorio Nacional</Link>
                <span>/</span>
                <span className="capitalize">{estadoObj.nombre}</span>
                <span>/</span>
                <span className="text-white font-bold">{especialidadFormat}</span>
            </nav>

            <header className="text-center md:text-left mb-12 border-b border-white/10 pb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    Resultados Geofenceados
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white font-[family-name:var(--font-outfit)] leading-tight mb-4">
                    Abogados Expertos en Materia <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">{especialidadFormat}</span> en {estadoObj.nombre}
                </h1>
                <p className="text-lg text-[var(--color-text-muted)] max-w-3xl">
                    Mostrando <strong>{abogadosFiltrados.length}</strong> especialistas verificados disponibles cerca de ti. Selecciona un perfil para agendar una cita o ver sus reseñas de éxito.
                </p>
            </header>

            {/* AdSense Top */}
            <div className="mb-12">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Cuadrícula de Abogados */}
            {abogadosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {abogadosFiltrados.map((abogado) => (
                        <Link
                            key={abogado.id}
                            href={`/abogados/${resolvedParams.estado}/${resolvedParams.especialidad}/${abogado.id}`}
                            className="bg-[#0f172a] rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 hover:bg-slate-800 transition-all shadow-xl group flex flex-col h-full"
                        >
                            <div className="flex gap-4 items-center mb-4">
                                <div className="relative shrink-0">
                                    <img
                                        src={abogado.foto_url}
                                        alt={abogado.nombre}
                                        className="w-16 h-16 object-cover rounded-full border-2 border-slate-700 group-hover:border-amber-500 transition-colors"
                                    />
                                    {abogado.verificado && (
                                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full border border-slate-900" title="Verificado">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">{abogado.nombre}</h3>
                                    <p className="text-xs text-amber-500 font-medium">{abogado.firma}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-black/40 text-amber-400 text-xs font-bold px-2 py-1 rounded border border-white/5 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    {abogado.rating}
                                </span>
                                <span className="text-white/40 text-xs">{abogado.resenas_count} opiniones</span>
                                <span className="text-white/20 text-xs">&bull;</span>
                                <span className="text-white/60 text-xs">{abogado.ciudad}</span>
                            </div>

                            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-6 flex-1">
                                {abogado.bio_corta}
                            </p>

                            <div className="mt-auto border-t border-white/5 pt-4 flex justify-between items-center text-sm">
                                <span className="text-white/50 text-xs">Cédula: <span className="font-mono text-white/70">{abogado.cedula}</span></span>
                                <span className="font-bold text-amber-400 flex items-center gap-1 group-hover:underline">
                                    Contactar <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-white/10 border-dashed">
                    <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <h3 className="text-xl font-bold text-white mb-2">No hay abogados disponibles</h3>
                    <p className="text-[var(--color-text-muted)] text-sm max-w-md mx-auto">
                        Actualmente no tenemos despachos registrados en <strong>{estadoObj.nombre}</strong> con la especialidad <strong>{especialidadFormat}</strong>.
                    </p>
                    <Link href="/abogados" className="inline-block mt-6 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-xl transition-colors text-sm">
                        Volver al Directorio
                    </Link>
                </div>
            )}

            {/* AdSense Bottom */}
            <div className="mt-8">
                <AdBannerWrapper format="horizontal" />
            </div>
        </main>
    );
}
