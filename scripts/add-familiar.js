const fs = require('fs');
const d = JSON.parse(fs.readFileSync('scripts/familiar.json', 'utf8'));
const S = 'background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;';
d.push({
    id: 'familiar-reduccion-pension-v1',
    slug: 'demanda-reduccion-pension-alimenticia',
    title: 'Demanda de Reduccion de Pension Alimenticia',
    legalBasis: ['Art. 311 CCDF'],
    description: 'Solicitud del deudor para bajar la pension cuando disminuyen sus ingresos o aumentan cargas.',
    keywords: ['reduccion alimentos', 'bajar pension', 'cambio circunstancias alimentarias'],
    html: '<div class="header-v1"><h1>Demanda de Reduccion de Pension Alimenticia</h1></div>' +
        '<p class="meta-line"><span style="' + S + '">(Ciudad de Mexico)</span>, a <span style="' + S + '">(26 de febrero de 2026)</span></p>' +
        '<div class="section-title">C. JUEZ FAMILIAR</div>' +
        '<p class="indent text-justify"><strong><span style="' + S + '">(Carlos Ramirez)</span></strong> solicita la REDUCCION de la pension fijada en <span style="' + S + '">(2023)</span>, ya que perdio su empleo el <span style="' + S + '">(enero de 2026)</span> y actualmente percibe solo $<span style="' + S + '">(8,000.00)</span> mensuales.</p>' +
        '<div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="' + S + '">(Deudor Alimentario)</span></div></div>'
});
fs.writeFileSync('scripts/familiar.json', JSON.stringify(d, null, 2));
console.log('familiar.json: ' + d.length);
