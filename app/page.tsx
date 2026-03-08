import {prisma} from '@/lib/prisma';
import GameCard from './components/GameCard';
import Link from 'next/link';
import {NewsletterSignup} from './components/NewsletterSignup';

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
                    {/* Featured Big Tile: Full width on mobile/tablet, 8-cols on desktop */}
                    {activeGames[0] && (
                        <div className="sm:col-span-1 lg:col-span-8 lg:row-span-2 sm:h-auto">
                            <GameCard game={activeGames[0]} isFeatured={true}/>
                        </div>
                    )}

                    {/* Secondary Tiles: 1-col on mobile, 1-col each on tablet, 4-cols on desktop */}
                    {activeGames.slice(1, 3).map((game) => (
                        <div key={game.id} className="col-span-1 lg:col-span-4 lg:row-span-1 md:row-span-2">
                            <GameCard game={game}/>
                        </div>
                    ))}

                    {/* Graveyard Portal: Full width on mobile, 4-cols on desktop */}
                    <Link href="/graveyard"
                          className="col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-1 bg-slate-800/30 border border-slate-700 rounded-3xl p-6 flex items-center justify-between hover:border-emerald-500/50 group transition-all">
                        <div>
                            <h3 className="text-xl font-bold">The Graveyard</h3>
                            <p className="text-sm text-slate-400">See what you missed.</p>
                        </div>
                        <span className="text-3xl group-hover:rotate-12 transition-transform">💀</span>
                    </Link>

                    {/* Remaining Tiles */}
                    {activeGames.slice(3).map((game) => (
                        <div key={game.id} className="col-span-1 lg:col-span-4 lg:row-span-1">
                            <GameCard game={game}/>
                        </div>
                    ))}
                </div>

                {/* Newsletter Section (#2) */}
                <NewsletterSignup/>
            </main>
        </>
    );
}