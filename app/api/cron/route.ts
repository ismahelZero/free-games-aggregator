import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        const syncStartTime = new Date();

        // 1. RUN SCRAPERS
        const scraperResults = await Promise.all(
            platforms.map(async (platform) => {
                const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                    headers: {'Authorization': `Bearer ${process.env.CRON_SECRET}`},
                    cache: 'no-store'
                });
                return {platform, status: res.ok ? 'Synced' : `Failed (${res.status})`};
            })
        );

        // 2. CHECK FOR NEWLY ADDED GAMES
        const newGames = await prisma.offer.findMany({
            where: {
                createdAt: {gte: syncStartTime},
                isActive: true
            }
        });

        // 3. SEND DYNAMIC EMAIL TO ALL SUBSCRIBERS
        if (newGames.length > 0 && process.env.RESEND_API_KEY) {
            const subscribers = await prisma.subscriber.findMany({select: {email: true}});
            const emailList = subscribers.map(s => s.email);

            if (emailList.length > 0) {
                await resend.emails.send({
                    from: 'LootVault <alerts@myfps.app>',
                    to: emailList,
                    subject: `🔥 LOOT SECURED: ${newGames.length} New Games Found!`,
                    html: `
                        <div style="background: #0f172a; color: white; padding: 40px; font-family: sans-serif; border: 8px solid #10b981;">
                            <h1 style="color: #10b981;">New Freebies in the Vault!</h1>
                            <p>Our scrapers just found new loot:</p>
                            <ul style="list-style: none; padding: 0;">
                                ${newGames.map(g => `
                                    <li style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                                        <strong style="font-size: 18px; color: #10b981;">${g.title}</strong> on ${g.platform}
                                    </li>
                                `).join('')}
                            </ul>
                            <a href="https://free.myfps.app" style="background: #10b981; color: #0f172a; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">VIEW THE VAULT</a>
                        </div>
                    `
                });
            }
        }

        // 4. AUTO-CLEANUP
        const archived = await prisma.offer.updateMany({
            where: {
                isActive: true,
                endDate: {lt: syncStartTime}
            },
            data: {isActive: false}
        });

        revalidatePath('/');
        revalidatePath('/graveyard');

        return NextResponse.json({
            success: true,
            scrapers: scraperResults,
            newGamesFound: newGames.length,
            archivedCount: archived.count
        });
    } catch (error: any) {
        console.error("CRON MASTER ERROR:", error.message);
        return NextResponse.json({success: false, error: error.message}, {status: 500});
    }
}