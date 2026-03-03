export interface JurisprudenciaLey {
    id: string; // Ej: "amparo-directo-en-revision-123-2023"
    ley_id: string; // Ej: "codigo-civil-federal"
    fuero: "federal" | "estatal";
    estado_id?: string;
    epoca: string;
    registro: string;
    instancia: string;
    tipo: "Jurisprudencia" | "Tesis Aislada";
    rubro: string; // Título o tema central
    resumen_seo: string; // Explicación fácil para el usuario
    texto_juicio_html: string; // El texto completo de los considerandos y fallos
    articulos_relacionados: string[]; // IDs de artículos, ej: ["articulo-1916"]
}

export const jurisprudenciasMock: JurisprudenciaLey[] = [
    {
        id: "amparo-directo-en-revision-517-2011",
        ley_id: "codigo-civil-federal",
        fuero: "federal",
        epoca: "Décima Época",
        registro: "2006159",
        instancia: "Primera Sala de la SCJN",
        tipo: "Jurisprudencia",
        rubro: "DAÑO MORAL POR VIOLACIÓN A LOS DERECHOS AL HONOR E INTIMIDAD. ALCANCES DEL ARTÍCULO 1916 DEL CÓDIGO CIVIL FEDERAL.",
        resumen_seo: "Esta jurisprudencia histórica de la Primera Sala de la Suprema Corte (SCJN) establece definitivamente cómo debe cuantificarse la indemnización por daño moral cuando se difama a una persona pública o privada. Rompió el techo de indemnizaciones mínimas estableciendo topes millonarios.",
        texto_juicio_html: `
            <h4>Considerandos de la Suprema Corte:</h4>
            <p>La protección al derecho a la propia imagen, el honor y la intimidad no se limita a una simple disculpa pública. Cuando el menoscabo provocado por publicaciones ilícitas afecta la esfera personalísima del individuo, configurando el supuesto del <strong>Artículo 1916 del Código Civil Federal</strong>, la indemnización no debe tasarse como una simple sanción simbólica.</p>
            <p>Por lo tanto, los jueces de instancia deben analizar la capacidad económica del responsable, la gravedad de la difusión de la ofensa, y el sufrimiento moral de la víctima para dictar sentencias proporcionales, sin los topes arruinadores contenidos en legislaciones de imprenta derogadas.</p>
            <h4>Resolutivos:</h4>
            <p><strong>PRIMERO.</strong> En la materia de la revisión, se revoca la sentencia recurrida.</p>
            <p><strong>SEGUNDO.</strong> La Justicia de la Unión ampara y protege al quejoso en relación a la cuantificación del Daño Moral por vulneración al Honor.</p>
        `,
        articulos_relacionados: ["articulo-1916"]
    },
    {
        id: "amparo-directo-33-2022",
        ley_id: "codigo-civil-federal",
        fuero: "federal",
        epoca: "Undécima Época",
        registro: "2025114",
        instancia: "Tribunales Colegiados de Circuito",
        tipo: "Tesis Aislada",
        rubro: "INDEMNIZACIÓN POR ERROR MÉDICO (MALA PRAXIS). OBLIGACIONES CIVILES DERIVADAS DE NEGLIGENCIA.",
        resumen_seo: "Tesis que analiza bajo qué criterios debe imputarse el pago de un daño moral cuando un médico de una institución privada en México comete negligencia operatoria amparado en el Código Civil Federal.",
        texto_juicio_html: `
            <h4>Considerandos Jurídicos:</h4>
            <p>En casos de responsabilidad civil médica (mala praxis), la carga de la prueba respecto a la diligencia debida recae fundamentalmente en el especialista aportador del servicio, dada su superioridad técnica frente al paciente.</p>
            <p>El tribunal determina que la aplicación análoga del <strong>artículo 1916</strong> es procedente para reclamar no solo el daño físico o patrimonial, sino el impacto psicológico y moral derivado de una cicatriz o secuela evitable en una cirugía plástica de embellecimiento.</p>
        `,
        articulos_relacionados: ["articulo-1916", "articulo-1"]
    },
    // --- Jurisprudencias Estatales (Ej. Nuevo León) ---
    {
        id: "amparo-directo-12-2023",
        ley_id: "codigo-civil",
        fuero: "estatal",
        estado_id: "nuevo-leon",
        epoca: "Undécima Época",
        registro: "2026888",
        instancia: "Tribunales Colegiados de Circuito",
        tipo: "Tesis Aislada",
        rubro: "ALIMENTOS. LA OBLIGACIÓN EN EL ESTADO DE NUEVO LEÓN NO SE EXTINGUE AUTOMÁTICAMENTE CON LA MAYORÍA DE EDAD.",
        resumen_seo: "Tesis que aclara que en Nuevo León, alcanzar los 18 años no extingue per se el derecho a recibir pensión alimenticia si el acreedor sigue estudiando una profesión con calificaciones aprobatorias.",
        texto_juicio_html: `
            <h4>Considerandos Jurídicos:</h4>
            <p>De la interpretación sistemática de los artículos del Código Civil para el Estado de Nuevo León, se advierte que la obligación de proporcionar alimentos a los hijos no culmina inexorablemente al adquirir estos la mayoría de edad.</p>
            <p>Si se demuestra que el hijo mayor de edad se encuentra estudiando una carrera profesional acorde a su edad, con un aprovechamiento escolar adecuado y que no cuenta con medios propios para subsistir, subsiste el deber alimentario de los progenitores.</p>
        `,
        articulos_relacionados: ["articulo-2"]
    }
];
