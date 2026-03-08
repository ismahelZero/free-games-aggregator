export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Consulting the Archives...</p>
            </div>
        </div>
    );
}