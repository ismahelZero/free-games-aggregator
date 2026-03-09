import {prisma} from '@/lib/prisma';
import GameCard from '../components/GameCard';
import React from "react";
import AdBanner from "@/app/components/AdBanner";
import Pagination from '../components/Pagination';

export const revalidate = 0;

// 1. Update the type to indicate searchParams is a Promise
export default async function GraveyardPage({
                                                searchParams
                                            }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // 2. Await the search parameters to unwrap the Promise
    const resolvedParams = await searchParams;

    // 3. Now you can safely access .page
    const currentPage = Number(resolvedParams?.page) || 1;
    const itemsPerPage = 20; // Number of games per page
    const skip = (currentPage - 1) * itemsPerPage;

    // Fetch the total count of dead games to calculate total pages
    const totalGames = await prisma.offer.count({
        where: {isActive: false}
    });
    const totalPages = Math.ceil(totalGames / itemsPerPage);

    // Fetch only the specific 20 games for this page
    const expiredGames = await prisma.offer.findMany({
        where: {isActive: false},
        orderBy: {endDate: 'desc'},
        take: itemsPerPage,
        skip: skip,
    });

    return (
        <main className="bg-[#0f172a] text-slate-100 p-6 md:p-12 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-extrabold mb-2">The Graveyard</h2>
                    <p className="text-slate-400 text-lg italic">
                        Gone but not forgotten. <span className="text-emerald-500 font-bold">{totalGames}</span> deals
                        have expired.
                    </p>
                </div>

                <div
                    className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
                    {expiredGames.length > 0 ? (
                        expiredGames.map((game, index) => (
                            <React.Fragment key={game.id}>
                                {/* Standard Graveyard Card */}
                                <div className="col-span-1 lg:col-span-4 lg:row-span-1">
                                    <GameCard game={game} isFeatured={false}/>
                                </div>

                                {/* The Ad Injection: Fires every 4th game */}
                                {(index + 1) % 4 === 0 && (
                                    <div className="col-span-1 lg:col-span-4 lg:row-span-1">
                                        <AdBanner/>
                                    </div>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div
                            className="col-span-full text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                            <span className="text-6xl mb-4 block">🕯️</span>
                            <h3 className="text-xl text-slate-500 font-medium">The graveyard is currently empty.</h3>
                        </div>
                    )}
                </div>

                {/* Inject Pagination Controls at the bottom */}
                <Pagination currentPage={currentPage} totalPages={totalPages}/>
            </div>
        </main>
    );
}