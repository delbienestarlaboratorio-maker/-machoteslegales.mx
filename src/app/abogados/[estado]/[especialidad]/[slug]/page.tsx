import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { abogadosMock } from '@/data/abogados';
import { estadosRepublica } from '@/data/estados';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return abogadosMock.map((abogado) => ({
        estado: abogado.estado_id,
        especialidad: abogado.especialidades[0].toLowerCase(), // Tomamos la primaria para la URL canónica
        slug: abogado.id,
    }));
}

type Props = {
    params: Promise<{ estado: string; especialidad: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const abogado = abogadosMock.find(a => a.id === resolvedParams.slug);
    const estadoObj = estadosRepublica.find(e => e.id === resolvedParams.estado);

    if (!abogado || !estadoObj) {
        return { title: 'Abogado no encontrado' };
    }

    const especialidadFormat = resolvedParams.especialidad.charAt(0).toUpperCase() + resolvedParams.especialidad.slice(1);

    return {
        title: `${abogado.nombre} - Abogado ${especialidadFormat} en ${abogado.ciudad}, ${estadoObj.nombre} | MachotesLegales`,
        description: abogado.bio_corta,
        keywords: [`abogado ${resolvedParams.especialidad} ${abogado.ciudad}`, `despacho legal ${estadoObj.nombre}`, abogado.nombre, abogado.firma],
        openGraph: {
            title: `${abogado.nombre} - Legal Profile`,
            description: abogado.bio_corta,
            url: `https://machoteslegales.mx/abogados/${resolvedParams.estado}/${resolvedParams.especialidad}/${abogado.id}`,
            type: 'profile',
            images: [{ url: abogado.foto_url, width: 200, height: 200 }]
        }
    };
}

export default async function PerfilAbogadoPage({ params }: Props) {
    const resolvedParams = await params;
    const abogado = abogadosMock.find(a => a.id === resolvedParams.slug);
    const estadoObj = estadosRepublica.find(e => e.id === resolvedParams.estado);

    if (!abogado || !estadoObj) {
        notFound();
    }

    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Breadcrumbs SEO */}
            <nav className="mb-8 text-[11px] md:text-sm font-medium flex items-center flex-wrap text-[var(--color-text-muted)] gap-2">
                <Link href="/abogados" className="hover:text-amber-400 transition-colors">Directorio Nacional</Link>
                <span>/</span>
                <span className="capitalize">{estadoObj.nombre}</span>
                <span>/</span>
                <span className="capitalize">{resolvedParams.especialidad}</span>
                <span>/</span>
                <span className="text-white font-bold">{abogado.nombre}</span>
            </nav>

            {/* Cabecera del Perfil */}
            <div className="bg-[#0f172a] rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                    <div className="shrink-0 relative">
                        <img
                            src={abogado.foto_url}
                            alt={abogado.nombre}
                            className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-3xl border-4 border-slate-800 shadow-xl"
                        />
                        {abogado.verificado && (
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] border-2 border-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Identidad Verificada
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left text-white">
                        <h1 className="text-3xl md:text-5xl font-black font-[family-name:var(--font-outfit)] mb-2 leading-tight">
                            {abogado.nombre}
                        </h1>
                        <p className="text-xl text-amber-500 font-medium mb-4">{abogado.firma}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                            <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                <span className="font-bold">{abogado.rating}</span>
                                <span className="text-white/50 text-xs">({abogado.resenas_count} reseñas)</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {abogado.ciudad}, {estadoObj.nombre}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {abogado.anos_experiencia} Años Exp.
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                Cédula: {abogado.cedula}
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                            {abogado.especialidades.map((esp, idx) => (
                                <span key={idx} className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
                                    {esp}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Top */}
            <div className="mb-12">
                <AdBannerWrapper format="horizontal" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna Izquierda: Información Extendida */}
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Perfil Profesional
                        </h2>
                        <div className="prose prose-invert prose-amber max-w-none text-[var(--color-text-muted)] leading-relaxed text-justify"
                            dangerouslySetInnerHTML={{ __html: abogado.bio_larga }}
                        />
                    </section>
                </div>

                {/* Columna Derecha: Sticky CTA Sidebar */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full"></div>

                        <div className="text-center mb-6">
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Costo Estimado Primera Asesoría</div>
                            <div className="text-4xl font-black text-amber-400 font-[family-name:var(--font-outfit)]">${abogado.precio_asesoria} <span className="text-sm text-white/50 font-normal">MXN</span></div>
                        </div>

                        <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-lg py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(245,158,11,0.3)] flex justify-center items-center gap-2 mb-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            Agendar Cita Ahora
                        </button>

                        <div className="text-xs text-center text-white/40 leading-relaxed mb-6">
                            Al hacer clic, un operador confirmará la disponibilidad del despacho en menos de 10 minutos.
                        </div>

                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-3">Garantías MachotesLegales</h4>
                            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Cédulas verificadas ante la SEP.
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Atención confidencial.
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Cero cuotas ocultas.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Bottom */}
            <div className="mt-16">
                <AdBannerWrapper format="horizontal" />
            </div>
        </main>
    );
}
