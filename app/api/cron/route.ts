import {NextResponse} from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    // 1. Get the current host dynamically from the request itself
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const platforms = ['epic', 'steam', 'indiegala', 'gog'];

    try {
        const results = await Promise.all(
            platforms.map(async (platform) => {
                // 2. Use the dynamic baseUrl
                const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.CRON_SECRET}`
                    },
                    cache: 'no-store'
                });

                // 3. Log the status for Vercel logs so you can see which one fails
                console.log(`Scraping ${platform}: ${res.status}`);

                return {platform, status: res.ok ? 'Success' : `Failed (${res.status})`};
            })
        );

        return NextResponse.json({success: true, results});
    } catch (error: any) {
        console.error("CRON ERROR:", error.message);
        return NextResponse.json({success: false, error: error.message}, {status: 500});
    }
}