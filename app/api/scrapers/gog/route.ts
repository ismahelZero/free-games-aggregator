import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // 1. Fetch the first 100 discounted games from GOG's official catalog API
            const response = await fetch('https://catalog.gog.com/v1/catalog?limit=100&price=discounted');
        const json = await response.json();

        // 2. Filter the results to ONLY include games with a 100% discount
        const freeGames = json.products.filter((game: any) => {
            return game.price && game.price.discountPercentage === 100;
        });

        let addedCount = 0;

        // 3. Loop through the 100% free games and format them
        for (const game of freeGames) {
            const title = game.title;

            // GOG provides clean store links using the game's "slug"
            const gameUrl = `https://www.gog.com/en/game/${game.slug}`;

            // Formatting the image URL (GOG omits the 'https:' in their JSON responses)
            const imageUrl = game.cover.startsWith('http') ? game.cover : `https:${game.cover}`;

            // Get the original price before the discount (GOG stores this as a string)
            const originalPrice = parseFloat(game.price.baseMoney.amount) || 0;

            if (title && gameUrl) {
                // Check database to prevent duplicates
                const existingGame = await prisma.offer.findFirst({
                    where: { title: title }
                });

                if (!existingGame) {
                    await prisma.offer.create({
                        data: {
                            title: title,
                            // We append a larger resolution tag to GOG's image URL for better frontend quality
                            thumbnailUrl: imageUrl.replace('.webp', '_product_tile_256.webp'),
                            platform: 'GOG',
                            originalPrice: originalPrice,
                            url: gameUrl,
                            startDate: new Date(),
                            // Giveaways usually last 72 hours on GOG
                            endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
                            isActive: true,
                        }
                    });
                    addedCount++;
                }
            }
        }

        return NextResponse.json({ success: true, newGamesScraped: addedCount });

    } catch (error) {
        console.error("GOG scraper error:", error);
        return NextResponse.json({ success: false, error: "Failed to scrape GOG" }, { status: 500 });
    }
}