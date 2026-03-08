import {NextResponse} from 'next/server';
import * as cheerio from 'cheerio';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const response = await fetch('https://freebies.indiegala.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);
        let addedCount = 0;

        const gameCards = $('.products-col-inner').toArray();

        for (const card of gameCards) {
            const title = $(card).find('.product-title').text().trim();
            const gameUrl = $(card).find('a.fit-click').attr('href') || '';
            const imageUrl = $(card).find('img').attr('data-img-src') || $(card).find('img').attr('src') || '';

            if (title && gameUrl && !gameUrl.includes('javascript')) {
                await prisma.offer.upsert({
                    where: {url: gameUrl},
                    update: {
                        isActive: true,
                        thumbnailUrl: imageUrl,
                    },
                    create: {
                        title: title,
                        thumbnailUrl: imageUrl,
                        platform: 'IndieGala',
                        originalPrice: 0,
                        url: gameUrl,
                        startDate: new Date(),
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        isActive: true,
                    }
                });
                addedCount++;
            }
        }

        return NextResponse.json({success: true, gamesProcessed: addedCount});
    } catch (error) {
        console.error("IndieGala scraper error:", error);
        return NextResponse.json({success: false, error: "Failed to scrape IndieGala"}, {status: 500});
    }
}