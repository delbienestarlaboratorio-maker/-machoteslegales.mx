const fs = require('fs');
const path = require('path');

const SPAN_STYLE = "background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;";
const span = (text) => `<span style="${SPAN_STYLE}">(${text})</span>`;

const templates = [
    {
        id: 'admin-derecho-peticion-v1',
        slug: 'escrito-derecho-peticion',
        title: 'Escrito de Petición (Art. 8 Constitucional)',
        legalBasis: ['Art. 8 CPEUM', 'Arts. 1, 15 LFPA'],
        description: 'Escrito formal para ejercer el derecho de petición ante cualquier autoridad administrativa.',
        keywords: ['derecho de petición', 'escrito libre', 'oficio autoridad', 'artículo 8 constitucional'],
        html: `<div class="header-v1">
    <h1>Escrito de Petición</h1>
    <p class="subtitle-v1">Artículo 8° de la Constitución Política de los Estados Unidos Mexicanos</p>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> ${span('TITULAR DE LA DEPENDENCIA')}</div>
<p class="indent text-justify"><strong>${span('María González López')}</strong>, promoviendo por mi propio derecho, señalando como domicilio para oír y recibir notificaciones el ubicado en ${span('Av. Insurgentes Sur 1602, CDMX, C.P. 03940')}, ante Usted, con el debido respeto comparezco y expongo:</p>
<p class="indent text-justify">Con fundamento en el <strong>artículo 8° de la Constitución Política de los Estados Unidos Mexicanos</strong>, presento formal petición en forma escrita, pacífica y respetuosa, consistente en: <strong>${span('solicitar información detallada sobre el estatus del trámite folio 12345')}</strong>.</p>
<p class="indent text-justify">Acompaño los siguientes documentos para sustentar mi petición: ${span('Copia de identificación oficial y recibo de trámite previo')}.</p>
<p class="indent text-justify">Por lo expuesto, le solicito dicte acuerdo escrito recaído a la presente petición y lo haga de mi conocimiento en breve término.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('LA Peticionaria')}</div>
</div>`
    },
    {
        id: 'admin-recurso-revision-v1',
        slug: 'recurso-revision-lfpa',
        title: 'Recurso de Revisión Administrativa (LFPA)',
        legalBasis: ['Arts. 83-96 LFPA'],
        description: 'Recurso de revisión contra actos de autoridades de la Administración Pública Federal.',
        keywords: ['recurso de revisión', 'lfpa', 'impugnación administrativa'],
        html: `<div class="header-v1">
    <h1>Recurso de Revisión Administrativa</h1>
    <p class="subtitle-v1">Ley Federal de Procedimiento Administrativo</p>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> ${span('TITULAR QUE EMITIÓ EL ACTO')}</div>
<p class="indent text-justify"><strong>${span('Inversiones del Norte S.A. de C.V.')}</strong>, a través de mi representante legal ${span('Lic. Francisco Sánchez Torres')}, con RFC ${span('INOR120101AB3')}, señalando domicilio en ${span('Col. Centro, CDMX')}, vengo a interponer <strong>RECURSO DE REVISIÓN</strong> en contra de la resolución ${span('DG/123/2026')}, notificada el ${span('15 de enero de 2026')}.</p>
<p class="indent text-justify"><strong>AGRAVIOS:</strong> El acto impugnado carece de fundamentación y motivación adecuada, vulnerando el artículo 16 Constitucional y 3 de la LFPA, toda vez que ${span('no detalla las causas reales de la clausura')}.</p>
<p class="indent text-justify"><strong>PRUEBAS:</strong> Se ofrecen: a) Documental pública consistente en el acto impugnado. b) Pericial en materia de ${span('arquitectura')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Representante Legal')}</div>
</div>`
    },
    {
        id: 'admin-recurso-inconformidad-v1',
        slug: 'recurso-inconformidad',
        title: 'Recurso de Inconformidad',
        legalBasis: ['Ley de Adquisiciones, Arrendamientos y Servicios del Sector Público'],
        description: 'Recurso contra fallos en procedimientos de licitación pública.',
        keywords: ['inconformidad', 'licitación pública', 'LAASSP'],
        html: `<div class="header-v1">
    <h1>Recurso de Inconformidad</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">SECRETARÍA DE LA FUNCIÓN PÚBLICA / ÓRGANO INTERNO DE CONTROL</div>
<p class="indent text-justify"><strong>${span('Comercializadora Norteña S.A. de C.V.')}</strong>, compareciendo e interponiendo <strong>RECURSO DE INCONFORMIDAD</strong> contra el fallo de la Licitación Pública ${span('LA-00123-2026')}, publicado el ${span('20 de febrero de 2026')} por la convocante ${span('IMSS')}.</p>
<p class="indent text-justify"><strong>HECHOS:</strong> Mi representada presentó propuesta técnica y económica solvente. Sin embargo, fue desechada ilegalmente bajo el argumento de ${span('ausencia de un requisito no previsto en bases')}.</p>
<p class="indent text-justify"><strong>AGRAVIOS:</strong> Se vulneran los principios de libre participación y economía, contraviniendo el artículo 134 Constitucional.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Representante Legal')}</div>
</div>`
    },
    {
        id: 'admin-nulidad-federal-v1',
        slug: 'juicio-nulidad-federal',
        title: 'Demanda de Juicio de Nulidad Federal',
        legalBasis: ['Ley Federal de Procedimiento Contencioso Administrativo'],
        description: 'Demanda de nulidad ante el Tribunal Federal de Justicia Administrativa (TFJA).',
        keywords: ['juicio de nulidad', 'tfja', 'contencioso administrativo'],
        html: `<div class="header-v1">
    <h1>Juicio Contencioso Administrativo Federal</h1>
    <p class="subtitle-v1">Tribunal Federal de Justicia Administrativa</p>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. SALA REGIONAL EN TURNO DEL TFJA</div>
<p class="indent text-justify"><strong>${span('Carlos Armando Pérez Ruiz')}</strong>, promoviendo demanda de <strong>NULIDAD</strong> en contra de la resolución administrativa con número de folio ${span('102938')}, emitida por ${span('PROFECO')}, mediante la cual se me impone una multa por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(50,000.00)</span>.</p>
<p class="indent text-justify">Se solicita la <strong>SUSPENSIÓN</strong> del acto impugnado para evitar el cobro coactivo, ofreciendo garantizar el interés fiscal mediante ${span('póliza de fianza')}.</p>
<p class="indent text-justify"><strong>CONCEPTOS DE IMPUGNACIÓN:</strong> La autoridad emisora es incompetente materialmente para sancionar ${span('la conducta descrita en el acta')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Actor')}</div>
</div>`
    },
    {
        id: 'admin-queja-servidor-publico-v1',
        slug: 'queja-servidor-publico',
        title: 'Queja contra Servidor Público',
        legalBasis: ['Ley General de Responsabilidades Administrativas'],
        description: 'Denuncia por faltas administrativas u omisiones de servidores públicos ante OIC.',
        keywords: ['queja', 'servidor público', 'OIC', 'responsabilidad administrativa'],
        html: `<div class="header-v1">
    <h1>Queja / Denuncia Administrativa</h1>
</div>
<p class="meta-line">${span('Monterrey, Nuevo León')}, a ${span('15 de marzo de 2026')}</p>
<div class="section-title">ÓRGANO INTERNO DE CONTROL EN ${span('LA SECRETARÍA DE MOVILIDAD')}</div>
<p class="indent text-justify"><strong>${span('María González López')}</strong>, presentando <strong>QUEJA FORMAL</strong> en contra del C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> ${span('Roberto Fuentes Herrera')}, en su carácter de ${span('Inspector o Funcionario')}, por actos que constituyen faltas administrativas consistentes en ${span('solicitar dádivas a cambio de agilizar un trámite')}.</p>
<p class="indent text-justify"><strong>CIRCUNSTANCIAS:</strong> El día ${span('10 de marzo de 2026')}, en las oficinas de ${span('Tránsito Municipal')}, el servidor público mencionado me indicó que ${span('debía pagar una tarifa no oficial')}. Acompaño como pruebas ${span('grabaciones, testigos o documentos')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('La Denunciante')}</div>
</div>`
    },
    {
        id: 'admin-licencia-funcionamiento-v1',
        slug: 'solicitud-licencia-funcionamiento',
        title: 'Solicitud de Licencia de Funcionamiento',
        legalBasis: ['Ley de Establecimientos Mercantiles'],
        description: 'Formato libre de solicitud para apertura y funcionamiento de establecimientos.',
        keywords: ['licencia de funcionamiento', 'apertura negocio', 'aviso mercantil'],
        html: `<div class="header-v1">
    <h1>Solicitud de Licencia de Funcionamiento</h1>
</div>
<p class="meta-line">A ${span('26 de febrero de 2026')}</p>
<div class="section-title">DIRECCIÓN DE PADRÓN Y LICENCIAS / DESARROLLO ECONÓMICO</div>
<p class="indent text-justify"><strong>${span('Lic. Francisco Sánchez Torres')}</strong>, representante legal de ${span('La Cafetería Bonita S.A. de C.V.')}, requiero formal <strong>LICENCIA DE FUNCIONAMIENTO / AVISO DE APERTURA</strong> para el giro comercial denominado ${span('Cafetería con venta de alimentos preparados')}, ubicado en ${span('Av. Juárez 100, Col. Centro')}.</p>
<p class="indent text-justify">Acompaño los dictámenes de: Protección Civil (Folio ${span('PC-901')}), Uso de Suelo (Folio ${span('US-112')}) y Contrato de Arrendamiento.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma del Titular o Representante')}</div>
</div>`
    },
    {
        id: 'admin-contestacion-requerimiento-v1',
        slug: 'contestacion-requerimiento-autoridad',
        title: 'Contestación a Requerimiento Administrativo',
        legalBasis: ['Art. 8 CPEUM', 'Arts. 1, 15 LFPA'],
        description: 'Escrito de desahogo y cumplimiento a requerimientos formulados por la autoridad.',
        keywords: ['contestación', 'requerimiento', 'desahogo de vista'],
        html: `<div class="header-v1">
    <h1>Desahogo de Requerimiento</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">AUTORIDAD QUE REQUIERE: ${span('DIRECCIÓN DE OBRAS PÚBLICAS')}</div>
<p class="indent text-justify">En relación a su requerimiento folio ${span('REQ-405/2026')} notificado el ${span('20 de febrero de 2026')}, <strong>${span('María González López')}</strong> en tiempo y forma comparece para <strong>DESAHOGAR</strong> la vista en los siguientes términos:</p>
<p class="indent text-justify">Se remite la documentación solicitada consistente en ${span('planos arquitectónicos actualizados y permiso de alineamiento')}, dando por cumplida la prevención u observación decretada.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    },
    {
        id: 'admin-solicitud-inai-v1',
        slug: 'solicitud-informacion-publica-inai',
        title: 'Solicitud de Acceso a la Información (Transparencia)',
        legalBasis: ['Ley General de Transparencia y Acceso a la Información Pública'],
        description: 'Formato libre para solicitar información pública gubernamental sin necesidad de interés jurídico.',
        keywords: ['transparencia', 'información pública', 'INAI', 'PNT'],
        html: `<div class="header-v1">
    <h1>Solicitud de Acceso a la Información Pública</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">UNIDAD DE TRANSPARENCIA DE ${span('LA SECRETARÍA DE SALUD')}</div>
<p class="indent text-justify">Por medio del presente y fundamentado en el artículo 6 Constitucional, solicito acceso a la siguiente información pública: <strong>${span('Contratos adjudicados para la compra de material médico en 2025 y sus montos')}</strong>.</p>
<p class="indent text-justify">Modalidad de entrega requerida: ${span('Archivo electrónico en formato Excel enviado a mi correo')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma (Opcional)')}</div>
</div>`
    },
    {
        id: 'admin-recurso-revision-transparencia-v1',
        slug: 'recurso-revision-transparencia',
        title: 'Recurso de Revisión en Transparencia',
        legalBasis: ['Ley General de Transparencia Art. 142'],
        description: 'Impugnación por negativa de información o información incompleta por parte del Sujeto Obligado.',
        keywords: ['INAI', 'recurso revisión transparencia', 'información oculta'],
        html: `<div class="header-v1">
    <h1>Recurso de Revisión de Transparencia</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">INSTITUTO NACIONAL DE TRANSPARENCIA (INAI) / ÓRGANO GARANTE ESTATAL</div>
<p class="indent text-justify">Impugno la respuesta del sujeto obligado ${span('Secretaría de Educación Pública')} a mi solicitud folio ${span('00012345678')}, por considerar que la información fue ${span('clasificada indebidamente como reservada / entregada de forma incompleta')}.</p>
<p class="indent text-justify"><strong>AGRAVIO:</strong> La clasificación de reserva vulnera el principio de máxima publicidad y no superó la prueba de daño conforme a la Ley.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Recurrente')}</div>
</div>`
    },
    {
        id: 'admin-alegatos-procedimiento-v1',
        slug: 'alegatos-procedimiento-administrativo',
        title: 'Alegatos en Procedimiento Administrativo',
        legalBasis: ['Art. 39 LFPA'],
        description: 'Escrito final de alegatos previo a que la autoridad dicte resolución administrativa.',
        keywords: ['alegatos administrativos', 'cierre de instrucción', 'LFPA'],
        html: `<div class="header-v1">
    <h1>Escrito de Alegatos</h1>
</div>
<p class="meta-line">${span('Guadalajara, Jalisco')}, a ${span('10 de abril de 2026')}</p>
<div class="section-title">AUTORIDAD SUSTANCIADORA: ${span('DIRECCIÓN DE ECOLOGÍA MUNICIPAL')}</div>
<p class="indent text-justify">Habiendo concluido el periodo probatorio del expediente ${span('ECO-99/2026')}, presento los alegatos que a mi derecho convienen:</p>
<p class="indent text-justify"><strong>PRIMERO.-</strong> Que ha quedado desvirtuada la infracción imputada mediante la prueba ${span('pericial en materia de sonido')}, la cual demostró que no excedí los decibeles permitidos.</p>
<p class="indent text-justify"><strong>SEGUNDO.-</strong> Se solicita se dicte resolución absolutoria sin imposición de multas ni clausuras.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    },
    {
        id: 'admin-revocacion-admin-v1',
        slug: 'recurso-revocacion-administrativa',
        title: 'Recurso de Revocación Administrativa',
        legalBasis: ['Ley de Procedimiento Administrativo Local'],
        description: 'Recurso ordinario contra actos de autoridades estatales o municipales (clausuras, retenciones).',
        keywords: ['revocación administrativa', 'impugnación municipal', 'multa municipal'],
        html: `<div class="header-v1">
    <h1>Recurso de Revocación Administrativa</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. AYUNTAMIENTO DE ${span('ZAPOPAN')} / TESORERÍA MUNICIPAL</div>
<p class="indent text-justify">Vengo a interponer <strong>RECURSO DE REVOCACIÓN</strong> en contra de la boleta de infracción folio ${span('998877')}, emitida por ${span('Reglamentos Municipales')}.</p>
<p class="indent text-justify">El acto es nulo de pleno derecho por omitir citar los fundamentos legales exactos que tipifican la infracción cometida, violando el artículo 16 Constitucional.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Promovente')}</div>
</div>`
    },
    {
        id: 'admin-responsabilidad-patrimonial-v1',
        slug: 'demanda-responsabilidad-patrimonial-estado',
        title: 'Demanda de Responsabilidad Patrimonial del Estado',
        legalBasis: ['Ley Federal de Responsabilidad Patrimonial del Estado', 'Art. 109 Constitucional'],
        description: 'Ramo administrativo. Indemnización por daños causados por actividad administrativa irregular.',
        keywords: ['responsabilidad patrimonial', 'indemnización estado', 'negligencia médica pública', 'bache daño auto'],
        html: `<div class="header-v1">
    <h1>Reclamación de Responsabilidad Patrimonial</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">${span('SECRETARÍA DE OBRAS / DEPENDENCIA RESPONSABLE')}</div>
<p class="indent text-justify">Reclamo la indemnización por <strong>Responsabilidad Patrimonial del Estado</strong> derivada de la actividad administrativa irregular consistente en: ${span('falla en el mantenimiento de la vía pública que ocasionó que mi vehículo cayera en una coladera destapada el día X')}.</p>
<p class="indent text-justify">Cuantifico los daños materiales en la cantidad de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(15,000.00)</span> comprobables con las siguientes facturas y peritajes: ${span('Factura de llantas nuevas, suspensión y reporte de ajustador')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Reclamante')}</div>
</div>`
    },
    {
        id: 'admin-uso-suelo-v1',
        slug: 'solicitud-dictamen-uso-suelo',
        title: 'Solicitud de Dictamen de Uso de Suelo',
        legalBasis: ['Leyes de Desarrollo Urbano Locales'],
        description: 'Petición para obtener factibilidad o dictamen de uso de suelo comercial o industrial.',
        keywords: ['uso de suelo', 'desarrollo urbano', 'factibilidad comercial'],
        html: `<div class="header-v1">
    <h1>Solicitud de Dictamen de Uso de Suelo</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">DIRECCIÓN DE DESARROLLO URBANO</div>
<p class="indent text-justify">Solicito formalmente el <strong>Dictamen de Uso de Suelo Factible</strong> para el predio ubicado en ${span('Av. Juárez 100')}, con cuenta predial ${span('000111222')}, a fin de autorizar el giro de ${span('Bodega de almacenamiento de abarrotes')}.</p>
<p class="indent text-justify">Acompaño: Copia de escrituras, pago de predial vigente y croquis de ubicación.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Propietario / Arrendatario')}</div>
</div>`
    },
    {
        id: 'admin-suspension-administrativa-v1',
        slug: 'escrito-suspension-acto-reclamado-administrativo',
        title: 'Solicitud de Suspensión del Acto en Recurso Administrativo',
        legalBasis: ['Art. 87 LFPA'],
        description: 'Petición incidental dentro de un recurso para que no se ejecute una clausura o multa.',
        keywords: ['suspensión', 'medida cautelar', 'paralización de clausura', 'LFPA'],
        html: `<div class="header-v1">
    <h1>Incidente de Suspensión</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<p class="indent text-justify">Por medio del presente ocurso y dentro del recurso interpuesto bajo el expediente ${span('REC-01/2026')}, solicito se decrete la <strong>SUSPENSIÓN DE LA EJECUCIÓN DEL ACTO IMPUGNADO</strong> consistente en la ${span('orden de clausura de la sucursal')}.</p>
<p class="indent text-justify">Toda vez que no se sigue perjuicio al interés social ni al orden público, y de ejecutarse se ocasionarían daños de difícil reparación, ofrezco la garantía consistente en ${span('Depósito en billete de depósito / Póliza de Fianza')} para salvaguardar cualquier adeudo.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    },
    {
        id: 'admin-reclamacion-administrativa-v1',
        slug: 'recurso-reclamacion-administrativo',
        title: 'Recurso de Reclamación (Contra Acuerdos de Trámite)',
        legalBasis: ['Ley Federal de Procedimiento Contencioso Administrativo'],
        description: 'Impugnación dentro del Tribunal Contencioso contra acuerdos del Magistrado Instructor que desechan pruebas o demandas.',
        keywords: ['reclamación tfja', 'acuerdo desechamiento', 'magistrado instructor'],
        html: `<div class="header-v1">
    <h1>Recurso de Reclamación</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">H. SALA REGIONAL DEL TFJA</div>
<p class="indent text-justify">Interpongo <strong>RECURSO DE RECLAMACIÓN</strong> en contra del auto de fecha ${span('10 de abril de 2026')}, dictado por el Magistrado Instructor mediante el cual ${span('desecha la prueba pericial contable ofrecida de mi parte')}.</p>
<p class="indent text-justify">Dicho auto me causa agravio al violar las reglas de admisibilidad probatoria de la LFPCA, dejándome en estado de indefensión procesal.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    },
    {
        id: 'admin-contestacion-procedimiento-sancionador-v1',
        slug: 'contestacion-procedimiento-administrativo-sancionador',
        title: 'Contestación a Procedimiento Administrativo Sancionador',
        legalBasis: ['Leyes Administrativas Generales', 'Art. 14 Constitucional'],
        description: 'Defensa inicial ante el inicio de un procedimiento sancionador de cualquier dependencia (PROFECO, COFEPRIS, STPS).',
        keywords: ['procedimiento sancionador', 'contestación acta inspección', 'visita verificación'],
        html: `<div class="header-v1">
    <h1>Comparecencia y Defensa en Procedimiento Sancionador</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">AUTORIDAD SANCIONADORA: ${span('COFEPRIS')}</div>
<p class="indent text-justify">Dando contestación al acta de verificación número ${span('VER-999')} levantada en el establecimiento ${span('Restaurante El Mar')}, expongo en vía de defensa:</p>
<p class="indent text-justify">Las supuestas anomalías observadas por los inspectores durante la visita, carecen de veracidad técnica, toda vez que ${span('todos los alimentos cuentan con bitácoras de temperatura vigentes')}. Acompaño pruebas documentales y técnicas que lo amparan.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Representante Legal')}</div>
</div>`
    },
    {
        id: 'admin-solicitud-copias-v1',
        slug: 'solicitud-copias-certificadas',
        title: 'Solicitud de Copias Certificadas Administrativas',
        legalBasis: ['Art. 8 CPEUM', 'Art. 347 CFPC'],
        description: 'Formato simple para solicitar copias certificadas de expedientes o permisos a cualquier dependencia.',
        keywords: ['copias certificadas', 'solicitud expediente', 'reproducción oficial'],
        html: `<div class="header-v1">
    <h1>Solicitud de Copias Certificadas</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">A QUIEN CORRESPONDA</div>
<p class="indent text-justify">Autorizando a ${span('Lic. Francisco Sánchez Torres')} para recibir, solicito a esa H. Dependencia la expedición a mi costa de <strong>COPIAS CERTIFICADAS</strong> de todo lo actuado en el expediente número ${span('LIC-8383/2019')}, relativo al trámite de ${span('licencia de construcción')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    },
    {
        id: 'admin-desahogo-vista-v1',
        slug: 'desahogo-vista-administrativa',
        title: 'Desahogo de Vista (Administrativo)',
        legalBasis: ['LFPA (Garantía de Audiencia)'],
        description: 'Documento para desahogar un emplazamiento o vista concedida por la autoridad antes de multar.',
        keywords: ['desahogo vista', 'garantía audiencia', 'LFPA'],
        html: `<div class="header-v1">
    <h1>Desahogo de Vista</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">AUTORIDAD EMISORA</div>
<p class="indent text-justify">Desahogando la vista concedida mediante oficio ${span('OF/12/2026')}, hago valer mi derecho constitucional de audiencia manifestando lo siguiente:</p>
<p class="indent text-justify">La irregularidad imputada derivó de un caso fortuito o fuerza mayor comprobable mediante ${span('los reportes de CFE sobre falla eléctrica masiva')}, por lo que solicito no se finque responsabilidad ni sanción pecuniaria.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    },
    {
        id: 'admin-devolucion-indebido-v1',
        slug: 'solicitud-devolucion-pago-indebido-administrativo',
        title: 'Solicitud de Devolución de Pago de lo Indebido',
        legalBasis: ['Código Fiscal Local', 'Código Civil', 'Art. 8 CPEUM'],
        description: 'Reclamación de devolución por pagos dobles, cobros excesivos de derechos o multas anuladas ante la Tesorería.',
        keywords: ['pago indebido', 'devolución derechos', 'cobro excesivo tesorería'],
        html: `<div class="header-v1">
    <h1>Solicitud de Devolución por Pago de lo Indebido</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">SECRETARÍA DE FINANZAS / TESORERÍA</div>
<p class="indent text-justify">Solicito formalmente la <strong>DEVOLUCIÓN DE PAGO DE LO INDEBIDO</strong> por la cantidad de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(4,500.00)</span> vinculada al recibo de pago número ${span('RP-89292')}.</p>
<p class="indent text-justify">La razón jurídica deviene de ${span('haber realizado un doble cobro en el sistema por el mismo trámite de emplacamiento vehicular')}. Para tal efecto, solicito se deposite el monto a la CLABE bancaria ${span('012180001234567890')}.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('El Pagador')}</div>
</div>`
    },
    {
        id: 'admin-recurso-revision-sedatu-v1',
        slug: 'recurso-revision-sedatu-infonavit',
        title: 'Recurso de Revisión Administrativa (SEDATU / INFONAVIT)',
        legalBasis: ['Ley de Vivienda', 'LFPA'],
        description: 'Modelo adaptado a litigios contra dependencias de territorio, vivienda o resoluciones de subsidios.',
        keywords: ['SEDATU', 'recurso revisión infonavit', 'subsidio vivienda administrativa'],
        html: `<div class="header-v1">
    <h1>Recurso de Revisión</h1>
</div>
<p class="meta-line">${span('Ciudad de México')}, a ${span('26 de febrero de 2026')}</p>
<div class="section-title">SECRETARÍA DE DESARROLLO AGRARIO, TERRITORIAL Y URBANO</div>
<p class="indent text-justify">Interpongo medio de defensa administrativo contra la resolución que ${span('niega la procedencia del subsidio de vivienda folio 889')}.</p>
<p class="indent text-justify">El acto de autoridad omitió la valoración de mis constancias de extrema necesidad y protección a grupos vulnerables, mismas que cumplo a cabalidad conforme a las Reglas de Operación vigentes publicadas en el DOF.</p>
<div class="signature-block" style="margin-top:50px;">
    <div class="signature-line">${span('Firma')}</div>
</div>`
    }
];

function process() {
    const v1Dir = path.join(__dirname, '..', 'src', 'data', 'templates', 'v1', 'administrativo');
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
        specialty: 'administrativo',
        tier: 'v1',
        file: 'v1/administrativo/${t.slug}.html',
        price: 0,
        priceLabel: 'Gratis',
        legalBasis: ${JSON.stringify(t.legalBasis)},
        description: '${t.description}',
        keywords: ${JSON.stringify(t.keywords)},
    },`;
        indexSnippets.push(snippet);
    });

    const arrayString = `\nexport const templatesV1_administrativo: Template[] = [\n${indexSnippets.join('\n')}\n];\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'templates-administrativo-export.ts'), arrayString);
    console.log("Generados 20 HTML y el archivo export.");
}

process();
