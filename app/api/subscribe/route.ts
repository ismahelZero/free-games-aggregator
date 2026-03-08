// app/api/subscribe/route.ts
import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const {email} = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({error: 'Invalid email'}, {status: 400});
        }

        // Use upsert to prevent errors if the user is already subscribed
        await prisma.subscriber.upsert({
            where: {email},
            update: {},
            create: {email}
        });

        return NextResponse.json({success: true});
    } catch (error: any) {
        console.error("Subscription Error:", error.message);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}