export default function PagoExitoPage() {
    return (
        <main className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            <div className="w-full max-w-md space-y-8 relative z-10 glass-card p-10 rounded-2xl border-green-500/30 shadow-2xl text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">¡Pago Exitoso!</h2>
                <p className="mt-4 text-[var(--color-text-muted)]">
                    Hemos confirmado tu pago correctamente. Tu plantilla ya está disponible en tu cuenta.
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
