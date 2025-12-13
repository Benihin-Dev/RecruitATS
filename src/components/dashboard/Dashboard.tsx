
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/ui/Buttons";
import { StatsCards } from "./StatsCards";

export default function Dashboard() {
    const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchStats() {
            try {
                const jobsRes = await fetch('/api/jobs');
                if (jobsRes.ok) {
                    const jobs = await jobsRes.json();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const totalApplicants = jobs.reduce((acc: any, job: any) => acc + (job._count?.applications || 0), 0);
                    setStats({ jobs: jobs.length || 0, applicants: totalApplicants });
                }
            } catch (e) {
                console.error("Failed to fetch stats", e);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 pt-24 min-h-screen bg-gray-50/50">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Good Morning, <span className="text-primary">{session?.user?.name?.split(' ')[0]}</span>! 👋
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
                        <button className="text-sm text-primary font-semibold hover:underline">View All</button>
                    </div>

                    <div className="space-y-8 relative border-l-2 border-gray-100 ml-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="ml-6 relative group">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white ring-2 ring-gray-100 bg-green-400 group-hover:scale-125 transition-transform"></div>
                                <div className="bg-gray-50 p-4 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-gray-100">
                                    <p className="text-sm text-gray-900 font-medium">New application received for <span className="font-bold text-primary">Senior Frontend Dev</span></p>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        2 hours ago
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Application Trends</h3>
                        <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50">
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>

                    {/* Mock Graph */}
                    <div className="flex-1 flex items-end justify-between gap-3 min-h-[200px] border-b border-gray-100 pb-2">
                        {[40, 70, 35, 85, 50, 65, 90].map((h, i) => (
                            <div key={i} className="w-full bg-orange-50 rounded-t-lg relative group h-full flex flex-col justify-end">
                                <div style={{ height: `${h}%` }} className="w-full bg-gradient-to-t from-primary to-orange-400 rounded-t-lg transition-all duration-500 group-hover:opacity-80 relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
