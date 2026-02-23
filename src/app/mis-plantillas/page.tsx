"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Tipo simulado de plantilla comprada (hasta conectarlo al 100% con Python)
interface PurchasedTemplate {
    id: string;
    title: string;
    date: string;
    tier: string;
    slug: string;
}

export default function MisPlantillasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [templates, setTemplates] = useState<PurchasedTemplate[]>([]);

    // Si no hay sesión, redirigir al login
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/mis-plantillas");
        }

        // Mock de datos (Aquí en el futuro haremos un fetch al backend de Python para traer las reales)
        if (status === "authenticated") {
            setTemplates([
                { id: "1", title: "Demanda de Divorcio Incausado — Versión Completa", date: "2026-02-22", tier: "V2", slug: "divorcio-incausado" },
                { id: "2", title: "Querella por Fraude — Versión Completa", date: "2026-02-20", tier: "V2", slug: "querella-fraude-completa" },
            ]);
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <main className="min-h-screen gradient-bg flex justify-center pt-32">
                <div className="text-white text-xl">Cargando tu cuenta...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20">
            {/* Header / Banner de cuenta */}
            <div className="gradient-bg py-16 text-center border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-outfit)]">
                        Mi <span className="gradient-gold">Panel Privado</span>
                    </h1>
                    <p className="mt-2 text-[var(--color-text-muted)]">
                        Sesión iniciada como: <span className="text-white font-medium">{session?.user?.email}</span>
                    </p>

                    {/* Estatus de Suscripción */}
                    <div className="mt-8 mx-auto max-w-sm glass-card p-4 rounded-xl border border-[var(--color-accent)]/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Plan Actual</div>
                        <div className="text-lg font-bold text-[var(--color-accent)] mt-1">Usuario Estándar (V2)</div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            Membresía <span className="text-purple-400 font-semibold">Elite V3 Inteligencia Artificial</span> Inactiva.
                        </p>
                        <a href="/precios" className="mt-3 block text-xs underline hover:text-white transition-colors">
                            Mejorar mi cuenta
                        </a>
                    </div>
                </div>
            </div>

            {/* Listado de Plantillas Compradas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-outfit)]">
                        Tus Plantillas Adquiridas
                    </h2>
                    <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-white">
                        {templates.length} documentos
                    </span>
                </div>

                {templates.length === 0 ? (
                    <div className="glass-card p-12 text-center rounded-2xl border-white/5">
                        <div className="text-4xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold text-white">Aún no tienes plantillas</h3>
                        <p className="text-[var(--color-text-muted)] mt-2">
                            Explora nuestro catálogo con más de 1,500 opciones profesionales.
                        </p>
                        <a href="/plantillas" className="inline-block mt-6 px-6 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold hover:bg-[var(--color-accent-light)] transition-colors">
                            Ir al Catálogo
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(tpl => (
                            <div key={tpl.id} className="glass-card p-6 rounded-2xl border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 transition-colors flex flex-col glow-hover">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                                        NIVEL {tpl.tier}
                                    </span>
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        Compra: {tpl.date}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 leading-tight flex-1">
                                    {tpl.title}
                                </h3>
                                <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
                                    <a href={`/plantillas/familiar/${tpl.slug}`} className="flex-1 text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors">
                                        Ver Detalles
                                    </a>
                                    <button className="flex-1 text-center py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-primary-dark)] font-bold text-sm transition-colors shadow-lg shadow-[var(--color-accent)]/20">
                                        ↓ Descargar PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
