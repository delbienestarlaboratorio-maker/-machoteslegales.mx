// Specialty data for the entire Machotes Legales platform
export interface Specialty {
    code: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    templateCount: number;
    slug: string;
}

export const SPECIALTIES: Specialty[] = [
    { code: "civil", name: "Derecho Civil", icon: "⚖️", color: "#3b82f6", description: "Contratos, propiedad, obligaciones, sucesiones", templateCount: 150, slug: "civil" },
    { code: "penal", name: "Derecho Penal", icon: "🔨", color: "#ef4444", description: "Denuncias, querellas, recursos, acuerdos reparatorios", templateCount: 25, slug: "penal" },
    { code: "familiar", name: "Derecho Familiar", icon: "👨‍👩‍👧", color: "#ec4899", description: "Divorcio, custodia, pensión alimenticia, adopción", templateCount: 45, slug: "familiar" },
    { code: "laboral", name: "Derecho Laboral", icon: "💼", color: "#f59e0b", description: "Demandas laborales, finiquitos, convenios, actas", templateCount: 45, slug: "laboral" },
    { code: "mercantil", name: "Derecho Mercantil", icon: "🤝", color: "#8b5cf6", description: "Sociedades, pagarés, juicio ejecutivo, concurso", templateCount: 30, slug: "mercantil" },
    { code: "fiscal", name: "Derecho Fiscal", icon: "🧮", color: "#6366f1", description: "SAT, impuestos, nulidad fiscal, IMSS, TFJA", templateCount: 15, slug: "fiscal" },
    { code: "amparo", name: "Juicio de Amparo", icon: "🛡️", color: "#0ea5e9", description: "Amparo directo, indirecto, recursos, suspensión", templateCount: 12, slug: "amparo" },
    { code: "administrativo", name: "Derecho Administrativo", icon: "🏛️", color: "#64748b", description: "Recursos, CNDH, transparencia, licitaciones", templateCount: 15, slug: "administrativo" },
    { code: "transito", name: "Derecho de Tránsito", icon: "🚗", color: "#10b981", description: "Accidentes viales, multas, seguros, peritajes", templateCount: 10, slug: "transito" },
    { code: "agrario", name: "Derecho Agrario", icon: "🌾", color: "#84cc16", description: "Ejidos, tierras, parcelas, asambleas ejidales", templateCount: 10, slug: "agrario" },
    { code: "ambiental", name: "Derecho Ambiental", icon: "🌿", color: "#22c55e", description: "PROFEPA, impacto ambiental, licencias, denuncias", templateCount: 10, slug: "ambiental" },
    { code: "migratorio", name: "Derecho Migratorio", icon: "🛂", color: "#06b6d4", description: "Visas, residencia, refugio, naturalización", templateCount: 10, slug: "migratorio" },
    { code: "propiedad_intelectual", name: "Propiedad Intelectual", icon: "💡", color: "#eab308", description: "Marcas, patentes, derechos de autor, IMPI", templateCount: 12, slug: "propiedad-intelectual" },
    { code: "internacional", name: "Derecho Internacional", icon: "🌐", color: "#14b8a6", description: "Tratados, extradición, apostilla, exhortos", templateCount: 10, slug: "internacional" },
    // Especialidades nuevas V1
    { code: "constitucional", name: "Derecho Constitucional", icon: "📜", color: "#a855f7", description: "Amparo constitucional, derechos fundamentales, controversias", templateCount: 20, slug: "constitucional" },
    { code: "electoral", name: "Derecho Electoral", icon: "🗳️", color: "#f97316", description: "Impugnaciones electorales, TEPJF, INE, partidos políticos", templateCount: 20, slug: "electoral" },
    { code: "inmobiliario", name: "Derecho Inmobiliario", icon: "🏠", color: "#0891b2", description: "Compraventa, arrendamiento, hipotecas, registro público", templateCount: 20, slug: "inmobiliario" },
    { code: "intelectual", name: "Propiedad Intelectual (PI)", icon: "🔬", color: "#d97706", description: "Marcas, patentes, derechos de autor, IMPI", templateCount: 20, slug: "intelectual" },
    { code: "notarial", name: "Derecho Notarial", icon: "✍️", color: "#7c3aed", description: "Escrituras, poderes, testamentos, actas notariales", templateCount: 20, slug: "notarial" },
    { code: "concursal", name: "Derecho Concursal", icon: "🏛", color: "#dc2626", description: "Concurso mercantil, quiebra, síndico, acuerdos de reestructura", templateCount: 20, slug: "concursal" },
    { code: "migracion", name: "Derecho Migratorio (Migración)", icon: "✈️", color: "#0284c7", description: "Visas, residencia, refugio, naturalización, INM", templateCount: 20, slug: "migracion" },
    { code: "arbitraje", name: "Arbitraje Comercial", icon: "⚡", color: "#059669", description: "Convenios arbitrales, demandas, laudos, CAM, CIAC", templateCount: 20, slug: "arbitraje" },
];


export const TOTAL_TEMPLATES = SPECIALTIES.reduce((sum, s) => sum + s.templateCount, 0);
