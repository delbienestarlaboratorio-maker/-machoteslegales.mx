const fs = require('fs');
const lines = fs.readFileSync('src/data/templates/index.ts', 'utf8').split('\n');

// El bloque UTILIDADES va de la linea 886 a la 930 (0-indexed: 885-929)
// Lo extraemos y lo ponemos al final

const utilStart = 885; // linea 886 (0-indexed)
const utilEnd = 929;   // linea 930 (0-indexed), incluye la linea en blanco

const beforeUtil = lines.slice(0, utilStart);
const utilBlock = lines.slice(utilStart, utilEnd + 1);
const afterUtil = lines.slice(utilEnd + 1);

// Verificar que el bloque es correcto
console.log('Bloque extraido:');
console.log('  Primera linea:', utilBlock[0].trim());
console.log('  Ultima linea:', utilBlock[utilBlock.length - 1].trim());
console.log('  Contiene allTemplates:', utilBlock.some(l => l.includes('allTemplates')));

// Reconstruir: antes + despues + bloque al final
const newContent = [...beforeUtil, ...afterUtil, '', ...utilBlock, ''].join('\n');
fs.writeFileSync('src/data/templates/index.ts', newContent, 'utf8');
console.log('OK: bloque UTILIDADES movido al final');
console.log('Total lineas:', newContent.split('\n').length);
