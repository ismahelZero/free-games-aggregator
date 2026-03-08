import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const host = request.headers.get('host');
    const isLocal = host?.includes('localhost');
    const baseUrl = isLocal ? `http://${host}` : 'https://free.myfps.app';

    const platforms = ['epic', 'steam', 'indiegala', 'gog'];

    try {
        // 1. RUN SCRAPERS
        const scraperResults = await Promise.all(
            platforms.map(async (platform) => {
                const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                    headers: {'Authorization': `Bearer ${process.env.CRON_SECRET}`},
                    cache: 'no-store'
                });

                // Log for Vercel debugging
                console.log(`Triggered ${platform} on ${baseUrl}: ${res.status}`);

                return {platform, status: res.ok ? 'Synced' : `Failed (${res.status})`};
            })
        );

        // 2. AUTO-CLEANUP
        const now = new Date();
        const archived = await prisma.offer.updateMany({
            where: {
                isActive: true,
                endDate: {lt: now}
            },
            data: {isActive: false}
        });

        console.log(`Archived ${archived.count} expired games.`);

        // 3. CACHE INVALIDATION
        revalidatePath('/');
        revalidatePath('/graveyard');

        return NextResponse.json({
            success: true,
            scrapers: scraperResults,
            archivedCount: archived.count,
            triggeredOn: baseUrl
        });
    } catch (error: any) {
        console.error("CRON MASTER ERROR:", error.message);
        return NextResponse.json({success: false, error: error.message}, {status: 500});
    }
}