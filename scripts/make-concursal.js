const fs = require('fs');

const templates = [
    {
        id: "concursal-solicitud-concurso-mercantil-v1",
        slug: "solicitud-declaracion-concurso-mercantil",
        title: "Solicitud de Declaracion de Concurso Mercantil",
        legalBasis: ["Arts. 9-20 Ley de Concursos Mercantiles"],
        description: "Solicitud voluntaria del comerciante ante el juez para ser declarado en concurso mercantil por estado general de incumplimiento.",
        keywords: ["concurso mercantil voluntario", "quiebra empresa Mexico", "insolvencia declaracion"],
        html: `<div class="header-v1"><h1>Solicitud de Declaracion de Concurso Mercantil</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DE DISTRITO EN MATERIA MERCANTIL</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Distribuidora Nacional SA de CV)</span></strong> solicita CONCURSO MERCANTIL al tener un pasivo de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(45,000,000.00)</span> con incumplimiento generalizado a mas de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(20 acreedores)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Comerciante / Representante Legal)</span></div></div>`
    },
    {
        id: "concursal-demanda-acreedor-v1",
        slug: "demanda-concurso-mercantil-por-acreedor",
        title: "Demanda de Concurso Mercantil por Acreedor",
        legalBasis: ["Arts. 21-30 LCM"],
        description: "Demanda interpuesta por un acreedor para que el juez declare en concurso mercantil al deudor insolvente.",
        keywords: ["concurso mercantil acreedor", "quiebra demanda creditor", "insolvencia deudor comerciante"],
        html: `<div class="header-v1"><h1>Demanda de Concurso Mercantil por Acreedor</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DE DISTRITO MERCANTIL</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Banco del Norte SA)</span></strong> demanda CONCURSO MERCANTIL de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Constructora Omega SA)</span> por adeudo de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(12,000,000.00)</span> con mora superior a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(60 dias)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Acreedor)</span></div></div>`
    },
    {
        id: "concursal-reconocimiento-credito-v1",
        slug: "solicitud-reconocimiento-credito-concurso",
        title: "Solicitud de Reconocimiento de Credito en Concurso",
        legalBasis: ["Arts. 121-150 LCM"],
        description: "Solicitud del acreedor ante el conciliador para que su credito sea incluido en la lista definitiva del concurso.",
        keywords: ["reconocimiento credito concurso", "lista definitiva acreedores", "conciliador concursal"],
        html: `<div class="header-v1"><h1>Solicitud de Reconocimiento de Credito en Concurso Mercantil</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">CONCILIADOR DEL CONCURSO</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Proveedor Alfa SA)</span></strong> solicita reconocimiento de credito por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(1,800,000.00)</span>, documentado en factura <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(No. F-2025-0456)</span>, con calificacion de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(acreedor comun quirografario)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Acreedor)</span></div></div>`
    },
    {
        id: "concursal-impugnacion-lista-v1",
        slug: "impugnacion-lista-definitiva-creditos",
        title: "Impugnacion de la Lista Definitiva de Creditos",
        legalBasis: ["Arts. 151-170 LCM"],
        description: "Recurso contra la lista definitiva de creditos reconocidos en el concurso por error u omision.",
        keywords: ["impugnar lista creditos concurso", "objetar credito reconocido", "prelacion acreedores impugnacion"],
        html: `<div class="header-v1"><h1>Impugnacion de Lista Definitiva de Creditos</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Financiera Sur SA)</span></strong> IMPUGNA la omision de su credito hipotecario por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(5,500,000.00)</span>, avalado con escritura No. <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(88,450)</span>, con derecho de preferencia especial.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Acreedor Impugnante)</span></div></div>`
    },
    {
        id: "concursal-convenio-concursal-v1",
        slug: "propuesta-convenio-concursal-deudor",
        title: "Propuesta de Convenio Concursal por el Deudor",
        legalBasis: ["Arts. 157-187 LCM"],
        description: "Propuesta formal del deudor concursado a sus acreedores para reestructurar sus obligaciones y evitar la quiebra.",
        keywords: ["convenio concursal propuesta", "quita acreedores concurso", "reestructura deuda evitar quiebra"],
        html: `<div class="header-v1"><h1>Propuesta de Convenio Concursal</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">ACREEDORES RECONOCIDOS / CONCILIADOR</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Distribuidora Nacional SA)</span></strong> propone: quita del <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(40%)</span> del pasivo; pago del remanente en <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(60 mensualidades)</span> desde <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(marzo 2026)</span>; garantia con inmueble en <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Av. Insurgentes Sur 1200)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Deudor Concursado)</span></div></div>`
    },
    {
        id: "concursal-quiebra-solicitud-v1",
        slug: "solicitud-declaracion-quiebra",
        title: "Solicitud de Declaracion en Quiebra",
        legalBasis: ["Arts. 188-210 LCM"],
        description: "Solicitud para que el juez declare la quiebra tras el fracaso de la etapa de conciliacion en el concurso mercantil.",
        keywords: ["declaracion quiebra empresa", "fase quiebra concurso Mexico", "sindico quiebra LCM"],
        html: `<div class="header-v1"><h1>Solicitud de Declaracion en Quiebra</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El CONCILIADOR informa vencimiento del plazo de conciliacion de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(185 dias)</span> sin lograr convenio, y solicita la DECLARACION EN QUIEBRA de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Distribuidora Nacional SA)</span> con nombramiento de sindico.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Conciliador)</span></div></div>`
    },
    {
        id: "concursal-accion-retroaccion-v1",
        slug: "accion-retroaccion-quiebra",
        title: "Accion de Retroaccion de Actos en el Periodo Sospechoso",
        legalBasis: ["Arts. 112-120 LCM"],
        description: "Demanda para que el sindico rescinda actos del deudor realizados en el periodo sospechoso previo al concurso.",
        keywords: ["retroaccion quiebra", "periodo sospechoso concurso", "rescindir actos fraudulentos insolvencia"],
        html: `<div class="header-v1"><h1>Accion de Retroaccion — Periodo Sospechoso</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El SINDICO demanda RETROACCION del contrato de compraventa del <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(15 ago 2025)</span> donde el deudor vendio inmueble a tercero relacionado subvaluado en $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(3,000,000.00)</span> dentro del periodo sospechoso.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Sindico)</span></div></div>`
    },
    {
        id: "concursal-incidente-separacion-bienes-v1",
        slug: "incidente-separacion-bienes-tercero",
        title: "Incidente de Separacion de Bienes de Tercero en Concurso",
        legalBasis: ["Arts. 71-80 LCM"],
        description: "Solicitud de un tercero para que se separen bienes propios que se encuentran en posesion del deudor concursado.",
        keywords: ["separacion bienes tercero concurso", "reivindicacion quiebra", "bienes propios masa concursal"],
        html: `<div class="header-v1"><h1>Incidente de Separacion de Bienes de Tercero</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Arrendadora Mex SA)</span></strong> solicita la SEPARACION de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(10 montacargas Toyota)</span> de su propiedad que se encuentran en instalaciones del deudor bajo contrato de arrendamiento de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(1 ene 2025)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Tercero Propietario)</span></div></div>`
    },
    {
        id: "concursal-objecion-credito-privilegiado-v1",
        slug: "objecion-credito-privilegiado",
        title: "Objecion de Credito con Preferencia Privilegiada",
        legalBasis: ["Arts. 217-230 LCM"],
        description: "Escrito de un acreedor objetando la prelacion privilegiada otorgada a otro credito en el concurso.",
        keywords: ["objetar credito privilegiado", "prelacion acreedores concurso", "credito subordinado impugnar"],
        html: `<div class="header-v1"><h1>Objecion de Credito con Preferencia Privilegiada</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Proveedor Alfa SA)</span></strong> OBJETA la calificacion de PRIVILEGIADO ESPECIAL del credito de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Banco Sur SA)</span> por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(8,000,000.00)</span>: la hipoteca quedo inscrita despues del incumplimiento generalizado.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Acreedor Objetante)</span></div></div>`
    },
    {
        id: "concursal-demanda-responsabilidad-administradores-v1",
        slug: "demanda-responsabilidad-administradores-quiebra",
        title: "Demanda de Responsabilidad contra Administradores en Quiebra",
        legalBasis: ["Arts. 271-285 LCM"],
        description: "Accion del sindico para demandar a administradores cuya conducta agrave o cause la insolvencia del comerciante.",
        keywords: ["responsabilidad administradores quiebra", "sindico demanda directores", "culpa gerencial insolvencia"],
        html: `<div class="header-v1"><h1>Demanda de Responsabilidad de Administradores en Quiebra</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El SINDICO demanda responsabilidad de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Juan Perez, Director General)</span> y <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Maria Lopez, Directora Financiera)</span> por transferencias fraudulentas de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(12,000,000.00)</span> a empresas relacionadas que agravaron la insolvencia.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Sindico)</span></div></div>`
    },
    {
        id: "concursal-cesion-credito-concurso-v1",
        slug: "cesion-credito-concurso-mercantil",
        title: "Convenio de Cesion de Credito en Concurso Mercantil",
        legalBasis: ["Arts. 2029-2042 CCDF", "LCM"],
        description: "Acuerdo por el que un acreedor cede su credito reconocido en el concurso a un tercero adquirente.",
        keywords: ["cesion credito concurso", "compra cartera concursal", "adquirir credito quiebra"],
        html: `<div class="header-v1"><h1>Convenio de Cesion de Credito en Concurso Mercantil</h1></div><p class="meta-line">Celebrado en <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, el <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><p class="indent text-justify"><strong>Cedente: <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Proveedor Alfa SA)</span></strong> cede credito reconocido por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(1,800,000.00)</span> al <strong>Cesionario: <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Fondo Distressed SA)</span></strong> por precio de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(900,000.00)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Las Partes)</span></div></div>`
    },
    {
        id: "concursal-suspension-pagos-v1",
        slug: "solicitud-suspension-pagos-visitador",
        title: "Solicitud de Suspension de Pagos ante Visitador",
        legalBasis: ["Arts. 41-70 LCM"],
        description: "Solicitud del deudor para que el visitador recomiende la suspension de obligaciones de pago mientras dura la visita.",
        keywords: ["suspension pagos concurso", "visitador concursal LCM", "moratoria obligaciones deudor"],
        html: `<div class="header-v1"><h1>Solicitud de Suspension de Pagos ante Visitador</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">VISITADOR DESIGNADO</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Distribuidora Nacional SA)</span></strong> solicita recomendacion de SUSPENSION de obligaciones vencidas por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(3,200,000.00)</span> que vencen en <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(30 dias)</span> durante la visita concursal.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Deudor)</span></div></div>`
    },
    {
        id: "concursal-enajenacion-activos-v1",
        slug: "solicitud-enajenacion-activos-concurso",
        title: "Solicitud de Enajenacion de Activos del Concursado",
        legalBasis: ["Arts. 211-240 LCM"],
        description: "Solicitud del sindico para autorizar la venta de activos de la masa concursal y distribuir el producto entre acreedores.",
        keywords: ["venta activos quiebra", "enajenacion masa concursal", "sindico venta bienes empresa"],
        html: `<div class="header-v1"><h1>Solicitud de Enajenacion de Activos en Quiebra</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El SINDICO solicita autorizacion para enajenar: <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(1. Inmueble industrial Vallejo avaluado $35M; 2. Flota 8 camiones $4M)</span> en subasta publica con valor minimo de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(30,000,000.00)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Sindico)</span></div></div>`
    },
    {
        id: "concursal-pago-preferente-laboral-v1",
        slug: "solicitud-pago-creditos-laborales-preferentes",
        title: "Solicitud de Pago Preferente de Creditos Laborales",
        legalBasis: ["Art. 224 LCM", "Art. 113 LFT"],
        description: "Peticion de los trabajadores para que sus creditos laborales se paguen con prioridad absoluta en el concurso.",
        keywords: ["credito laboral preferente quiebra", "trabajadores concurso mercantil", "salarios quiebra empresa"],
        html: `<div class="header-v1"><h1>Solicitud de Pago Preferente de Creditos Laborales</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">Los <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(350 trabajadores)</span> del concursado solicitan pago INMEDIATO Y PREFERENTE de salarios, IMSS, vacaciones y aguinaldo por $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(6,800,000.00)</span> con cargo a la masa concursal.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Sindicato / Los Trabajadores)</span></div></div>`
    },
    {
        id: "concursal-oposicion-concurso-v1",
        slug: "oposicion-declaracion-concurso-mercantil",
        title: "Oposicion a la Declaracion de Concurso Mercantil",
        legalBasis: ["Arts. 31-40 LCM"],
        description: "Escrito del deudor oponiendo pruebas contra la solicitud de concurso presentada por un acreedor.",
        keywords: ["oposicion concurso mercantil", "contestar demanda quiebra", "refutar insolvencia empresa"],
        html: `<div class="header-v1"><h1>Oposicion a la Declaracion de Concurso Mercantil</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ MERCANTIL</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Constructora Omega SA)</span></strong> se OPONE exhibiendo estados financieros que acreditan liquidez positiva y que el incumplimiento con el banco deriva de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(disputa contractual especifica, no insolvencia generalizada)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Deudor Demandado)</span></div></div>`
    },
    {
        id: "concursal-acuerdo-preconcursal-v1",
        slug: "acuerdo-extrajudicial-preconcursal",
        title: "Acuerdo Extrajudicial Preconcursal con Acreedores",
        legalBasis: ["Arts. 338-346 LCM"],
        description: "Convenio privado deudor-acreedores para reestructurar la deuda sin acudir al proceso concursal judicial.",
        keywords: ["acuerdo preconcursal extrajudicial", "reestructura privada deuda", "evitar quiebra convenio acreedores"],
        html: `<div class="header-v1"><h1>Acuerdo Extrajudicial Preconcursal</h1></div><p class="meta-line">Celebrado en <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, el <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Distribuidora Nacional SA)</span></strong> y acreedores representando el <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(70% del pasivo total)</span> acuerdan: quita del <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(30%)</span>; prorroga de <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(24 meses)</span>; supervision mensual de estados financieros auditados.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Las Partes)</span></div></div>`
    },
    {
        id: "concursal-acumulacion-juicios-v1",
        slug: "solicitud-acumulacion-juicios-concurso",
        title: "Solicitud de Acumulacion de Juicios al Concurso Mercantil",
        legalBasis: ["Arts. 65-70 LCM"],
        description: "Solicitud para que todos los juicios individuales contra el concursado se concentren en el expediente concursal.",
        keywords: ["acumulacion juicios concurso", "fuero de atraccion quiebra", "concentrar demandas concursal"],
        html: `<div class="header-v1"><h1>Solicitud de Acumulacion de Juicios al Concurso</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El CONCILIADOR solicita acumulacion de: <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ejecutivo Mercantil 500/2025; Juicio Laboral 200/2025; Contencioso Fiscal 100/2025)</span> para tramitarlos bajo un solo fuero concursal.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Conciliador)</span></div></div>`
    },
    {
        id: "concursal-plan-prepack-v1",
        slug: "plan-reestructura-prepack-concurso",
        title: "Plan de Reestructura Pre-Pactado (Prepack) en Concurso",
        legalBasis: ["Arts. 338-370 LCM"],
        description: "Plan de reestructura negociado antes del concurso y presentado para aprobacion rapida en el proceso.",
        keywords: ["prepack concurso Mexico", "reestructura rapida empresa", "convenio previo acreedores concurso"],
        html: `<div class="header-v1"><h1>Plan de Reestructura Pre-Pactado (Prepack)</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO / CONCILIADOR</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Distribuidora Nacional SA)</span></strong> presenta PLAN PRE-PACTADO firmado por el <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(75%)</span> de acreedores antes del concurso: capitalizacion de $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(15,000,000.00)</span> + pago del remanente en <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(36 meses)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Deudor y Acreedores Firmantes)</span></div></div>`
    },
    {
        id: "concursal-clausura-expediente-v1",
        slug: "clausura-expediente-concurso-mercantil",
        title: "Solicitud de Clausura del Expediente Concursal",
        legalBasis: ["Arts. 286-300 LCM"],
        description: "Peticion del sindico al juez para declarar concluido el concurso mercantil tras liquidar el pasivo.",
        keywords: ["clausura concurso mercantil", "fin quiebra extincion", "cierre expediente concursal sindico"],
        html: `<div class="header-v1"><h1>Solicitud de Clausura del Concurso Mercantil</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El SINDICO informa que se termino la enajenacion total de activos, obteniendo $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(36,000,000.00)</span> con los que se cubrieron todos los pasivos reconocidos segun prelacion, y solicita la CLAUSURA del expediente e inscripcion en el Registro Publico de Comercio.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Sindico)</span></div></div>`
    }
];

fs.writeFileSync('scripts/concursal.json', JSON.stringify(templates, null, 2), 'utf8');
console.log('OK concursal.json:', templates.length, 'plantillas');
