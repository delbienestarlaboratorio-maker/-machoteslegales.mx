const fs = require('fs');
const path = require('path');

const SPAN_STYLE = "background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;";
const span = (text) => `<span style="${SPAN_STYLE}">(${text})</span>`;

const templates = [
    {
        id: 'agrario-demanda-inicial-v1',
        slug: 'demanda-agraria-restitucion-tierras',
        title: 'Demanda Agraria Inicial (Restitución de Tierras)',
        legalBasis: ['Arts. 2, 9, 27 CPEUM', 'Arts. 49, 163 Ley Agraria'],
        description: 'Demanda inicial ante Tribunal Unitario Agrario para restitución de superficie parcelaria o comunal.',
        keywords: ['demanda agraria', 'restitución tierras', 'tribunal unitario agrario', 'ejido'],
        html: `<div class="header-v1">
    <h1>Demanda Agraria por Restitución de Tierras</h1>
</div>
<p class="meta-line">${span('Puebla, Puebla')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO DISTRITO ${span('47')}</div>
<p class="indent text-justify"><strong>${span('Juan Pérez Gómez')}</strong>, en mi carácter de ${span('Ejidatario / Comunero')} legalmente reconocido del Núcleo Agrario ${span('San Juan Texmelucan')}, señalando domicilio en ${span('Calle Reforma #10')}, vengo a demandar a <strong>${span('Pedro Díaz Rojas')}</strong> las siguientes prestaciones:</p>
<p class="indent text-justify">a) La desocupación y entrega material de la fracción de tierra correspondiente a la parcela ${span('número 45')}. b) El pago de daños y perjuicios.</p>
<p class="indent text-justify"><strong>HECHOS:</strong> Soy titular de los derechos parcelarios amparados con el certificado ${span('0001234')}. El pasado ${span('10 de enero de 2026')}, el demandado invadió ilegalmente mi parcela alegando falsamente tener derechos sobre la misma.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Promovente')}</div>
</div>`
    },
    {
        id: 'agrario-nulidad-asamblea-v1',
        slug: 'demanda-nulidad-actas-asamblea-ejidal',
        title: 'Demanda de Nulidad de Actas de Asamblea Ejidal',
        legalBasis: ['Arts. 22-31 Ley Agraria'],
        description: 'Juicio para anular acuerdos tomados en asamblea por falta de quórum o formalidades.',
        keywords: ['nulidad asamblea', 'comisariado ejidal', 'ley agraria', 'asamblea ejidatarios'],
        html: `<div class="header-v1">
    <h1>Demanda de Nulidad de Acta de Asamblea</h1>
</div>
<p class="meta-line">${span('Oaxaca, Oax.')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify"><strong>${span('María González López')}</strong>, ejidataria del poblado ${span('Santa Lucía')}, vengo a demandar al <strong>Comisariado Ejidal</strong> la <strong>NULIDAD ABSOLUTA</strong> del acta de asamblea de fecha ${span('15 de febrero de 2026')}.</p>
<p class="indent text-justify">Las determinaciones tomadas en dicha asamblea, consistentes en ${span('asignación de tierras de uso común a terceros')}, carecen de validez, toda vez que no se cumplió con la convocatoria legal estipulada ni con el quórum del artículo 26 de la Ley Agraria.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Ejidataria Demandante')}</div>
</div>`
    },
    {
        id: 'agrario-sucesion-intestamentaria-v1',
        slug: 'demanda-sucesion-agraria',
        title: 'Juicio Sucesorio Agrario Intestamentario',
        legalBasis: ['Arts. 17, 18, 19 Ley Agraria'],
        description: 'Trámite TUA para transmisión de derechos agrarios a sucesores legales por ausencia de lista de sucesión.',
        keywords: ['sucesión agraria', 'intestamentario ejidal', 'derechos parcelarios', 'viuda ejidatario'],
        html: `<div class="header-v1">
    <h1>Demanda de Sucesión Agraria Intestamentaria</h1>
</div>
<p class="meta-line">${span('Toluca, Estado de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify"><strong>${span('Teresa Flores Márquez')}</strong>, en mi carácter de ${span('cónyuge supérstite')} del *de cujus* quien en vida llevó el nombre de ${span('Roberto Sánchez Cruz')}, promuevo diligencias de <strong>Sucesión Intestamentaria Agraria</strong>.</p>
<p class="indent text-justify">El titular fallecido no depositó Lista de Sucesores ante el Registro Agrario Nacional, por lo que, conforme al orden de prelación del artículo 18 de la Ley Agraria, solicito se me reconozca como única y universal heredera de los derechos agrarios de la parcela ${span('12')} del Ejido ${span('Zinacantepec')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Heredera Legal')}</div>
</div>`
    },
    {
        id: 'agrario-repudio-derechos-v1',
        slug: 'escrito-repudio-derechos-agrarios',
        title: 'Escrito de Repudio de Sucesión Agraria',
        legalBasis: ['Art. 18 Ley Agraria'],
        description: 'Renuncia a los derechos agrarios heredados para que pasen al siguiente en el orden de preferencia.',
        keywords: ['repudio derechos', 'renuncia herencia ejidal', 'sucesión agraria'],
        html: `<div class="header-v1">
    <h1>Escrito de Repudio de Derechos Agrarios</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO EN TURNO</div>
<p class="indent text-justify"><strong>${span('Carlos Armando Pérez Ruiz')}</strong>, compareciendo dentro del expediente sucesorio agrario número ${span('123/2026')}, con fundamento en la legislación agraria, expongo:</p>
<p class="indent text-justify">Por medio del presente escrito y por convenir a mis intereses, manifiesto mi voluntad expresa e irrevocable de formular <strong>REPUDIO TOTAL</strong> respecto a los derechos agrarios que pudieran corresponderme por el fallecimiento de mi ${span('padre')}, el C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> ${span('Armando Pérez Díaz')}.</p>
<p class="indent text-justify">Solicito que el derecho pase al siguiente en el orden de prelación establecido por el artículo 18 de la Ley Agraria.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Repudiante')}</div>
</div>`
    },
    {
        id: 'agrario-enajenacion-parcela-v1',
        slug: 'cesion-derechos-agrarios-enajenacion',
        title: 'Contrato de Enajenación de Derechos Parcelarios',
        legalBasis: ['Art. 80 Ley Agraria'],
        description: 'Contrato de compraventa (cesión onerosa) de derechos parcelarios entre ejidatarios o avecindados.',
        keywords: ['compraventa parcela', 'enajenación derechos parcelarios', 'ejido venta'],
        html: `<div class="header-v1">
    <h1>Contrato de Enajenación de Derechos Parcelarios</h1>
</div>
<p class="meta-line">Celebrado en ${span('Cuernavaca, Morelos')}, el ${span('26 de febrero de 2026')}</p>
<p class="indent text-justify">Comparecen por una parte el <strong>ENAJENANTE</strong>, C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> <strong>${span('Juan Pérez Gómez')}</strong>, y por otra el <strong>ADQUIRENTE</strong> (quien cuenta con calidad de ${span('avecindado reconocido')}), C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> <strong>${span('Martín Rojas Solís')}</strong>.</p>
<p class="indent text-justify"><strong>PRIMERA.</strong> El Enajenante cede a título oneroso los derechos de la parcela ${span('No. 45, zona 1, polígono 2')} del Ejido ${span('Acatlipa')}, registrada con el Certificado Parcelario ${span('99887766')}.</p>
<p class="indent text-justify"><strong>SEGUNDA.</strong> El precio pactado es de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(500,000.00)</span> pesos. Ambas partes afirman que se cumplió con el Derecho al Tanto notificando legalmente al cónyuge e hijos del enajenante.</p>
<div class="signature-block" style="margin-top:50px; display:flex; justify-content:space-between;">
    <div class="signature-line" style="width:45%">${span('Enajenante')}</div>
    <div class="signature-line" style="width:45%">${span('Adquirente')}</div>
</div>`
    },
    {
        id: 'agrario-contestacion-demanda-v1',
        slug: 'contestacion-demanda-agraria',
        title: 'Contestación de Demanda Agraria',
        legalBasis: ['Art. 178 Ley Agraria'],
        description: 'Escrito del demandado para contestar prestaciones, oponer excepciones y defensas en juicio agrario.',
        keywords: ['contestación agraria', 'juicio agrario', 'excepciones', 'TUA'],
        html: `<div class="header-v1">
    <h1>Contestación de Demanda Agraria</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify"><strong>${span('Pedro Díaz Rojas')}</strong>, demandado en el expediente ${span('56/2026')}, por propio derecho comparezco para <strong>CONTESTAR LA DEMANDA</strong> interpuesta en mi contra:</p>
<p class="indent text-justify">Niego que el actor tenga derecho a exigir la restitución de la parcela ${span('No. 45')}. Es FALSO el hecho, ya que yo cuento con la posesión pacífica, continua y pública desde hace más de ${span('diez')} años, generando prescripción adquisitiva a mi favor.</p>
<p class="indent text-justify"><strong>EXCEPCIONES:</strong> Opongo la excepción de Prescripción Adquisitiva, y la de Falta de Acción y Derecho.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Demandado')}</div>
</div>`
    },
    {
        id: 'agrario-pruebas-v1',
        slug: 'ofrecimiento-pruebas-agrario',
        title: 'Ofrecimiento de Pruebas en Juicio Agrario',
        legalBasis: ['Arts. 186-188 Ley Agraria'],
        description: 'Ofrecimiento de periciales topográficas, documentales e inspecciones para el desahogo judicial.',
        keywords: ['pruebas agrarias', 'pericial topográfica', 'TUA', 'documentales RAN'],
        html: `<div class="header-v1">
    <h1>Ofrecimiento de Pruebas (Materia Agraria)</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify">En el expediente ${span('123/2026')}, con fundamento en el artículo 186 de la Ley Agraria, ofrezco las siguientes <strong>PRUEBAS</strong> de mi intención:</p>
<p class="indent text-justify">1. <strong>PERICIAL EN TOPOGRAFÍA Y AGRIMENSURA:</strong> A cargo del Ing. ${span('Luis Fuentes')}, para determinar los linderos exactos de la parcela en conflicto afectando el plano interno del ejido.</p>
<p class="indent text-justify">2. <strong>DOCUMENTAL PÚBLICA:</strong> Copia certificada del acta de asamblea de procedal (PROCEDE) relativa al núcleo agrario ${span('San Juan Texmelucan')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Promovente')}</div>
</div>`
    },
    {
        id: 'agrario-recurso-revision-v1',
        slug: 'recurso-revision-tribunal-superior-agrario',
        title: 'Recurso de Revisión Agraria (TSA)',
        legalBasis: ['Arts. 198, 199 Ley Agraria'],
        description: 'Recurso contra sentencias de los TUA que resuelvan restitución de tierras de núcleos de población.',
        keywords: ['revisión agraria', 'TSA', 'recurso impugnación agraria'],
        html: `<div class="header-v1">
    <h1>Recurso de Revisión</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL SUPERIOR AGRARIO</div>
<p class="indent text-justify"><strong>${span('Comisariado Ejidal del poblado X')}</strong>, interponiendo <strong>RECURSO DE REVISIÓN</strong> contra la sentencia definitiva dictada por el TUA Distrito ${span('47')} en el expediente ${span('100/2025')}, que ordena la restitución de tierras comunales a favor del núcleo poblacional.</p>
<p class="indent text-justify"><strong>AGRAVIOS:</strong> La sentencia causa agravio al aplicar erróneamente los planos de dotación presidencial de ${span('1938')}, alterando la realidad topográfica e ignorando los trabajos técnicos informativos del RAN.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Representantes del Órgano Ejidal')}</div>
</div>`
    },
    {
        id: 'agrario-solicitud-ran-v1',
        slug: 'solicitud-certificado-parcelario-ran',
        title: 'Solicitud de Expedición de Certificado Parcelario',
        legalBasis: ['Arts. 16, 56 Ley Agraria'],
        description: 'Solicitud directa al Registro Agrario Nacional (RAN) para emitir el certificado parcelario o de uso común.',
        keywords: ['RAN', 'certificado parcelario', 'título de propiedad ejidal', 'trámite agrario'],
        html: `<div class="header-v1">
    <h1>Solicitud de Certificado Parcelario</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">DELEGADO ESTATAL DEL REGISTRO AGRARIO NACIONAL</div>
<p class="indent text-justify"><strong>${span('María González López')}</strong>, ejidataria reconocida conforme a asamblea de procedal, vengo a solicitar la expedición de mi <strong>Certificado Parcelario</strong> correspondiente a la parcela ${span('número 15')}, del Ejido ${span('San Mateo')}.</p>
<p class="indent text-justify">Acompaño a la presente: 1) Constancia de vigencia de derechos, 2) Acta de asamblea delimitación, y 3) Copia de INE.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Solicitante')}</div>
</div>`
    },
    {
        id: 'agrario-dominio-pleno-v1',
        slug: 'solicitud-cambio-destino-tierras-dominio-pleno',
        title: 'Solicitud de Dominio Pleno (Cambio de Destino)',
        legalBasis: ['Arts. 81, 82 Ley Agraria'],
        description: 'Solicitud formal para convocar a asamblea y desincorporar parcelas ejidales a dominio pleno (propiedad privada).',
        keywords: ['dominio pleno', 'privatizar ejido', 'tierras ejidales', 'propiedad privada'],
        html: `<div class="header-v1">
    <h1>Solicitud de Adopción de Dominio Pleno</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. COMISARIADO EJIDAL DEL POBLADO ${span('SAN MARCOS')}</div>
<p class="indent text-justify"><strong>${span('Juan Pérez Gómez')}</strong>, titular de la parcela ${span('04')}, solicito respetuosamente se incluya en el orden del día de la próxima asamblea de formalidades especiales la solicitud de <strong>ADOPCIÓN DE DOMINIO PLENO</strong> sobre mi parcela.</p>
<p class="indent text-justify">Esto a fin de poder solicitar al RAN la cancelación del certificado parcelario y gestionar la expedición del Título de Propiedad para su inscripción en el Registro Público de la Propiedad, al cumplir el ejido con todos los requisitos del Art. 81 agrario.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Ejidatario Titular')}</div>
</div>`
    },
    {
        id: 'agrario-alegatos-v1',
        slug: 'escrito-alegatos-juicio-agrario',
        title: 'Escrito de Alegatos en Juicio Agrario',
        legalBasis: ['Art. 189 Ley Agraria'],
        description: 'Presentación de conclusiones y argumentación final probatoria en el Tribunal Unitario Agrario.',
        keywords: ['alegatos TUA', 'conclusiones agrarias', 'juicio agrario'],
        html: `<div class="header-v1">
    <h1>Escrito de Alegatos</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify">En autos del expediente ${span('44/2026')}, formulo mis <strong>ALEGATOS</strong>:</p>
<p class="indent text-justify">1. El actor no comprobó el abandono de parcela invocado, pues con la prueba ${span('testimonial de 3 colindantes')}, se demostró que el suscrito cultiva de manera ininterrumpida el predio temporalero.</p>
<p class="indent text-justify">2. Los títulos de derechos parcelarios de mi representada son válidos y superaron en valor probatorio a las constancias simuladas de la contraparte.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Representante o Promovente')}</div>
</div>`
    },
    {
        id: 'agrario-reconocimiento-derechos-v1',
        slug: 'demanda-reconocimiento-derechos-agrarios',
        title: 'Demanda de Reconocimiento de Derechos Agrarios',
        legalBasis: ['Arts. 12-16 Ley Agraria'],
        description: 'Juicio para obligar a la asamblea o comisariado a reconocer calidad de ejidatario o avecindado.',
        keywords: ['reconocimiento', 'avecindado', 'ejidatario judicial', 'derechos agrarios'],
        html: `<div class="header-v1">
    <h1>Demanda de Reconocimiento de Derechos</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify"><strong>${span('Martín Rojas Solís')}</strong>, demandando al Comisariado Ejidal de ${span('Xochitepec')}, reclamo el <strong>Reconocimiento Judicial de mi Calidad de Avecindado / Ejidatario</strong>.</p>
<p class="indent text-justify">Cumplo los requisitos legales de la Ley Agraria al residir ininterrumpidamente en el núcleo agrario por más de un año (${span('desde 2018')}) y estar avalado por las autoridades municipales, sin embargo, la asamblea se ha negado de forma reiterada a emitir mi constancia oficial.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Solicitante')}</div>
</div>`
    },
    {
        id: 'agrario-arrendamiento-medieria-v1',
        slug: 'contrato-arrendamiento-parcela-medieria',
        title: 'Contrato de Mediería o Aparcería (Arrendamiento Parcelario)',
        legalBasis: ['Arts. 45, 79 Ley Agraria'],
        description: 'Contrato tradicional agrario para que un tercero trabaje la tierra a cambio de una participación de cosecha o renta.',
        keywords: ['aparcería', 'mediería', 'rentería tierras', 'renta de parcela', 'contrato agrícola'],
        html: `<div class="header-v1">
    <h1>Contrato de Aparcería/Arrendamiento Rural</h1>
</div>
<p class="meta-line">Celebrado en ${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<p class="indent text-justify">Entre <strong>${span('Juan Pérez Gómez')}</strong> (Propietario / Ejidatario) y <strong>${span('Luis Cárdenas')}</strong> (Aparcero / Arrendatario).</p>
<p class="indent text-justify"><strong>PRIMERA:</strong> El Ejidatario otorga el uso y disfrute temporal de la parcela ${span('08')} amparada con certificado ${span('0001')}, exclusivamente para la siembra de ${span('caña de azúcar')}.</p>
<p class="indent text-justify"><strong>SEGUNDA (Vigencia):</strong> El contrato durará ${span('dos ciclos agrícolas / 2 años')}, sin exceder los 30 años que marca la ley.</p>
<p class="indent text-justify"><strong>TERCERA (Contraprestación):</strong> El Aparcero entregará por ciclo agrícola la cantidad de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(20,000.00)</span> MXN, o el ${span('30%')} de la cosecha obtenida.</p>
<div class="signature-block" style="margin-top:50px; display:flex; justify-content:space-between;">
    <div class="signature-line" style="width:45%">${span('Propietario')}</div>
    <div class="signature-line" style="width:45%">${span('Aparcero')}</div>
</div>`
    },
    {
        id: 'agrario-usufructo-parcela-v1',
        slug: 'contrato-usufructo-parcela-ejidal',
        title: 'Contrato de Usufructo de Parcela Ejidal',
        legalBasis: ['Art. 79 Ley Agraria'],
        description: 'Contrato para ceder el usufructo (ganancias y uso) de una parcela por tiempo determinado constituyendo una garantía para el acreedor (usufructuario).',
        keywords: ['usufructo parcela', 'garantía de siembra', 'terrenos ejidales'],
        html: `<div class="header-v1">
    <h1>Contrato de Usufructo de Parcela Ejidal</h1>
</div>
<p class="meta-line">Otorgado en ${span('Zacatecas, Zacatecas')}, el ${span('26 de febrero de 2026')}</p>
<p class="indent text-justify">El <strong>EJIDATARIO NUDO PROPIETARIO</strong>, ${span('María González López')}, otorga a favor del <strong>USUFRUCTUARIO</strong>, ${span('Agroindustrias del Norte S.A.')}, el usufructo temporal de la parcela ${span('10')}.</p>
<p class="indent text-justify"><strong>CONDICIONES:</strong> El usufructo tendrá vigencia de ${span('5 años')}, durante los cuales el usufructuario asume los riesgos propios de la siembra y retiene la totalidad de las ganancias en compensación a ${span('préstamo refaccionario otorgado previamente')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firmas de Voluntad')}</div>
</div>`
    },
    {
        id: 'agrario-audiencia-procuraduria-v1',
        slug: 'solicitud-audiencia-procuraduria-agraria',
        title: 'Solicitud de Asesoría / Audiencia ante Procuraduría Agraria',
        legalBasis: ['Arts. 134-136 Ley Agraria'],
        description: 'Petición a la Procuraduría Agraria para solicitar representación jurídica gratuita o asesoría.',
        keywords: ['procuraduría agraria', 'representación agraria gratuita', 'visitador agrario'],
        html: `<div class="header-v1">
    <h1>Solicitud de Asesoría y Representación</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">DELEGADO DE LA PROCURADURÍA AGRARIA</div>
<p class="indent text-justify"><strong>${span('Juan Pérez Gómez')}</strong>, sujeto agrario, con domicilio en ${span('Mérida, Yucatán')}, solicito de la Institución a su digno cargo la <strong>ASESORÍA, CONCILIACIÓN y/o REPRESENTACIÓN JURÍDICA GRATUITA</strong> institucional.</p>
<p class="indent text-justify">El motivo es el conflicto consistente en: ${span('Despojo de mi parcela por parte de un vecino colindante que movió las mojoneras')}. Acompaño copia de mi certificado parcelario e identificación oficial.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Sujeto Agrario')}</div>
</div>`
    },
    {
        id: 'agrario-queja-comisariado-v1',
        slug: 'queja-contra-comisariado-ejidal',
        title: 'Escrito de Queja contra Comisariado Ejidal',
        legalBasis: ['Arts. 32, 33 Ley Agraria'],
        description: 'Documento firmado por el Consejo de Vigilancia o asambleístas para destituir o amonestar al comisariado por abusos.',
        keywords: ['queja comisariado ejidal', 'destitución comisariado', 'malos manejos', 'consejo vigilancia'],
        html: `<div class="header-v1">
    <h1>Queja contra Miembros del Comisariado Ejidal</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">CONSEJO DE VIGILANCIA / PROCURADURÍA AGRARIA</div>
<p class="indent text-justify">Los ejidatarios firmantes, representando más del 20% del núcleo agrario ${span('Tepotzotlán')}, presentamos formal queja contra el C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> ${span('Pedro Díaz Rojas')}, Presidente del Comisariado.</p>
<p class="indent text-justify"><strong>MOTIVOS:</strong> Ha incurrido en omisiones a la Ley Agraria al ${span('negarse a rendir cuentas de las aportaciones recibidas y no convocar a asambleas durante más de 6 meses')}. Solicitamos la instalación de una Asamblea Extraordinaria para su remoción y auditoría.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Ejidatarios Conformantes')}</div>
</div>`
    },
    {
        id: 'agrario-convocatoria-asamblea-v1',
        slug: 'convocatoria-asamblea-ejidal',
        title: 'Convocatoria a Asamblea General de Ejidatarios',
        legalBasis: ['Arts. 24, 25 Ley Agraria'],
        description: 'Pizarrón formal ejidal, modelo de citatorio con primera o segunda convocatoria y orden del día.',
        keywords: ['convocatoria asamblea', 'asamblea ejidatarios', 'orden del día ejido'],
        html: `<div class="header-v1">
    <h1>Convocatoria de Asamblea Ejidal</h1>
    <p class="subtitle-v1">${span('Primera / Segunda')} Convocatoria</p>
</div>
<p class="meta-line">Fecha de Emisión: ${span('26 de febrero de 2026')}</p>
<p class="indent text-justify">El Comisariado Ejidal de ${span('San Mateo')}, con fundamento en el artículo 24 de la Ley Agraria, <strong>CONVOCA</strong> a todos los ejidatarios legalmente reconocidos a la <strong>ASAMBLEA ORDINARIA</strong> que se verificará el día ${span('15 de marzo de 2026')} a las ${span('10:00')} horas, en ${span('la casa ejidal / salón usos múltiples')}, bajo el siguiente:</p>
<div class="section-title">ORDEN DEL DÍA</div>
<p class="indent text-justify">1. Lista de asistencia. 2. Aprobación y cuentas financieras. 3. ${span('Análisis de contratos y apoyos federales')}. 4. Clausura y firma del acta.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Comisariado Ejidal (Presidente, Secretario y Tesorero)')}</div>
</div>`
    },
    {
        id: 'agrario-acta-conciliacion-v1',
        slug: 'acta-conciliacion-agraria',
        title: 'Acta de Conciliación Agraria',
        legalBasis: ['Arts. 185-186 Ley Agraria'],
        description: 'Convenio formal entre partes en conflicto agrario (linderos, deudas, usufructos) ante Procuraduría Agraria para ser elevada a cosa juzgada.',
        keywords: ['conciliación agraria', 'convenio ejidatarios', 'fin de conflicto agrario'],
        html: `<div class="header-v1">
    <h1>Acta de Conciliación Agraria</h1>
</div>
<p class="meta-line">En ${span('Ciudad de México')}, el día ${span('26 de febrero de 2026')}</p>
<p class="indent text-justify">Con la intervención institucional del Visitador Agrario ${span('Lic. Francisco Sánchez Torres')}, comparecen voluntariamente <strong>${span('Juan Pérez Gómez')}</strong> (Parte A) y <strong>${span('María González López')}</strong> (Parte B) para suscribir el presente Convenio de Conciliación:</p>
<p class="indent text-justify"><strong>ACUERDOS:</strong><br>1. Ambas partes reconocen como linderos definitivos entre sus parcelas la mojonera natural ubicada en ${span('la loma norte')}.<br>2. Se comprometen a respetar pacíficamente los sembradíos actuales.<br>3. Solicitan al TUA se eleve a categoría de sentencia ejecutoriada.</p>
<div class="signature-block" style="margin-top:50px; display:flex; justify-content:space-between;">
    <div class="signature-line" style="width:45%">${span('Parte A')}</div>
    <div class="signature-line" style="width:45%">${span('Parte B')}</div>
</div>`
    },
    {
        id: 'agrario-prescripcion-adquisitiva-v1',
        slug: 'demanda-prescripcion-adquisitiva-agraria',
        title: 'Demanda de Prescripción Adquisitiva Agraria',
        legalBasis: ['Art. 48 Ley Agraria'],
        description: 'Juicio para regularizar tierras que han sido poseídas en calidad de ejidatario de buena fe por 5 años o mala fe por 10 años.',
        keywords: ['prescripción agraria', 'regularizar parcela', 'prescripción adquisitiva', 'usucapión agraria'],
        html: `<div class="header-v1">
    <h1>Juicio de Prescripción Adquisitiva Agraria</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. TRIBUNAL UNITARIO AGRARIO</div>
<p class="indent text-justify"><strong>${span('Pedro Díaz Rojas')}</strong>, demandando al C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> Titular Registral ${span('Juan Pérez')}, reclamo el <strong>RECONOCIMIENTO DE DERECHOS POR PRESCRIPCIÓN POSITIVA</strong> sobre la parcela número ${span('22')}.</p>
<p class="indent text-justify"><strong>HECHOS:</strong> He detentado la posesión de la parcela citada de manera pacífica, continua, pública y en concepto de titular de derechos (con base en el contrato de enajenación original) por más de ${span('cinco')} años (de buena fe), cultivándola ininterrumpidamente, cumpliendo la hipótesis del Art. 48 de la Ley Agraria y demandando la expedición de un nuevo certificado.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Promovente Posesionario')}</div>
</div>`
    },
    {
        id: 'agrario-constancia-vigencia-v1',
        slug: 'solicitud-constancia-vigencia-derechos-ran',
        title: 'Solicitud Constancia de Vigencia de Derechos (RAN)',
        legalBasis: ['Art. 152 Ley Agraria'],
        description: 'Solicitud simple pero obligatoria para juicios, donde se pide al RAN historial del campesino.',
        keywords: ['vigencia derechos', 'historial RAN', 'registro ejidatario'],
        html: `<div class="header-v1">
    <h1>Solicitud de Constancia de Vigencia de Derechos Agrarios</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">DELEGACIÓN DEL REGISTRO AGRARIO NACIONAL</div>
<p class="indent text-justify"><strong>${span('Katia Ruiz Sánchez')}</strong>, ejidataria del poblado ${span('Milpa Alta')}, solicito de la manera más atenta se realice una búsqueda en el archivo registral y se expida a mi nombre <strong>CONSTANCIA DE VIGENCIA DE DERECHOS</strong>.</p>
<p class="indent text-justify">Lo anterior resulta indispensable para continuar con el desahogo de prevención en el Tribunal y comprobar la capacidad agraria de mi representado al momento del fallecimiento. Anexo recibo de pago de derechos fiscales correspondientes.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Solicitante')}</div>
</div>`
    }
];

function process() {
    const v1Dir = path.join(__dirname, '..', 'src', 'data', 'templates', 'v1', 'agrario');
    if (!fs.existsSync(v1Dir)) {
        fs.mkdirSync(v1Dir, { recursive: true });
    }

    const indexSnippets = [];

    templates.forEach(t => {
        // Write HTML file
        const safeHtml = `<!DOCTYPE html>
<html lang="es-MX">
<head>
    <meta charset="UTF-8">
</head>
<body>
${t.html}
</body>
</html>`;
        const filePath = path.join(v1Dir, `${t.slug}.html`);
        fs.writeFileSync(filePath, safeHtml, 'utf8');

        // Make typescript object string
        const snippet = `    {
        id: '${t.id}',
        slug: '${t.slug}',
        title: '${t.title}',
        specialty: 'agrario',
        tier: 'v1',
        file: 'v1/agrario/${t.slug}.html',
        price: 0,
        priceLabel: 'Gratis',
        legalBasis: ${JSON.stringify(t.legalBasis)},
        description: '${t.description}',
        keywords: ${JSON.stringify(t.keywords)},
    },`;
        indexSnippets.push(snippet);
    });

    const arrayString = `\nexport const templatesV1_agrario: Template[] = [\n${indexSnippets.join('\n')}\n];\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'templates-agrario-export.ts'), arrayString);
    console.log("Generados 20 HTML agrarios y el archivo export.");
}

process();
