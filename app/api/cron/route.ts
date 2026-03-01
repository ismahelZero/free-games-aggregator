import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // 1. Security Check: Only allow Vercel or you to trigger this
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const platforms = ['epic', 'steam', 'indiegala', 'gog'];
    const results = [];

    try {
        // 2. Ping each scraper in sequence
        for (const platform of platforms) {
            const res = await fetch(`${baseUrl}/api/scrapers/${platform}`, {
                headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` }
            });
            const data = await res.json();
            results.push({ platform, status: data.success ? 'Success' : 'Failed' });
        }

        return NextResponse.json({ success: true, results });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Cron execution failed" }, { status: 500 });
    }
}