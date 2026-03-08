import {prisma} from '@/lib/prisma';
import GameCard from '../components/GameCard';

export const revalidate = 0; // Ensure we see the latest archived games immediately

export default async function GraveyardPage() {
    // Fetch only games that are no longer active
    const expiredGames = await prisma.offer.findMany({
        where: {isActive: false},
        orderBy: {endDate: 'desc'}
    });

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12">

            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-extrabold mb-2">The Graveyard</h2>
                    <p className="text-slate-400 text-lg italic">Gone but not forgotten. These deals have expired.</p>
                </div>

                {/* Grayscale Grid for Historical Feel */}
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    {expiredGames.map((game) => (
                        <GameCard key={game.id} game={game}/>
                    ))}
                </div>

                {/* Empty State */}
                {expiredGames.length === 0 && (
                    <div
                        className="text-center py-32 bg-slate-800/10 rounded-3xl border border-dashed border-slate-800">
                        <span className="text-6xl mb-4 block">🕯️</span>
                        <h3 className="text-xl text-slate-500 font-medium">The graveyard is currently empty.</h3>
                    </div>
                )}
            </div>
        </main>
    );
}