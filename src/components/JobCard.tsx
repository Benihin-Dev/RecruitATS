"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { deleteJob } from "@/app/actions";
import { useRouter } from "next/navigation";

// Calculate days ago helper
const daysAgo = (date: any) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
};

export default function JobCard({ job }: { job: any }) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteJob(job.id);
        if (res.success) {
            setShowDeleteModal(false);
            // Router refresh handled in action but this ensures UI sync if needed
        } else {
            alert("Failed to delete job");
        }
        setIsDeleting(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
            ${job.jobType === 'Internship' ? 'bg-purple-100 text-purple-700' :
                            job.jobType === 'Contract' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'}`}>
                        {job.jobType || "Full-time"}
                    </span>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-xs">{daysAgo(job.createdAt)}d ago</span>
                    </div>
                </div>

                <Link href={`/jobs/${job.id}`} className="block flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{job.briefDesc}</p>
                </Link>

                <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center text-gray-500">
                        <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                    </div>
                    <Link href={`/jobs/${job.id}`} className="font-semibold text-primary hover:underline">
                        {job._count.applications} Applicants →
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 border-t border-gray-100 pt-3 mt-auto">
                    <Link href={`/jobs/${job.id}/edit`} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded">
                        Edit
                    </Link>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Job"
                message={`Are you sure you want to delete "${job.title}"? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </>
    );
}
