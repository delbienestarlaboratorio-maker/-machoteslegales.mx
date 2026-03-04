"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MisPlantillasPage() {
    const router = useRouter();

    // Redirigir al login ya que auth no está habilitado en modo estático
    useEffect(() => {
        router.push("/auth/login?callbackUrl=/mis-plantillas");
    }, [router]);

    return (
        <main className="min-h-screen gradient-bg flex justify-center pt-32">
            <div className="text-white text-xl">Redirigiendo al inicio de sesión...</div>
        </main>
    );
}
