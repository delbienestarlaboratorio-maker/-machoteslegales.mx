import fs from 'fs/promises';
import path from 'path';

/**
 * PARSER LEGAL MASIVO (Alternativa Offline Anti-Bloqueos)
 * 
 * Uso: 
 * 1. Colocar el texto completo de una ley en `scripts/raw_txt/[estado]-[ley].txt`.
 * 2. Correr este script.
 * 3. Tokenizará y escribirá los miles de artículos en `src/data/db_leyes/`.
 */

async function parsearLey(estadoSlug: string, leySlug: string) {
    const rawPath = path.join(process.cwd(), 'scripts', 'raw_txt', `${estadoSlug}-${leySlug}.txt`);
    console.log(`\n🚀 Iniciando Ingestión Legal Local: ${estadoSlug} -> ${leySlug}`);

    try {
        const rawText = await fs.readFile(rawPath, 'utf8');
        console.log(`📖 Texto cargado exitosamente (${rawText.length} bytes). Procesando...`);

        // Separar por renglones
        const lines = rawText.split('\n');

        const allArticles = [];
        let currentArtId = '';
        let currentArtTitle = '';
        let currentContent: string[] = [];

        for (const line of lines) {
            const text = line.trim();
            if (!text) continue;

            // Regex mejorado para captar "Artículo 1º.-", "Artículo 23.-", "Articulo 1."
            const articuloMatch = text.match(/^(ART[IÍ]CULO\s+\d+[a-zA-Z\s]*[\.\-º°]?)/i);

            if (articuloMatch) {
                // Guardar el artículo anterior si existe
                if (currentArtTitle && currentContent.length > 0) {
                    allArticles.push({
                        id: parseInt(currentArtId.replace(/[^\d]/g, ''), 10) || currentArtTitle.replace(/\s+/g, '-').toLowerCase(),
                        etiqueta: currentArtTitle,
                        texto: currentContent.join('\n\n')
                    });
                }

                // Iniciar el nuevo artículo
                const fullTitle = articuloMatch[1];
                currentArtTitle = fullTitle.replace(/[\.\-º°]$/, '').trim();
                currentArtId = currentArtTitle;

                // El resto de la línea es el inicio del contenido
                const resto = text.substring(fullTitle.length).trim();
                currentContent = resto ? [resto] : [];
            } else {
                // Es parte del contenido del artículo activo
                if (currentArtTitle) {
                    currentContent.push(text);
                }
            }
        }

        // Empujar el ultimísimo artículo
        if (currentArtTitle && currentContent.length > 0) {
            allArticles.push({
                id: parseInt(currentArtId.replace(/[^\d]/g, ''), 10) || currentArtTitle.replace(/\s+/g, '-').toLowerCase(),
                etiqueta: currentArtTitle,
                texto: currentContent.join('\n\n')
            });
        }

        const cleanArticles = allArticles.filter(a => a.texto.length > 5);

        if (cleanArticles.length === 0) {
            console.warn("⚠️ No se encontraron artículos. Revisa el formato del TXT (Debe tener renglones que inicien con 'Artículo X').");
            return;
        }

        console.log(`✅ Procesamiento exitoso: ${cleanArticles.length} artículos parseados mediante Regex.`);

        // Escribir archivo estático
        const dbDir = path.join(process.cwd(), 'src', 'data', 'db_leyes', estadoSlug);
        await fs.mkdir(dbDir, { recursive: true });

        const outputPath = path.join(dbDir, `${leySlug}.json`);
        await fs.writeFile(outputPath, JSON.stringify(cleanArticles, null, 2), 'utf8');

        console.log(`💾 JSON Fragmentado escrito en: ${outputPath}`);

    } catch (error: any) {
        console.error(`❌ Error al leer o procesar el archivo: ${error.message}`);
    }
}

async function start() {
    const estado = process.argv[2];
    const ley = process.argv[3];

    if (!estado || !ley) {
        console.error("❌ Error: Debes proveer estado y ley como argumentos.");
        console.log("👉 Ejemplo: npx tsx scripts/parser-leyes.ts federal codigo-civil");
        process.exit(1);
    }

    await parsearLey(estado, ley);
}

start();
