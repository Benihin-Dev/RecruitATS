
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/ui/Buttons";
import { StatsCards } from "./StatsCards";
import AIJobMatcher from "./AIJobMatcher";

export default function Dashboard() {
    const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
    const [recentApplications, setRecentApplications] = useState<any[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch jobs stats
                const jobsRes = await fetch('/api/jobs');
                if (jobsRes.ok) {
                    const jobs = await jobsRes.json();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const totalApplicants = jobs.reduce((acc: any, job: any) => acc + (job._count?.applications || 0), 0);
                    setStats({ jobs: jobs.length || 0, applicants: totalApplicants });
                }

                // Fetch recent applications
                const appsRes = await fetch('/api/applications/recent');
                if (appsRes.ok) {
                    const apps = await appsRes.json();
                    setRecentApplications(apps);
                }
            } catch (e) {
                console.error("Failed to fetch data", e);
            }
        }
        fetchData();
    }, []);

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    return (
        <div className="max-w-7xl mx-auto pt-28 pb-8 px-4 sm:px-6 lg:px-8 space-y-10 min-h-screen bg-gray-50/50">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Good Morning, <span className="text-primary">{session?.user?.name?.split(' ')[0]}</span>! ✨
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">Here is what&apos;s happening with your hiring pipeline today.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/jobs/new">
                        <PrimaryButton className="shadow-lg hover:shadow-glow px-6 py-3">
                            + Create New Job
                        </PrimaryButton>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <StatsCards stats={stats} />
            </div>

            {/* Recent Activity / Timeline Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                        <Link href="/applications" className="text-sm text-primary font-semibold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-8 relative border-l-2 border-gray-100 ml-3">
                        {recentApplications.length === 0 ? (
                            <div className="ml-6 text-gray-500 text-sm italic">No recent applications</div>
                        ) : (
                            recentApplications.slice(0, 3).map((app) => (
                                <div key={app.id} className="ml-6 relative group">
                                    <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white ring-2 ring-gray-100 bg-green-400 group-hover:scale-125 transition-transform"></div>
                                    <Link href={`/applications/${app.id}`}>
                                        <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-gray-100 cursor-pointer">
                                            <p className="text-sm text-gray-900 font-medium">
                                                <span className="font-bold text-primary">{app.applicant.name}</span> applied for <span className="font-semibold">{app.job.title}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {getTimeAgo(app.createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Applications (Last 7 Days)</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-t from-primary to-orange-400"></div>
                            <span className="text-xs text-gray-600">Applications</span>
                        </div>
                    </div>

                    {/* Chart */}
                    {(() => {
                        const CHART_HEIGHT = 300; // Fixed chart height in pixels

                        // Calculate application counts for the last 7 days
                        const last7Days = Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (6 - i));
                            return date.toISOString().split('T')[0];
                        });

                        const dailyCounts = last7Days.map(dateStr => {
                            return recentApplications.filter(app => {
                                const appDate = new Date(app.createdAt).toISOString().split('T')[0];
                                return appDate === dateStr;
                            }).length;
                        });

                        // Dynamic max scale = highest count + 25%, minimum of 5
                        const maxCount = Math.max(...dailyCounts, 1);
                        const MAX_SCALE = Math.max(Math.ceil(maxCount * 1.25), 5);
                        const midScale = Math.round(MAX_SCALE / 2);

                        return (
                            <div className="flex gap-3">
                                {/* Y-axis labels */}
                                <div className="flex flex-col justify-between text-xs text-gray-400 font-medium w-6 text-right" style={{ height: `${CHART_HEIGHT}px` }}>
                                    <span>{MAX_SCALE}</span>
                                    <span>{midScale}</span>
                                    <span>0</span>
                                </div>
                                {/* Bars container */}
                                <div className="flex-1 flex items-end gap-2 border-b border-l border-gray-200" style={{ height: `${CHART_HEIGHT}px` }}>
                                    {last7Days.map((dateStr, i) => {
                                        const count = dailyCounts[i];
                                        // Calculate bar height in pixels
                                        const barHeight = count > 0 ? Math.max((count / MAX_SCALE) * CHART_HEIGHT, 8) : 4;
                                        const date = new Date(dateStr);

                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center">
                                                {/* Bar wrapper */}
                                                <div className="w-full flex justify-center items-end h-full">
                                                    <div className="relative group w-8">
                                                        <div
                                                            style={{ height: `${barHeight}px` }}
                                                            className={`w-full rounded-t-lg transition-all duration-500 group-hover:scale-105 ${count > 0
                                                                ? 'bg-gradient-to-t from-primary to-orange-400'
                                                                : 'bg-gray-200'
                                                                }`}
                                                        />
                                                        {/* Tooltip */}
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            {count} application{count !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Day label */}
                                                <span className="text-xs text-gray-400 font-medium mt-2">
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* AI Job Matching Section */}
            <div id="ai-matcher" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <AIJobMatcher />
            </div>

            {/* Floating AI Matcher Button */}
            <button
                onClick={() => {
                    document.getElementById('ai-matcher')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="fixed bottom-8 right-8 bg-gradient-to-br from-black to-gray-800 text-white p-4 rounded-full shadow-2xl hover:shadow-black/50 hover:scale-110 transition-all duration-300 z-50 group"
                title="View AI Job Matching"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    AI
                </span>
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    AI Job Matching
                </div>
            </button>
        </div>
    );
}
