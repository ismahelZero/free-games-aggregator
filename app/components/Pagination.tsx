import Link from 'next/link';

export default function Pagination({currentPage, totalPages}: { currentPage: number, totalPages: number }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-16">
            {currentPage > 1 ? (
                <Link
                    href={`/graveyard?page=${currentPage - 1}`}
                    className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                >
                    Previous
                </Link>
            ) : (
                <span className="px-6 py-3 rounded-xl bg-slate-800/40 text-slate-600 font-bold cursor-not-allowed">
                    Previous
                </span>
            )}

            <span className="text-slate-400 font-bold px-4">
                Page <span className="text-white">{currentPage}</span> of {totalPages}
            </span>

            {currentPage < totalPages ? (
                <Link
                    href={`/graveyard?page=${currentPage + 1}`}
                    className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                >
                    Next
                </Link>
            ) : (
                <span className="px-6 py-3 rounded-xl bg-slate-800/40 text-slate-600 font-bold cursor-not-allowed">
                    Next
                </span>
            )}
        </div>
    );
}