export interface TerminoGlosario {
    id: string; // Slug para la URL, ej: "usufructo"
    termino: string; // Nombre formal
    definicion_corta: string; // Descripción SEO (< 160 chars)
    explicacion_larga: string; // HTML con explicación expansiva (+500 palabras)
    letras_clave: string; // Inicial para agrupar A-Z
    sinonimos?: string[];
    materia: "Civil" | "Penal" | "Laboral" | "Mercantil" | "Fiscal" | "Amparo" | "Familiar" | "Inmobiliario" | "General";
    enlaces_relacionados?: { texto: string; url: string }[];
}

export const glosarioMock: TerminoGlosario[] = [
    {
        id: "albacea",
        termino: "Albacea",
        definicion_corta: "Persona encargada de custodiar los bienes y cumplir la voluntad del testador u organizar la sucesión intestada.",
        explicacion_larga: `
            <p>El <strong>albacea</strong> es la figura jurídica central dentro del derecho sucesorio. Su función principal es asegurar que los bienes, derechos y obligaciones del difunto (de cujus) se liquiden y distribuyan conforme a las instrucciones dictadas en su testamento, o bien, según lo disponga la ley en caso de sucesiones legítimas.</p>
            <h4>Responsabilidades Principales</h4>
            <ul>
                <li>Formular el inventario y avalúo de la masa hereditaria.</li>
                <li>Administrar los bienes y rendir cuentas a los herederos.</li>
                <li>Pagar las deudas mortuorias, hereditarias y testamentarias.</li>
                <li>Garantizar una repartición justa entre los legatarios o herederos.</li>
            </ul>
        `,
        letras_clave: "A",
        materia: "Civil",
        sinonimos: ["Ejecutor testamentario", "Administrador de la sucesión"],
        enlaces_relacionados: [
            { texto: "Código Civil Federal (Sucesiones)", url: "/leyes/federal/codigo-civil-federal" }
        ]
    },
    {
        id: "amparo-directo",
        termino: "Amparo Directo",
        definicion_corta: "Juicio constitucional de una sola instancia promovido contra sentencias definitivas, laudos o resoluciones que pongan fin a un juicio.",
        explicacion_larga: `
            <p>El <strong>Amparo Directo</strong> es la última línea de defensa judicial que tiene todo ciudadano en México contra resoluciones emitidas por tribunales judiciales, administrativos, agrarios o del trabajo. Su propósito central no es revisar el pleito original, sino verificar si en dicha sentencia se violaron los Derechos Humanos o las garantías consagradas en la Constitución.</p>
            <p>Se presenta habitualmente ante los Tribunales Colegiados de Circuito y procede exclusivamente tras agotar todos los recursos ordinarios de la ley.</p>
        `,
        letras_clave: "A",
        materia: "Amparo",
        enlaces_relacionados: [
            { texto: "Ley de Amparo", url: "/leyes/federal/ley-amparo" }
        ]
    },
    {
        id: "litis",
        termino: "Litis",
        definicion_corta: "El conflicto de intereses calificado por la pretensión de uno de los interesados y la resistencia del otro.",
        explicacion_larga: `
            <p>La <strong>Litis</strong> representa la materia fundamental de todo juicio. Nace desde el momento en que una persona (actor) presenta su demanda exigiendo algo, y la contraparte (demandado) la contesta oponiendo defensas y excepciones. Hasta que la litis no se fija mediante la contestación, el juez no tiene demarcado sobre qué hechos exactos habrá de juzgar.</p>
        `,
        letras_clave: "L",
        materia: "General",
        sinonimos: ["Controversia", "Pleito judicial", "Conflicto legal"]
    },
    {
        id: "usufructo",
        termino: "Usufructo",
        definicion_corta: "Derecho real y temporal de disfrutar de los bienes ajenos sin alterar su forma ni substancia.",
        explicacion_larga: `
            <p>El <strong>Usufructo</strong> desmiembra la propiedad en dos: el nudo propietario (dueño del bien legalmente) y el usufructuario (quien tiene el derecho de usarlo y quedarse con sus frutos, rentas o cosechas). Es extremadamente común en la planificación patrimonial de padres hacia hijos.</p>
        `,
        letras_clave: "U",
        materia: "Civil",
        sinonimos: ["Gasto de disfrute"],
        enlaces_relacionados: [
            { texto: "Código Civil", url: "/leyes/federal/codigo-civil-federal" }
        ]
    },
    {
        id: "vicios-ocultos",
        termino: "Vicios Ocultos",
        definicion_corta: "Defectos invisibles en cosas que se compran y que, de haberse sabido, se habría pagado menos o no se habría comprado.",
        explicacion_larga: `
            <p>Los <strong>Vicios Ocultos</strong> son fundamentales en los contratos de compraventa. La ley protege al comprador otorgándole acciones (redhibitoria o quanti minoris) para exigir la devolución del dinero o una rebaja, cuando un vehículo usado, una casa recién comprada o un bien mueble presenta defectos graves que no estaban a la vista al momento del trato.</p>
        `,
        letras_clave: "V",
        materia: "Mercantil",
        sinonimos: ["Defectos latentes"]
    },
    {
        id: "acoso-laboral",
        termino: "Acoso Laboral (Mobbing)",
        definicion_corta: "Conductas abusivas de violencia psicológica ejercidas de forma sistemática en el entorno de trabajo, con el objetivo de intimidar, degradar o forzar la renuncia.",
        explicacion_larga: `
            <p>El <strong>acoso laboral (mobbing)</strong> es una de las principales causas de rescisión de la relación de trabajo sin responsabilidad para el empleado (lo que obliga al patrón a pagar una liquidación completa). Ocurre cuando jefes o compañeros marginan, insultan o sobrecargan de tareas a un trabajador de forma deliberada.</p>
            <p>Para probarse, suele requerir documentos como correos electrónicos, testimonios o grabaciones legales. Es una violación directa a las normas de trabajo digno previstas en la LFT y la NOM-035.</p>
        `,
        letras_clave: "A",
        materia: "Laboral",
        sinonimos: ["Mobbing", "Hostigamiento Laboral"],
        enlaces_relacionados: [
            { texto: "Ley Federal del Trabajo", url: "/leyes/federal/ley-federal-del-trabajo" },
            { texto: "Calculadora de Finiquito y Liquidación", url: "/calculadora/finiquito-liquidacion" }
        ]
    },
    {
        id: "arraigo",
        termino: "Arraigo",
        definicion_corta: "Medida cautelar excepcional que priva de la libertad a una persona sospechosa de delincuencia organizada durante el periodo de investigación.",
        explicacion_larga: `
            <p>El <strong>Arraigo Penales</strong> es una figura jurídica muy controvertida en México. Consiste en detener a un sospechoso por hasta 40 días (prorrogables) sin haberle imputado formalmente un delito, bajo la premisa de que se está "investigando" su nexo con el crimen organizado y existe riesgo de fuga.</p>
            <p>La Corte Interamericana de Derechos Humanos (CIDH) ha ordenado a México eliminar esta figura por considerarla violatoria de la presunción de inocencia, obligando a los jueces a aplicar "control de convencionalidad" para evitar su uso ciego.</p>
        `,
        letras_clave: "A",
        materia: "Penal",
        sinonimos: ["Detención provisional"],
        enlaces_relacionados: [
            { texto: "Amparo contra arraigos", url: "/abogados" }
        ]
    },
    {
        id: "caducidad",
        termino: "Caducidad (Procesal)",
        definicion_corta: "Extinción de una instancia judicial por falta de actividad de las partes durante el tiempo marcado por la ley.",
        explicacion_larga: `
            <p>La <strong>Caducidad</strong> ocurre si "dejas abandonado" tu juicio. Si presentaste una demanda civil o mercantil y, por negligencia o inacción de tu abogado, dejas de promover e impulsar el procedimiento durante un plazo largo (como 120 días hábiles en materia mercantil), el juez declarará perdida la instancia.</p>
            <p>Es el peor error estratégico que se puede cometer, ya que todos los embargos logrados se levantan y el expediente se va al archivo muerto.</p>
        `,
        letras_clave: "C",
        materia: "Civil",
        sinonimos: ["Caducidad de la instancia", "Extinción por inactividad"]
    },
    {
        id: "desheredacion",
        termino: "Desheredación",
        definicion_corta: "Acto por el cual un testador excluye explícitamente a un heredero forzoso de su herencia por causas graves fijadas en la ley.",
        explicacion_larga: `
            <p>La <strong>Desheredación</strong> (o declaración de incapacidad para heredar) aplica generalmente contra hijos o cónyuges que cometieron actos indignos contra el testador, tales como abandono, violencia física y psicológica, o la comisión de un delito grave contra su persona y sus bienes.</p>
            <p>Para que la desheredación sea válida, las causas deben estar plenamente probadas legalmente, de lo contrario, el heredero despedido puede impugnar el testamento vía un juicio sucesorio.</p>
        `,
        letras_clave: "D",
        materia: "Civil",
        sinonimos: ["Privación de herencia", "Incapacidad para heredar"]
    },
    {
        id: "embargo",
        termino: "Embargo Precautorio",
        definicion_corta: "Retención o inmovilización de bienes de un deudor por orden de un juez para asegurar el pago de un juicio futuro.",
        explicacion_larga: `
            <p>El <strong>Embargo</strong> es la cristalización del refrán "el que debe, paga". Es un acto de ejecución judicial donde un actuario acude al domicilio del deudor para señalar y asegurar bienes (casas, autos, cuentas bancarias, acciones o sueldo) cuyo valor alcance para garantizar lo que se reclama en la demanda principal.</p>
            <p>Para levantar o descongelar bienes de un embargo injusto, se utilizan las "tercerías excluyentes de dominio" o bien el amparo indirecto.</p>
        `,
        letras_clave: "E",
        materia: "Mercantil",
        sinonimos: ["Secuestro judicial", "Aseguramiento de bienes"],
        enlaces_relacionados: [
            { texto: "Generador de Pagarés Protegidos", url: "/generador/mercantil/pagare-v2" }
        ]
    },
    {
        id: "jurisprudencia",
        termino: "Jurisprudencia (Tesis Jurisprudencial)",
        definicion_corta: "Interpretación vinculante y obligatoria que hace la Suprema Corte o los Tribunales Colegiados sobre cómo debe leerse una ley defectuosa.",
        explicacion_larga: `
            <p>La <strong>Jurisprudencia</strong> es mucho más poderosa que la ley escrita. Cuando una ley tiene fallas, lagunas o contradice la Constitución, los altos tribunales emiten resoluciones repetitivas definiendo el conflicto. Cuando acumulan 5 fallos en el mismo sentido (o resuelven una contradicción de tesis), la interpretación se vuelve forzosa "Jurisprudencia".</p>
            <p>Un abogado moderno no gana amparos citando "leyes", gana los amparos citando las "jurisprudencias" recientes aplicables al caso.</p>
        `,
        letras_clave: "J",
        materia: "Amparo",
        sinonimos: ["Precedente judicial", "Interpretación de la norma"],
        enlaces_relacionados: [
            { texto: "Buscador de Jurisprudencia", url: "/leyes" }
        ]
    },
    {
        id: "soborno",
        termino: "Cohecho",
        definicion_corta: "Delito cometido por un servidor público que exige, recibe o acepta dinero o dádivas a cambio de hacer u omitir algo en sus funciones.",
        explicacion_larga: `
            <p>El coloquialmente llamado "soborno" se tipifica legalmente bajo el nombre de <strong>Cohecho</strong>. Es un delito de doble vía que castiga tanto al policía o juez que <em>pide</em> "la mordida", como al ciudadano o empresario que <em>ofrece</em> el dinero.</p>
            <p>Las penalidades incrementan severamente bajo el Sistema Nacional Anticorrupción dependiendo del monto transferido y el daño causado al patrimonio estatal.</p>
        `,
        letras_clave: "S",
        materia: "Penal",
        sinonimos: ["Corrupción", "Mordida", "Soborno"]
    },
    {
        id: "tutela",
        termino: "Tutela",
        definicion_corta: "Figura jurídica diseñada para cuidar temporalmente a menores o discapacitados que han perdido a sus padres, asumiendo su representación legal y cuido patrimonial.",
        explicacion_larga: `
            <p>A falta de la patria potestad (muerte de los padres, abandono o condena judicial), la <strong>Tutela</strong> entra al rescate para garantizar que un menor o una persona declarada en estado de interdicción no queden en indefensión jurídica y moral.</p>
            <p>Existen distintos tipos de tutela (legítima, testamentaria y dativa). El tutor nombrado debe rendir fianzas y presentar cuentas anuales de todos los gastos que haga empleando el dinero del pupilo, supervisado siempre por un Juez de lo Familiar.</p>
        `,
        letras_clave: "T",
        materia: "Familiar",
        sinonimos: ["Guarda y custodia (extendida)"],
        enlaces_relacionados: [
            { texto: "Abogados Familiares Expertos", url: "/abogados" }
        ]
    },
    {
        id: "sobreseimiento",
        termino: "Sobreseimiento (Amparo)",
        definicion_corta: "Resolución por la que un juez termina anticipadamente un juicio sin analizar si el demandante tiene razón o no, por fallas procesales irreversibles.",
        explicacion_larga: `
            <p>El <strong>Sobreseimiento</strong> es el fantasma que aterroriza a todos los abogados litigantes del país en materia de Amparo. Ocurre cuando se te pasa un plazo fatal de 15 días, cuando ocurre un cambio en la constitución, o cuando muere el agraviado antes de dictarse sentencia.</p>
            <p>En pocas palabras, es equivalente a un "cierre de caso técnico". El Juez dice: "me es imposible analizar si abusaron de ti, porque incumples con los requisitos formales mínimos para seguir el pleito".</p>
        `,
        letras_clave: "S",
        materia: "Amparo",
        sinonimos: ["Terminación anticipada sin fondo", "Desechamiento extemporáneo"]
    },
    {
        id: "usucapion",
        termino: "Usucapión (Prescripción Positiva)",
        definicion_corta: "Modo de volverse dueño legal de una propiedad tras haberla poseído de manera pública, pacífica y continua por un tiempo marcado por la ley.",
        explicacion_larga: `
            <p>La <strong>Usucapión</strong> es la pesadilla de quienes dejan terrenos abandonados, y la salvación de quienes compraron a plazos pero nunca les dieron escrituras formales. Mediante un Juicio de Usucapión o Prescripción Adquisitiva, una persona que ha usado una casa o terreno de "buena fe" (por 5 años continuos) o de "mala fe" (por 10 años continuos), se apropia legalmente de la escritura frente al Registro Público.</p>
            <p>Requisitos de oro: Comportarse frente a los vecinos como dueño (pagar luz, predial), y hacerlo sin esconderse (de forma pública y pacífica).</p>
        `,
        letras_clave: "U",
        materia: "Inmobiliario",
        sinonimos: ["Prescripción adquisitiva"],
        enlaces_relacionados: [
            { texto: "Abogados Especialistas en Bienes Raíces", url: "/abogados" }
        ]
    }
];
