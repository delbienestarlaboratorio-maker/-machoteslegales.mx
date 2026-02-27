import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/auth/',
                    '/mis-plantillas',
                    '/_next/',
                ],
            },
        ],
        sitemap: 'https://machoteslegales.mx/sitemap.xml',
        host: 'https://machoteslegales.mx',
    };
}
