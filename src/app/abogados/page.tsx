import Link from 'next/link';
import { Metadata } from 'next';
import { abogadosMock } from '@/data/abogados';
import { estadosRepublica } from '@/data/estados';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const metadata: Metadata = {
    title: 'Encuentra Abogados Expertos Cerca de Ti | MachotesLegales',
    description: 'Directorio nacional de despachos y abogados especialistas en materias Familiar, Civil, Laboral, Penal y más. Contacta expertos verificados en tu ciudad.',
    keywords: ['abogados cerca de mi', 'despachos de abogados', 'asesoria legal', 'abogado en linea', 'contratar abogado'],
    openGraph: {
        title: 'Directorio Nacional Legal',
        description: 'Encuentra los mejores despachos en tu ciudad de forma rápida y segura.',
        url: 'https://machoteslegales.mx/abogados',
        type: 'website',
    }
};

export default function DirectorioAbogadosPage() {
    // Array para renderizar estrellas
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            {/* Cabecera Hero */}
            <header className="text-center mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 font-bold tracking-widest uppercase mb-6 text-sm relative z-10">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    Red Nacional de Expertos
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white font-[family-name:var(--font-outfit)] tracking-tight mb-6">
                    Directorio de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Abogados</span>
                </h1>
                <p className="text-lg md:text-2xl text-[var(--color-text-muted)] max-w-3xl mx-auto leading-relaxed relative z-10">
                    No enfrentes tus problemas legales solo. Hemos calificado y reunido a los mejores litigantes y corporativistas de México listos para defender tu patrimonio, familia o libertad.
                </p>
            </header>

            {/* Buscador Interactivo/Filtros (Visual) */}
            <div className="bg-[#0f172a] p-6 lg:p-8 rounded-3xl border border-white/10 shadow-2xl mb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Estado</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 appearance-none">
                        <option value="">Selecciona tu Estado</option>
                        {estadosRepublica.map(e => (
                            <option key={e.id} value={e.id}>{e.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Especialidad</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 appearance-none">
                        <option value="">¿Qué problema tienes?</option>
                        <option value="Laboral">Despido o Problema Laboral (Laboral)</option>
                        <option value="Familiar">Divorcios o Pensiones Alimenticias (Familiar)</option>
                        <option value="Penal">Detenciones o Fraudes (Penal)</option>
                        <option value="Civil">Deudas o Pagarés (Mercantil/Civil)</option>
                        <option value="Inmobiliario">Bienes Raíces (Inmobiliario)</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20">
                        Buscar Expertos
                    </button>
                </div>
            </div>

            <div className="mb-12">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Listado de Abogados */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)] border-b border-white/10 pb-4">
                    Expertos Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {abogadosMock.map((abogado) => {
                        const estadoObj = estadosRepublica.find(e => e.id === abogado.estado_id);
                        return (
                            <article key={abogado.id} className="glass-card flex flex-col sm:flex-row gap-6 p-6 md:p-8 rounded-3xl border border-white/10 hover:border-amber-500/40 hover:bg-slate-800/80 transition-all shadow-xl group">
                                <div className="shrink-0 relative">
                                    <img
                                        src={abogado.foto_url}
                                        alt={abogado.nombre}
                                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-slate-700 group-hover:border-amber-500 transition-colors shadow-lg"
                                        loading="lazy"
                                    />
                                    {abogado.verificado && (
                                        <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg border-2 border-slate-900 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Verenis
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-amber-400 transition-colors">
                                                    {abogado.nombre}
                                                </h3>
                                                <p className="text-sm font-medium text-amber-500/80 mb-2">{abogado.firma}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                                                <span className="text-sm font-bold text-white">{abogado.rating}</span>
                                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4 text-xs font-bold tracking-widest uppercase">
                                            {abogado.especialidades.map((esp, idx) => (
                                                <span key={idx} className="bg-slate-800 text-white/70 px-2 py-1 rounded-md border border-white/5">
                                                    {esp}
                                                </span>
                                            ))}
                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-md flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {abogado.ciudad}, {estadoObj?.nombre || abogado.estado_id}
                                            </span>
                                        </div>

                                        <p className="text-[var(--color-text-muted)] text-sm mb-6 line-clamp-2">
                                            {abogado.bio_corta}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            // En el futuro será /abogados/[estado]/[especialidad]/[id], 
                                            // Por ahora mockeamos y enviaremos directo al perfil (la URL real exigirá parámetros).
                                            href={`/abogados/${abogado.estado_id}/${abogado.especialidades[0].toLowerCase()}/${abogado.id}`}
                                            className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-colors border border-white/5"
                                        >
                                            Ver Perfil Completo
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            <div className="mt-16">
                <AdBannerWrapper format="horizontal" />
            </div>
        </main>
    );
}
