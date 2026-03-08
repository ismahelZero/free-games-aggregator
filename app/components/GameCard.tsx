"use client";
import {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import Image from 'next/image';
import {Check, Link as LinkIcon, Share2} from 'lucide-react';

export default function GameCard({game, isFeatured = false}: { game: any, isFeatured?: boolean }) {
    const cardRef = useRef(null);
    const [copied, setCopied] = useState(false);

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
                await navigator.share({
                    title: `Free Game: ${game.title}`,
                    text: `Secure the bag! ${game.title} is currently free on ${game.platform}.`,
                    url: game.url,
                });
            } catch (err) {
                console.log("Share failed", err);
            }
        } else {
            handleCopy(e);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                opacity: 0,
                y: 15,
                duration: 0.6,
                ease: "power2.out",
                delay: Math.random() * 0.2
            });
        }, cardRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="h-full relative group">
            {/* SAVINGS BADGE (#4) */}
            {game.originalPrice > 0 && (
                <div
                    className="absolute -top-2 -right-2 z-30 bg-emerald-500 text-slate-900 font-black text-xs px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform">
                    SAVE ${game.originalPrice.toFixed(2)}
                </div>
            )}

            <a href={game.url} target="_blank"
               className="relative block h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
                <div className="relative w-full h-full min-h-[250px]">
                    <Image
                        src={game.thumbnailUrl}
                        alt={game.title}
                        fill
                        priority={isFeatured} // Loads featured images instantly
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="opacity-50 group-hover:opacity-80 transition-all duration-700"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"/>

                <div className="absolute bottom-0 p-4 sm:p-6 z-10 w-full">
                    <span
                        className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3 inline-block">{game.platform}</span>
                    <h2 className={`${isFeatured ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg'} font-bold leading-tight line-clamp-2`}>{game.title}</h2>

                    {/* ACTION BUTTONS (#5) */}
                    <div className="flex gap-2 mt-4 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleShare}
                                className="p-4 lg:p-2 bg-slate-800/80 rounded-lg hover:bg-emerald-500 hover:text-slate-900 transition-colors">
                            <Share2 size={16}/>
                        </button>
                        <button onClick={handleCopy}
                                className="p-4 lg:p-2 bg-slate-800/80 rounded-lg hover:bg-emerald-500 hover:text-slate-900 transition-colors">
                            {copied ? <Check size={16}/> : <LinkIcon size={16}/>}
                        </button>
                    </div>
                </div>
            </a>
        </div>
    );
}