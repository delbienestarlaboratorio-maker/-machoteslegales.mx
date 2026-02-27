const fs = require('fs');

// Inyectar migracion
let idx = fs.readFileSync('src/data/templates/index.ts', 'utf8');
const mig = fs.readFileSync('templates-migracion-export.ts', 'utf8');
const arb = fs.readFileSync('templates-arbitraje-export.ts', 'utf8');

// Agregar exports al final
if (!idx.includes('templatesV1_migracion')) {
    idx += '\n' + mig;
}
if (!idx.includes('templatesV1_arbitraje')) {
    idx += '\n' + arb;
}

// Insertar en el array allTemplates
if (!idx.includes('...templatesV1_migracion,')) {
    idx = idx.replace(
        '...templatesV1_concursal,',
        '...templatesV1_concursal,\n    ...templatesV1_migracion,'
    );
}
if (!idx.includes('...templatesV1_arbitraje,')) {
    idx = idx.replace(
        '...templatesV1_migracion,',
        '...templatesV1_migracion,\n    ...templatesV1_arbitraje,'
    );
}

fs.writeFileSync('src/data/templates/index.ts', idx, 'utf8');
console.log('OK: migracion y arbitraje inyectados en index.ts');
