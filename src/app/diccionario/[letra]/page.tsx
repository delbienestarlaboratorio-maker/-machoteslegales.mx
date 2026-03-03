import { Metadata } from 'next';
import Link from 'next/link';
import { diccionariJuridico } from '@/data/diccionario';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    // Generar todas las letras de la A a la Z que tengan al menos un término
    const letrasDisponibles = Array.from(new Set(diccionariJuridico.map(term => term.letra.toLowerCase())));
    return letrasDisponibles.map((letra) => ({
        letra: letra,
    }));
}

type Props = {
    params: { letra: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const letra = resolvedParams.letra.toUpperCase();
    return {
        title: `Términos Jurídicos con la Letra ${letra} | Diccionario Legal México`,
        description: `Encuentra definiciones y conceptos legales de México que empiezan con la letra ${letra}. Glosario jurídico gratuito.`,
        alternates: { canonical: `https://machoteslegales.mx/diccionario/${resolvedParams.letra.toLowerCase()}` }
    };
}

export default async function DiccionarioLetraPage({ params }: Props) {
    const resolvedParams = await params;
    const letra = resolvedParams.letra.toUpperCase();
    const terminos = diccionariJuridico
        .filter(t => t.letra.toUpperCase() === letra)
        .sort((a, b) => a.termino.localeCompare(b.termino));

    if (terminos.length === 0) {
        notFound();
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-10 text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-xs text-[var(--color-accent)] mb-4 uppercase tracking-widest font-bold">
                    <Link href="/diccionario" className="hover:underline">Índice del Diccionario</Link>
                    <span className="text-white/30">•</span>
                    <span>Letra {letra}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] mb-4">
                    Glosario Legal - Letra <span className="text-[var(--color-accent)]">{letra}</span>
                </h1>
                <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm">
                    {terminos.length} definiciones jurídicas encontradas comenzando con esta letra.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                {terminos.map(term => (
                    <Link href={`/diccionario/${term.letra.toLowerCase()}/${term.id}`} key={term.id} className="block group h-full">
                        <div className="glass-card p-6 rounded-xl border border-white/5 group-hover:border-[var(--color-accent)]/50 transition-all h-full flex flex-col group-hover:-translate-y-1 shadow-md hover:shadow-[0_4px_20px_rgba(234,179,8,0.15)] bg-gradient-to-br from-[#0f172a] to-black relative overflow-hidden">
                            {/* Accento Visual Inferior */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <h3 className="text-lg font-bold text-white mb-2 pb-2 border-b border-white/10 group-hover:text-[var(--color-accent)] transition-colors">
                                {term.termino}
                            </h3>
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed m-0 flex-1">
                                {term.definicion_corta}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link href="/diccionario" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors border border-slate-600">
                    ← Volver al Abecedario Completo
                </Link>
            </div>
        </main>
    );
}
