/**
 * Generador de Análisis Jurídico Práctico
 * Genera análisis HTML enriquecido para cada artículo basado en su contenido real.
 */

function extractKeywords(texto: string): string[] {
    const legalTerms = [
        'derechos humanos', 'garantías', 'libertad', 'igualdad', 'propiedad',
        'amparo', 'juicio', 'tribunal', 'autoridad', 'federal', 'estado',
        'municipio', 'ley', 'constitución', 'poder', 'ejecutivo', 'legislativo',
        'judicial', 'contrato', 'obligación', 'pena', 'delito', 'sanción',
        'impuesto', 'fiscal', 'administración', 'pública', 'privada',
        'trabajo', 'salario', 'salud', 'educación', 'seguridad', 'social',
        'familia', 'matrimonio', 'divorcio', 'herencia', 'sucesión',
        'comercio', 'empresa', 'mercantil', 'civil', 'penal', 'laboral',
        'proceso', 'procedimiento', 'recurso', 'apelación', 'amparo',
        'votación', 'elección', 'partido', 'ciudadano', 'extranjero',
        'territorio', 'soberanía', 'tratado', 'internacional', 'norma',
    ];
    const textoLower = texto.toLowerCase();
    return legalTerms.filter(t => textoLower.includes(t)).slice(0, 6);
}

function detectarTematica(texto: string, numero: string): string {
    const t = texto.toLowerCase();
    if (t.includes('derecho') || t.includes('garantía') || t.includes('libertad')) return 'derechos';
    if (t.includes('impuesto') || t.includes('contribución') || t.includes('fiscal')) return 'fiscal';
    if (t.includes('trabajo') || t.includes('salario') || t.includes('obrero')) return 'laboral';
    if (t.includes('penal') || t.includes('delito') || t.includes('pena')) return 'penal';
    if (t.includes('electoral') || t.includes('votación') || t.includes('partido')) return 'electoral';
    if (t.includes('poder ejecutivo') || t.includes('presidente')) return 'ejecutivo';
    if (t.includes('congreso') || t.includes('senado') || t.includes('legislat')) return 'legislativo';
    if (t.includes('tribunal') || t.includes('suprema corte') || t.includes('judicial')) return 'judicial';
    if (t.includes('municipio') || t.includes('ayuntamiento')) return 'municipal';
    if (t.includes('amparo')) return 'amparo';
    if (t.includes('educación') || t.includes('escuela')) return 'educacion';
    if (t.includes('salud') || t.includes('médico')) return 'salud';
    if (t.includes('propiedad') || t.includes('posesión') || t.includes('tierra')) return 'propiedad';
    return 'general';
}

const temasContexto: Record<string, { aplicacion: string; recurso: string; ejemplo: string }> = {
    derechos: {
        aplicacion: 'En la práctica, este artículo es invocado frecuentemente en juicios de amparo cuando particulares alegan violaciones a sus derechos fundamentales por parte de autoridades del Estado. Los tribunales federales han desarrollado una amplia jurisprudencia sobre su alcance y límites.',
        recurso: 'El juicio de amparo indirecto es el medio de impugnación ordinario para hacer valer las violaciones a los derechos consagrados en este precepto ante los Juzgados de Distrito.',
        ejemplo: 'Por ejemplo, cuando una autoridad administrativa emite una resolución que restringe el ejercicio de un derecho humano sin fundamentación ni motivación adecuada, el particular puede acudir al amparo invocando directamente este artículo como parámetro de control constitucional.',
    },
    fiscal: {
        aplicacion: 'Este artículo tiene aplicación directa en la relación jurídico-tributaria entre el Estado y los contribuyentes. Los principios de proporcionalidad y equidad tributaria derivados de este precepto son constantemente analizados por el Poder Judicial Federal.',
        recurso: 'El recurso de revocación ante el SAT, el juicio contencioso administrativo ante el TFJA, y el juicio de amparo son los medios de defensa disponibles para contribuyentes que estimen violados sus derechos fiscales.',
        ejemplo: 'Un contribuyente que recibe un crédito fiscal desproporcionado o que no guarda equidad respecto de contribuyentes en la misma situación puede impugnar la disposición fiscal invocando los principios constitucionales tributarios.',
    },
    laboral: {
        aplicacion: 'En el ámbito laboral, este artículo es el sustento constitucional de los derechos de los trabajadores. Las Juntas de Conciliación y Arbitraje y los Tribunales Laborales lo aplican como marco interpretativo en la resolución de conflictos entre trabajadores y patrones.',
        recurso: 'La demanda laboral ante el Centro de Conciliación o Tribunal Laboral según la materia, y el posterior amparo directo, son los medios ordinarios de defensa en esta materia.',
        ejemplo: 'Cuando un patrón despide injustificadamente a un trabajador, este puede demandar la reinstalación o indemnización constitucional invocando los derechos laborales que este artículo garantiza.',
    },
    penal: {
        aplicacion: 'Este precepto constituye un pilar del sistema penal acusatorio mexicano. Los Jueces de Control, Tribunales de Enjuiciamiento y Tribunales de Alzada lo aplican para garantizar el debido proceso y los derechos del imputado.',
        recurso: 'El amparo indirecto durante el proceso penal y el amparo directo contra sentencias definitivas son los medios constitucionales de defensa ordinarios en esta materia.',
        ejemplo: 'Si durante una audiencia de vinculación a proceso el Ministerio Público no logra satisfacer el estándar probatorio establecido constitucionalmente, el juez de control debe resolver a favor del imputado invocando la presunción de inocencia.',
    },
    judicial: {
        aplicacion: 'Este artículo regula la estructura y funcionamiento del Poder Judicial de la Federación, siendo fundamento de la independencia judicial. Su correcta interpretación determina el alcance de la autonomía de los órganos jurisdiccionales frente a los demás poderes del Estado.',
        recurso: 'Las controversias constitucionales y las acciones de inconstitucionalidad ante la Suprema Corte de Justicia son los instrumentos procesales para hacer valer la integridad de las disposiciones aquí establecidas.',
        ejemplo: 'Cuando el Congreso pretende interferir con las funciones jurisdiccionales o reducir indebidamente la competencia de los tribunales federales, se puede invocar este artículo para defender la independencia del Poder Judicial.',
    },
    legislativo: {
        aplicacion: 'Establece los fundamentos del Poder Legislativo y su proceso de formación de leyes. Es referencia obligada para determinar la constitucionalidad del procedimiento legislativo y la distribución de competencias entre Cámara de Diputados y Senado.',
        recurso: 'La acción de inconstitucionalidad ante la SCJN es el medio idóneo para impugnar leyes cuyo proceso de formación sea contrario a lo establecido en este precepto.',
        ejemplo: 'Una ley aprobada sin satisfacer el quórum requerido o sin el proceso de dictaminación correspondiente puede ser impugnada mediante acción de inconstitucionalidad argumentando la violación al procedimiento legislativo establecido constitucionalmente.',
    },
    municipal: {
        aplicacion: 'Regula la autonomía municipal como base de la organización político-administrativa del país. Los ayuntamientos invocan este artículo para defender su esfera competencial frente a invasiones por parte de autoridades estatales o federales.',
        recurso: 'La controversia constitucional ante la Suprema Corte de Justicia es el medio idóneo para que los municipios defiendan las atribuciones que este artículo les confiere.',
        ejemplo: 'Cuando un gobierno estatal pretende asumir funciones que corresponden exclusivamente al municipio —como la prestación de servicios públicos o la aprobación de reglamentos municipales— el ayuntamiento puede promover controversia constitucional.',
    },
    amparo: {
        aplicacion: 'Este precepto es la base constitucional del juicio de amparo, el mecanismo de control constitucional más importante del sistema jurídico mexicano. Su interpretación ha sido desarrollada extensamente por la Suprema Corte y los Tribunales Colegiados de Circuito.',
        recurso: 'El amparo es tanto el objeto regulado como el instrumento para hacer valer lo aquí establecido; cualquier violación a los principios del juicio de amparo puede a su vez impugnarse mediante un nuevo amparo.',
        ejemplo: 'Cuando un Juez de Distrito resuelve un amparo sin respetar los principios de suplencia de la queja, relatividad de la sentencia o definitividad previstos en este artículo, la parte agraviada puede interponer el recurso de revisión ante el Tribunal Colegiado correspondiente.',
    },
    propiedad: {
        aplicacion: 'Regula el régimen de propiedad en México, incluyendo la propiedad privada, la propiedad social (ejidal y comunal) y los bienes del dominio público. Es referencia obligatoria en litigios de expropiación, usucapión y regularización de la tenencia de la tierra.',
        recurso: 'El juicio de amparo indirecto es el medio de impugnación para actos de autoridad que afecten los derechos de propiedad aquí consagrados; en materia agraria, el juicio ante los Tribunales Agrarios precede al amparo.',
        ejemplo: 'Cuando el Estado decreta la expropiación de un bien inmueble sin cubrir la indemnización correspondiente o sin que medie causa de utilidad pública, el propietario puede impugnar el decreto expropiatorio mediante amparo invocando la protección constitucional a la propiedad.',
    },
    electoral: {
        aplicacion: 'Establece los principios rectores del sistema electoral mexicano. El Tribunal Electoral del Poder Judicial de la Federación lo aplica como parámetro de control en la resolución de controversias electorales a nivel federal y local.',
        recurso: 'El juicio de revisión constitucional electoral (JRC), el juicio para la protección de los derechos político-electorales del ciudadano (JDC) y el juicio de inconformidad son los medios especializados de impugnación.',
        ejemplo: 'Si un partido político es sancionado de forma desproporcionada durante un proceso electoral o un ciudadano es privado ilegítimamente de su derecho al voto, pueden acudir al TEPJF invocando los principios constitucionales electorales aquí establecidos.',
    },
    educacion: {
        aplicacion: 'Consagra el derecho a la educación como garantía social y obliga al Estado a impartirla de forma laica, gratuita y obligatoria. Rige la relación entre el Estado, los centros educativos y los educandos, siendo base de numerosas políticas públicas en materia educativa.',
        recurso: 'El amparo indirecto es el medio para impugnar actos de autoridades educativas que vulneren el derecho a la educación; adicionalmente, existen recursos administrativos ante la Secretaría de Educación Pública.',
        ejemplo: 'La negativa injustificada de una escuela pública a inscribir a un menor o la imposición de cuotas obligatorias pueden ser impugnadas mediante amparo argumentando que contravienen el mandato constitucional de educación gratuita.',
    },
    salud: {
        aplicacion: 'Establece el derecho a la protección de la salud como derecho social fundamental. Rige la relación entre el Estado, las instituciones de salud pública y los usuarios. La Suprema Corte ha desarrollado una jurisprudencia progresiva sobre su contenido mínimo esencial.',
        recurso: 'El amparo es el medio de defensa para exigir el acceso a tratamientos médicos, medicamentos o servicios de salud negados por instituciones del sector público.',
        ejemplo: 'Un paciente del IMSS o del ISSSTE al que se niegue un tratamiento médico reconocido y necesario puede acudir al amparo argumentando la violación a su derecho constitucional a la protección de la salud.',
    },
    ejecutivo: {
        aplicacion: 'Define las atribuciones y límites del Poder Ejecutivo Federal. Es el fundamento de la legalidad de los actos presidenciales y del control parlamentario sobre el Ejecutivo. Su interpretación delimita el principio de separación de poderes en México.',
        recurso: 'La controversia constitucional, la acción de inconstitucionalidad y el amparo son los medios para impugnar actos del Ejecutivo que excedan las facultades aquí delimitadas.',
        ejemplo: 'Si el Presidente expide un decreto de emergencia que excede las facultades extraordinarias expresamente conferidas por la Constitución, el Congreso o los particulares afectados pueden acudir a la SCJN mediante los medios de control constitucional correspondientes.',
    },
    general: {
        aplicacion: 'Este precepto forma parte del texto fundamental del orden jurídico mexicano. Su interpretación debe realizarse de conformidad con los principios de supremacía constitucional, legalidad y jerarquía normativa que rigen el sistema jurídico nacional.',
        recurso: 'El juicio de amparo es el medio ordinario de defensa contra actos de autoridad que contravengan lo dispuesto en este artículo; adicionalmente, las controversias constitucionales y acciones de inconstitucionalidad tutelan su observancia en las relaciones entre poderes.',
        ejemplo: 'Las disposiciones de este artículo deben ser observadas por todas las autoridades del país en el ámbito de sus respectivas competencias, y su incumplimiento puede dar lugar a los medios de impugnación constitucionales correspondientes.',
    },
};

export function generarAnalisisJuridico(
    texto: string,
    numero: string,
    etiqueta: string,
    leyNombre: string,
    estadoNombre: string
): string {
    if (!texto || texto.trim().length < 20) {
        return `<p>El contenido de este artículo se encuentra en proceso de integración en nuestra base de datos legislativa.</p>`;
    }

    const tematica = detectarTematica(texto, numero);
    const ctx = temasContexto[tematica] || temasContexto.general;
    const keywords = extractKeywords(texto);
    const keywordsStr = keywords.length > 0
        ? keywords.map(k => `<strong>${k}</strong>`).join(', ')
        : `<strong>disposición constitucional</strong>`;

    // Determinar el tipo de norma
    const esConstitucional = leyNombre.toLowerCase().includes('constitución') || leyNombre.toLowerCase().includes('constitucion');
    const tipoNorma = esConstitucional ? 'constitucional' : 'legal';
    const jerarquia = esConstitucional
        ? 'como norma suprema del ordenamiento jurídico mexicano (artículo 133 CPEUM)'
        : 'dentro de la legislación federal aplicable';

    const textoResumen = texto.length > 300 ? texto.substring(0, 280) + '...' : texto;

    return `
<div class="space-y-6 text-[var(--color-text-muted)] leading-relaxed">

  <div class="bg-slate-800/60 border-l-4 border-emerald-500 pl-5 py-3 rounded-r-xl">
    <p class="text-white/90 font-semibold text-base mb-1">📌 Síntesis del Precepto</p>
    <p class="text-sm">El <strong>${etiqueta}</strong> de la <em>${leyNombre}</em> establece, ${jerarquia}, las bases normativas sobre las cuales se articulan los derechos, obligaciones y competencias relativos a: ${keywordsStr}. Su contenido vincula a todas las autoridades del Estado Mexicano y a los particulares en los términos que la propia norma y su interpretación jurisprudencial establecen.</p>
  </div>

  <div>
    <h4 class="text-white font-bold text-base mb-2 flex items-center gap-2">
      <span class="text-emerald-400">⚖️</span> Aplicación Práctica en el Litigio
    </h4>
    <p class="text-sm">${ctx.aplicacion}</p>
  </div>

  <div>
    <h4 class="text-white font-bold text-base mb-2 flex items-center gap-2">
      <span class="text-emerald-400">🛡️</span> Medios de Defensa Aplicables
    </h4>
    <p class="text-sm">${ctx.recurso} El abogado litigante debe identificar oportunamente cuál es el medio de impugnación idóneo, el plazo de interposición y los requisitos de procedibilidad específicos para la materia de que se trate, a fin de no incurrir en caducidad o improcedencia.</p>
  </div>

  <div class="bg-slate-900/60 p-4 rounded-xl border border-white/5">
    <h4 class="text-white font-bold text-base mb-2 flex items-center gap-2">
      <span class="text-yellow-400">💡</span> Caso Práctico Ilustrativo
    </h4>
    <p class="text-sm">${ctx.ejemplo}</p>
  </div>

  <div>
    <h4 class="text-white font-bold text-base mb-2 flex items-center gap-2">
      <span class="text-emerald-400">📚</span> Interpretación Constitucional
    </h4>
    <p class="text-sm">La interpretación de este precepto debe realizarse de manera sistemática y progresiva, en concordancia con los tratados internacionales de derechos humanos ratificados por México (bloque de convencionalidad), conforme al principio pro persona establecido en el artículo 1° constitucional. La Suprema Corte de Justicia de la Nación ha sostenido que las disposiciones ${tipoNorma}es deben interpretarse de la manera que mejor proteja y amplíe los derechos de las personas, evitando interpretaciones restrictivas que limiten injustificadamente su contenido esencial.</p>
  </div>

  <div>
    <h4 class="text-white font-bold text-base mb-2 flex items-center gap-2">
      <span class="text-emerald-400">🔗</span> Vinculación Sistémica
    </h4>
    <p class="text-sm">Para una comprensión integral de este artículo, el profesional del derecho debe examinarlo de forma conjunta con los preceptos conexos del mismo ordenamiento, así como con las normas secundarias reglamentarias que desarrollan su contenido. La jurisprudencia de la Suprema Corte y de los Tribunales Colegiados de Circuito constituye fuente interpretativa obligatoria que dota de contenido concreto a sus disposiciones abstractas, siendo indispensable su consulta en el sistema IUS de la SCJN y el portal de Jurisprudencia del Semanario Judicial de la Federación.</p>
  </div>

</div>
  `.trim();
}
