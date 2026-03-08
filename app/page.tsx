import {prisma} from '@/lib/prisma';
import {LootVaultLogo} from "@/app/components/LootValueLogo";
import Link from "next/link";
import GameCard from "@/app/components/GameCard";
// ... (Logo and Link imports)

export default async function Home() {
    const activeGames = await prisma.offer.findMany({
        where: {isActive: true},
        orderBy: {createdAt: 'desc'}
    });

    // Get the latest update time from any offer
    const lastUpdate = activeGames.length > 0
        ? new Date(Math.max(...activeGames.map(g => g.updatedAt.getTime())))
        : null;

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12">
            <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <LootVaultLogo className="w-12 h-12"/>
                    <h1 className="text-3xl font-bold tracking-tighter">LOOT<span
                        className="text-emerald-500 text-glow">VAULT</span></h1>
                </div>
                <nav className="flex gap-8 font-medium text-slate-400">
                    <Link href="/" className="text-emerald-500 border-b-2 border-emerald-500 pb-1">Active Loot</Link>
                    <Link href="/graveyard" className="hover:text-white transition-colors">The Graveyard</Link>
                </nav>
            </header>

            {/* Bento Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[280px]">
                {/* 1. Featured Big Tile */}
                {activeGames[0] && (
                    <div className="md:col-span-4 lg:col-span-8 lg:row-span-2">
                        <GameCard game={activeGames[0]} isFeatured={true}/>
                    </div>
                )}

                {/* 2. Secondary Tiles */}
                {activeGames.slice(1, 3).map((game) => (
                    <div key={game.id} className="md:col-span-2 lg:col-span-4 lg:row-span-2">
                        <GameCard game={game}/>
                    </div>
                ))}

                {/* 3. The Graveyard Portal (Bento Tile) */}
                <Link href="/graveyard"
                      className="lg:col-span-4 lg:row-span-1 bg-slate-800/30 border border-slate-700 rounded-3xl p-6 flex items-center justify-between hover:border-emerald-500/50 group transition-all">
                    <div>
                        <h3 className="text-xl font-bold">The Graveyard</h3>
                        <p className="text-sm text-slate-400">See what you missed.</p>
                    </div>
                    <span className="text-3xl group-hover:rotate-12 transition-transform">💀</span>
                </Link>

                {/* 4. Smaller Remaining Tiles */}
                {activeGames.slice(3).map((game) => (
                    <div key={game.id} className="md:col-span-2 lg:col-span-4 lg:row-span-1">
                        <GameCard game={game}/>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {activeGames.length === 0 && (
                <div
                    className="text-center mt-10 py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 max-w-7xl mx-auto">
                    <h3 className="text-2xl text-slate-500 font-bold">The vault is currently locked. Check back
                        soon!</h3>
                </div>)}

            {/* Last Synced Footer */}
            <footer className="mt-20 flex flex-col items-center justify-center gap-4 text-slate-500 text-sm">
                {lastUpdate && (
                    <div
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-full border border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Last Vault Sync: {lastUpdate.toLocaleString()}
                    </div>
                )}
                <p>© 2026 LootVault. All rights reserved.</p>
            </footer>
        </main>
    );
}