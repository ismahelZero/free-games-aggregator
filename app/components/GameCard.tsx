"use client";
import {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import Image from "next/image";

export default function GameCard({game, isFeatured = false}: { game: any, isFeatured?: boolean }) {
    const cardRef = useRef(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(game.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        // Use a GSAP context for clean cleanup
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                opacity: 0,
                y: 15, // Subtle movement to prevent "dropping" feel
                duration: 0.6,
                ease: "power2.out",
                delay: Math.random() * 0.2,
                clearProps: "all" // Removes GSAP styles after finishing
            });
        }, cardRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="h-full">
            <a
                href={game.url}
                target="_blank"
                className="group relative block w-full h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl"
            >
                {/* Copy Button */}
                <button onClick={handleCopy}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95">
                    {copied ? "✓" : "🔗"}
                    {copied && (
                        <span
                            className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">COPIED!</span>
                    )}
                </button>
                {/* Fixed Aspect Ratio Container prevents "dropping" */}
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"/>

                <div className="absolute bottom-0 p-6 z-10">
                    <span
                        className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3 inline-block">
                        {game.platform}
                    </span>
                    <h2 className={`${isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold leading-tight line-clamp-2`}>
                        {game.title}
                    </h2>
                </div>
            </a>
        </div>
    );
}