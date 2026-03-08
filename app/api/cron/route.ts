import {NextResponse} from 'next/server';

export async function GET(request: Request) {
    // 1. Check if the person calling THIS master cron has the secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    // 2. Use your new subdomain for the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://free.myfps.app';
    const platforms = ['epic', 'steam', 'indiegala', 'gog'];

    try {
        const results = await Promise.all(
            platforms.map(async (platform) => {
                const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                    headers: {
                        // 3. THIS IS THE KEY: Passing the secret to the scrapers
                        'Authorization': `Bearer ${process.env.CRON_SECRET}`
                    },
                    cache: 'no-store'
                });
                return {platform, status: res.ok ? 'Success' : 'Failed'};
            })
        );

        return NextResponse.json({success: true, results});
    } catch (error) {
        return NextResponse.json({success: false, error: "Cron execution failed"}, {status: 500});
    }
}