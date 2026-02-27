const fs = require('fs');
const d = JSON.parse(fs.readFileSync('scripts/mercantil.json', 'utf8'));
const S = 'background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;';
if (d.length < 20) {
    d.push({
        id: 'mercantil-contrato-suministro-v1',
        slug: 'demanda-incumplimiento-contrato-suministro',
        title: 'Demanda por Incumplimiento de Contrato de Suministro',
        legalBasis: ['Arts. 304-310 Codigo de Comercio'],
        description: 'Reclamacion cuando el proveedor no entrega la mercancia en tiempo o calidad pactada.',
        keywords: ['suministro mercantil', 'proveedor incumplido', 'entrega mercancia'],
        html: '<div class="header-v1"><h1>Demanda por Incumplimiento de Contrato de Suministro</h1></div>' +
            '<p class="meta-line"><span style="' + S + '">(Ciudad de Mexico)</span>, a <span style="' + S + '">(26 de febrero de 2026)</span></p>' +
            '<div class="section-title">C. JUEZ MERCANTIL</div>' +
            '<p class="indent text-justify"><strong><span style="' + S + '">(Supermercados del Norte SA)</span></strong> demanda a <strong><span style="' + S + '">(Proveedor Agricola SA)</span></strong> el cumplimiento del contrato de suministro mensual de <span style="' + S + '">(20 toneladas de aguacate)</span> o el pago de daños por $<span style="' + S + '">(180,000.00)</span> derivados del incumplimiento de <span style="' + S + '">(3 meses consecutivos)</span>.</p>' +
            '<div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="' + S + '">(Actora)</span></div></div>'
    });
    fs.writeFileSync('scripts/mercantil.json', JSON.stringify(d, null, 2));
    console.log('mercantil.json ampliado a: ' + d.length);
} else {
    console.log('Ya tiene ' + d.length + ' elementos');
}
