import {prisma} from '@/lib/prisma';
import GameCard from '../components/GameCard';
import {LootVaultLogo} from '../components/LootValueLogo';
import Link from 'next/link';

export const revalidate = 0; // Ensure we see the latest archived games immediately

export default async function GraveyardPage() {
    // Fetch only games that are no longer active
    const expiredGames = await prisma.offer.findMany({
        where: {isActive: false},
        orderBy: {endDate: 'desc'}
    });

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12">
            {/* Header */}
            <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-3 group">
                    <LootVaultLogo className="w-12 h-12"/>
                    <h1 className="text-3xl font-bold tracking-tighter">
                        LOOT<span className="text-slate-500 group-hover:text-emerald-500 transition-colors">VAULT</span>
                    </h1>
                </Link>
                <nav className="flex gap-8 font-medium text-slate-400">
                    <Link href="/" className="hover:text-white transition-colors">Active Loot</Link>
                    <Link href="/graveyard" className="text-emerald-500 border-b-2 border-emerald-500 pb-1">The
                        Graveyard</Link>
                </nav>
            </header>

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

            <footer className="mt-24 text-center text-slate-600 text-sm">
                <p>© 2026 LootVault Graveyard | Data archived via automated scrapers</p>
            </footer>
        </main>
    );
}