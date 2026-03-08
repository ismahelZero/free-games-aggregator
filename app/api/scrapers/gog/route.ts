import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const response = await fetch('https://catalog.gog.com/v1/catalog?limit=100&price=discounted');
        const json = await response.json();

        const freeGames = json.products.filter((game: any) => {
            return game.price && game.price.discountPercentage === 100;
        });

        let addedCount = 0;

        for (const game of freeGames) {
            const title = game.title;
            const gameUrl = `https://www.gog.com/en/game/${game.slug}`;
            const imageUrl = game.cover.startsWith('http') ? game.cover : `https:${game.cover}`;
            const finalImageUrl = imageUrl.replace('.webp', '_product_tile_256.webp');
            const originalPrice = parseFloat(game.price.baseMoney.amount) || 0;

            if (title && gameUrl) {
                await prisma.offer.upsert({
                    where: {url: gameUrl},
                    update: {
                        isActive: true,
                        thumbnailUrl: finalImageUrl,
                        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
                    },
                    create: {
                        title: title,
                        thumbnailUrl: finalImageUrl,
                        platform: 'GOG',
                        originalPrice: originalPrice,
                        url: gameUrl,
                        startDate: new Date(),
                        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
                        isActive: true,
                    }
                });
                addedCount++;
            }
        }

        return NextResponse.json({success: true, gamesProcessed: addedCount});
    } catch (error) {
        console.error("GOG scraper error:", error);
        return NextResponse.json({success: false, error: "Failed to scrape GOG"}, {status: 500});
    }
}