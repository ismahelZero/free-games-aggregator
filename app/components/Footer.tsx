import {LootVaultLogo} from './LootValueLogo';
import {prisma} from "@/lib/prisma";

const latestSync = await prisma.offer.findFirst({
    orderBy: {updatedAt: 'desc'},
    select: {updatedAt: true}
});

export default function Footer() {
    return (
        <footer className="mt-auto py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
            <div className="flex flex-col items-center gap-4">
                <LootVaultLogo className="w-8 h-8 opacity-50 grayscale"/>
                {latestSync && (
                    <div
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/30 rounded-full border border-slate-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Last Vault Sync: {latestSync.updatedAt.toLocaleString()}
                    </div>
                )}
                <p>© 2026 LootVault. Secure the bag. Play for free.</p>
            </div>
        </footer>
    );
}