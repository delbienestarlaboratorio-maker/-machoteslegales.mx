export interface DictionaryTerm {
    id: string; // url slug
    letra: string; // for alphabetical grouping
    termino: string; // display title
    definicion_corta: string; // meta description & intro
    explicacion_detallada: string; // main body
    fundamento_legal: string[]; // array of laws
    ejemplo_uso: string; // practical example
    plantillas_relacionadas: string[]; // slugs of related templates for cross-selling
    analisis_profundo_seo?: string; // SEO article content for >500 words
}

export const diccionariJuridico: DictionaryTerm[] = [
    {
        id: "accion-reivindicatoria",
        letra: "A",
        termino: "Acción Reivindicatoria",
        definicion_corta: "Medio jurídico por el cual el propietario de un bien que no lo tiene en su posesión exige la restitución del mismo a quien lo posee sin derecho.",
        explicacion_detallada: "La acción reivindicatoria compete a quien no está en posesión de la cosa, de la cual tiene la propiedad, y su efecto será declarar que el actor tiene dominio sobre ella y se la entregue el demandado con sus frutos y accesiones en los términos prescritos por el Código Civil. Para que proceda, se requiere acreditar la propiedad del bien, la posesión del demandado y la identidad de la cosa.",
        fundamento_legal: ["Art. 4 del Código de Procedimientos Civiles", "Código Civil Federal"],
        ejemplo_uso: "Un paracaidista invade un terreno de tu propiedad mientras estabas de viaje. Promueves una acción reivindicatoria para que un juez ordene su desalojo y te devuelvan el predio.",
        plantillas_relacionadas: ["demanda-civil-reivindicatoria", "contestacion-demanda-civil"]
    },
    {
        id: "albacea",
        letra: "A",
        termino: "Albacea",
        definicion_corta: "Persona designada en un testamento o por un juez para administrar y liquidar el patrimonio de una persona fallecida hasta su entrega a los herederos.",
        explicacion_detallada: "El albacea es el representante legal de la sucesión. Sus obligaciones incluyen la presentación del testamento, el aseguramiento de los bienes de la herencia, la formación de inventarios, la administración de los bienes y la partición y adjudicación de los bienes entre los herederos y legatarios.",
        fundamento_legal: ["Art. 1679 al 1749 del Código Civil Federal"],
        ejemplo_uso: "En su testamento, el Sr. López nombró a su hermano Pedro como albacea, quien se encargará de pagar las deudas pendientes y repartir las casas entre los hijos.",
        plantillas_relacionadas: ["testamento-publico-abierto", "nombramiento-albacea"]
    },
    {
        id: "amparo",
        letra: "A",
        termino: "Amparo (Juicio de)",
        definicion_corta: "Medio de defensa constitucional que protege a las personas frente a normas generales, actos u omisiones de autoridades que violen sus derechos humanos.",
        explicacion_detallada: "Es la figura principal del sistema jurídico mexicano para la defensa de los derechos fundamentales. Puede ser Directo (contra sentencias definitivas) o Indirecto (contra leyes, actos de imposible reparación o de autoridades distintas a tribunales judiciales). Se tramita ante los Juzgados de Distrito o Tribunales Colegiados de Circuito.",
        fundamento_legal: ["Art. 103 y 107 de la Constitución Política de los Estados Unidos Mexicanos", "Ley de Amparo"],
        ejemplo_uso: "Un juez ordena el embargo de una de tus cuentas bancarias sin haberte notificado previamente de un juicio. Tramitas un Amparo Indirecto por violación a la garantía de audiencia.",
        plantillas_relacionadas: ["amparo-indirecto-civil", "amparo-directo-penal", "incidente-suspension-amparo"]
    },
    {
        id: "arrendamiento",
        letra: "A",
        termino: "Arrendamiento",
        definicion_corta: "Contrato mediante el cual una persona (arrendador) cede a otra (arrendatario) el uso y goce temporal de un bien, a cambio del pago de una renta.",
        explicacion_detallada: "En México, el arrendamiento de inmuebles es uno de los contratos más comunes. Si es para casa habitación, tiene regulaciones especiales que protegen al inquilino (plazos mínimos, condiciones de habitabilidad). Si es comercial, prima la libertad contractual. Siempre debe constar por escrito para seguridad jurídica, aunque la falta de este se imputa al arrendador.",
        fundamento_legal: ["Art. 2398 al 2496 del Código Civil Federal"],
        ejemplo_uso: "Inmobiliaria SUR firma un contrato de arrendamiento por un año con Juan para que este viva en el departamento 4 a cambio de 10,000 pesos mensuales.",
        plantillas_relacionadas: ["contrato-arrendamiento-casa-habitacion", "contrato-arrendamiento-local-comercial", "convenio-desocupacion-inmueble"]
    },
    {
        id: "averiguacion-previa",
        letra: "A",
        termino: "Averiguación Previa",
        definicion_corta: "Fase de investigación de un delito bajo el antiguo sistema penal inquisitivo (ahora reemplazada por la Carpeta de Investigación).",
        explicacion_detallada: "En el sistema tradicional, era la primera etapa del procedimiento penal en la cual el Ministerio Público realizaba las diligencias necesarias para determinar si había elementos suficientes que acreditaran el cuerpo del delito y la probable responsabilidad del indiciado. Hoy en día (Sistema Penal Acusatorio) se le conoce como Integración de la Carpeta de Investigación.",
        fundamento_legal: ["Antiguo Código Federal de Procedimientos Penales"],
        ejemplo_uso: "Se inició una averiguación previa en 2012 por el robo del vehículo, la cual acaba de ser consignada ante el juez penal.",
        plantillas_relacionadas: ["denuncia-querella-penal", "escrito-pruebas-ministerio-publico"]
    },
    {
        id: "cargo-de-confianza",
        letra: "C",
        termino: "Cargo de Confianza (Trabajador de Confianza)",
        definicion_corta: "Categoría laboral que agrupa funciones de dirección, inspección, vigilancia o fiscalización dentro de una empresa, con regulaciones de despido distintas.",
        explicacion_detallada: "La calidad de trabajador de confianza no depende de lo que diga el contrato, sino de la naturaleza de las funciones que desempeña. Estos trabajadores tienen restricciones respecto a la sindicalización y, en caso de despido injustificado, el patrón generalmente no está obligado a reinstalarlos, pudiendo solo indemnizarlos.",
        fundamento_legal: ["Art. 9 de la Ley Federal del Trabajo"],
        ejemplo_uso: "El Gerente de Recursos Humanos fue liquidado de la empresa; al ser empleado de confianza, no podrá exigir su reinstalación por vía legal.",
        plantillas_relacionadas: ["contrato-individual-trabajo-confianza", "convenio-terminacion-relacion-laboral"]
    },
    {
        id: "carpeta-de-investigacion",
        letra: "C",
        termino: "Carpeta de Investigación",
        definicion_corta: "Registro o expediente que integra el Ministerio Público que contiene todos los datos de prueba recabados durante la investigación inicial de un delito.",
        explicacion_detallada: "Figura central del Sistema Penal Acusatorio (Juicios Orales). Al recibir una denuncia o querella, el MP abre esta carpeta para reunir evidencias que esclarezcan los hechos. Si encuentra elementos suficientes, formula la imputación ante un Juez de Control. Reemplazó a la antigua Averiguación Previa.",
        fundamento_legal: ["Art. 211 y siguientes del Código Nacional de Procedimientos Penales"],
        ejemplo_uso: "Tras presentar tu querella por fraude bancario, el fiscal te entregó el número de tu Carpeta de Investigación para dar seguimiento al caso.",
        plantillas_relacionadas: ["querella-fraude", "escrito-coadyuvancia-penal"]
    },
    {
        id: "casacion",
        letra: "C",
        termino: "Casación",
        definicion_corta: "Recurso extraordinario o facultad de tribunales superiores para anular sentencias emitidas por tribunales inferiores que contienen errores en la aplicación de la ley.",
        explicacion_detallada: "Aunque en México la figura puramente de 'Casación' clásica evolucionó fuertemente hacia la vía del Amparo Directo, en el derecho procesal (y en diversos ordenamientos locales) se refiere al acto de romper, anular o invalidar una resolución por defectos de forma procesal o de fondo en la interpretación de la ley, garantizando la uniformidad de la jurisprudencia.",
        fundamento_legal: ["Doctrina Jurisprudencial", "Ley de Amparo (como símil de anulación)"],
        ejemplo_uso: "La defensa buscará la casación de la sentencia de segunda instancia al argumentar que el magistrado aplicó un código civil derogado.",
        plantillas_relacionadas: ["amparo-directo-civil", "recurso-apelacion-sentencia"]
    },
    {
        id: "comodato",
        letra: "C",
        termino: "Comodato",
        definicion_corta: "Contrato mediante el cual una persona presta gratuitamente el uso de un bien no fungible a otra, quien se obliga a restituirlo individualmente.",
        explicacion_detallada: "Es esencialmente gratuito. Si hubiera cobro, sería un arrendamiento. El comodatario (quien recibe el bien) está obligado a poner toda diligencia en su cuidado y responde de su deterioro en caso de culpa. No transfiere la propiedad ni los frutos, solo el uso.",
        fundamento_legal: ["Art. 2497 al 2515 del Código Civil Federal"],
        ejemplo_uso: "Te presto mi cabaña en Valle de Bravo por dos semanas bajo un contrato de comodato, te encargas de mantenerla limpia y me la devuelves intacta.",
        plantillas_relacionadas: ["contrato-comodato", "requerimiento-entrega-inmueble"]
    },
    {
        id: "compraventa",
        letra: "C",
        termino: "Compraventa",
        definicion_corta: "Contrato translaticio de dominio donde uno de los contratantes se obliga a transferir la propiedad de una cosa o derecho, y el otro paga por ellos un precio cierto y en dinero.",
        explicacion_detallada: "Por regla general, la venta es perfecta y obligatoria para las partes cuando se han convenido sobre la cosa y su precio, aunque la primera no haya sido entregada ni el segundo satisfecho. Tratándose de inmuebles, la ley exige formalidades estrictas como la escritura pública ante Notario cuando el valor excede cierto umbral de UMAs.",
        fundamento_legal: ["Art. 2248 al 2326 del Código Civil Federal"],
        ejemplo_uso: "Firmamos un contrato de compraventa privada de tu automóvil usado; yo te doy los $100,000 MXN en transferencia y tú me endosas la factura.",
        plantillas_relacionadas: ["contrato-compraventa-auto", "contrato-compraventa-inmueble"]
    },
    {
        id: "conciliacion",
        letra: "C",
        termino: "Conciliación",
        definicion_corta: "Mecanismo Alternativo de Solución de Controversias (MASC) donde un tercero imparcial ayuda a las partes en conflicto a llegar a un acuerdo.",
        explicacion_detallada: "A diferencia del arbitraje (donde el tercero decide) o la mediación (donde el tercero solo facilita el diálogo), en la conciliación el tercero (conciliador) está facultado para proponer soluciones concretas. En materia laboral, ahora es un paso prejudicial obligatorio ante el Centro de Conciliación y Registro Laboral antes de demandar en tribunales.",
        fundamento_legal: ["Ley de Mecanismos Alternativos de Solución de Controversias", "Art. 684 LFT"],
        ejemplo_uso: "Antes de ir a juicio laboral, empresa y trabajador asistieron al Centro de Conciliación, donde firmaron un convenio por el pago del 80% del finiquito y cerraron el asunto sin abogados.",
        plantillas_relacionadas: ["convenio-conciliacion-laboral", "citatorio-mediacion"]
    },
    {
        id: "contrato",
        letra: "C",
        termino: "Contrato",
        definicion_corta: "Acuerdo de voluntades de dos o más personas para crear o transmitir derechos y obligaciones.",
        explicacion_detallada: "Es una especie de convenio. Los convenios que producen o transfieren las obligaciones y derechos, toman el nombre de contratos. Para que exista requiere: Consentimiento y Objeto que pueda ser materia del contrato. Puede ser invalidado por diversas razones, como coacción, error o ser objeto ilícito.",
        fundamento_legal: ["Art. 1792 y 1793 del Código Civil Federal"],
        ejemplo_uso: "Ayer firmamos un contrato laboral para formalizar el cargo que tendrás en mi empresa a partir de enero.",
        plantillas_relacionadas: ["contrato-individual-trabajo", "contrato-prestacion-servicios"]
    },
    {
        id: "dano-moral",
        letra: "D",
        termino: "Daño Moral",
        definicion_corta: "Afectación que sufre una persona en sus sentimientos, afectos, creencias, decoro, honor, reputación, vida privada o conformación física.",
        explicacion_detallada: "Se presume que hay daño moral cuando se vulnere o menoscabe ilegítimamente la libertad o integridad física o psíquica de las personas. Quien exija reparación por daño moral debe probar el hecho ilícito o culposo, y el daño material sufrido no es un requisito previo indispensable para demandar el daño moral en México.",
        fundamento_legal: ["Art. 1916 del Código Civil Federal"],
        ejemplo_uso: "La revista publicó fotos fabricadas alegando un arresto falso del empresario, quien ahora los demandará por indemnización millonaria de daño moral por devastar su reputación.",
        plantillas_relacionadas: ["demanda-dano-moral-civil", "demanda-responsabilidad-civil"]
    },
    {
        id: "danos-y-perjuicios",
        letra: "D",
        termino: "Daños y Perjuicios",
        definicion_corta: "Categoría combinada civil: 'Daño' es la pérdida sufrida en el patrimonio por falta de cumplimiento de una obligación, y 'Perjuicio' es la ganancia lícita que dejó de obtenerse (Lucro Cesante).",
        explicacion_detallada: "Generalmente demandados en conjunto cuando una de las partes incumple un contrato o comete un hecho ilícito. Siempre deben ser consecuencia inmediata y directa de la falta de cumplimiento de la obligación y deben probarse fehacientemente mediante peritajes económicos o contables.",
        fundamento_legal: ["Art. 2108 y 2109 del Código Civil Federal"],
        ejemplo_uso: "Exigiré Daños por la destrucción del camión que chocaste, y Perjuicios por todas las entregas de mercancía que me cancelaron al quedarme sin transporte este mes.",
        plantillas_relacionadas: ["demanda-civil-incumplimiento-contrato", "incidente-liquidacion-danos"]
    },
    {
        id: "demanda",
        letra: "D",
        termino: "Demanda",
        definicion_corta: "Acto procesal inicial, presentado por escrito ante un juez, mediante el cual el actor ejerce su derecho de acción contra una persona pidiendo una resolución.",
        explicacion_detallada: "Es el documento que da inicio a casi cualquier juicio (civil, laboral, mercantil, familiar). Debe contener inexcusablemente el tribunal ante el que se promueve, los nombres del actor y demandado, los hechos en que funda su petición y los fundamentos de derecho. Una demanda mal estructurada puede ser desechada o prevenida.",
        fundamento_legal: ["Art. 255 del Código de Procedimientos Civiles"],
        ejemplo_uso: "Presentaré la demanda de divorcio encausado en la oficialía de partes familiar a primera hora de mañana.",
        plantillas_relacionadas: ["demanda-divorcio-incausado", "demanda-ejecutiva-mercantil", "demanda-laboral-despido"]
    },
    {
        id: "divorcio-incausado",
        letra: "D",
        termino: "Divorcio Incausado (Divorcio Exprés)",
        definicion_corta: "Disolución del vínculo matrimonial sin necesidad de señalar o probar a un juez la causa (infidelidad, abandono) que motivó la separación.",
        explicacion_detallada: "Consagrado por la Suprema Corte bajo el libre desarrollo de la personalidad. Basta con que uno de los cónyuges no desee continuar el matrimonio para que el juez decrete el divorcio casi de inmediato. Sin embargo, temas como pensión alimenticia, bienes y custodia continúan litigándose vía incidental posterior al auto de divorcio.",
        fundamento_legal: ["Jurisprudencia de la SCJN", "Código Civil (diversos estados)"],
        ejemplo_uso: "Ya no tienes que probar causales ocultas; basta con ingresar la solicitud de divorcio incausado junto con un convenio propuesto y quedarás divorciado legalmente.",
        plantillas_relacionadas: ["demanda-divorcio-incausado", "convenio-divorcio-mutuo-acuerdo"]
    },
    {
        id: "donacion",
        letra: "D",
        termino: "Donación",
        definicion_corta: "Contrato por el cual una persona transfiere a otra, gratuitamente, una parte o la totalidad de sus bienes presentes.",
        explicacion_detallada: "La donación no puede comprender los bienes futuros. Es perfecta desde que el donatario la acepta. Es uno de los contratos más vigilados por el SAT en transmisiones de grandes valores o inmuebles, debiendo protocolizarse ante Notario si sobrepasa montos exentos y tributando ISR en caso de hacerla a personas que no sean descendientes, ascendientes o cónyuges en línea recta.",
        fundamento_legal: ["Art. 2332 al 2383 del Código Civil Federal"],
        ejemplo_uso: "Realizó un contrato de donación de su departamento en favor de su hija para en un futuro evitarle gastos de sucesión cuando él fallezca.",
        plantillas_relacionadas: ["contrato-donacion", "contrato-donacion-usufructo"]
    },
    {
        id: "embargo",
        letra: "E",
        termino: "Embargo",
        definicion_corta: "Retención o aseguramiento judicial de un bien perteneciente al deudor para garantizar el cumplimiento de una obligación de pago dictada por un juez.",
        explicacion_detallada: "Se ejecuta a través de un actuario judicial. En caso de no pagar tras un requerimiento y una orden jurisdiccional precautoria o ejecutiva (como en un Pagaré), el actuario embargará bienes suficientes (autos, nómina parcial, cuentas de banco, bienes muebles o inmuebles). Existen bienes inembargables de subsistencia básica como vestido y máquinas de trabajo.",
        fundamento_legal: ["Art. 432 y 1392 del Código de Comercio", "Código Federal de Procedimientos Civiles"],
        ejemplo_uso: "El abogado mercantil consiguió ejecutar una orden de embargo y le inmovilizaron las cuentas de cheques a la empresa deudora.",
        plantillas_relacionadas: ["demanda-ejecutiva-mercantil", "incidente-levantamiento-embargo"]
    },
    {
        id: "emplazamiento",
        letra: "E",
        termino: "Emplazamiento",
        definicion_corta: "Notificación oficial y solemne que hace el juzgado al demandado informándole que ha sido denunciado y otorgándole un plazo legal para contestar.",
        explicacion_detallada: "Mala realización del emplazamiento es una de las violaciones al debido proceso (garantía de audiencia) más graves en el derecho mexicano, siendo una de las causas más recurrentes y efectivas del Juicio de Amparo. Sin el llamado respetuoso a juicio, todas las actuaciones del proceso son legalmente anulables.",
        fundamento_legal: ["Arts. 110 al 119 del Código de Procedimientos Civiles"],
        ejemplo_uso: "El actuario me dejó una cédula de notificación del emplazamiento; tengo 9 días hábiles para dar contestación a la demanda civil.",
        plantillas_relacionadas: ["amparo-indirecto-falta-emplazamiento", "contestacion-demanda-civil"]
    },
    {
        id: "eviccion",
        letra: "E",
        termino: "Evicción (y Saneamiento)",
        definicion_corta: "Pérdida de un derecho adquirido que sufre el comprador por sentencia firme derivada de un derecho anterior que tenía un tercero sobre la cosa.",
        explicacion_detallada: "El 'Saneamiento por evicción' es la obligación que tiene el vendedor frente al comprador en todo contrato oneroso para responder si el comprador es despojado judicialmente de lo pactado. El vendedor tendrá que devolver el precio, gastos de juicio e incluso indemnización.",
        fundamento_legal: ["Art. 2119 y siguientes del Código Civil Federal"],
        ejemplo_uso: "Compré el terreno libre pero resultó que otro vendedor ya lo había escriturado un año antes. Ahora enfrento evicción y debo exigir saneamiento al que me lo vendió.",
        plantillas_relacionadas: ["demanda-civil-saneamiento-eviccion"]
    },
    {
        id: "exhorto",
        letra: "E",
        termino: "Exhorto",
        definicion_corta: "Comunicación u oficio escrito entre jueces de diferente lugar, pero igual jerarquía, donde el juzgado que lo gira pide ayuda al segundo para realizar un acto procesal en su territorio jurisdiccional.",
        explicacion_detallada: "Si un juez de Monterrey necesita notificar una demanda o embargar una casa en Guadalajara, no puede hacerlo directamente debido al límite local de su jurisdicción; emite un exhorto a un juez de Jalisco para que sus actuarios locales lo diligencien y regresen el acta levantada de vuelta a Nuevo León.",
        fundamento_legal: ["Arts. 104 y 105 del Código Federal de Procedimientos Civiles"],
        ejemplo_uso: "Solicitaremos que se expida un exhorto para emplazar demandado en su residencia vacacional en Cancún.",
        plantillas_relacionadas: ["escrito-solicita-exhorto"]
    },
    {
        id: "fianza",
        letra: "F",
        termino: "Fianza",
        definicion_corta: "Garantía personal en virtud de la cual una persona (fiador) se compromete frente al acreedor a cumplir la obligación del deudor principal si este no lo hace.",
        explicacion_detallada: "La fianza siempre debe constar expresamente, no se presume. Para fianzas de alto valor pecuniario como rentas y amparos judiciales penales, existen comúnmente en México Afianzadoras profesionales reguladas (Instituciones de Garantías o Instituciones de Seguros y Fianzas) que venden pólizas de caución.",
        fundamento_legal: ["Art. 2794 al 2855 del Código Civil Federal"],
        ejemplo_uso: "El juez penal me fijó una fianza de $500,000 pesos como medida cautelar para seguir mi proceso penal en libertad provisional.",
        plantillas_relacionadas: ["escrito-exhibe-fianza-penal", "contrato-arrendamiento-fiador"]
    },
    {
        id: "guarda-y-custodia",
        letra: "G",
        termino: "Guarda y Custodia",
        definicion_corta: "Derecho y obligación relacionado exclusivamente con los cuidados ordinarios y convivencia física y diaria que uno de los padres tiene respecto de los menores de edad.",
        explicacion_detallada: "No debe confundirse con la Patria Potestad (que son los deberes jurídicos y representación moral de un padre, y que casi siempre la retienen ambos, incluso el que no vive en la misma casa). La custodia determina con quién cohabita permanentemente el menor. Puede ser compartida en favor de ambos progenitores dividiendo tiempos.",
        fundamento_legal: ["Código Civil y Reglamentaciones de Familia"],
        ejemplo_uso: "En el convenio de divorcio se pactó que la madre conservará la guarda y custodia provisional de la niña, mientras el padre mantiene un régimen de visitas abierto los fines de semana.",
        plantillas_relacionadas: ["convenio-divorcio-mutuo-acuerdo", "demanda-guarda-y-custodia"]
    },
    {
        id: "heredero",
        letra: "H",
        termino: "Heredero (y Legatario)",
        definicion_corta: "El heredero sucede a título universal toda o una parte fraccionada de la herencia (incluyendo su participación en las deudas no extintas del difunto).",
        explicacion_detallada: "A diferencia del 'Legatario', que sucede a título particular (ej. le dejan un inmueble específico y listado o un cuadro, libre de participar en liquidación del total de deudas, salvo excepciones). Un heredero es a partes generales (el '50% de mi masa patrimonial neta').",
        fundamento_legal: ["Art. 1284, 1285 y 1290 del Código Civil Federal"],
        ejemplo_uso: "Dejé como herederos a mis hijos en partes iguales (33% c/u), pero nombré legataria a mi hermana para que reciba mi Mustang 1970 clásico directamente.",
        plantillas_relacionadas: ["testamento-publico-abierto", "repudio-herencia"]
    },
    {
        id: "hipoteca",
        letra: "H",
        termino: "Hipoteca",
        definicion_corta: "Garantía real constituida sobre bienes que no se entregan al acreedor, y que da derecho a este a ser pagado con su venta en caso de un incumplimiento de repago.",
        explicacion_detallada: "Por regla imperativa la hipoteca recae en bienes raíces. Al no desposeer al titular, este puede vivir en su casa mientras la hipoteca está gravada como una carga registral limitativa en el Registro Público de la Propiedad. Requiere protocolización notarial si ampara obligaciones considerables.",
        fundamento_legal: ["Art. 2893 y siguientes del Código Civil Federal"],
        ejemplo_uso: "El banco constituyó una escritura de hipoteca de primera fila sobre mi nuevo departamento como garantía del crédito a 20 años que me facilitaron.",
        plantillas_relacionadas: ["contrato-mutuo-hipotecario", "cancelacion-hipoteca"]
    },
    {
        id: "incidente",
        letra: "I",
        termino: "Incidente",
        definicion_corta: "Procedimiento jurídico accesorio que se tramita dentro y a la par de un juicio principal para resolver una cuestión separada surgida al respecto.",
        explicacion_detallada: "Hay juicios secundarios a todo litigio que requieren resolución sin esperar a la sentencia final, como el 'Incidente de Nulidad de Actuaciones' (que ataca la viabilidad del modo de ser notificados) o los 'Incidentes de Liquidación de Sentencia' (que calculan en números brutos la condena).",
        fundamento_legal: ["Múltiples Códigos de Procedimientos Civiles y Mercantiles"],
        ejemplo_uso: "Promoveremos un Incidente de Cuantificación para que el perito determine cuántos intereses nos adeudan conforme a los lineamientos que el Juez dictó en la sentencia firme.",
        plantillas_relacionadas: ["incidente-liquidacion-gastos", "incidente-nulidad-notificacion"]
    },
    {
        id: "jurisprudencia",
        letra: "J",
        termino: "Jurisprudencia (SCJN / Tribunales Colegiados)",
        definicion_corta: "Interpretación vinculatoria y firme emitida por el Poder Judicial Federal sobre cómo entender e interpretar el alcance opaco, contradictorio o ambiguo de una ley vigente.",
        explicacion_detallada: "Acto de suma autoridad legal en el sistema jurídico en México. Establece Precedente Obligatorio por Contradicción o Reiteración (5 resoluciones seguidas no interrumpidas por una en contra). Si existe jurisprudencia, todo juez inferior tiene la estricta obligación constitucional de atacar el acto exactamente como indica la tesis para cualquier ciudadano amparado.",
        fundamento_legal: ["Art. 94 de la Constitución", "Arts. 215 a 230 de la Ley de Amparo"],
        ejemplo_uso: "Como defensa en este pagaré, invocaremos la Jurisprudencia de Usura de la Primera Sala de la Corte respecto al topo inflacionario del interés aplicable en actos comerciales no bancarios.",
        plantillas_relacionadas: ["alegatos-conclusion-civil", "amparo-directo-penal"]
    },
    {
        id: "laudo",
        letra: "L",
        termino: "Laudo",
        definicion_corta: "Resolución definitiva pronunciada por árbitros en un juicio de arbitraje o (previo a la reforma) por las históricas Juntas de Conciliación y Arbitraje para resolver el fondo laboral.",
        explicacion_detallada: "Antiguamente en México la resolución definitiva en materia obrera no se llamaba Sentencia sino Laudo, al venir de las Juntas tripartitas que eran entes administrativos y no judiciales. Tras las Reformas Laborales donde pasaron a existir Jueces Laborales de pleno fuero federal, comenzaron a emitirse las nuevas sentencias laborales. El laudo también es usado para decisiones vinculativas emitidas por paneles privados de arbitraje.",
        fundamento_legal: ["Arts. 840 y 841 LFT Histórica"],
        ejemplo_uso: "La Junta Local emitió laudo condenatorio instruyendo restituir los 3 años de salarios caídos demandados por despido al ingeniero petrolero.",
        plantillas_relacionadas: ["amparo-directo-laudo-laboral"]
    },
    {
        id: "medidas-cautelares",
        letra: "M",
        termino: "Medidas Cautelares",
        definicion_corta: "Decisión preventiva y temporal que un juez impone sobre una persona acusada con el fin de evitar riesgos severos mientras avanza el largo proceso jurídico.",
        explicacion_detallada: "En materia penal estas medidas buscan que el imputado no se sustraiga de la justicia (se escape), no perjudique la investigación, ni ponga en severo peligro a la víctima. Varían en grado, desde presentarse a firmar cada 15 días, depositar garantía económica, no abandonar el país, el arresto domiciliario y en su formato más lesivo la 'Prisión Preventiva Justificada u Oficiosa'.",
        fundamento_legal: ["Art. 153 a 175 Código Nacional de Procedimientos Penales"],
        ejemplo_uso: "El juez de control decidió la sujeción a proceso por lesiones pero le quitó el pasaporte y le dictó como medida cautelar usar un brazalete geolocalizador en vez de recluirlo.",
        plantillas_relacionadas: ["solicitud-cambio-medida-cautelar", "amparo-prision-preventiva"]
    },
    {
        id: "ministerio-publico",
        letra: "M",
        termino: "Ministerio Público (M.P. / Fiscal)",
        definicion_corta: "Representante legal del Estado encausado de velar por los intereses colectivos y exclusivo de la acusación pública, director técnico e integrador de toda pesquisa criminal.",
        explicacion_detallada: "Monopolizan de origen a nivel Constitucional la obligación de percibir y atender la querella y las denuncias penales así como el control de dirección de los peritos y policías investigadores. Deberán allegarse pruebas para lograr una judicialidad (ejercer acción penal).",
        fundamento_legal: ["Art. 21 Constitucional"],
        ejemplo_uso: "Asistí a la agencia del Ministerio Público a relatar los hechos e integrar las videograbaciones de vigilancia dentro de mi acta de denuncia penal por estafa en redes sociales.",
        plantillas_relacionadas: ["denuncia-querella-penal", "escrito-aportacion-pruebas-mp"]
    },
    {
        id: "nua",
        letra: "N",
        termino: "Nulidad",
        definicion_corta: "Ineficacia de un acto jurídico originada por la falta de un elemento esencial, el incumplimiento estricto legal al formularlo, vicios del consentimiento o la simulación legal.",
        explicacion_detallada: "Un acto jurídico formal (Como un Testamento, Matrimonio o Contrato Millonario) es susceptible de estar viciado o simulado, promoviéndose un 'Juicio de Nulidad Acto Jurídico' cuando a pesar de existir legalidad aparente, es falso bajo ley civil la voluntad o es contrario a las leyes del orden social (P. Ej. Contratar actos no-comercializables por prohibición local o error in situ de la persona de forma fraudulenta). Puede ser Invalidez Absoluta (que no prescribe) o Relativa.",
        fundamento_legal: ["Art. 2224 al 2242 del Código Civil Federal"],
        ejemplo_uso: "Reclamé la Nulidad Absoluta del Contrato de Traspaso de acciones ya que mi firma fue clonada con fraude tecnológico, por lo que bajo Derecho nada operó.",
        plantillas_relacionadas: ["demanda-nulidad-acto-juridico"]
    },
    {
        id: "pagare",
        letra: "P",
        termino: "Pagaré",
        definicion_corta: "Título de crédito con la promesa incondicional escrita y suscrita por una persona (el deudor) a una orden específica de cubrir el pago monetario fijado por el tiempo fijado.",
        explicacion_detallada: "Documento altamente poderoso de la actividad crediticia. Como 'Prueba Preconstituida', en su tenencia supose y conlleva Acción Ejecutoria (embargo preventivo inicial a demanda, al revés que el derecho civil habitual). Requiere requisitos rigoristas para validez y ser un título autónomo: Inserción de la palabra 'pagaré' textual; montos y firma auténtica. Suele acarrear réditos por mora.",
        fundamento_legal: ["Arts. 170 y 174 de Lay Ley General de Títulos y Operaciones de Crédito"],
        ejemplo_uso: "No pagaré mis dividendos adeudados sino garantizamos esto tras redactar un Pagaré que estipule 20% anual como sanción penal al retraso predecible.",
        plantillas_relacionadas: ["pagare-mexico", "demanda-ejecutiva-mercantil-pagare"]
    },
    {
        id: "patria-potestad",
        letra: "P",
        termino: "Patria Potestad",
        definicion_corta: "El cúmulo fundamental inalienable de derechos morales, de representación legal civil y obligacionales que recaen ante toda autoridad protectora de menores sobre sus progenitores nativos o adquiridos.",
        explicacion_detallada: "Son la guarda y custodia un mero efecto accidental y dependencial y variable de esto. Solamente en casos trágicos sentenciados o de agresión y abandono innegable es extinguible en la Ley Local (Quitarle y destronarlo legalmente sus apellidos rectores). Incluye la capacidad del padre a gestionar el usufructo del menor de su patrimonio propio (Herencias).",
        fundamento_legal: ["Arts. 411 y siguientes Código Civil de protección de familiaridad."],
        ejemplo_uso: "Si el abuelo se intenta llevar a la infante a EUA no lo dejarán, el Estado reconoce solo y ante el visado mis atribuciones civiles como tutor exclusivo dada mi total Patria Potestad.",
        plantillas_relacionadas: ["demanda-perdida-patria-potestad", "convenio-custodia-menores"]
    },
    {
        id: "pension-alimenticia",
        letra: "P",
        termino: "Pensión Alimenticia",
        definicion_corta: "Obligación de sostenimiento pecuniario forzoso determinado a familiares en línea directa a prever alimentos (entendiendo vestido, escolaridad medica, gastos médicos o comida básica) sin dolo.",
        explicacion_detallada: "Sustentado jurídicamente con el grado básico de consanguinidad ascendente o descendente. Si una parte divorciada requiere sustento y carecía o interrumpió ingresos monetizables para cuidar del hogar familiar, tienen derecho vitalicio o variable a exigirlo (hasta liquidar similar vida productiva truncada). En el Estado es penal evadirse a las deudas atrasadas incurriendo en mora prexistente notificada.",
        fundamento_legal: ["Título relativo y Libro de Deuda en Diversos Códigos Civiles."],
        ejemplo_uso: "Se impuso una fijación temporal en embargo pidiendo al IMSS del empleado una reducción patronal precautoria de la Pensión Alimenticia dictada al sueldo por un estimado del 35% general a depósitos directos de su ex concubino.",
        plantillas_relacionadas: ["demanda-pension-alimenticia", "cancelacion-pension-alimenticia"]
    },
    {
        id: "poder-notarial",
        letra: "P",
        termino: "Poder (General y Especial)",
        definicion_corta: "Representación jurídica documentada y protocolizada donde mediante una Carta Mandato Formal el 'Otorgante' dota al 'Apoderado' facultades explícitas formales para obrar por cuenta en todo ámbito en un grado predefinido.",
        explicacion_detallada: "Dividense por su naturaleza general (facultando actuar como el Titular en todas las operaciones, y usualmente son para Pleitos y Cobranza; Administración y/o un Acto Solemne de Dominio total de patrimonios). Cuando los Poderes tienen mención única o actos únicos inalienables se dictan Poderes Especiales.",
        fundamento_legal: ["Arts. 2546 en adelante en Correlación de Actos Mercantiles o de Registro."],
        ejemplo_uso: "Revocaré tu Poder Administrativo porque a quien contraté como Administrador Condominal no debería firmar el crédito de refacción de muros exteriores.",
        plantillas_relacionadas: ["poder-carta-simple", "revocacion-poder-notarial", "poder-amplio-representacion-legal"]
    },
    {
        id: "prision-preventiva",
        letra: "P",
        termino: "Prisión Preventiva (Oficiosa y Justificada)",
        definicion_corta: "Medida pre-condenatoria precautoria mediante el encarcelamiento físico a resguardos punitivos penales sin dictamen aún comprobado legal, justificado para que permanezca privado de garantías temporales.",
        explicacion_detallada: "Polémica cautela constitucional actual. Si la medida 'Justificada' se apela, el Ministerio debe comprobar la Alta Posibilidad Probable real de desorden y fuga (Múltiples actas o no tener casa estable o arraigo local). La variante altamente restrictiva es 'Prisión Oficiosa', mandatando pena a ciegas que todo individuo vinculado formalmente a Catálogos Penales por delitos de máximo daño y gravedad como narcotráfico, asesinato doloso, desvío gubernamental millonario permanezcan de rigor dentro.",
        fundamento_legal: ["Art. 19 de la CPEM (Constitución) Federal Modificaciones en Vigencia."],
        ejemplo_uso: "La Corte interamericana nos ordena reducir nuestra prisión oficiosa mexicana sin sentencias firmes. Mi amparo va para el cese al reabrir mi revisión formal de medidas de comparecencia.",
        plantillas_relacionadas: ["amparo-prision-preventiva", "apelacion-auto-vinculacion-proceso"]
    },
    {
        id: "querella",
        letra: "Q",
        termino: "Querella",
        definicion_corta: "Expresión penal que consiste en presentar directamente y con la declaración fidedigna y que el presunto doloso fue afectado inminentemente en persona la comisión del delito y que pide al Estado activarlo.",
        explicacion_detallada: "Opuesta o diferencial a una 'Denuncia' donde esta última versa contra delitos que se persiguen universalmente (Oficio), porque un fraude es un daño donde te pudiste contentar al pago retroactivo privado. En la Ley una Querella versa estrictamente sobre ilícitos de Persecución Voluntaria sin la iniciativa del afectado (Si hay un Choque Automotriz por Culpa el Fiscal General nunca intervendría activamente en prisión a tu conductor demandado si el afectado repara su Auto y no acude). Es un mecanismo para pedir el resarcimiento con perdón reparatorio.",
        fundamento_legal: ["Arts. 221 Y 225 de del CNPP (Procedimientos Penales)."],
        ejemplo_uso: "Fueron a la oficina penal a meter una querella formal contra un amigo que difamó mi restaurante por daños y pérdidas irreparables con intento de extorsión a que la retiraría si yo le cerraba al bar temporal local.",
        plantillas_relacionadas: ["denuncia-querella-penal", "escrito-perdon-querella"]
    },
    {
        id: "rescision",
        letra: "R",
        termino: "Rescisión (de Contrato o Laboral)",
        definicion_corta: "Ruptura, disolución, revocación o la terminación impuesta justificada válida jurídicamente en acto delictual, por moratoria dolosa para el cumplimiento temporal forzoso pactado en el tiempo formal.",
        explicacion_detallada: "Quien alega causal para ejercerla y es imputable válidamente tras demandarlo está librado de cumplir toda la vida del acto principal pactado. P.Ej Empleados faltos o faltos que mienten en certificados médicos es Despido Injustificado y de origen si no el obrero o locatario en materia civil, a su cargo a restituirse de ser posible como de antemano el adeudo.",
        fundamento_legal: ["Art. 47 en lo laboral Federal, Arts. 1949 Obligaciones Civiles."],
        ejemplo_uso: "Se notificó oficialmente al arrendatario la Rescisión del contrato maestro para local corporativo dado que alteró y rompió un pilar fundamental modificado en sus oficinas privadas.",
        plantillas_relacionadas: ["notificacion-rescision-contrato", "carta-despido-justificado-laboral"]
    },
    {
        id: "sentencia",
        letra: "S",
        termino: "Sentencia Definitiva",
        definicion_corta: "Sentencia resolutoria magna y acto formal imperativo culminante con lo que finalizan la autoridad magistral superior sobre todos los conflictos y pretensiones esgrimidas.",
        explicacion_detallada: "Se emiten resoluciones intermedias previas pero sólo la Definitiva causa fallo irreversible salvo un medio directo como un Amparo e instruye el resarcimiento forzado final absoluto después de valoraciones periciales rigurosas.",
        fundamento_legal: ["Sentencias Definitorias en los Estatutos Códigos Orgánicos locales del Sistema Jurídico Magistrado."],
        ejemplo_uso: "No pagaré mis dividendos adeudados sino garantizamos esto tras requerir a tu Abogado que presente pruebas ante que emitan su Sentencia el miércoles definitivo.",
        plantillas_relacionadas: ["amparo-directo-civil", "recurso-apelacion-sentencia"]
    },
    {
        id: "sobreseimiento",
        letra: "S",
        termino: "Sobreseimiento (Penal y Amparo)",
        definicion_corta: "Finalización anticipada total definitiva procesal formal sin resolver con culpabilidad probada el juicio legal cuando de oficio es visible de plano una imposibilidad radical u objeto obsoleto pre-comisión del fallo dictaminador legal o del juez adscrito al juzgado de autos.",
        explicacion_detallada: "Para entender la esencia del Sobreseimiento: No absuelve por la vía legal que probaste, sino que lo paraliza todo preexistente al fallo. P. Ej si fallece la contra investigada el expediente fenece sin absolución para sus antecedentes como el desistimiento. En el Amparo ocurre generalizado al derogarse o morir legalmente aquel acto abusivo preexistente de su autoridad u otra razón extintiva superior de facto extinguiendo todo objeto prexistente procesal legal y anulando en toda fuerza legal al que lo presentaba de lo contrario de su existencia general abstracta penal sin resolutorias futuras.",
        fundamento_legal: ["Art. 61. Ley De Amparos Y Art. 327 Código Penal de Procedimientos Adscritos."],
        ejemplo_uso: "Salió en libertad provisional gracias a que en su etapa media un recurso interpuso todo y se logró sobreseimiento ya que la victima otorgó perdón notariado.",
        plantillas_relacionadas: ["escrito-sobreseimiento-proceso", "desistimiento-amparo"]
    },
    {
        id: "testamento",
        letra: "T",
        termino: "Testamento Olografo / Modificatorio",
        definicion_corta: "Escrito legal manuscrito secreto con su mano rubricada puño escrito a total puño del cedente, o uno formal Público General ante Testigos y ratificado de voluntades del autor al fallecer prexistiendo de antes en total facultada de testar al futuro sucesorio para repartirlo sin conflicto extra local de Notarías y Jueces Intermedios O Herederos en Litigios prolongados a falta en caso contrario general intestados preexistentes legales forzados limitativamente limitados en general al porcentaje fijo de los hijos sin derecho u omisiones testamentarias legales obligatorias sin previas omisivas legales.",
        explicacion_detallada: "En su esencia se presenta manuscrito rigurosamente todo (Ológrafo) validado rigurosamente pericialmente ante Registros por testador mismo y su Testamento ante testadores presentes, es libre de mutar revocando a posteriores cada mes y uno invalida universalmente y total al previo a menos a pacto modificador del previo anterior si prexiste. Siempre válido es su final y último asentamiento público con base y apego civil en Notario de sus testigos si carecia de las reglas obligatorias preexistentes testamentarias de las porciones libres a los no descendientes obligatorios civiles.",
        fundamento_legal: ["Arts. 1295 del Título de Disposiciones Sucesiones Civiles y sus variables Códigos Legales Testamentarias Mexicanos"],
        ejemplo_uso: "Mi testamento del 2021 quedó oficialmente muerto. Hice una disposición post-vida revocatoria y con Testamento Público para designar que en parte al ser Olografo testamental me heredó un hermano de él de sus activos. Me es inválido legal por omisión si se rectifica.",
        plantillas_relacionadas: ["testamento-publico-abierto", "repudio-herencia"]
    },
    {
        id: "usufructo",
        letra: "U",
        termino: "Usufructo (Vitalicio y Temporal)",
        definicion_corta: "Mecanismo jurídico temporal de separar el dominio pleno limitando a Nudo Propietario conservando Uso Libre pleno con Utilidades directas sobre cosa inmueble que será poseída o en manos a no despojos de las herencias post-fallecer legales del titular sin dominio por derecho a desposeer.",
        explicacion_detallada: "Si me donas una propiedad a mi nombre a nombre pero me estableces legal en escrituración 'Reserva Vitalicia', tienes libre acceso sobre todo ganancial prexistente que genere una finca por ejemplo su rentabilidad legal sin perder acceso u uso forzado de expulsado ni dominio tuyo a mis decisiones (Eres un Nudo Propietario inactivo temporalmente) a mi nombre.",
        fundamento_legal: ["Arts. 980 C. Civil Federal sobre Uso y Habitaciones y Dominio."],
        ejemplo_uso: "Firmaré a mi hijo la Venta Escrituración en Donación y todo esto. Mas en testamento le otorgo y asumo mi casa limitándola el Dominio Total sobre ello por 5 años más o en caso fortuito mi fallecimiento se extingue la cesión del Usufructo preestablecido de antes de manera Vitalicia limitando ventas.",
        plantillas_relacionadas: ["contrato-donacion-usufructo", "cancelacion-usufructo"]
    }
];
