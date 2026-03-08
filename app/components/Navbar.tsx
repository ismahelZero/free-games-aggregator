"use client";
import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Ghost, Menu, X} from 'lucide-react';
import {LootVaultLogo} from './LootValueLogo';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        {name: 'Active Loot', href: '/'},
        {name: 'The Graveyard', href: '/graveyard'},
    ];

    return (
        <header
            className="fixed top-0 left-0 right-0 z-[100] bg-[#0f172a] border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3">
                    <LootVaultLogo className="w-10 h-10 md:w-12 md:h-12"/>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
                        LOOT<span className="text-emerald-500">VAULT</span>
                    </h1>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors ${pathname === link.href ? 'text-emerald-500' : 'text-slate-400 hover:text-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Toggle */}
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 text-emerald-500">
                    <Menu size={28}/>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[110] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar Panel - Solid Primary BG */}
            <aside
                className={`fixed top-0 right-0 h-full w-72 bg-[#0f172a] border-l border-slate-800 p-8 transition-transform duration-300 z-[120] md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-10">
                    <Ghost className="text-emerald-500" size={32}/>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400">
                        <X size={32}/>
                    </button>
                </div>
                <nav className="flex flex-col gap-8 text-xl font-bold">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={pathname === link.href ? 'text-emerald-500' : 'text-slate-400'}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </header>
    );
}