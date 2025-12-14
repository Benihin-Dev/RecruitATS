"use client";

import { useState } from "react";
import { Application, Job, Applicant, ApplicationStatus } from "@prisma/client";
import { updateApplicationStatus, deleteApplication } from "@/app/actions";
import { useRouter } from "next/navigation";
import { PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useToast } from "@/components/ui/ToasterContext";

type ApplicationWithRelations = Application & {
    job: Job;
    applicant: Applicant;
};

interface ApplicationListProps {
    initialApplications: ApplicationWithRelations[];
}

const STAGES: ApplicationStatus[] = ["NEW", "REVIEW", "INTERVIEW", "OFFER", "REJECTED"];

export default function ApplicationList({ initialApplications }: ApplicationListProps) {
    const [applications, setApplications] = useState<ApplicationWithRelations[]>(initialApplications);
    const [activeTab, setActiveTab] = useState<ApplicationStatus>("NEW");
    const router = useRouter();
    const { addToast } = useToast();

    // Filter applications by active tab
    const filteredApps = applications.filter(app => app.status === activeTab);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;

        const result = await deleteApplication(id);
        if (result.success) {
            setApplications(prev => prev.filter(app => app.id !== id));
            addToast("Application deleted successfully", "success");
            router.refresh();
        } else {
            addToast("Failed to delete application", "error");
        }
    };

    const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
        const result = await updateApplicationStatus(id, newStatus);
        if (result.success) {
            setApplications(prev =>
                prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
            );
            addToast(`Application moved to ${newStatus}`, "success");
            router.refresh();
        } else {
            addToast("Failed to update status", "error");
        }
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {STAGES.map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setActiveTab(stage)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === stage
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                            `}
                        >
                            {stage} ({applications.filter(a => a.status === stage).length})
                        </button>
                    ))}
                </nav>
            </div>

            {/* List */}
            {filteredApps.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No applications in {activeTab} stage.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApps.map((app) => (
                        <div key={app.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={app.job.title}>
                                        {app.job.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {app.applicant.name}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                    ${activeTab === 'NEW' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${activeTab === 'REVIEW' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    ${activeTab === 'INTERVIEW' ? 'bg-purple-100 text-purple-800' : ''}
                                    ${activeTab === 'OFFER' ? 'bg-green-100 text-green-800' : ''}
                                    ${activeTab === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {activeTab}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                                <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                <p className="truncate" title={app.applicant.email}>{app.applicant.email}</p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex space-x-2">
                                    <Link href={`/applications/${app.id}`} className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors" title="View Details">
                                        <EyeIcon className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <select
                                    value={app.status}
                                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                    className="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                                >
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
