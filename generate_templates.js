const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, 'src/data/templates/v2');

const tpl = (title, subtitle, desc) => `<div class="header-v2">
<span class="tier-badge">PROFESIONAL</span>
<h1>${title}</h1>
<p class="subtitle-v2">${subtitle}</p>
</div>

<p class="meta-line">{{ ciudad | default("Ciudad") }}, {{ estado | default("Estado") }}, a {{ fecha_actual_texto | default("__ de ________ de 20__") }}</p>

<p class="indent text-justify">${desc}</p>

<div class="section-title">FUNDAMENTO LEGAL</div>
<p class="indent text-justify">El presente documento se fundamenta en ${subtitle} y demás disposiciones aplicables del marco jurídico mexicano vigente.</p>

<div class="section-title">DATOS DEL PROMOVENTE</div>
<p class="indent text-justify"><strong>{{ nombre_promovente | default("NOMBRE COMPLETO") }}</strong>, {{ nacionalidad | default("mexicano(a)") }}, mayor de edad, con domicilio en {{ domicilio | default("_________________________________") }}, identificándose con {{ identificacion | default("credencial para votar (INE)") }} número {{ numero_id | default("_______________") }}.</p>

<div class="section-title">HECHOS</div>
<p class="indent text-justify"><strong>PRIMERO.</strong> — {{ hecho_1 | default("Relacionar los hechos que motivan la presentación de este documento, indicando fechas, lugares y circunstancias relevantes.") }}</p>
<p class="indent text-justify"><strong>SEGUNDO.</strong> — {{ hecho_2 | default("Describir las consecuencias jurídicas y fácticas de los hechos narrados.") }}</p>
<p class="indent text-justify"><strong>TERCERO.</strong> — {{ hecho_3 | default("Señalar los elementos de prueba o indicios que soportan la pretensión.") }}</p>

<div class="section-title">PETICIONES</div>
<p class="indent text-justify"><strong>PRIMERA.</strong> — Tener por presentado el presente escrito en los términos solicitados.<br>
<strong>SEGUNDA.</strong> — Dar trámite conforme a derecho corresponda.<br>
<strong>TERCERA.</strong> — {{ peticion_especifica | default("Resolver favorablemente la pretensión del promovente.") }}</p>

<p class="indent text-justify">PROTESTO LO NECESARIO.</p>

<div class="signature-block" style="margin-top:50px;"><div class="signature-line">{{ nombre_promovente | default("EL PROMOVENTE") }}</div></div>

<div class="confidencialidad-v2"><strong>AVISO:</strong> Este documento es una plantilla profesional de Machotes Legales. Su uso no sustituye la asesoría de un abogado titulado.</div>`;

const files = [
    ['penal/acuerdo_reparatorio.html', 'Acuerdo Reparatorio', 'Arts. 186-190 CNPP', 'Acuerdo reparatorio entre víctima e imputado para solucionar el conflicto penal de forma alternativa.'],
    ['penal/querella_abuso_confianza.html', 'Querella por Abuso de Confianza', 'Arts. 382-385 CPF', 'Querella penal por el delito de abuso de confianza con cuantificación del daño patrimonial.'],
    ['penal/denuncia_lesiones.html', 'Denuncia por Lesiones', 'Arts. 288-293 CPF', 'Denuncia por el delito de lesiones con clasificación de gravedad y solicitud de dictamen médico.'],
    ['penal/denuncia_violencia_familiar.html', 'Denuncia por Violencia Familiar', 'Art. 343 Bis CPF', 'Denuncia por violencia familiar con solicitud de órdenes de protección y medidas cautelares.'],
    ['penal/querella_generica.html', 'Querella Penal Genérica', 'Arts. 221-225 CNPP', 'Formato de querella penal adaptable a cualquier delito perseguible por querella de parte.'],
    ['penal/solicitud_reparacion_dano.html', 'Solicitud de Reparación del Daño', 'Art. 20 Apt C CPEUM', 'Solicitud de reparación integral del daño como derecho constitucional de la víctima.'],
    ['civil/contestacion_demanda.html', 'Contestación de Demanda Civil', 'Arts. 260-271 CFPC', 'Contestación de demanda con excepciones perentorias y dilatorias.'],
    ['civil/ofrecimiento_pruebas.html', 'Ofrecimiento de Pruebas', 'Arts. 281-326 CFPC', 'Escrito de ofrecimiento de pruebas en juicio civil ordinario.'],
    ['civil/alegatos.html', 'Alegatos de Buena Prueba', 'Art. 393 CFPC', 'Escrito de alegatos con análisis de pruebas desahogadas.'],
    ['civil/contrato_arrendamiento_v2.html', 'Contrato de Arrendamiento Blindado', 'Arts. 2398-2496 CCF', 'Contrato de arrendamiento con cláusulas blindadas de protección para el arrendador.'],
    ['familiar/divorcio_incausado_con_hijos.html', 'Divorcio Incausado con Hijos Menores', 'Arts. 266-291 CCF', 'Demanda de divorcio incausado con propuesta de custodia, pensión y régimen de convivencia.'],
    ['familiar/demanda_divorcio_incausado_v2.html', 'Divorcio Incausado Versión Completa', 'Arts. 266-291 CCF', 'Demanda de divorcio incausado con jurisprudencia SCJN sobre libre desarrollo de la personalidad.'],
    ['familiar/demanda_custodia.html', 'Demanda de Custodia y Guarda', 'Arts. 411-424 CCF', 'Demanda de guarda y custodia fundamentada en el Interés Superior del Niño.'],
    ['familiar/solicitud_adopcion.html', 'Solicitud de Adopción', 'Arts. 390-401 CCF', 'Solicitud de adopción plena con requisitos documentales.'],
    ['familiar/reduccion_pension.html', 'Incidente de Reducción de Pensión', 'Arts. 311, 317 CCF', 'Incidente de reducción de pensión alimenticia por cambio de circunstancias económicas.'],
    ['laboral/demanda_pago_salarios.html', 'Demanda por Falta de Pago de Salarios', 'Arts. 82, 84, 87 LFT', 'Demanda laboral por incumplimiento de pago de salarios y prestaciones.'],
    ['laboral/demanda_reinstalacion.html', 'Demanda de Reinstalación', 'Art. 48 LFT', 'Demanda de reinstalación laboral solicitando reincorporación al puesto.'],
    ['laboral/demanda_rescision.html', 'Demanda por Rescisión Imputable al Patrón', 'Art. 51 LFT', 'Demanda de rescisión de relación laboral por causas imputables al patrón.'],
    ['mercantil/acta_asamblea_ordinaria.html', 'Acta de Asamblea General Ordinaria', 'Arts. 178-184 LGSM', 'Acta de asamblea general ordinaria de accionistas con orden del día.'],
    ['mercantil/demanda_ejecutiva_mercantil_v2.html', 'Demanda Ejecutiva Mercantil Completa', 'Arts. 1391-1414 Código de Comercio', 'Demanda ejecutiva mercantil con tabla de prestaciones y control de usura.'],
    ['fiscal/recurso_revocacion.html', 'Recurso de Revocación Fiscal', 'Arts. 116-128 CFF', 'Recurso de revocación ante el SAT contra resoluciones fiscales.'],
    ['fiscal/solicitud_condonacion.html', 'Solicitud de Condonación de Multas', 'Art. 74 CFF', 'Solicitud de condonación de multas fiscales ante el SAT.'],
];

let created = 0;
files.forEach(([file, title, sub, desc]) => {
    const fp = path.join(base, file);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    if (!fs.existsSync(fp)) {
        fs.writeFileSync(fp, tpl(title, sub, desc), 'utf8');
        console.log('Created: ' + file);
        created++;
    } else {
        console.log('EXISTS: ' + file);
    }
});
console.log('Done! Created ' + created + ' new files.');
