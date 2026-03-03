export interface AbogadoPerfil {
    id: string; // Ej: "despacho-garcia-asociados"
    nombre: string;
    firma: string;
    especialidades: ("Familiar" | "Civil" | "Laboral" | "Penal" | "Mercantil" | "Inmobiliario" | "Corporativo")[];
    estado_id: string; // Ej: "ciudad-de-mexico"
    ciudad: string;
    cedula: string;
    anos_experiencia: number;
    bio_corta: string; // Para tarjetas
    bio_larga: string; // HTML para perfil
    foto_url: string;
    rating: number; // Ej: 4.8
    resenas_count: number;
    precio_asesoria: number; // MXN
    verificado: boolean;
}

export const abogadosMock: AbogadoPerfil[] = [
    {
        id: "hernandez-litigio-estrategico",
        nombre: "Lic. Roberto Hernández",
        firma: "Hernández Litigio Estratégico",
        especialidades: ["Familiar", "Civil"],
        estado_id: "ciudad-de-mexico",
        ciudad: "CDMX",
        cedula: "12345678",
        anos_experiencia: 15,
        bio_corta: "Especialista en divorcios incausados, pensiones alimenticias y juicios sucesorios con alto porcentaje de éxito en tribunales de la CDMX.",
        bio_larga: "<p>Con más de 15 años de experiencia litigando exclusivamente ante los Juzgados de lo Familiar del Tribunal Superior de Justicia de la CDMX, el Lic. Roberto Hernández se distingue por un enfoque empático pero contundente. Ha resuelto más de 500 juicios de divorcio y custodia, priorizando siempre la mediación antes de llegar a un desgaste procesal prolongado.</p>",
        foto_url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 4.9,
        resenas_count: 142,
        precio_asesoria: 800,
        verificado: true
    },
    {
        id: "diaz-corp-abogados",
        nombre: "Lic. Ana Paula Díaz",
        firma: "Díaz & Asociados",
        especialidades: ["Laboral", "Corporativo"],
        estado_id: "nuevo-leon",
        ciudad: "Monterrey",
        cedula: "87654321",
        anos_experiencia: 12,
        bio_corta: "Defensa férrea de trabajadores frente a despidos injustificados y asesoría preventiva para empresas del sector industrial regiomontano.",
        bio_larga: "<p>Socia fundadora de Díaz & Asociados. Ex-funcionaria de la Junta Local de Conciliación y Arbitraje, lo que le otorga una visión desde adentro del sistema laboral. Experta en negociaciones liquidatarias de alto perfil y auditorías patronales preventivas.</p>",
        foto_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 4.7,
        resenas_count: 85,
        precio_asesoria: 1200,
        verificado: true
    },
    {
        id: "penalistas-velazquez",
        nombre: "Lic. Carlos Velázquez",
        firma: "Bufete Penal Velázquez",
        especialidades: ["Penal"],
        estado_id: "jalisco",
        ciudad: "Guadalajara",
        cedula: "99887766",
        anos_experiencia: 20,
        bio_corta: "Experiencia comprobada en el Sistema de Justicia Penal Acusatorio. Defensas urgentes ante Ministerio Público y audiencias de control.",
        bio_larga: "<p>Experto en litigio penal oral. Ha participado en sonados casos mediáticos en Jalisco, garantizando el respeto al debido proceso. Disponible 24/7 para emergencias legales y detenciones arbitrarias.</p>",
        foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 5.0,
        resenas_count: 310,
        precio_asesoria: 2000,
        verificado: true
    },
    {
        id: "martinez-inmobiliario",
        nombre: "Lic. Sofía Martínez",
        firma: "Consultoría Inmobiliaria Martínez",
        especialidades: ["Inmobiliario", "Civil"],
        estado_id: "estado-de-mexico",
        ciudad: "Toluca",
        cedula: "11223344",
        anos_experiencia: 8,
        bio_corta: "Especialista en regularización de predios, usucapión (prescripción adquisitiva), y redacción de contratos de arrendamiento blindados.",
        bio_larga: "<p>Abogada transaccional enfocada en la protección del patrimonio inmobiliario. Si vas a comprar o rentar una propiedad en el Edomex, la Lic. Martínez audita preventivamente los folios reales para evitar fraudes.</p>",
        foto_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
        rating: 4.6,
        resenas_count: 54,
        precio_asesoria: 600,
        verificado: false
    }
];
