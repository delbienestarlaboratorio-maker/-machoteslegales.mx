const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2];
const specialty = process.argv[3];

if (!jsonPath || !specialty) {
    console.error("Uso: node generate-from-json.js <archivo.json> <especialidad>");
    process.exit(1);
}

const templates = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const v1Dir = path.join(__dirname, '..', 'src', 'data', 'templates', 'v1', specialty);
if (!fs.existsSync(v1Dir)) {
    fs.mkdirSync(v1Dir, { recursive: true });
}

const indexSnippets = [];

templates.forEach(t => {
    // Escapar backticks en el html por si acaso, aunque el html no debería tener
    // El HTML ya viene con los span reemplazados desde el JSON.
    const safeHtml = `<!DOCTYPE html>\n<html lang="es-MX">\n<head>\n    <meta charset="UTF-8">\n</head>\n<body>\n${t.html}\n</body>\n</html>`;
    const filePath = path.join(v1Dir, `${t.slug}.html`);
    fs.writeFileSync(filePath, safeHtml, 'utf8');

    const snippet = `    {
        id: '${t.id}',
        slug: '${t.slug}',
        title: '${t.title}',
        specialty: '${specialty}',
        tier: 'v1',
        file: 'v1/${specialty}/${t.slug}.html',
        price: 0,
        priceLabel: 'Gratis',
        legalBasis: ${JSON.stringify(t.legalBasis)},
        description: '${t.description}',
        keywords: ${JSON.stringify(t.keywords)},
    },`;
    indexSnippets.push(snippet);
});

const arrayString = `\nexport const templatesV1_${specialty}: Template[] = [\n${indexSnippets.join('\n')}\n];\n`;
fs.writeFileSync(path.join(__dirname, '..', `templates-${specialty}-export.ts`), arrayString);
console.log(`Generados ${templates.length} HTML de ${specialty} y el archivo export.`);
