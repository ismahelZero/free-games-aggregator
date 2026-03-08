"use client";
import {useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';

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
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
            delay: Math.random() * 0.3
        });
    }, []);

    return (
        <a href={game.url} target="_blank" ref={cardRef}
           className="group relative block w-full h-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl">
            {/* Copy Button */}
            <button onClick={handleCopy}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95">
                {copied ? "✓" : "🔗"}
                {copied && (
                    <span
                        className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">COPIED!</span>
                )}
            </button>

            <img src={game.thumbnailUrl} alt={game.title}
                 className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"/>
            <div className="absolute bottom-0 p-6 md:p-8">
                <span
                    className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-3 inline-block">{game.platform}</span>
                <h2 className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-bold leading-tight`}>{game.title}</h2>
            </div>
        </a>
    );
}