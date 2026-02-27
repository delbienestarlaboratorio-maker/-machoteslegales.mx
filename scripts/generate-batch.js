const fs = require('fs');
const path = require('path');

const area = process.argv[2];
if (!area) { console.error('Uso: node generate-batch.js <area>'); process.exit(1); }

const jsonFile = path.join(__dirname, area + '.json');
const templates = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

const v1Dir = path.join(__dirname, '..', 'src', 'data', 'templates', 'v1', area);
if (!fs.existsSync(v1Dir)) fs.mkdirSync(v1Dir, { recursive: true });

const snips = [];
templates.forEach(t => {
    const html = `<!DOCTYPE html>\n<html lang="es-MX">\n<head>\n    <meta charset="UTF-8">\n</head>\n<body>\n${t.html}\n</body>\n</html>`;
    fs.writeFileSync(path.join(v1Dir, t.slug + '.html'), html, 'utf8');
    const title = t.title.replace(/'/g, "\\'");
    const desc = t.description.replace(/'/g, "\\'");
    snips.push(`    {\n        id: '${t.id}',\n        slug: '${t.slug}',\n        title: '${title}',\n        specialty: '${area}',\n        tier: 'v1',\n        file: 'v1/${area}/${t.slug}.html',\n        price: 0,\n        priceLabel: 'Gratis',\n        legalBasis: ${JSON.stringify(t.legalBasis)},\n        description: '${desc}',\n        keywords: ${JSON.stringify(t.keywords)},\n    },`);
});

const exportContent = `\nexport const templatesV1_${area}: Template[] = [\n${snips.join('\n')}\n];\n`;
fs.writeFileSync(path.join(__dirname, '..', `templates-${area}-export.ts`), exportContent, 'utf8');
console.log(`OK: ${templates.length} plantillas de ${area}`);
