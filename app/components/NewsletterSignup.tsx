"use client";
import {useState} from 'react';

export function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // This requires creating an /api/subscribe route
        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify({email}),
        });
        setStatus('success');
        setEmail('');
    };

    return (
        <section
            className="mt-24 max-w-2xl mx-auto text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-4">Never Miss a Drop</h3>
            <p className="text-slate-400 mb-8 text-lg">Join the inner circle. Get an email the second we find new free
                games.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-[#0f172a] border border-slate-700 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all text-white"
                />
                <button
                    disabled={status === 'loading'}
                    className="bg-emerald-500 text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                    {status === 'loading' ? 'Joining...' : status === 'success' ? 'You’re in! ✅' : 'Notify Me'}
                </button>
            </form>
        </section>
    );
}