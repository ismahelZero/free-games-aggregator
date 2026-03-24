import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/']
        },
        sitemap: 'https://free.myfps.app/sitemap.xml'
    }
}
