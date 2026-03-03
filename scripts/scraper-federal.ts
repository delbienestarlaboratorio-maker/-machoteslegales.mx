import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
const pdfParse = require('pdf-parse');

/**
 * PARSER LEGAL NLP
 */
async function parsearYGuardarLey(estadoSlug: string, leySlug: string, fullText: string) {
    console.log(`🧠 Iniciando Ingestión NLP Local: ${estadoSlug} -> ${leySlug} (${fullText.length} chars)`);

    const lines = fullText.split('\n');
    const allArticles = [];
    let currentArtId = '';
    let currentArtTitle = '';
    let currentContent: string[] = [];

    // Ajuste del RegEx del Parser para admitir "ARTÍCULO 1o." y otras flexiones del PDF
    for (const line of lines) {
        const text = line.trim();
        if (!text) continue;

        // Limpiar basura de header/footer (números de página, títulos de la ley repetidos)
        if (text.match(/CÁMARA DE DIPUTADOS DEL H\. CONGRESO DE LA UNIÓN/i)) continue;
        if (text.match(/Secretaría General/i)) continue;
        if (text.match(/Secretaría de Servicios Parlamentarios/i)) continue;
        if (text.match(/Última Refor/i)) continue;

        // Regex para "ARTÍCULO 1o.-", "Artículo 2o.", "Articulo 3"
        const articuloMatch = text.match(/^(ART[IÍ]CULO\s+\d+[a-zA-Z\s]*[\.\-º°]?)/i);

        if (articuloMatch) {
            if (currentArtTitle && currentContent.length > 0) {
                allArticles.push({
                    id: parseInt(currentArtId.replace(/[^\d]/g, ''), 10) || currentArtTitle.replace(/\s+/g, '-').toLowerCase(),
                    etiqueta: currentArtTitle,
                    texto: currentContent.join('\n\n').replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim()
                });
            }

            const fullTitle = articuloMatch[1];
            currentArtTitle = fullTitle.replace(/[\.\-º°]$/, '').trim();
            currentArtId = currentArtTitle;

            const resto = text.substring(fullTitle.length).trim();
            currentContent = resto ? [resto] : [];
        } else {
            if (currentArtTitle) {
                currentContent.push(text);
            }
        }
    }

    if (currentArtTitle && currentContent.length > 0) {
        allArticles.push({
            id: parseInt(currentArtId.replace(/[^\d]/g, ''), 10) || currentArtTitle.replace(/\s+/g, '-').toLowerCase(),
            etiqueta: currentArtTitle,
            texto: currentContent.join('\n\n').replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim()
        });
    }

    const cleanArticles = allArticles.filter(a => a.texto.length > 5);

    if (cleanArticles.length === 0) {
        console.warn(`⚠️ ALERTA: Parser finalizó con 0 artículos (El OCR del PDF podría estar ilegible).`);
        return false;
    }

    console.log(`✅ ¡Éxito! ${cleanArticles.length} artículos parseados. Escribiendo a disco.`);

    const dbDir = path.join(process.cwd(), 'src', 'data', 'db_leyes', estadoSlug);
    await fs.mkdir(dbDir, { recursive: true });

    const outputPath = path.join(dbDir, `${leySlug}.json`);
    await fs.writeFile(outputPath, JSON.stringify(cleanArticles, null, 2), 'utf8');

    return true;
}


async function crawlDiputadosFederales() {
    console.log("==================================================");
    console.log("🏛️ CRAWLER DE GOBIERNO ABIERTO INICIADO (DIPUTADOS)");
    console.log("==================================================");

    const baseUrl = 'https://www.diputados.gob.mx/LeyesBiblio/index.htm';
    const domain = 'https://www.diputados.gob.mx/LeyesBiblio/';

    try {
        console.log("1. Obteniendo Catálogo de Leyes Federales...");
        // Bypassing axios SSL if their cert is old
        const response = await axios.get(baseUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const linksInteres: any[] = [];
        // Las leyes suelen estar en PDFs en los href de la tabla
        $('a[href$=".pdf"]').each((i, el) => {
            const relHref = $(el).attr('href');
            let nombreLey = $(el).text().trim() || $(el).parent().prev().text().trim();
            if (!nombreLey) nombreLey = "Ley Desconocida " + i;

            if (relHref && relHref.includes('pdf/')) {
                // Generar un SLUG amigable para nuestra DB
                let slug = nombreLey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                linksInteres.push({
                    nombre: nombreLey,
                    slug: slug.substring(0, 50), // Cortar si es muy largo
                    url: domain + relHref
                });
            }
        });

        console.log(`📜 Se detectaron ${linksInteres.length} Archivos PDF Oficiales en el sitio.`);
        if (linksInteres.length === 0) return;

        // Vamos a procesar UN PAR de leyes clave a modo de demostración para el usuario:
        // Buscamos el Código Civil Federal, y la Ley Federal del Trabajo
        const objetivos = linksInteres.filter(l => l.slug.includes('civil') || l.slug.includes('trabajo') || l.slug.includes('comercio'));
        const tops = objetivos.slice(0, 3); // Solo bajamos 3 de jalón para demostrar eficacia

        if (tops.length === 0) tops.push(linksInteres[0]);

        for (const ley of tops) {
            console.log(`\n⬇️  Descargando PDF Oficial: ${ley.nombre}`);
            console.log(`🔗 URL: ${ley.url}`);

            try {
                const pdfResponse = await axios.get(ley.url, {
                    responseType: 'arraybuffer',
                    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
                });

                console.log(`📝 Extrayendo texto puro del PDF (${(pdfResponse.data.byteLength / 1024 / 1024).toFixed(2)} MB)...`);
                const extractor = pdfParse.default || pdfParse;
                const pdfData = await extractor(pdfResponse.data);
                const rawText = pdfData.text;

                // Escribir el texto crudo a disco temporalmente para debug del OCR
                await fs.writeFile(path.join(process.cwd(), 'scripts', 'raw_txt', `debug_${ley.slug}.txt`), rawText, 'utf8');
                console.log(`🛠️ RAW Text dumpéado para Debug en: scripts/raw_txt/debug_${ley.slug}.txt`);

                // Enviar el texto extraído del PDF a nuestro Parser NLP
                await parsearYGuardarLey('federal', ley.slug, rawText);

            } catch (e: any) {
                console.error(`❌ Error al descargar o leer PDF: ${e.message}`);
            }
            // Delay cortesía
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log("\n✅ Demostración de Scraping Federal finalizada. Los JSON de las leyes resultantes han sido generados en /db_leyes/federal/");

    } catch (err: any) {
        console.error(`❌ Error conectando a Diputados: ${err.message}`);
    }
}

crawlDiputadosFederales();
