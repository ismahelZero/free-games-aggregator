import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const response = await fetch('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US');
        const json = await response.json();
        const allGames = json.data.Catalog.searchStore.elements;

        const freeGames = allGames.filter((game: any) => {
            return (
                game.promotions &&
                game.promotions.promotionalOffers &&
                game.promotions.promotionalOffers.length > 0 &&
                game.price.totalPrice.discountPrice === 0
            );
        });

        let addedCount = 0;

        for (const game of freeGames) {
            const title = game.title;
            const image = game.keyImages.find((img: any) => img.type === 'OfferImageWide');
            const promoData = game.promotions.promotionalOffers[0].promotionalOffers[0];
            const gameUrl = `https://store.epicgames.com/en-US/p/${game.catalogNs?.mappings[0]?.pageSlug || ''}`;

            // Use upsert to handle updates and reactivations
            await prisma.offer.upsert({
                where: {url: gameUrl},
                update: {
                    isActive: true,
                    thumbnailUrl: image ? image.url : '',
                    endDate: new Date(promoData.endDate),
                },
                create: {
                    title: title,
                    thumbnailUrl: image ? image.url : '',
                    platform: 'Epic Games',
                    originalPrice: game.price.totalPrice.originalPrice / 100,
                    url: gameUrl,
                    startDate: new Date(promoData.startDate),
                    endDate: new Date(promoData.endDate),
                    isActive: true,
                }
            });
            addedCount++;
        }

        return NextResponse.json({success: true, gamesProcessed: addedCount});
    } catch (error) {
        console.error("Epic scraper error:", error);
        return NextResponse.json({success: false, error: "Failed to scrape Epic Games"}, {status: 500});
    }
}