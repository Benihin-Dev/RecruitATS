
"use client";

import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <span className="inline-block py-1.5 px-4 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 animate-fade-in border border-orange-100 shadow-sm">
                    ✨ ATS with Smart AI Matching
                </span>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 animate-slide-up leading-tight">
                    Find the Right Talent. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                        Matched Smarter.
                    </span>
                </h1>

                <p
                    className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up"
                    style={{ animationDelay: '0.1s' }}
                >
                    Use intelligent AI matching to compare jobs and applicants based on skills,
                    experience, and role requirements—so you can quickly identify the most
                    relevant candidates and move faster.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Link href="/auth/signup">
                        <PrimaryButton className="text-lg px-10 py-4 h-14 w-full sm:w-auto shadow-glow font-bold">
                            Start Hiring Free
                        </PrimaryButton>
                    </Link>
                    <Link href="/auth/signin">
                        <SecondaryButton className="text-lg px-10 py-4 h-14 w-full sm:w-auto font-bold">
                            View Demo
                        </SecondaryButton>
                    </Link>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-16 relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 blur-3xl"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Mockup Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Dashboard Overview</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Live</div>
                            </div>
                        </div>

                        {/* Mockup Content */}
                        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500 font-medium mb-1">Total Jobs</div>
                                    <div className="text-2xl font-bold text-gray-900">24</div>
                                    <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500 font-medium mb-1">Applicants</div>
                                    <div className="text-2xl font-bold text-gray-900">156</div>
                                    <div className="text-xs text-green-600 mt-1">↑ 23% this month</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-500 font-medium mb-1">Applications</div>
                                    <div className="text-2xl font-bold text-gray-900">89</div>
                                    <div className="text-xs text-orange-600 mt-1">8 pending review</div>
                                </div>
                            </div>

                            {/* Chart & Activity */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Chart */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-sm font-semibold text-gray-900 mb-3">Application Trends</div>
                                    <div className="flex items-end justify-between h-24 gap-2">
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '40%' }}></div>
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '65%' }}></div>
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '80%' }}></div>
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '55%' }}></div>
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '90%' }}></div>
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '75%' }}></div>
                                        <div className="flex-1 bg-gradient-to-t from-primary to-orange-400 rounded-t" style={{ height: '100%' }}></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                                        <span>Mon</span>
                                        <span>Tue</span>
                                        <span>Wed</span>
                                        <span>Thu</span>
                                        <span>Fri</span>
                                        <span>Sat</span>
                                        <span>Sun</span>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-gray-900">New Application</div>
                                                <div className="text-xs text-gray-500">John Doe applied for Senior Dev</div>
                                            </div>
                                            <div className="text-xs text-gray-400">2m</div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-gray-900">Interview Scheduled</div>
                                                <div className="text-xs text-gray-500">Sarah Smith - Product Manager</div>
                                            </div>
                                            <div className="text-xs text-gray-400">1h</div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-gray-900">Job Posted</div>
                                                <div className="text-xs text-gray-500">Full Stack Developer position</div>
                                            </div>
                                            <div className="text-xs text-gray-400">3h</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
