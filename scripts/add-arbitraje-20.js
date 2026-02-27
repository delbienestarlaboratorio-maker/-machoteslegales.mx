const fs = require('fs');
const d = JSON.parse(fs.readFileSync('scripts/arbitraje.json', 'utf8'));

d.push({
    id: "arbitraje-mediacion-cam-v1",
    slug: "mediacion-cam-previa-arbitraje",
    title: "Solicitud de Mediacion ante el CAM (Previa al Arbitraje)",
    legalBasis: ["Ley de Mediacion CDMX", "Reglamento de Mediacion CAM"],
    description: "Solicitud formal para iniciar un proceso de mediacion ante el Centro de Arbitraje de Mexico como paso previo al arbitraje.",
    keywords: ["mediacion cam mexico", "mediacion comercial previa arbitraje", "conciliacion cam empresa"],
    html: `<div class="header-v1"><h1>Solicitud de Mediacion ante el CAM</h1></div><p class="meta-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Ciudad de Mexico)</span>, a <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(27 de febrero de 2026)</span></p><div class="section-title">CENTRO DE ARBITRAJE DE MEXICO (CAM) — SERVICIO DE MEDIACION</div><p class="indent text-justify"><strong><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Tech Solutions SA)</span></strong> solicita que se inicie un proceso de MEDIACION con <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Global Corp SA)</span> por la controversia derivada del <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(Contrato No. 0145/2026)</span>, como requisito previo al arbitraje establecido en la clausula <span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(12.3)</span>.</p><div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;">(La Parte Solicitante)</span></div></div>`
});

fs.writeFileSync('scripts/arbitraje.json', JSON.stringify(d, null, 2), 'utf8');
console.log('arbitraje.json actualizado:', d.length, 'plantillas');
