"use client";

// SessionProvider de next-auth deshabilitado para compatibilidad con Cloudflare Pages (sitio estático).
// La autenticación no es necesaria para este sitio de consulta legal pública.

export default function Providers({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
