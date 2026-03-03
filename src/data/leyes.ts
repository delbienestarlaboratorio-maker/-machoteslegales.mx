export interface LeyDocumento {
    id: string;
    nombre: string;
    ultima_reforma: string;
    articulos_totales: number;
    descripcion_seo: string;
    analisis_profundo_seo?: string; // Texto largo de +500 palabras
    correlaciones?: { id_ley: string; nombre: string; url: string }[]; // Enlaces a otras leyes relacionadas
}

export const estadoLeyesMock: LeyDocumento[] = [
    {
        id: "codigo-civil",
        nombre: "Código Civil del Estado",
        ultima_reforma: "15 de Febrero de 2024",
        articulos_totales: 3012,
        descripcion_seo: "Legislación fundamental que rige las personas, la familia, los bienes, las obligaciones y los contratos en este Estado.",
        correlaciones: [
            { id_ley: "codigo-de-procedimientos-civiles", nombre: "Código de Procedimientos Civiles del Estado", url: "codigo-de-procedimientos-civiles" },
            { id_ley: "codigo-civil-federal", nombre: "Código Civil Federal", url: "/leyes/federal/codigo-civil-federal" }
        ],
        analisis_profundo_seo: "<p>Un texto de 500 palabras irá aquí generado por IA...</p>"
    },
    {
        id: "codigo-penal",
        nombre: "Código Penal del Estado",
        ultima_reforma: "10 de Enero de 2024",
        articulos_totales: 410,
        descripcion_seo: "Catálogo de delitos y penas aplicables a nivel del fuero común para esta entidad federativa."
    },
    {
        id: "constitucion-politica",
        nombre: "Constitución Política Local",
        ultima_reforma: "5 de Noviembre de 2023",
        articulos_totales: 154,
        descripcion_seo: "Carta magna que establece las bases de la organización política y derechos de los ciudadanos en el Estado."
    },
    {
        id: "ley-hacienda",
        nombre: "Ley de Hacienda del Estado",
        ultima_reforma: "30 de Diciembre de 2023",
        articulos_totales: 280,
        descripcion_seo: "Regula los ingresos, impuestos estatales, derechos y contribuciones especiales cobradas por la Tesorería Local."
    },
    {
        id: "ley-transito",
        nombre: "Ley de Tránsito y Transporte",
        ultima_reforma: "20 de Agosto de 2023",
        articulos_totales: 195,
        descripcion_seo: "Normatividad que rige la movilidad, emplacamiento, transporte público y multas viales en los municipios del Estado."
    },
    {
        id: "ley-agua",
        nombre: "Ley de Aguas del Estado",
        ultima_reforma: "12 de Julio de 2023",
        articulos_totales: 142,
        descripcion_seo: "Regula el uso, explotación y saneamiento del agua potable a nivel urbano y rural en esta entidad."
    },
    {
        id: "ley-notariado",
        nombre: "Ley del Notariado del Estado",
        ultima_reforma: "8 de Febrero de 2024",
        articulos_totales: 210,
        descripcion_seo: "Regula la función notarial, requisitos para obtener la patente y las responsabilidades de los fedatarios públicos locales."
    },
    {
        id: "ley-proteccion-civil",
        nombre: "Ley de Protección Civil Local",
        ultima_reforma: "2 de Septiembre de 2023",
        articulos_totales: 130,
        descripcion_seo: "Establece los protocolos de prevención, mitigación y auxilio de la población ante desastres naturales y emergencias."
    },
    {
        id: "ley-desarrollo-urbano",
        nombre: "Ley de Asentamientos Humanos y Desarrollo Urbano",
        ultima_reforma: "18 de Enero de 2024",
        articulos_totales: 345,
        descripcion_seo: "Normatividad para licencias de construcción, zonificación, uso de suelo y planeación metropolitana."
    },
    {
        id: "ley-equilibrio-ecologico",
        nombre: "Ley de Equilibrio Ecológico y Protección al Ambiente",
        ultima_reforma: "5 de Junio de 2023",
        articulos_totales: 260,
        descripcion_seo: "Regulaciones ambientales estatales sobre emisiones, manejo de residuos y áreas naturales protegidas."
    },
    {
        id: "ley-salud",
        nombre: "Ley Estatal de Salud",
        ultima_reforma: "14 de Marzo de 2024",
        articulos_totales: 412,
        descripcion_seo: "Disposiciones locales sobre salubridad gubernamental, control sanitario de giros y prevención de adicciones."
    },
    {
        id: "ley-educacion",
        nombre: "Ley de Educación del Estado",
        ultima_reforma: "30 de Agosto de 2023",
        articulos_totales: 198,
        descripcion_seo: "Bases del sistema educativo estatal, validez oficial de estudios (RVOE) y derechos del personal docente."
    },
    {
        id: "ley-transparencia",
        nombre: "Ley de Transparencia y Acceso a la Información Pública",
        ultima_reforma: "11 de Noviembre de 2023",
        articulos_totales: 175,
        descripcion_seo: "Obligación de los sujetos obligados estatales a transparentar su gestión y responder solicitudes ciudadanas."
    },
    {
        id: "ley-responsabilidades",
        nombre: "Ley de Responsabilidades de los Servidores Públicos",
        ultima_reforma: "22 de Febrero de 2024",
        articulos_totales: 120,
        descripcion_seo: "Sanciona actos de corrupción, establece el procedimiento de juicio político y la declaración patrimonial."
    },
    {
        id: "ley-adquisiciones",
        nombre: "Ley de Adquisiciones, Arrendamientos y Servicios del Gobierno",
        ultima_reforma: "7 de Enero de 2024",
        articulos_totales: 156,
        descripcion_seo: "Bases y procedimientos de licitación pública, compras gubernamentales y padrón de proveedores locales."
    }
];

export const federalLeyesMock: LeyDocumento[] = [
    {
        id: "constitucion-politica-estados-unidos-mexicanos",
        nombre: "Constitución Política de los Estados Unidos Mexicanos",
        ultima_reforma: "22 de Marzo de 2024",
        articulos_totales: 136,
        descripcion_seo: "Ley Suprema de la nación. Establece los Derechos Humanos, garantías individuales y la estructura del Estado Mexicano."
    },
    {
        id: "codigo-civil-federal",
        nombre: "Código Civil Federal",
        ultima_reforma: "11 de Enero de 2021",
        articulos_totales: 2947,
        descripcion_seo: "Legislación supletoria de aplicación en toda la República en materia civil, contratos, obligaciones y bienes de carácter federal."
    },
    {
        id: "codigo-penal-federal",
        nombre: "Código Penal Federal",
        ultima_reforma: "24 de Enero de 2024",
        articulos_totales: 432,
        descripcion_seo: "Delitos del orden federal como narcotráfico, portación de armas, ataques a vías de comunicación y defraudación fiscal."
    },
    {
        id: "ley-federal-del-trabajo",
        nombre: "Ley Federal del Trabajo (LFT)",
        ultima_reforma: "24 de Enero de 2024",
        articulos_totales: 1010,
        descripcion_seo: "Norma máxima que regula las relaciones laborales entre patrones y trabajadores, salarios, sindicatos y huelgas."
    },
    {
        id: "ley-general-sociedades-mercantiles",
        nombre: "Ley General de Sociedades Mercantiles",
        ultima_reforma: "20 de Octubre de 2023",
        articulos_totales: 273,
        descripcion_seo: "Regula la constitución, estructura y disolución de empresas formales (S.A. de C.V., S. de R.L., S.A.S.) en México."
    },
    {
        id: "codigo-comercio",
        nombre: "Código de Comercio",
        ultima_reforma: "26 de Enero de 2024",
        articulos_totales: 1500,
        descripcion_seo: "Codificación antiquísima y fundamental para resolver los conflictos entre comerciantes y ejecutar cobro de pagarés.",
        correlaciones: [
            { id_ley: "ley-general-sociedades-mercantiles", nombre: "Ley General de Sociedades Mercantiles", url: "/leyes/federal/ley-general-sociedades-mercantiles" },
            { id_ley: "codigo-civil-federal", nombre: "Código Civil Federal", url: "/leyes/federal/codigo-civil-federal" }
        ]
    },
    {
        id: "ley-amparo",
        nombre: "Ley de Amparo",
        ultima_reforma: "7 de Junio de 2021",
        articulos_totales: 271,
        descripcion_seo: "Reglamenta los artículos 103 y 107 Constitucionales. Es el escudo judicial por excelencia contra abusos de autoridad."
    }
];
