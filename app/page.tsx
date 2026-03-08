import {prisma} from '@/lib/prisma';
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
            {/* ... (Header and Bento Grid) */}

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