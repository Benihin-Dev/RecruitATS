"use client";

import { useState, useMemo } from 'react';
import ApplicationCardDetailed from './ApplicationCardDetailed';
import Link from 'next/link';

interface ApplicationListManagerProps {
    applications: any[];
}

type FilterStatus = 'ALL' | 'NEW' | 'REVIEW' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export default function ApplicationListManager({ applications }: ApplicationListManagerProps) {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');

    // Calculate counts
    const counts = useMemo(() => {
        const acc = { ALL: applications.length, NEW: 0, REVIEW: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 };
        applications.forEach(app => {
            if (acc[app.status as keyof typeof acc] !== undefined) {
                acc[app.status as keyof typeof acc]++;
            }
        });
        return acc;
    }, [applications]);

    const filteredApplications = useMemo(() => {
        if (activeFilter === 'ALL') return applications;
        return applications.filter(app => app.status === activeFilter);
    }, [applications, activeFilter]);

    const filters: { label: string, value: FilterStatus, color: string }[] = [
        { label: 'All Applications', value: 'ALL', color: 'bg-gray-100 text-gray-600' },
        { label: 'New', value: 'NEW', color: 'bg-blue-50 text-blue-600' },
        { label: 'Reviewing', value: 'REVIEW', color: 'bg-yellow-50 text-yellow-600' },
        { label: 'Interview', value: 'INTERVIEW', color: 'bg-purple-50 text-purple-600' },
        { label: 'Offer', value: 'OFFER', color: 'bg-green-50 text-green-600' },
        { label: 'Rejected', value: 'REJECTED', color: 'bg-red-50 text-red-600' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters (1/5) */}
            <div className="lg:w-1/5 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2">Filter By Status</h3>
                    <div className="space-y-1">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeFilter === filter.value
                                        ? 'bg-primary/10 text-primary shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span>{filter.label}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === filter.value
                                        ? 'bg-white text-primary'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {counts[filter.value]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content (4/5) */}
            <div className="lg:w-4/5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {activeFilter === 'ALL' ? 'All Applications' : `${filters.find(f => f.value === activeFilter)?.label} Applications`}
                        <span className="ml-2 text-sm font-normal text-gray-500">({filteredApplications.length})</span>
                    </h2>
                    <Link href="/applications/new">
                        <button className="bg-primary hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow transition-colors">
                            + New Application
                        </button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No applications found in this category.</p>
                        </div>
                    ) : (
                        filteredApplications.map(app => (
                            <ApplicationCardDetailed key={app.id} application={app} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
