import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Fetch from the specific Steam search URL that filters for 100% off games
        const response = await fetch('https://store.steampowered.com/search/?maxprice=free&category1=998&specials=1', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9', // Forces English titles
                // Bypass the Steam Age Gate to see M-rated freebies
                'Cookie': 'birthtime=283993201; lastagecheckage=1-January-1979; wants_mature_content=1'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);
        let addedCount = 0;

        // 2. Select the game rows from the search results
        const gameRows = $('#search_resultsRows a.search_result_row').toArray();

        for (const row of gameRows) {
            const title = $(row).find('.title').text().trim();
            const gameUrl = $(row).attr('href') || '';
            const imageUrl = $(row).find('.search_capsule img').attr('src') || '';

            let originalPrice = 0;

            // 1. Extract the App ID from the URL (e.g., store.steampowered.com/app/123456/)
            const appIdMatch = gameUrl.match(/\/app\/(\d+)/);

            if (appIdMatch && appIdMatch[1]) {
                const appId = appIdMatch[1];

                try {
                    // 2. Ping the official Steam API specifically for this game's price
                    const priceResponse = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
                    const priceJson = await priceResponse.json();

                    // 3. Steam stores prices in cents (e.g., 1999 = $19.99), so we divide by 100
                    if (priceJson[appId]?.success && priceJson[appId]?.data?.price_overview) {
                        originalPrice = priceJson[appId].data.price_overview.initial / 100;
                    }
                } catch (err) {
                    console.log(`Could not fetch exact price for App ID: ${appId}`);
                }
            }

            if (title && gameUrl) {
                const existingGame = await prisma.offer.findFirst({
                    where: { title: title }
                });

                if (!existingGame) {
                    await prisma.offer.create({
                        data: {
                            title: title,
                            thumbnailUrl: imageUrl,
                            platform: 'Steam',
                            originalPrice: originalPrice, // Now perfectly accurate!
                            url: gameUrl.split('?')[0],
                            startDate: new Date(),
                            endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
                            isActive: true,
                        }
                    });
                    addedCount++;
                }
            }
        }

        return NextResponse.json({ success: true, newGamesScraped: addedCount });

    } catch (error) {
        console.error("Steam scraper error:", error);
        return NextResponse.json({ success: false, error: "Failed to scrape Steam" }, { status: 500 });
    }
}