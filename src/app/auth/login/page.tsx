"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Utilizamos el provider 'credentials' que definimos en AuthOptions
            const result = await signIn("credentials", {
                redirect: false,
                username: email,
                password: password,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                // Redirigir a la página principal o al callbackUrl tras éxito
                const callbackUrl = searchParams.get("callbackUrl");
                router.push(callbackUrl || "/");
                router.refresh(); // Refresca el estado global de la sesión
            }
        } catch (error) {
            setError("Ocurrió un error inesperado al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            <div className="w-full max-w-md space-y-8 relative z-10 glass-card p-10 rounded-2xl border-[var(--color-accent)]/20 shadow-2xl">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold font-[family-name:var(--font-outfit)] tracking-tight text-white">
                        Bienvenido de vuelta a<br />
                        <span className="gradient-gold">Machotes Legales</span>
                    </h2>
                    <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
                        Inicia sesión para descargar tus plantillas o accede con Google.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* Botón de Google */}
                    <button
                        onClick={() => signIn("google")}
                        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.86C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.86z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.86c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--color-surface)] text-[var(--color-text-muted)]">O continúa con tu correo</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-muted)]">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/10 bg-black/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent sm:text-sm transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-muted)]">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-4 py-3 border border-white/10 bg-black/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[var(--color-primary-dark)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all shadow-lg hover:shadow-[var(--color-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
                        ¿No tienes cuenta? <a href="/auth/registro" className="text-[var(--color-accent)] hover:text-white transition-colors">Crea una gratis</a> en 5 segundos.
                    </p>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen gradient-bg flex items-center justify-center text-white">Cargando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
