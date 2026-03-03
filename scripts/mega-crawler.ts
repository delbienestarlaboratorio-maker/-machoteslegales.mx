import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Para poder importar módulos TypeScript como `estadosRepublica` directamente en ts-node / tsx
import { estadosRepublica } from '../src/data/estados';
import { estadoLeyesMock } from '../src/data/leyes';

puppeteer.use(StealthPlugin());

/**
 * Espera pasiva
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * PARSER LEGAL (Misma lógica probada del Fase 14)
 */
async function parsearYGuardarLey(estadoSlug: string, leySlug: string, fullText: string) {
    console.log(`🧠 Iniciando Ingestión NLP Local: ${estadoSlug} -> ${leySlug} (${fullText.length} chars)`);

    const lines = fullText.split('\n');
    const allArticles = [];
    let currentArtId = '';
    let currentArtTitle = '';
    let currentContent: string[] = [];

    for (const line of lines) {
        const text = line.trim();
        if (!text) continue;

        const articuloMatch = text.match(/^(ART[IÍ]CULO\s+\d+[a-zA-Z\s]*[\.\-º°]?)/i);

        if (articuloMatch) {
            if (currentArtTitle && currentContent.length > 0) {
                allArticles.push({
                    id: parseInt(currentArtId.replace(/[^\d]/g, ''), 10) || currentArtTitle.replace(/\s+/g, '-').toLowerCase(),
                    etiqueta: currentArtTitle,
                    texto: currentContent.join('\n\n')
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
            texto: currentContent.join('\n\n')
        });
    }

    const cleanArticles = allArticles.filter(a => a.texto.length > 5);

    if (cleanArticles.length === 0) {
        console.warn(`⚠️ ALERTA: Parser finalizó pero encontró 0 artículos válidos. Posible error de extracción.`);
        return false;
    }

    console.log(`✅ ¡Éxito! ${cleanArticles.length} artículos parseados. Escribiendo a disco.`);

    const dbDir = path.join(process.cwd(), 'src', 'data', 'db_leyes', estadoSlug);
    await fs.mkdir(dbDir, { recursive: true });

    const outputPath = path.join(dbDir, `${leySlug}.json`);
    await fs.writeFile(outputPath, JSON.stringify(cleanArticles, null, 2), 'utf8');

    return true;
}

/**
 * MOTOR DE SCRAPING CON DDG Y JUSTIA
 */
async function arrancarMegaCrawler() {
    console.log("==================================================");
    console.log("🚀 MEGA-CRAWLER NOCTURNO INICIADO (Modo Automático)");
    console.log("==================================================");

    const logPath = path.join(process.cwd(), 'scripts', 'crawler-log.txt');

    const browser = await puppeteer.launch({
        headless: true, // "new" si tira warning en consolas actuales
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    try {
        const page = await browser.newPage();

        // Bloquear recursos innecesarios para speed-up
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Loop masivo de leyes
        for (const estado of estadosRepublica) {
            for (const ley of estadoLeyesMock) {
                const dbPath = path.join(process.cwd(), 'src', 'data', 'db_leyes', estado.id, `${ley.id}.json`);

                // Si la ley ya existe asume que fue parseada excitósamente (Safe Resume Point)
                try {
                    await fs.access(dbPath);
                    console.log(`⏩ SALTADO: ${estado.nombre} - ${ley.nombre} ya existe.`);
                    continue;
                } catch (e) { }

                console.log(`\n---------------------------------`);
                console.log(`🔍 BUCANDO LEY: ${ley.nombre} de ${estado.nombre}`);

                let success = false;

                try {
                    // 1. DuckDuckGo HTML API
                    const query = `site:mexico.justia.com "${ley.nombre}" "${estado.nombre}"`;
                    await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

                    const urls = await page.evaluate(() => {
                        const links = Array.from(document.querySelectorAll('.result__url'));
                        return links.map(a => (a as HTMLAnchorElement).href.trim()).filter(h => h.includes('mexico.justia.com/estatales/'));
                    });

                    let justiaUrl = urls.length > 0 ? urls[0] : null;

                    if (!justiaUrl) {
                        console.log(`🚫 Búsqueda DDG vacía. Intentando predecir URL...`);
                        // Fallback Predictivo "Safe Guess"
                        justiaUrl = `https://mexico.justia.com/estatales/${estado.id}/${ley.id}-para-el-estado-de-${estado.id}/`;
                    } else {
                        console.log(`📍 Url Encontrada en DDG: ${justiaUrl}`);
                    }

                    // Removemos cualquier tracking o redirección de DDG (A veces DDG parsea sus hrefs raro, o Justia usa //)
                    // Generalmente html.duckduckgo.com/html no hace deep redirects en innerText
                    if (!justiaUrl.startsWith('http')) justiaUrl = 'https://' + justiaUrl;

                    // 2. Navegar a Justia
                    await page.goto(justiaUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
                    await delay(3000); // Wait for potential CF Turnstile/JS challenge

                    // Confirmar que no es un 404
                    const is404 = await page.evaluate(() => document.body.innerText.includes('Página No Encontrada') || document.body.innerText.includes('404'));
                    if (is404) {
                        throw new Error("Justia 404 - No Encontrado");
                    }

                    // 3. Extraer el Texto Puro de la Portada
                    let globalText = await page.evaluate(() => document.body.innerText);

                    // 4. Buscar Sub-Niveles (Paginación de Leyes largas)
                    const baseUrlSlug = new URL(justiaUrl).pathname;
                    const subLinks = await page.evaluate((baseHref) => {
                        return Array.from(document.querySelectorAll('a'))
                            .map(a => a.href)
                            .filter(href => href.includes(baseHref) && href !== location.href && !href.includes('#')) // Validar que sean hijos
                            .filter((value, index, self) => self.indexOf(value) === index); // Unique
                    }, baseUrlSlug);

                    if (subLinks.length > 0) {
                        console.log(`📁 Detectada paginación de ley (Capítulos). Recolectando ${subLinks.length} sub-páginas...`);

                        // Recolectar top 100 links (seguridad contra bucles)
                        const linksToVisit = subLinks.slice(0, 100);
                        for (let i = 0; i < linksToVisit.length; i++) {
                            const subLink = linksToVisit[i];
                            process.stdout.write(`\r  > Scrapeando pag ${i + 1}/${linksToVisit.length}... `);
                            try {
                                await page.goto(subLink, { waitUntil: 'domcontentloaded', timeout: 15000 });
                                const subText = await page.evaluate(() => document.body.innerText);
                                globalText += '\n\n' + subText;
                                await delay(800); // Be polite a Justia
                            } catch (subErr) {
                                console.log(' (Timeout en subpagina)');
                            }
                        }
                        process.stdout.write("\n");
                    }

                    // 5. Enviar a Parsing NLP
                    if (globalText.length > 1000) {
                        const parsingResult = await parsearYGuardarLey(estado.id, ley.id, globalText);
                        if (parsingResult) success = true;
                    } else {
                        throw new Error("El texto extraído es demasiado corto para ser una ley válida.");
                    }

                } catch (err: any) {
                    console.error(`❌ Error en Extracción: ${err.message}`);
                }

                if (!success) {
                    await fs.appendFile(logPath, `Fallo: ${estado.id} - ${ley.id} - ${new Date().toISOString()}\n`, 'utf8');
                } else {
                    await fs.appendFile(logPath, `Exito: ${estado.id} - ${ley.id} - ${new Date().toISOString()}\n`, 'utf8');
                }

                // Espera entre Ley y Ley para evitar Rate Limits Globales
                console.log(`⏳ Esperando 4 segundos para enfriar la IP...`);
                await delay(4000);
            }
        }
    } catch (criticalError: any) {
        console.error(`☠️ CRASH CRITICO DEL CRAWLER: ${criticalError.message}`);
    } finally {
        console.log("🔌 Cerrando Instancia del Explorador...");
        await browser.close();
    }
}

// Inicializador
arrancarMegaCrawler();
