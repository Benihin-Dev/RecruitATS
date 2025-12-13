
"use client";

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Testimonials</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Loved by Recruiters</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don&apos;t just take our word for it. Here&apos;s what hiring managers are saying.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="flex gap-1 mb-4 text-yellow-400">
                            {'★★★★★'.split('').map((c, i) => <span key={i}>{c}</span>)}
                        </div>
                        <p className="text-gray-700 italic mb-6">&quot;This ATS completely changed how we hire. The UI is gorgeous and so easy to use. We reduced our time-to-hire by 40%.&quot;</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                            <div>
                                <p className="font-bold text-gray-900">Sarah J.</p>
                                <p className="text-xs text-gray-500">Head of Talent, TechCo</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="flex gap-1 mb-4 text-yellow-400">
                            {'★★★★★'.split('').map((c, i) => <span key={i}>{c}</span>)}
                        </div>
                        <p className="text-gray-700 italic mb-6">&quot;Finally, software that doesn&apos;t look like it was built in 2005. The candidate pipeline view is a game changer for our team.&quot;</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500"></div>
                            <div>
                                <p className="font-bold text-gray-900">Mark T.</p>
                                <p className="text-xs text-gray-500">Recruiting Manager, StartupX</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <div className="flex gap-1 mb-4 text-yellow-400">
                            {'★★★★★'.split('').map((c, i) => <span key={i}>{c}</span>)}
                        </div>
                        <p className="text-gray-700 italic mb-6">&quot;Support is amazing and the features are exactly what we needed without the bloat. Highly recommend!&quot;</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500"></div>
                            <div>
                                <p className="font-bold text-gray-900">Emily R.</p>
                                <p className="text-xs text-gray-500">HR Director, AgencyBig</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
