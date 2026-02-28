const fs = require('fs');
let c = fs.readFileSync('src/data/templates/index.ts', 'utf8');
const before = "| 'ambiental' | 'internacional' | 'propiedad_intelectual' | 'transito'";
const after = "| 'ambiental' | 'internacional' | 'propiedad_intelectual' | 'transito'\n    | 'constitucional' | 'electoral' | 'inmobiliario' | 'intelectual'\n    | 'notarial' | 'concursal' | 'migracion' | 'arbitraje'";
if (c.includes(before)) {
    c = c.replace(before, after);
    fs.writeFileSync('src/data/templates/index.ts', c, 'utf8');
    console.log('OK: tipo Specialty actualizado con 8 nuevas especialidades');
} else {
    console.log('Ya está actualizado o no se encontró el patron');
    const hasArbitraje = c.includes("'arbitraje'");
    console.log('Tiene arbitraje:', hasArbitraje);
}
