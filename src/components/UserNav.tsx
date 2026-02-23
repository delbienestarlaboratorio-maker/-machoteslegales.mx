"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserNav() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="px-4 py-2 font-semibold text-sm text-[var(--color-text-muted)]">Cargando...</div>;
    }

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--color-text-muted)]">
                    Hola, {session.user?.email?.split("@")[0]}
                </span>
                <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-lg border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <a
            href="/auth/login"
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors"
        >
            Iniciar Sesión
        </a>
    );
}
