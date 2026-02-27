"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
    "": "Inicio",
    plantillas: "Plantillas",
    precios: "Precios",
    privacidad: "Aviso de Privacidad",
    terminos: "Términos y Condiciones",
    confidencialidad: "Confidencialidad",
    "mis-plantillas": "Mis Plantillas",
    auth: "Cuenta",
    login: "Iniciar Sesión",
    registro: "Registro",
    pago: "Pago",
    exito: "Pago Exitoso",
    // Especialidades legales
    civil: "Derecho Civil",
    penal: "Derecho Penal",
    laboral: "Derecho Laboral",
    familiar: "Derecho Familiar",
    amparo: "Juicio de Amparo",
    fiscal: "Derecho Fiscal",
    mercantil: "Derecho Mercantil",
    administrativo: "Derecho Administrativo",
    agrario: "Derecho Agrario",
    ambiental: "Derecho Ambiental",
    inmobiliario: "Derecho Inmobiliario",
    constitucional: "Derecho Constitucional",
    intelectual: "Propiedad Intelectual",
    notarial: "Derecho Notarial",
    internacional: "Derecho Internacional",
    electoral: "Derecho Electoral",
    concursal: "Derecho Concursal",
    migracion: "Derecho Migratorio",
    arbitraje: "Arbitraje",
};

function labelForSegment(segment: string): string {
    const lower = segment.toLowerCase();
    if (LABELS[lower]) return LABELS[lower];
    // CamelCase slug → human: "demanda-laboral-despido" → "Demanda Laboral Despido"
    return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function BreadcrumbNav() {
    const pathname = usePathname();

    // No mostrar en la página de inicio
    if (pathname === "/") return null;

    const segments = pathname.split("/").filter(Boolean);

    return (
        <div className="breadcrumb-bar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center flex-wrap gap-0.5">
                <a href="/" className="hover:text-[var(--color-accent)] transition-colors">
                    🏠 Inicio
                </a>
                {segments.map((seg, idx) => {
                    const href = "/" + segments.slice(0, idx + 1).join("/");
                    const isLast = idx === segments.length - 1;
                    const label = labelForSegment(seg);

                    return (
                        <span key={idx} className="flex items-center">
                            <span className="breadcrumb-separator">›</span>
                            {isLast ? (
                                <span className="current">{label}</span>
                            ) : (
                                <a href={href} className="hover:text-[var(--color-accent)] transition-colors">
                                    {label}
                                </a>
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
