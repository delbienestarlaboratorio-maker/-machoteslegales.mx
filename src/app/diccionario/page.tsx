import Link from 'next/link';
import { Metadata } from 'next';
import { diccionariJuridico } from '@/data/diccionario';
import DiccionarioSearch from '@/components/DiccionarioSearch';

export const metadata: Metadata = {
    title: 'Diccionario Jurídico Mexicano | Letra por Letra',
    description: 'Consulta el glosario más completo de términos legales, amparos, contratos y jurisprudencia en México. Definiciones claras para todos.',
    keywords: ['diccionario juridico', 'terminos legales mexico', 'glosario derecho mexicano', 'que significa en derecho'],
    openGraph: {
        title: 'Diccionario Jurídico de México',
        description: 'Encuentra el significado fácil y legal de cientos de palabras jurídicas.',
        url: 'https://machoteslegales.mx/diccionario'
    }
};

export default function DiccionarioIndex() {
    // Extraer todas las letras únicas que existen en nuestra base de datos
    const letrasDisponibles = Array.from(new Set(diccionariJuridico.map(term => term.letra.toUpperCase()))).sort();

    // Todas las letras del abecedario
    const abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 text-sm text-[var(--color-accent)] mb-4">
                    <span>📖</span><span>Enciclopedia Legal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-outfit)] mb-6">
                    Diccionario <span className="gradient-gold">Jurídico Mexicano</span>
                </h1>
                <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10">
                    Explora cientos de conceptos legales explicados de manera sencilla y clara basados en la legislación de México.
                </p>
                <DiccionarioSearch />
            </div>

            <div className="glass-card p-8 rounded-2xl border-white/5 mb-16">
                <h2 className="text-xl font-bold text-white mb-6 text-center">Búsqueda Alfabética</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {abecedario.map((letra) => {
                        const estaDisponible = letrasDisponibles.includes(letra);
                        return estaDisponible ? (
                            <Link
                                key={letra}
                                href={`/diccionario/${letra.toLowerCase()}`}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/30 font-bold hover:bg-[var(--color-accent)] hover:text-black transition-all shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:-translate-y-1"
                            >
                                {letra}
                            </Link>
                        ) : (
                            <span
                                key={letra}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                            >
                                {letra}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mostrar algunos terminos destacados o recientes */}
                {diccionariJuridico.slice(0, 6).map((termino) => (
                    <Link href={`/diccionario/${termino.letra.toLowerCase()}/${termino.id}`} key={termino.id} className="block group">
                        <div className="glass-card p-6 rounded-2xl h-full border border-white/5 group-hover:border-[var(--color-accent)]/30 transition-colors">
                            <div className="text-[var(--color-accent)] font-bold text-xs mb-2 uppercase tracking-wider">Letra {termino.letra}</div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--color-accent)] transition-colors">{termino.termino}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">{termino.definicion_corta}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
