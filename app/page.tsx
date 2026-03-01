import { prisma } from '@/lib/prisma';
import { Offer } from '@prisma/client'

// Notice the 'async' here - Next.js Server Components can await database calls!
export default async function Home() {

    // Fetch all active games from your PostgreSQL database
    const freeGames = await prisma.offer.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' } // Shows the newest games first
    });

    return (
        <main className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Free Games Right Now
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Automatically tracking the best 100% free PC games.
                    </p>
                </header>

                {/* The Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Map through the database results */}
                    {freeGames.map((game:Offer) => (
                        <div key={game.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col hover:border-blue-500 transition-colors duration-300">

                            {/* Game Thumbnail */}
                            <img
                                src={game.thumbnailUrl}
                                alt={game.title}
                                className="w-full h-56 object-cover"
                            />

                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold mb-1 truncate" title={game.title}>
                                    {game.title}
                                </h2>
                                <p className="text-sm text-gray-400 mb-6 font-medium tracking-wide">
                                    {game.platform}
                                </p>

                                {/* Bottom Row: Price & Claim Button */}
                                <div className="mt-auto flex justify-between items-center">
                                    <div className="flex flex-col">
                    <span className="text-gray-500 line-through text-xs">
                      ${game.originalPrice.toFixed(2)}
                    </span>
                                        <span className="text-green-400 font-bold uppercase tracking-wider text-sm">
                      Free
                    </span>
                                    </div>

                                    <a
                                        href={game.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
                                    >
                                        Claim Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Empty State Fallback */}
                {freeGames.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl text-gray-400">No free games found right now. Check back later!</h3>
                    </div>
                )}

            </div>
        </main>
    );
}