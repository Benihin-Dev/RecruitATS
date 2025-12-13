
"use client";

export default function Stats() {
    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by World-Class Recruitment Teams</p>
                <div className="flex justify-center flex-wrap gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 items-center">
                    {/* Mock Logos - giving them a bit more styled look even as text */}
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-8 h-8 rounded bg-gray-800 group-hover:bg-primary transition-colors"></div>
                        <span className="text-2xl font-bold font-serif text-gray-800">Acme Corp</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-blue-600 transition-colors"></div>
                        <span className="text-2xl font-bold font-mono text-gray-800">Globex</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-8 h-8 rotate-45 bg-gray-800 group-hover:bg-green-600 transition-colors"></div>
                        <span className="text-2xl font-black italic text-gray-800">Soylent</span>
                    </div>
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-8 h-8 rounded-tr-xl bg-gray-800 group-hover:bg-red-600 transition-colors"></div>
                        <span className="text-2xl font-semibold text-gray-800">Umbrella</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
