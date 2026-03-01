import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        // 1. Fetch data directly from Epic's hidden API
        const response = await fetch('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US');
        const json = await response.json();

        // 2. Navigate the JSON tree
        const allGames = json.data.Catalog.searchStore.elements;

        // 3. Filter for active 100% free promotions
        const freeGames = allGames.filter((game: any) => {
            return (
                game.promotions &&
                game.promotions.promotionalOffers &&
                game.promotions.promotionalOffers.length > 0 &&
                game.price.totalPrice.discountPrice === 0
            );
        });

        let addedCount = 0;

        // 4. Save to database
        for (const game of freeGames) {
            const title = game.title;

            const existingGame = await prisma.offer.findFirst({
                where: { title: title }
            });

            if (!existingGame) {
                const image = game.keyImages.find((img: any) => img.type === 'OfferImageWide');
                const promoData = game.promotions.promotionalOffers[0].promotionalOffers[0];

                await prisma.offer.create({
                    data: {
                        title: title,
                        thumbnailUrl: image ? image.url : '',
                        platform: 'Epic Games',
                        originalPrice: game.price.totalPrice.originalPrice / 100,
                        url: `https://store.epicgames.com/en-US/p/${game.catalogNs?.mappings[0]?.pageSlug || ''}`,
                        startDate: new Date(promoData.startDate),
                        endDate: new Date(promoData.endDate),
                        isActive: true,
                    }
                });
                addedCount++;
            }
        }

        return NextResponse.json({ success: true, newGamesScraped: addedCount });

    } catch (error) {
        console.error("Epic scraper error:", error);
        return NextResponse.json({ success: false, error: "Failed to scrape Epic Games" }, { status: 500 });
    }
}