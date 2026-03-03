import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { diccionariJuridico } from '@/data/diccionario';

export const dynamic = 'force-static';

const BASE_URL = 'https://machoteslegales.mx';

// Especialidades disponibles
const especialidades = [
    'civil', 'penal', 'laboral', 'familiar', 'amparo', 'fiscal',
    'mercantil', 'administrativo', 'agrario', 'ambiental', 'inmobiliario',
    'constitucional', 'intelectual', 'notarial', 'internacional',
    'electoral', 'concursal', 'migracion', 'arbitraje'
];

// Extraer especialidad del ID de la plantilla (ej: "civil-demanda-v1" → "civil")
function especialidadDelId(id: string): string {
    const part = id.split('-')[0];
    return especialidades.includes(part) ? part : 'civil';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Importar templates dinámicamente para no romper el build si hay errores de tipado
    let templateEntries: MetadataRoute.Sitemap = [];
    try {
        const { allTemplates } = await import('@/data/templates');
        templateEntries = allTemplates.map((t: any) => {
            const esp = t.specialty || t.especialidad || especialidadDelId(t.id || t.slug);
            return {
                url: `${BASE_URL}/plantillas/${esp}/${t.slug}`,
                lastModified: new Date('2026-02-27'),
                changeFrequency: 'monthly' as const,
                priority: (t.version === 'v1' || t.tier === 'v1') ? 0.7 : 0.6,
            };
        });
    } catch {
        // Si falla el import, solo retornamos las páginas estáticas
    }

    // Indexar calculadoras dinámicamente desde el filesystem
    let calculadorasEntries: MetadataRoute.Sitemap = [];
    try {
        const calcDir = path.join(process.cwd(), 'src', 'app', 'calculadora');
        const calcDirs = fs.readdirSync(calcDir, { withFileTypes: true })
            .filter(dir => dir.isDirectory())
            .map(dir => dir.name);

        calculadorasEntries = calcDirs.map(slug => ({
            url: `${BASE_URL}/calculadora/${slug}`,
            lastModified: new Date('2026-02-28'),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Error reading calculadoras directory for sitemap", e);
    }

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/precios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/plantillas`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/terminos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
        { url: `${BASE_URL}/privacidad`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.2 },
    ];

    // Páginas de listado por especialidad
    const espPages: MetadataRoute.Sitemap = especialidades.map((esp) => ({
        url: `${BASE_URL}/plantillas/${esp}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Indexar Diccionario Juridico
    const diccionarioIndex: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/diccionario`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }
    ];

    const letrasDisponibles = Array.from(new Set(diccionariJuridico.map(term => term.letra.toLowerCase())));
    const diccionarioLetras: MetadataRoute.Sitemap = letrasDisponibles.map(letra => ({
        url: `${BASE_URL}/diccionario/${letra}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8
    }));

    const diccionarioTerminos: MetadataRoute.Sitemap = diccionariJuridico.map(term => ({
        url: `${BASE_URL}/diccionario/${term.letra.toLowerCase()}/${term.id}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7
    }));

    return [...staticPages, ...espPages, ...templateEntries, ...calculadorasEntries, ...diccionarioIndex, ...diccionarioLetras, ...diccionarioTerminos];
}
