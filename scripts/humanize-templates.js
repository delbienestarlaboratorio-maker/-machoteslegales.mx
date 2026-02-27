/**
 * humanize-templates.js
 * =====================
 * Transforma los templates HTML V1/V2 de formato Jinja2 automático
 * a formato humano: elimina {{ variable | default("...") }} y pone
 * ejemplos realistas entre paréntesis con estilo azul para rellenar a mano.
 *
 * Uso: node scripts/humanize-templates.js
 */

const fs = require('fs');
const path = require('path');

// ─── SPAN AZUL ESTÁNDAR ───────────────────────────────────────────────────────
const span = (text) =>
    `<span class="campo-editable">(${text})</span>`;

// ─── MAPA DE EJEMPLOS REALISTAS POR VARIANTE DE CAMPO ────────────────────────
// Clave: regex que matchea el content entre {{ }} (case-insensitive en default)
// Valor: texto de ejemplo en español

const FIELD_MAP = [
    // ── PERSONAS ──
    { key: /nombre_promovente/, example: 'María González López' },
    { key: /nombre_solicitante/, example: 'María González López' },
    { key: /nombre_querellante/, example: 'Carlos Armando Pérez Ruiz' },
    { key: /nombre_demandante/, example: 'Carlos Armando Pérez Ruiz' },
    { key: /nombre_actora?/, example: 'María González López' },
    { key: /nombre_trabajador/, example: 'José Manuel Ramírez Díaz' },
    { key: /nombre_empleado/, example: 'José Manuel Ramírez Díaz' },
    { key: /cliente\.nombre/, example: 'José Manuel Ramírez Díaz' },
    { key: /nombre_demandado/, example: 'Roberto Fuentes Herrera' },
    { key: /nombre_querellado/, example: 'Armando Vega Salinas' },
    { key: /nombre_imputado/, example: 'Pedro Rojas Mendoza' },
    { key: /nombre_acusado/, example: 'Pedro Rojas Mendoza' },
    { key: /nombre_testigo_?1/, example: 'Ana Lucía Torres Soto' },
    { key: /nombre_testigo_?2/, example: 'Luis Enrique Ramos García' },
    { key: /testigo_1/, example: 'Ana Lucía Torres Soto' },
    { key: /testigo_2/, example: 'Luis Enrique Ramos García' },
    { key: /nombre_adoptante/, example: 'Patricia Morales Vidal' },
    { key: /nombre_menor/, example: 'Sofía Hernández Campos' },
    { key: /nombre_alimentista/, example: 'Sofía Hernández Campos (menor de edad)' },
    { key: /nombre_deudor/, example: 'Ernesto Salinas Bravo' },
    { key: /nombre_acreedor/, example: 'Inversiones del Norte S.A. de C.V.' },
    { key: /nombre_contribuyente/, example: 'María González López' },
    { key: /nombre_solicitante_resid/, example: 'Jean Paul Dupont' },
    { key: /nombre_completo/i, example: 'María González López' },
    { key: /nombre_abogado/, example: 'Lic. Francisco Sánchez Torres' },
    { key: /abogado\.nombre/, example: 'Lic. Francisco Sánchez Torres' },
    { key: /nombre_asesor/, example: 'Lic. Laura Vidal Mendoza' },
    { key: /nombre_notario/, example: 'Lic. Ernesto Fuentes Medina, Notario Público No. 45' },
    { key: /nombre_representante/, example: 'Ing. Raúl Martínez Ochoa, Gerente General' },
    { key: /representante_legal/, example: 'Lic. Ana Sofía Guerrero Ponce' },

    // ── ABOGADO / CÉDULA ──
    { key: /cedula|cédula/, example: '3847291' },
    { key: /abogado\.cedula/, example: '3847291' },

    // ── EMPRESA / PATRÓN ──
    { key: /patron|patrón/, example: 'Construcciones del Valle S.A. de C.V.' },
    { key: /razon_social|razón_social/, example: 'Servicios Integrales del Sur S.A. de C.V.' },
    { key: /empresa/, example: 'Comercializadora Norteña S.A. de C.V.' },
    { key: /nombre_empresa/, example: 'Alpha Tecnología S.A. de C.V.' },

    // ── JUZGADOS / TRIBUNALES ──
    { key: /numero_juzgado|número_juzgado/, example: 'Primero' },
    { key: /circuito/, example: 'Primero en Materia Laboral de la CDMX' },
    { key: /nombre_tribunal/, example: 'Juzgado Primero de lo Familiar del Tribunal Superior de Justicia de la CDMX' },
    { key: /jurisdiccion|jurisdicción/, example: 'General de la República' },
    { key: /numero_oficial|número_oficial/, example: '15' },

    // ── DOMICILIOS ──
    { key: /domicilio_procesal/, example: 'Av. Insurgentes Sur 1602, Col. Crédito Constructor, Ciudad de México, C.P. 03940' },
    { key: /domicilio_promovente/, example: 'Calle Morelos 45, Col. Centro, Coyoacán, Ciudad de México, C.P. 04000' },
    { key: /domicilio_demandado/, example: 'Av. Revolución 1500, Col. San Ángel, Ciudad de México, C.P. 01000' },
    { key: /domicilio_querellante/, example: 'Calle Juárez 78, Col. Del Valle, Benito Juárez, Ciudad de México, C.P. 03100' },
    { key: /domicilio_querellado/, example: 'Av. Universidad 123, Col. Narvarte, Ciudad de México, C.P. 03020' },
    { key: /domicilio_testigo_?1/, example: 'Calle Hidalgo 22, Col. Roma Norte, Ciudad de México, C.P. 06600' },
    { key: /domicilio_conyugal/, example: 'Calle Emilio Castelar 152, Col. Polanco, Ciudad de México, C.P. 11550' },
    { key: /domicilio_patron|domicilio_patrón/, example: 'Blvd. Manuel Ávila Camacho 36, Col. Lomas de Chapultepec, Ciudad de México, C.P. 11000' },
    { key: /cliente\.domicilio/, example: 'Calle Morelos 45, Col. Centro, Coyoacán, Ciudad de México, C.P. 04000' },
    { key: /domicilio/, example: 'Calle Morelos 45, Col. Centro, Ciudad de México, C.P. 04000' },

    // ── DOCUMENTOS / IDS ──
    { key: /curp/, example: 'GOML850312HDFNRR09' },
    { key: /nss/, example: '34829104567' },
    { key: /rfc_patron|rfc_patrón/, example: 'CVA901210AB3' },
    { key: /rfc/, example: 'GOML850312AB3' },
    { key: /numero_causa|número_causa/, example: 'PEN/001/2026' },
    { key: /numero_expediente|número_expediente/, example: 'EXP/FAM/142/2026' },
    { key: /numero_acta_matrimonio/, example: '00234' },
    { key: /folio|número_acta/, example: '00234' },
    { key: /license_id/, example: 'TLEX-V2-001234' },
    { key: /license_user/, example: 'usuario@correo.com' },

    // ── FECHAS ──
    { key: /fecha_actual_texto|fecha_texto/, example: '26 de febrero de 2026' },
    { key: /fecha_matrimonio/, example: '14 de febrero de 2015' },
    { key: /fecha_ingreso/, example: '3 de enero de 2020' },
    { key: /fecha_despido/, example: '10 de enero de 2026' },
    { key: /fecha_entrega_bien/, example: '5 de agosto de 2025' },
    { key: /fecha_descubrimiento/, example: '20 de octubre de 2025' },
    { key: /fecha_requerimiento/, example: '15 de noviembre de 2025' },
    { key: /fecha_acta/, example: '14 de febrero de 2015' },
    { key: /fecha/, example: '26 de febrero de 2026' },

    // ── MONTOS ──
    { key: /monto_total_reparacion/, example: '45,000.00' },
    { key: /monto_dano_material/, example: '20,000.00' },
    { key: /monto_dano_fisico/, example: '12,500.00' },
    { key: /monto_dano_moral/, example: '8,000.00' },
    { key: /monto_lucro_cesante/, example: '4,500.00' },
    { key: /monto_gastos_medicos/, example: '12,500.00' },
    { key: /monto_valuatorio/, example: '20,000.00' },
    { key: /monto_compensatoria/, example: '5,000.00' },
    { key: /monto_pension/, example: '3,500.00' },
    { key: /monto_dano/, example: '18,000.00' },
    { key: /monto_reclamado/, example: '35,000.00' },
    { key: /monto_adeudo/, example: '25,000.00' },
    { key: /valor_aproximado/, example: '18,000.00' },
    { key: /valor_bien_1/, example: '12,000.00' },
    { key: /valor_bien_2/, example: '6,000.00' },
    { key: /monto/, example: '15,000.00' },
    { key: /indem_3meses/, example: '12,450.00' },
    { key: /indem_20dias/, example: '8,300.00' },
    { key: /salarios_caidos/, example: '24,900.00' },
    { key: /intereses/, example: '3,588.00' },
    { key: /prima_antiguedad/, example: '2,077.50' },
    { key: /aguinaldo/, example: '2,075.00' },
    { key: /vacaciones/, example: '2,490.00' },
    { key: /prima_vac/, example: '622.50' },
    { key: /ptu/, example: '4,150.00' },
    { key: /horas_extras/, example: '1,800.00' },
    { key: /total/, example: '55,000.00' },
    { key: /gastos_procesales/, example: '3,500.00' },
    { key: /salario_diario/, example: '415.00' },
    { key: /salario_integrado/, example: '498.00' },

    // ── LABORAL ──
    { key: /antiguedad|antigüedad/, example: '6 años y 2 meses' },
    { key: /puesto/, example: 'Auxiliar Contable' },
    { key: /horario/, example: 'Lunes a viernes de 9:00 a 18:00 hrs, sábado de 9:00 a 14:00 hrs' },
    { key: /horas_semana/, example: '48' },
    { key: /tipo_jornada/, example: 'Diurna, Art. 60 LFT' },
    { key: /dia_descanso/, example: 'Domingo' },
    { key: /dias_vac/, example: '12' },
    { key: /tipo_persona_patron/, example: 'moral' },

    // ── PENAL / PROCEDIMIENTO ──
    { key: /tipo_delito/, example: 'abuso de confianza' },
    { key: /descripcion_bienes/, example: 'Una laptop marca Dell modelo Inspiron 15, color negro, serie 5XJ2NK3, valuada en $18,000 MXN' },
    { key: /bien_1/, example: 'Laptop Dell Inspiron 15' },
    { key: /bien_2/, example: 'Automóvil Volkswagen Jetta 2019 (si aplica)' },
    { key: /descripcion_bien_1/, example: 'Serie 5XJ2NK3, color negro, en buen estado' },
    { key: /descripcion_bien_2/, example: 'Placas ABC-123-X, color blanco' },
    { key: /titulo_posesion/, example: 'depósito temporal para resguardo' },
    { key: /condiciones_devolucion/, example: 'devolución acordada para el 30 de septiembre de 2025' },
    { key: /conducta_delictiva/, example: 'se negó a devolverlos y los vendió a un tercero sin autorización' },
    { key: /medio_requerimiento/, example: 'de forma escrita mediante carta notarial' },
    { key: /respuesta_querellado/, example: 'evasión y promesas incumplidas' },
    { key: /documento_probatorio/, example: 'contrato de depósito firmado ante dos testigos' },
    { key: /documentos_prueba/, example: 'Contrato de depósito firmado / recibo de entrega / capturas de mensajes WhatsApp' },
    { key: /cantidad_agravante/, example: '500' },
    { key: /caracter|carácter/, example: 'víctima directa del delito' },
    { key: /descripcion_dano_material/, example: 'Destrucción de laptop y materiales de trabajo' },
    { key: /descripcion_dano_fisico/, example: 'Gastos médicos de urgencias y 3 días de hospitalización' },
    { key: /descripcion_dano_moral/, example: 'Daño psicológico, estrés postraumático y afectación a la dignidad personal' },
    { key: /descripcion_lucro_cesante/, example: 'Ingresos no percibidos durante 15 días de incapacidad médica' },

    // ── FAMILIAR ──
    { key: /regimen_patrimonial/, example: 'sociedad conyugal' },
    { key: /municipio_matrimonio/, example: 'Coyoacán' },
    { key: /anios_matrimonio|años_matrimonio/, example: '11' },
    { key: /numero_hijos|número_hijos/, example: '2' },
    { key: /nombres_edades_hijos/, example: 'Sofía (8 años) y Diego (5 años)' },
    { key: /periodo_compensatoria/, example: '24 meses' },
    { key: /porcentaje_pension/, example: '30%' },
    { key: /dias_convivencia/, example: 'sábados y domingos de 10:00 a 18:00 hrs, períodos vacacionales alternos' },
    { key: /bien_1/, example: 'Inmueble en Calle Emilio Castelar 152, Col. Polanco, CDMX — valor aprox. $2,800,000 MXN' },
    { key: /bien_2/, example: 'Vehículo Volkswagen Tiguan 2022, placas MJKR22, color azul, valor aprox. $380,000 MXN' },
    { key: /bien_3/, example: 'Cuenta BBVA clabe 012180001234567890, saldo aprox. $85,000 MXN' },

    // ── FISCAL ──
    { key: /numero_resolucion/, example: 'SAT/ACDO-45/2025' },
    { key: /ejercicio_fiscal/, example: '2023' },
    { key: /acto_impugnado/, example: 'Resolución determinante de crédito fiscal por $180,000 MXN' },
    { key: /autoridad_emisora/, example: 'Servicio de Administración Tributaria (SAT)' },

    // ── MERCANTIL ──
    { key: /lugar_suscripcion/, example: 'Ciudad de México' },
    { key: /nombre_suscriptor/, example: 'Roberto Fuentes Herrera' },
    { key: /nombre_beneficiario/, example: 'Inversiones del Norte S.A. de C.V.' },

    // ── MIGRATORIO ──
    { key: /nacionalidad/, example: 'francesa' },
    { key: /numero_pasaporte/, example: 'P123456789' },
    { key: /tipo_residencia/, example: 'temporal por vínculos familiares' },

    // ── GEOGRAFÍA ──
    { key: /ciudad/, example: 'Ciudad de México' },
    { key: /estado/, example: 'Ciudad de México' },
    { key: /municipio/, example: 'Coyoacán' },

    // ── GENÉRICOS (van al final) ──
    { key: /prueba_documental/, example: 'Recibos de nómina, contrato de trabajo, credencial laboral y comprobantes de pago' },
    { key: /hecho_1/, example: 'Redactar aquí el primer hecho cronológicamente, con fecha, lugar y personas involucradas' },
    { key: /hecho_2/, example: 'Redactar aquí el segundo hecho, describiendo la conducta del demandado' },
    { key: /hecho_3/, example: 'Redactar aquí el tercer hecho y sus consecuencias para el promovente' },
    { key: /hecho_4/, example: 'Redactar aquí hechos adicionales si los hubiere' },
    // El catch-all va AL FINAL
];

// ─── TEXTOS GENÉRICOS DENTRO DE DEFAULT() QUE QUEREMOS MEJORAR ───────────────
// Estos se aplican cuando ninguna clave del mapa anterior matcheó
const GENERIC_DEFAULT_IMPROVEMENTS = [
    { from: /NOMBRE COMPLETO DEL PROMOVENTE/i, to: 'María González López' },
    { from: /NOMBRE COMPLETO DEL (?:QUERELLANTE|TRABAJADOR|ACTOR)/i, to: 'Carlos Armando Pérez Ruiz' },
    { from: /NOMBRE COMPLETO DEL QUERELLADO/i, to: 'Armando Vega Salinas' },
    { from: /NOMBRE DEL (?:ABOGADO|LICENCIADO)/i, to: 'Lic. Francisco Sánchez Torres' },
    { from: /NOMBRE(?:\s+DEL)?\s+IMPUTADO/i, to: 'Pedro Rojas Mendoza' },
    { from: /NOMBRE(?:\s+DEL)?\s+C[ÓO]NYUGE DEMANDADO/i, to: 'Roberto Fuentes Herrera' },
    { from: /NOMBRE(?:\s+DE\s+LA)?\s+V[ÍI]CTIMA/i, to: 'María González López' },
    { from: /NOMBRE COMPLETO Y FIRMA DEL TRABAJADOR/i, to: 'José Manuel Ramírez Díaz' },
    { from: /EL\/LA PROMOVENTE/i, to: 'María González López' },
    { from: /EL\/LA QUERELLANTE/i, to: 'Carlos Armando Pérez Ruiz' },
    { from: /LA V[ÍI]CTIMA \/ ASESOR JUR[ÍI]DICO/i, to: 'María González López' },
    { from: /NOMBRE(?:\s+DEL)?\s+PATR[ÓO]N|NOMBRE O RAZ[ÓO]N SOCIAL/i, to: 'Construcciones del Valle S.A. de C.V.' },
    { from: /PRIMER/, to: 'Primero' },
    { from: /DELITO COMETIDO/i, to: 'abuso de confianza' },
    { from: /TLEX-V2-XXXXXX/, to: 'TLEX-V2-001234' },
];

// ─── ESTILO INLINE DEL SPAN ───────────────────────────────────────────────────
const SPAN_STYLE = `background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;`;

// ─── FUNCIÓN: encontrar el ejemplo para un campo ──────────────────────────────
function getExample(varName, defaultVal) {
    // 1. Buscar por nombre de variable
    for (const { key, example } of FIELD_MAP) {
        if (key.test(varName)) return example;
    }
    // 2. Buscar por texto del default
    for (const { from, to } of GENERIC_DEFAULT_IMPROVEMENTS) {
        if (from.test(defaultVal)) return to;
    }
    // 3. Si el default es solo guiones o vacío, usar algo genérico
    if (/^[_\s-]+$/.test(defaultVal.trim()) || defaultVal.trim() === '') {
        return 'completar aquí';
    }
    // 4. Devolver el propio default mejorado (quitar mayúsculas completas)
    if (defaultVal === defaultVal.toUpperCase() && defaultVal.length > 3) {
        return defaultVal.charAt(0).toUpperCase() + defaultVal.slice(1).toLowerCase();
    }
    return defaultVal;
}

// ─── FUNCIÓN PRINCIPAL: procesar un archivo HTML ─────────────────────────────
function processHtml(content, filePath) {
    let html = content;

    // 1. Quitar bloques Jinja2 de control {% ... %}
    html = html.replace(/{%[\s\S]*?%}/g, '');

    // 2. Reemplazar {{ variable | default("texto") }} con dobles quotes
    html = html.replace(/\{\{\s*([\w.]+)\s*\|\s*default\(\s*"([^"]*)"\s*\)\s*\}\}/g,
        (match, varName, defaultVal) => {
            const example = getExample(varName.trim(), defaultVal.trim());
            return `<span style="${SPAN_STYLE}">(${example})</span>`;
        }
    );

    // 3. Reemplazar {{ variable | default('texto') }} con comillas simples
    html = html.replace(/\{\{\s*([\w.]+)\s*\|\s*default\(\s*'([^']*)'\s*\)\s*\}\}/g,
        (match, varName, defaultVal) => {
            const example = getExample(varName.trim(), defaultVal.trim());
            return `<span style="${SPAN_STYLE}">(${example})</span>`;
        }
    );

    // 4. Reemplazar {{ variable }} sin default
    html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g,
        (match, varName) => {
            const example = getExample(varName.trim(), '');
            return `<span style="${SPAN_STYLE}">(${example})</span>`;
        }
    );

    // 5. Reemplazar [campo] dentro de texto corriente (no en atributos HTML)
    // Esto cubre casos como [nombre completo] [fecha de ingreso] etc.
    html = html.replace(/\[([^\]]{3,60})\]/g, (match, inner) => {
        // No tocar href, src, class, id, etc. (probablemente no hay en estos templates, pero por seguridad)
        const cleaned = inner.trim();
        return `<span style="${SPAN_STYLE}">(${cleaned})</span>`;
    });

    // 6. Explicar "C." como abreviatura de Ciudadano/Ciudadana
    // Solo cuando aparece como "C. JUEZ", "C. AGENTE", "C. DIRECTOR", etc.
    html = html.replace(/\bC\.\s+(JUEZ|JUEZA|AGENTE|DIRECTOR|DIRECTORA|MAGISTRADO|MAGISTRADA|SECRETARIO|SECRETARIA|PRESIDENTE|PRESIDENTA)/g,
        (match, titulo) => `C. <em style="font-size:9pt;color:#666;">(Ciudadano/Ciudadana)</em> ${titulo}`
    );

    return html;
}

// ─── RECORRER TODOS LOS ARCHIVOS HTML EN V1 Y V2 ────────────────────────────
const TEMPLATES_BASE = path.join(__dirname, '..', 'src', 'data', 'templates');
const VERSIONS = ['v1', 'v2'];

let totalFiles = 0;
let modifiedFiles = 0;

function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            totalFiles++;
            const original = fs.readFileSync(fullPath, 'utf-8');
            const processed = processHtml(original, fullPath);
            if (processed !== original) {
                fs.writeFileSync(fullPath, processed, 'utf-8');
                modifiedFiles++;
                console.log(`  ✅ ${path.relative(TEMPLATES_BASE, fullPath)}`);
            } else {
                console.log(`  ⏭  ${path.relative(TEMPLATES_BASE, fullPath)} (sin cambios)`);
            }
        }
    }
}

console.log('\n🔄 Humanizando templates V1 y V2...\n');

for (const ver of VERSIONS) {
    const versionDir = path.join(TEMPLATES_BASE, ver);
    if (fs.existsSync(versionDir)) {
        console.log(`📁 ${ver}/`);
        walkDir(versionDir);
    } else {
        console.log(`⚠️  No existe directorio: ${versionDir}`);
    }
}

console.log(`\n✨ Listo. ${modifiedFiles} de ${totalFiles} archivos modificados.\n`);
