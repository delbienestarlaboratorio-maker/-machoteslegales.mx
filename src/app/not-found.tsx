import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Página no encontrada | Machotes Legales',
    description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-md w-full text-center animate-fade-in-up">
                {/* Ícono Ilustrativo */}
                <div className="mx-auto w-24 h-24 mb-8 bg-slate-900 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative">
                    <span className="text-4xl">⚖️</span>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-black font-black border-4 border-[#0f172a]">
                        !
                    </div>
                </div>

                {/* Títulos */}
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-4 font-[family-name:var(--font-outfit)] tracking-tighter">
                    404
                </h1>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Artículo no encontrado
                </h2>
                <p className="text-base text-[var(--color-text-muted)] mb-10 leading-relaxed">
                    Parece que la página o el documento jurídico que estás buscando no existe, cambió de dirección, o ha sido temporalmente removido de nuestros archivos.
                </p>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center bg-[var(--color-accent)] hover:bg-yellow-400 text-black px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                    >
                        Ir a Inicio
                    </Link>
                    <Link
                        href="/plantillas"
                        className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-6 py-3.5 rounded-xl font-semibold transition-colors"
                    >
                        Ver Catálogo
                    </Link>
                </div>

                {/* Footer Opcional del 404 */}
                <div className="mt-12 pt-8 border-t border-white/10 text-xs text-white/40">
                    Código de Error: Objeto Legal Inexistente - 404
                </div>
            </div>
        </div>
    );
}
