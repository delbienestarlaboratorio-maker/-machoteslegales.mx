import { Metadata } from "next";
import CalculadoraLaboral from "./CalculadoraLaboral";

export const metadata: Metadata = {
    title: "Calculadora de Liquidación Laboral México 2026 — Despido y Renuncia | Machotes Legales",
    description: "Calcula tu liquidación por despido injustificado o finiquito por renuncia voluntaria. Actualizada 2026 con salario mínimo $315.04 MXN y reforma de Vacaciones Dignas. Fundamento en la Ley Federal del Trabajo.",
    keywords: [
        "calculadora liquidación laboral México",
        "cuánto me toca de liquidación",
        "calcular finiquito renuncia",
        "liquidación despido injustificado",
        "indemnización laboral México 2026",
        "calculadora finiquito LFT",
        "salario mínimo 2026 México",
        "3 meses de salario despido",
        "20 días por año trabajado",
        "prima de antigüedad",
        "vacaciones dignas 2023",
    ],
    alternates: { canonical: "https://machoteslegales.mx/calculadora-laboral" },
    openGraph: {
        title: "Calculadora de Liquidación Laboral México 2026",
        description: "Calcula cuánto te corresponde por despido o renuncia. Actualizada con LFT 2026 y Vacaciones Dignas.",
        url: "https://machoteslegales.mx/calculadora-laboral",
    },
};

export default function CalculadoraPage() {
    return <CalculadoraLaboral />;
}
