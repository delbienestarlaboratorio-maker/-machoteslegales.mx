export interface ArticuloLey {
    id: string; // slug del articulo ej: "articulo-1"
    ley_id: string; // id de la ley a la que pertenece
    fuero: "federal" | "estatal";
    estado_id?: string;
    numero: number | string; // 1, "123-A"
    contenido: string;
    explicacion_seo: string; // Texto de +500 palabras exclusivo para este artículo
    correlaciones?: { id_articulo: string; ley_id: string; nombre: string; url: string }[];
}

export const articulosMock: ArticuloLey[] = [
    // --- Artículos del Código Civil Federal ---
    {
        id: "articulo-1",
        ley_id: "codigo-civil-federal",
        fuero: "federal",
        numero: 1,
        contenido: "Las disposiciones de este Código regirán en toda la República en asuntos del orden federal.",
        explicacion_seo: "<p>Aquí redactaremos un texto gigante de 500 palabras explicando cómo el Artículo 1 establece la jurisdicción del Código Civil Federal frente a los códigos locales, y dando ejemplos prácticos para estudiantes de derecho y ciudadanos.</p>",
        correlaciones: [
            { id_articulo: "articulo-2", ley_id: "codigo-civil-federal", nombre: "Artículo 2 del CCF", url: "/leyes/federal/codigo-civil-federal/articulo-2" },
            { id_articulo: "constitucion-articulo-121", ley_id: "constitucion-politica-estados-unidos-mexicanos", nombre: "Art. 121 Constitucional", url: "/leyes/federal/constitucion-politica-estados-unidos-mexicanos/articulo-121" }
        ]
    },
    {
        id: "articulo-2",
        ley_id: "codigo-civil-federal",
        fuero: "federal",
        numero: 2,
        contenido: "La capacidad jurídica es igual para el hombre y la mujer; en consecuencia, la mujer no queda sometida, por razón de su sexo, a restricción alguna en la adquisición y ejercicio de sus derechos civiles.",
        explicacion_seo: "<p>Este artículo es fundamental para la equidad de género en México. Rompe históricas ataduras legales que en el pasado requerían la concesión marital para que una mujer pudiese disponer de bienes. Un texto de +500 palabras detallará esta evolución jurisprudencial.</p>"
    },
    {
        id: "articulo-3",
        ley_id: "codigo-civil-federal",
        fuero: "federal",
        numero: 3,
        contenido: "Las leyes, reglamentos, circulares o cualesquiera otras disposiciones de observancia general, obligan y surten sus efectos tres días después de su publicación en el Periódico Oficial.",
        explicacion_seo: "<p>Regla máxima sobre la retroactividad y la entrada en vigor de la norma jurídica, el sistema sincrónico y sucesivo. Análisis SEO que atraerá a miles de despachos buscando resolver dudas procesales.</p>"
    },
    {
        id: "articulo-1916",
        ley_id: "codigo-civil-federal",
        fuero: "federal",
        numero: 1916,
        contenido: "Por daño moral se entiende la afectación que una persona sufre en sus sentimientos, afectos, creencias, decoro, honor, reputación, vida privada, configuración y aspectos físicos, o bien en la consideración que de sí misma tienen los demás.",
        explicacion_seo: "<p>Uno de los artículos más buscados en todo México. Aquí insertaremos una redacción que aborde cuándo, cómo y cuánto demandar por difamaciones o casos de negligencia grave, hiper-asociado a nuestras calculadoras y plantillas.</p>",
        correlaciones: [
            { id_articulo: "articulo-1", ley_id: "ley-hacienda", nombre: "Artículo 1", url: "/leyes/nuevo-leon/ley-hacienda/articulo-1" }
        ]
    },

    // --- Artículos Estatales (Ej. Nuevo León) ---
    {
        id: "articulo-1",
        ley_id: "codigo-civil",
        fuero: "estatal",
        estado_id: "nuevo-leon",
        numero: 1,
        contenido: "Las disposiciones de este Código regirán en el Estado de Nuevo León en asuntos del orden común.",
        explicacion_seo: "<p>Este artículo define la soberanía del Estado de Nuevo León en materia civil, aplicando el Código a todos los habitantes del Estado y a los bienes ubicados en su territorio, delimitando su esfera competencial frente al Código Civil Federal.</p>"
    },
    {
        id: "articulo-2",
        ley_id: "codigo-civil",
        fuero: "estatal",
        estado_id: "nuevo-leon",
        numero: 2,
        contenido: "Los habitantes del Estado tienen obligación de ejercer sus actividades, y de usar y gozar de sus bienes en forma que no perjudique a la colectividad.",
        explicacion_seo: "<p>Un principio fundamental del derecho civil moderno que establece el concepto de la función social de la propiedad y el límite al ejercicio abusivo de los derechos subjetivos dentro del Estado.</p>"
    }
];
