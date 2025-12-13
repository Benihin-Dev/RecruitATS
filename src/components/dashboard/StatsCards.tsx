
import Link from "next/link";

interface StatsCardsProps {
    stats: {
        jobs: number;
        applicants: number;
    };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <div className="absolute right-0 top-0 p-4 opacity-30 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <svg className="w-32 h-32 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Jobs</p>
                    <p className="text-5xl font-extrabold text-gray-900 tracking-tight">{stats.jobs}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                        <span>↑ 12% from last week</span>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 relative overflow-hidden group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <div className="absolute right-0 top-0 p-4 opacity-30 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <svg className="w-32 h-32 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Applicants</p>
                    <p className="text-5xl font-extrabold text-gray-900 tracking-tight">{stats.applicants}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                        <span>↑ 5 New today</span>
                    </div>
                </div>
            </div>

            {/* Card 3 - Action */}
            <div className="bg-gradient-to-br from-primary-500 to-red-600 rounded-2xl p-6 shadow-lg shadow-orange-500/30 text-white relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">🔥</span>
                        <p className="text-lg font-bold text-gray-500 ">Pro Tip</p>
                    </div>
                    <p className="text-gray-600  text-sm leading-relaxed ">Review your &quot;Pending&quot; applications to keep the pipeline moving! Candidates love fast feedback.</p>
                </div>
                <Link href="/jobs" className="mt-6 bg-white text-primary font-bold py-3 px-4 rounded-xl text-center shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    Go to Jobs <span>→</span>
                </Link>
            </div>
        </div>
    );
};
