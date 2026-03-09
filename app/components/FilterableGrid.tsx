"use client";
import React, {useState} from 'react';
import GameCard from './GameCard';
import AdBanner from './AdBanner';

export default function FilterableGrid({games}: { games: any[] }) {
    const [activeFilter, setActiveFilter] = useState('All');

    // Dynamically get unique platforms from the currently active games
    const platforms = ['All', ...Array.from(new Set(games.map(g => g.platform)))];

    // Filter games based on the selected chip
    const filteredGames = activeFilter === 'All' ? games : games.filter(g => g.platform === activeFilter);

    return (
        <div className="w-full">
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
                {platforms.map(platform => (
                    <button
                        key={platform as string}
                        onClick={() => setActiveFilter(platform as string)}
                        className={`px-5 py-2 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                            activeFilter === platform
                                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                        }`}
                    >
                        {platform as string}
                    </button>
                ))}
            </div>

            {/* The Bento Grid */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game, index) => (
                        <React.Fragment key={game.id}>
                            <div
                                className={`${index === 0 && activeFilter === 'All' ? 'sm:col-span-2 lg:col-span-8 lg:row-span-2 h-[350px] sm:h-auto' : 'col-span-1 lg:col-span-4 lg:row-span-1'}`}>
                                <GameCard game={game} isFeatured={index === 0 && activeFilter === 'All'}/>
                            </div>

                            {/* Ad Injection every 4th card */}
                            {(index + 1) % 4 === 0 && (
                                <div className="col-span-1 lg:col-span-4 lg:row-span-1">
                                    <AdBanner/>
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <div
                        className="col-span-full py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                        <p className="text-xl text-slate-500 font-bold">No active loot found for this platform right
                            now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}