export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="relative flex flex-col items-center">
                {/* Animated Vault Scanner */}
                <div
                    className="w-24 h-24 border-2 border-emerald-500/20 rounded-2xl relative overflow-hidden bg-slate-900/50">
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent h-1/2 w-full animate-[scan_2s_ease-in-out_infinite]"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-left-[15px] border-l-emerald-500 animate-pulse"/>
                    </div>
                </div>
                <p className="mt-6 text-emerald-500 font-black tracking-widest text-xs uppercase animate-pulse">
                    Decrypting Vault...
                </p>
            </div>
        </div>
    );
}