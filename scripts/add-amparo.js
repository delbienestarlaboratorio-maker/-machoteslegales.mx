const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scripts/amparo.json'));
data.push({
    id: 'amparo-recurso-revocacion-v1',
    slug: 'recurso-revocacion-amparo',
    title: 'Recurso de Revocación en Amparo',
    legalBasis: ['Arts. 266 Ley de Amparo'],
    description: 'Medio de impugnación contra acuerdos de trámite que dicte el presidente de la Suprema Corte o los Colegiados.',
    keywords: ['revocación amparo', 'impugnar trámite colegiado'],
    html: '<div class="header-v1">\n    <h1>Recurso de Revocación</h1>\n</div>\n<p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(Ciudad de México)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(26 de febrero de 2026)</span></p>\n<div class="section-title">H. PRESIDENTE DEL TRIBUNAL COLEGIADO</div>\n<p class="indent text-justify">Vengo a interponer recurso de revocación contra el acuerdo de trámite dictado con fecha <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(20 de febrero)</span> que me requiere exhibir copias excedentes de la demanda.</p>\n<p class="indent text-justify">Solicito se revoque por ser contrario a derecho y se admita procedentemente el recurso intentado previamente.</p>\n<div class="signature-block" style="margin-top:50px;">\n    <div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;font-style:normal;">(Recurrente)</span></div>\n</div>'
});
fs.writeFileSync('scripts/amparo.json', JSON.stringify(data, null, 2));
console.log('Amparo json updated to ' + data.length + ' items');
