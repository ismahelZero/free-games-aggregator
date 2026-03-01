import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // 1. Fetch with a fake Chrome browser header to bypass basic bot protection
        const response = await fetch('https://freebies.indiegala.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const html = await response.text();

        // 2. DEBUGGING: Print the first 300 characters of the HTML to your VS Code terminal
        console.log("INDIEGALA HTML RESPONSE:", html.substring(0, 300));

        const $ = cheerio.load(html);
        let addedCount = 0;

        // 3. Find the game containers using the new wrapper class
        const gameCards = $('.products-col-inner').toArray();

        for (const card of gameCards) {

            // 4. Extract data using the exact CSS classes from your screenshot
            const title = $(card).find('.product-title').text().trim();

            // The game link is stored in the <a> tag with the class "fit-click"
            const gameUrl = $(card).find('a.fit-click').attr('href') || '';

            // Because IndieGala lazy-loads images, we grab 'data-img-src' first, then fallback to 'src'
            const imageUrl = $(card).find('img').attr('data-img-src') || $(card).find('img').attr('src') || '';

            // Make sure we actually found a game
            if (title && gameUrl && !gameUrl.includes('javascript')) {

                // 5. Check the database to prevent duplicates
                const existingGame = await prisma.offer.findFirst({
                    where: { title: title }
                });

                if (!existingGame) {
                    // 6. Save the new game to PostgreSQL
                    await prisma.offer.create({
                        data: {
                            title: title,
                            thumbnailUrl: imageUrl,
                            platform: 'IndieGala',
                            originalPrice: 0,
                            url: gameUrl,
                            startDate: new Date(),
                            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Default 1 year expiry
                            isActive: true,
                        }
                    });
                    addedCount++;
                }
            }
        }

        return NextResponse.json({ success: true, newGamesScraped: addedCount });

    } catch (error) {
        console.error("IndieGala scraper error:", error);
        return NextResponse.json({ success: false, error: "Failed to scrape IndieGala" }, { status: 500 });
    }
}