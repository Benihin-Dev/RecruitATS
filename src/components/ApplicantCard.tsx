"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { deleteApplicant } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ApplicantCard({ applicant }: { applicant: any }) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteApplicant(applicant.id);
        if (res.success) {
            setShowDeleteModal(false);
            // Router refresh handled in action
        } else {
            alert("Failed to delete applicant");
        }
        setIsDeleting(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex items-start space-x-4 relative">
                <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">
                        {applicant.name[0]}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <Link href={`/applicants/${applicant.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                            {applicant.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{applicant.email}</p>
                        <p className="text-xs text-gray-400 mt-1">{applicant.phone || "No phone"}</p>
                    </Link>
                    <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${applicant._count.applications > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                            {applicant._count.applications} Applications
                        </span>

                        {/* Actions z-10 to stay above the card link */}
                        <div className="flex space-x-2 z-10 relative">
                            <Link href={`/applicants/${applicant.id}/edit`} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded">
                                Edit
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowDeleteModal(true);
                                }}
                                className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Applicant"
                message={`Are you sure you want to delete "${applicant.name}"? This action cannot be undone.`}
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </>
    );
}
