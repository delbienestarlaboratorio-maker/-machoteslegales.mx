const fs = require('fs');
const d = JSON.parse(fs.readFileSync('scripts/concursal.json', 'utf8'));

const extra = {
    id: "concursal-reporte-sindico-v1",
    slug: "informe-trimestral-sindico-concurso",
    title: "Informe Trimestral del Sindico en Concurso Mercantil",
    legalBasis: ["Arts. 252-270 LCM"],
    description: "Reporte periodico del sindico al juez sobre el estado de la masa concursal y las gestiones realizadas.",
    keywords: ["informe sindico concurso", "reporte masa concursal", "administracion quiebra sindico"],
    html: `<div class="header-v1"><h1>Informe Trimestral del Sindico</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">C. JUEZ DEL CONCURSO</div><p class="indent text-justify">El SINDICO presenta INFORME TRIMESTRAL del periodo <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(octubre-diciembre 2025)</span>: activos administrados $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(39,000,000.00)</span>; pasivo reconocido $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(45,000,000.00)</span>; ingresos operativos cobrados $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(280,000.00)</span>; gastos concursales $<span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(120,000.00)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(El Sindico)</span></div></div>`
};

d.push(extra);
fs.writeFileSync('scripts/concursal.json', JSON.stringify(d, null, 2), 'utf8');
console.log('concursal.json actualizado:', d.length, 'plantillas');
