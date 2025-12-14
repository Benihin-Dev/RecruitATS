"use client";

import { useState } from "react";
import ApplicantCard from "@/components/ApplicantCard";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/Buttons";

interface ApplicantListProps {
    applicants: any[];
}

export default function ApplicantList({ applicants }: ApplicantListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredApplicants = applicants.filter(applicant =>
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-11/12 mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Talent Pool</h1>
                    <p className="text-gray-500 mt-2">View and manage your candidate database.</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm w-full md:w-64"
                    />
                    <Link href="/applicants/new">
                        <PrimaryButton>+ Add Candidate</PrimaryButton>
                    </Link>
                </div>
            </div>

            {filteredApplicants.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-medium text-gray-900">
                        {searchQuery ? "No candidates found" : "No applicants yet"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchQuery ? "Try a different search term" : "Add candidates manually or wait for applications."}
                    </p>
                    {!searchQuery && (
                        <div className="w-full flex item-center justify-center">
                            <Link href="/applicants/new"><PrimaryButton>Add Candidate</PrimaryButton></Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplicants.map((applicant: any) => (
                        <ApplicantCard key={applicant.id} applicant={applicant} />
                    ))}
                </div>
            )}
        </div>
    );
}
