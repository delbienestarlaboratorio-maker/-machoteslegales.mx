'use client';

export default function PagoFalloPage() {
    return (
        <main className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="w-full max-w-md space-y-8 relative z-10 glass-card p-10 rounded-2xl border-red-500/30 shadow-2xl text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Pago Rechazado</h2>
                <p className="mt-4 text-[var(--color-text-muted)]">
                    Hubo un problema procesando tu pago. Por favor, intenta de nuevo o utiliza otro método de pago.
                </p>
                <div className="mt-8 space-y-4">
                    <button onClick={() => window.history.back()} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[var(--color-primary-dark)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all">
                        Intentar de Nuevo
                    </button>
                    <a href="/plantillas" className="w-full flex justify-center py-3 px-4 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/5 transition-colors">
                        Volver al Catálogo
                    </a>
                </div>
            </div>
        </main>
    );
}
