import Link from 'next/link';
import { Metadata } from 'next';
import { glosarioMock } from '@/data/glosario';
import AdBannerWrapper from '@/components/ads/AdBannerWrapper';

export const metadata: Metadata = {
    title: 'Glosario Jurídico y Diccionario Legal | MachotesLegales',
    description: 'Encuentra el significado de miles de conceptos legales, términos de abogacía y definiciones jurídicas explicadas de forma sencilla y clara.',
    keywords: ['diccionario juridico', 'glosario legal', 'terminos legales', 'que significa en derecho', 'abogado'],
    openGraph: {
        title: 'Diccionario Legal Mexicano A-Z',
        description: 'La enciclopedia jurídica más rápida para entender conceptos legales sin tecnicismos.',
        url: 'https://machoteslegales.mx/glosario',
        type: 'website',
    }
};

export default function GlosarioIndexPage() {
    // Agrupar términos por letra inicial
    const terminosPorLetra = glosarioMock.reduce((acc, termino) => {
        const letra = termino.letras_clave.toUpperCase();
        if (!acc[letra]) {
            acc[letra] = [];
        }
        acc[letra].push(termino);
        return acc;
    }, {} as Record<string, typeof glosarioMock>);

    const letrasDisponibles = Object.keys(terminosPorLetra).sort();

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <header className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 font-bold tracking-widest uppercase mb-6 text-sm">
                    Diccionario Enciclopédico
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white font-[family-name:var(--font-outfit)] tracking-tight mb-6 mt-4">
                    Glosario <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Jurídico</span>
                </h1>
                <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
                    Comprende el lenguaje de los abogados. Encuentra definiciones claras, jurisprudencia y ejemplos prácticos de miles de términos legales.
                </p>
            </header>

            {/* Buscador Rápido (Placeholder Visual) */}
            <div className="max-w-2xl mx-auto mb-16 relative">
                <input
                    type="text"
                    placeholder="Buscar un concepto (Ej. 'Amparo', 'Albacea')"
                    className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-white text-lg focus:outline-none focus:border-emerald-500 transition-colors pl-14 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    disabled
                />
                <svg className="w-6 h-6 text-white/40 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 text-xs text-white/50 px-3 py-1.5 rounded-lg border border-white/5 hidden sm:block">
                    Índice A-Z
                </div>
            </div>

            {/* AdSense Top */}
            <div className="mb-16">
                <AdBannerWrapper format="horizontal" />
            </div>

            {/* Navegación Alfabética Interactiva */}
            <div className="flex flex-wrap justify-center gap-2 mb-16 bg-slate-900/50 p-4 rounded-3xl border border-white/5">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letra) => {
                    const tieneTerminos = letrasDisponibles.includes(letra);
                    return (
                        <a
                            href={tieneTerminos ? `#letra-${letra}` : undefined}
                            key={letra}
                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${tieneTerminos
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                    : 'bg-black/20 text-white/20 cursor-not-allowed'
                                }`}
                        >
                            {letra}
                        </a>
                    );
                })}
            </div>

            {/* Listado de Términos Agrupados */}
            <div className="space-y-16">
                {letrasDisponibles.map((letra) => (
                    <section key={letra} id={`letra-${letra}`} className="scroll-mt-8">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 font-[family-name:var(--font-outfit)]">
                                {letra}
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {terminosPorLetra[letra].map((termino) => (
                                <Link href={`/glosario/${termino.id}`} key={termino.id} className="group flex flex-col h-full bg-[#0f172a] p-6 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-slate-800 transition-all shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                            {termino.termino}
                                        </h3>
                                        <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-slate-800 text-white/40 rounded border border-white/5">
                                            {termino.materia}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-4 flex-1">
                                        {termino.definicion_corta}
                                    </p>
                                    <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                                        Leer Definición <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* AdSense Bottom */}
            <div className="mt-20">
                <AdBannerWrapper format="horizontal" />
            </div>

        </main>
    );
}
