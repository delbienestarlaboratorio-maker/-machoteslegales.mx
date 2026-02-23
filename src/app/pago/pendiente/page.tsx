export default function PagoPendientePage() {
    return (
        <main className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="w-full max-w-md space-y-8 relative z-10 glass-card p-10 rounded-2xl border-yellow-500/30 shadow-2xl text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Pago Pendiente</h2>
                <p className="mt-4 text-[var(--color-text-muted)]">
                    Tu pago está siendo procesado. Si pagaste en efectivo (OXXO, 7-Eleven), esto puede demorar hasta 24 horas en reflejarse. Te notificaremos por correo.
                </p>
                <div className="mt-8">
                    <a href="/mis-plantillas" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[var(--color-primary-dark)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all">
                        Ir a Mis Plantillas
                    </a>
                </div>
            </div>
        </main>
    );
}
