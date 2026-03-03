import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://mexico.justia.com';

async function fetchHtml(page: any, url: string) {
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const html = await page.content();
        return html;
    } catch (error: any) {
        console.error(`❌ Error fetching ${url}: ${error.message}`);
        return null;
    }
}

async function scrapeJustiaLaw(stateSlug: string, lawSlug: string, justiaLawPath: string) {
    console.log(`\n🚀 Iniciando extracción con Puppeteer: ${stateSlug} -> ${lawSlug}`);

    const browser = await puppeteer.launch({
        headless: true, // Ejecución silenciosa
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });
    const page = await browser.newPage();

    // Disfrazar el crawler
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    const lawUrl = `${BASE_URL}${justiaLawPath}`;
    const mainHtml = await fetchHtml(page, lawUrl);

    if (!mainHtml) {
        await browser.close();
        return;
    }

    const $ = cheerio.load(mainHtml);

    // Extraer enlaces de capítulos/títulos
    const chapterLinks: string[] = [];
    $('div.law-details a, div.wrapper a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith(justiaLawPath) && href !== justiaLawPath) {
            chapterLinks.push(href);
        }
    });

    // Validar subcapítulos
    const uniqueChapters = [...new Set(chapterLinks)];
    console.log(`📌 Encontrados ${uniqueChapters.length} capítulos/libros.`);

    if (uniqueChapters.length === 0) {
        console.log("⚠️ No se encontraron sub-capítulos. Analizando la página principal directamente...");
        uniqueChapters.push(justiaLawPath);
    }

    const allArticles: any[] = [];

    // Iterar cada capítulo
    for (const chapterPath of uniqueChapters) {
        console.log(`  -> Analizando: ${chapterPath}`);
        const chapterUrl = chapterPath.startsWith('http') ? chapterPath : `${BASE_URL}${chapterPath}`;

        const chapterHtml = await fetchHtml(page, chapterUrl);
        if (!chapterHtml) continue;

        const $$ = cheerio.load(chapterHtml);

        // Extraer los artículos basados en "Artículo X..."
        // En Justia, el DOM es usualmente una serie de <p> o <div>.
        $$('p, div.article-text, div.justify-wrap').each((i, el) => {
            const text = $$(el).text().trim();
            const match = text.match(/^(Artículo\s+\d+[a-zA-Z\s]*[\.\-]?)(.*)$/i);

            if (match) {
                const title = match[1].trim().replace(/[\.\-]$/, '');
                let content = match[2].trim();

                // Atrapar siguientes párrafos que no son artículos nuevos
                let nextNode = $$(el).next();
                while (nextNode.length && !nextNode.text().trim().match(/^Artículo\s+\d+/i)) {
                    content += "\n" + nextNode.text().trim();
                    nextNode = nextNode.next();
                }

                if (content.trim().length > 0) {
                    allArticles.push({
                        id: parseInt(title.replace(/[^\d]/g, ''), 10) || title.replace(/\s+/g, '-').toLowerCase(),
                        etiqueta: title,
                        texto: content
                    });
                }
            }
        });

        // Pausa para evitar rate limits anti-bot
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    await browser.close();

    const cleanArticles = allArticles.filter(a => a.texto.length > 5);

    if (cleanArticles.length === 0) {
        console.log("⚠️ Falló la extracción de artículos. El DOM no contiene la palabra 'Artículo X' como se esperaba.");
        if (uniqueChapters.length > 0) {
            const firstChapterUrl = uniqueChapters[0].startsWith('http') ? uniqueChapters[0] : `${BASE_URL}${uniqueChapters[0]}`;
            const html = await fetchHtml(page, firstChapterUrl);
            await fs.writeFile('debug-justia.html', html || '', 'utf8');
            console.log("📄 Guardado debug-justia.html para inspeccionar la estructura.");
        }
    } else {
        console.log(`✅ Extracción exitosa: ${cleanArticles.length} artículos leídos.`);

        // Escribir archivo estático (La Base de Datos de Archivo Único)
        const dbDir = path.join(process.cwd(), 'src', 'data', 'db_leyes', stateSlug);
        await fs.mkdir(dbDir, { recursive: true });

        const outputPath = path.join(dbDir, `${lawSlug}.json`);
        await fs.writeFile(outputPath, JSON.stringify(cleanArticles, null, 2), 'utf8');

        console.log(`💾 JSON Estático escrito exitosamente en: ${outputPath}`);
    }
}

// Ejecución
async function runTest() {
    await scrapeJustiaLaw(
        'nuevo-leon',
        'codigo-civil',
        '/estatales/nuevo-leon/codigo-civil-para-el-estado-de-nuevo-leon/'
    );
}

runTest();
