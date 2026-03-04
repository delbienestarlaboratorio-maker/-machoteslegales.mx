"use client";

// Auth deshabilitado para sitio estático en Cloudflare Pages.
// Se muestra siempre el botón "Iniciar Sesión" como decorativo.

export default function UserNav() {
    return (
        <a
            href="/auth/login"
            className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-semibold text-sm hover:bg-[var(--color-accent-light)] transition-colors"
        >
            Iniciar Sesión
        </a>
    );
}
