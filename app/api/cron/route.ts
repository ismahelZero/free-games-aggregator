import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const platforms = ['epic', 'steam', 'indiegala', 'gog'];

    try {
        // 1. RUN SCRAPERS
        const scraperResults = await Promise.all(
            platforms.map(async (platform) => {
                const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                    headers: {'Authorization': `Bearer ${process.env.CRON_SECRET}`},
                    cache: 'no-store'
                });
                return {platform, status: res.ok ? 'Synced' : 'Failed'};
            })
        );

        // 2. AUTO-CLEANUP: Deactivate games past their end date
        const now = new Date();
        const archived = await prisma.offer.updateMany({
            where: {
                isActive: true,
                endDate: {lt: now} // If end date is less than (before) right now
            },
            data: {isActive: false}
        });

        console.log(`Archived ${archived.count} expired games.`);

        // 3. CACHE INVALIDATION: Tell Next.js to refresh the UI
        revalidatePath('/');
        revalidatePath('/graveyard');

        return NextResponse.json({
            success: true,
            scrapers: scraperResults,
            archivedCount: archived.count
        });
    } catch (error: any) {
        return NextResponse.json({success: false, error: error.message}, {status: 500});
    }
}