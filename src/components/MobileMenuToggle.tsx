"use client";

import { useState } from "react";

export default function MobileMenuToggle() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Toggle button — only visible on mobile */}
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Menú"
                aria-expanded={open}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {open ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Dropdown menu mobile */}
            {open && (
                <div className="mobile-menu absolute top-full left-0 right-0 z-40 px-4 py-4 flex flex-col gap-3 text-sm">
                    <a
                        href="/plantillas"
                        onClick={() => setOpen(false)}
                        className="py-2 px-3 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                    >
                        📄 Plantillas
                    </a>
                    <a
                        href="/precios"
                        onClick={() => setOpen(false)}
                        className="py-2 px-3 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                    >
                        💎 Precios
                    </a>
                    <a
                        href="/mis-plantillas"
                        onClick={() => setOpen(false)}
                        className="py-2 px-3 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                    >
                        🗂️ Mis Plantillas
                    </a>
                    <a
                        href="/auth/login"
                        onClick={() => setOpen(false)}
                        className="py-2 px-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary-dark)] font-bold text-center hover:bg-[var(--color-accent-light)] transition-colors"
                    >
                        Iniciar Sesión
                    </a>
                </div>
            )}
        </>
    );
}
