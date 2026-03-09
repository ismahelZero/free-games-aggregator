"use client";
import React, {useState} from 'react';
import Image from 'next/image';
import {Copy, PlayIcon, PlaySquare, Share2, X} from 'lucide-react';

export default function GameCard({game, isFeatured = false}: { game: any, isFeatured?: boolean }) {
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(game.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({title: `Free Game: ${game.title}`, url: game.url});
            } catch (err) {
                console.log(err);
            }
        } else {
            handleCopy(e);
        }
    };

    return (
        <>
            {/* The Game Card */}
            <div
                onClick={() => setShowModal(true)}
                className="group relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col"
            >
                <div className="relative w-full h-48 sm:h-full flex-grow overflow-hidden bg-slate-800">
                    <Image
                        src={game.thumbnailUrl || '/placeholder.jpg'}
                        alt={game.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={isFeatured}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"/>
                    <div
                        className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        {game.platform}
                    </div>
                    {/* Play Icon Overlay on Hover */}
                    <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                        <PlaySquare size={48} className="text-white drop-shadow-lg"/>
                    </div>
                </div>

                <div className="relative p-5 sm:p-6 flex flex-col justify-end bg-slate-900">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-1">{game.title}</h3>
                    <div className="flex gap-2">
                        <button onClick={handleShare}
                                className="p-2 sm:p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors z-10">
                            <Share2 size={20}/>
                        </button>
                        <button onClick={handleCopy}
                                className="p-2 sm:p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors relative z-10">
                            <Copy size={20}/>
                            {copied && <span
                                className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-emerald-500 text-white px-2 py-1 rounded">Copied!</span>}
                        </button>
                        <a href={game.url} target="_blank" rel="noopener noreferrer"
                           onClick={(e) => e.stopPropagation()}
                           className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center px-4 transition-colors z-10">
                            Get Game
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Look Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-[#0f172a] rounded-3xl w-full max-w-4xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 md:p-6 flex justify-between items-center border-b border-slate-800">
                            <h3 className="text-xl md:text-2xl font-bold text-white pr-4">{game.title}</h3>
                            <button onClick={() => setShowModal(false)}
                                    className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition">
                                <X size={24}/>
                            </button>
                        </div>

                        {/* 100% Reliable YouTube Search Link styled as a Video Player */}
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(game.title + ' gameplay trailer')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden"
                        >
                            {/* Blurry background version of the game image for cinematic effect */}
                            <Image
                                src={game.thumbnailUrl || '/placeholder.jpg'}
                                alt={game.title}
                                fill
                                className="object-cover opacity-30 blur-sm group-hover:opacity-40 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"/>

                            <div
                                className="relative z-10 flex flex-col items-center gap-4 transition-transform group-hover:scale-110">
                                <div
                                    className="bg-[#ff0000] text-white rounded-2xl p-4 shadow-[0_0_30px_rgba(255,0,0,0.6)]">
                                    <PlayIcon size={48} className="fill-current"/>
                                </div>
                                <span
                                    className="font-bold text-xl text-white drop-shadow-md">Watch Trailer on YouTube</span>
                            </div>
                        </a>

                        <div className="p-4 md:p-6 flex justify-end gap-4 bg-slate-900 border-t border-slate-800">
                            <a href={game.url} target="_blank" rel="noopener noreferrer"
                               className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-xl transition-colors text-lg">
                                Secure the Loot on {game.platform}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}