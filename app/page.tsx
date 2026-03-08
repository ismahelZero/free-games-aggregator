import {prisma} from '@/lib/prisma';
import GameCard from './components/GameCard';
import {NewsletterSignup} from './components/NewsletterSignup';
import AdBanner from "@/app/components/AdBanner";
import React from "react";

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
            <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12">
                {/* Bento Grid */}
                <div
                    className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
                    {activeGames.length > 0 ? (
                        activeGames.map((game, index) => (
                            <React.Fragment key={game.id}>
                                {/* The Game Card */}
                                <div
                                    className={`
                        ${index === 0
                                        ? 'sm:col-span-2 lg:col-span-8 lg:row-span-2 h-[350px] sm:h-auto'
                                        : 'col-span-1 lg:col-span-4 lg:row-span-1'
                                    }
                    `}
                                >
                                    <GameCard game={game} isFeatured={index === 0}/>
                                </div>

                                {/* The Ad Injection: Fires every 4th game (index 3, 7, 11...) */}
                                {(index + 1) % 4 === 0 && (
                                    <div className="col-span-1 lg:col-span-4 lg:row-span-1">
                                        <AdBanner/>
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div
                            className="col-span-full text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                            <h3 className="text-xl md:text-2xl text-slate-500 font-bold px-4">The vault is currently
                                locked. Check back soon!</h3>
                        </div>
                    )}
                </div>
                {/* Newsletter Section (#2) */}
                <NewsletterSignup/>
            </main>
        </>
    );
}