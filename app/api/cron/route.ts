import {NextResponse} from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const platforms = ['epic', 'steam', 'indiegala', 'gog'];

    try {
        // Fire all scrapers at the same time to avoid the 10-second timeout
        const results = await Promise.all(
            platforms.map(async (platform) => {
                try {
                    const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                        headers: {Authorization: `Bearer ${process.env.CRON_SECRET}`},
                        // Important: Tell Vercel not to cache this request
                        cache: 'no-store'
                    });
                    return {platform, status: res.ok ? 'Triggered' : 'Failed'};
                } catch (err) {
                    return {platform, status: 'Error'};
                }
            })
        );

        return NextResponse.json({success: true, results});
    } catch (error) {
        return NextResponse.json({success: false, error: "Cron execution failed"}, {status: 500});
    }
}