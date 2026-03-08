import {prisma} from '@/lib/prisma';
import GameCard from '../components/GameCard';
import React from "react";
import AdBanner from "@/app/components/AdBanner";

export const revalidate = 0; // Ensure we see the latest archived games immediately

export default async function GraveyardPage() {
    // Fetch only games that are no longer active
    const expiredGames = await prisma.offer.findMany({
        where: {isActive: false},
        orderBy: {endDate: 'desc'}
    });

    return (
        <main className=" bg-[#0f172a] text-slate-100 p-6 md:p-12">

            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-extrabold mb-2">The Graveyard</h2>
                    <p className="text-slate-400 text-lg italic">Gone but not forgotten. These deals have expired.</p>
                </div>

                {/* Grayscale Grid for Historical Feel */}
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

            </div>
        </main>
    );
}