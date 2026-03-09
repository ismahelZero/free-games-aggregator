import {prisma} from '@/lib/prisma';
import {NewsletterSignup} from './components/NewsletterSignup';
import React from "react";
import FilterableGrid from "@/app/components/FilterableGrid";

export const revalidate = 0;

export default async function Home() {
    const activeGames = await prisma.offer.findMany({
        where: {isActive: true},
        orderBy: {createdAt: 'desc'}
    });

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Active Free Games Loot',
        'itemListElement': activeGames.map((game, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
                '@type': 'Product',
                'name': game.title,
                'image': game.thumbnailUrl,
                'description': `Free game giveaway on ${game.platform}.`,
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'USD',
                    'availability': 'https://schema.org/InStock',
                    'url': game.url,
                },
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <main className="min-h-screen max-w-7xl mx-auto bg-[#0f172a] text-slate-100 p-6 md:p-8">
                <FilterableGrid games={activeGames}/>
                {/* Newsletter Section (#2) */}
                <NewsletterSignup/>
            </main>
        </>
    );
}