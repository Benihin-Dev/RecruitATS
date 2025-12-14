"use client";

import { useState } from "react";
import { Job, Applicant, Application } from "@prisma/client";
import { createApplication } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToasterContext";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import ApplicantForm from "@/components/ApplicantForm";

// Fallback if constants don't exist
const BTN_CLASS = "bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md shadow transition-colors";

interface ApplicationFormProps {
    jobs: Job[];
    applicants: Applicant[];
    onSuccess?: () => void;
}

export default function ApplicationForm({ jobs, applicants: initialApplicants }: ApplicationFormProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [applicants, setApplicants] = useState(initialApplicants);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        jobId: "",
        applicantId: "",
        status: "NEW"
    });

    const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.jobId || !formData.applicantId) {
            addToast("Please select both a job and an applicant", "error");
            setLoading(false);
            return;
        }

        try {
            const res = await createApplication(formData);
            if (res.success) {
                addToast("Application created successfully!", "success");
                setFormData({ jobId: "", applicantId: "", status: "NEW" });
                router.refresh(); // Refresh to show in list
            } else {
                addToast("Failed to create application", "error");
            }
        } catch (error) {
            addToast("An error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApplicantCreated = (newApplicant: any) => { // Using any as Applicant type might vary slightly with relations
        // Assuming newApplicant is the object returned from DB
        setApplicants(prev => [...prev, newApplicant]);
        setFormData(prev => ({ ...prev, applicantId: newApplicant.id || newApplicant.data?.id }));
        setIsApplicantModalOpen(false);
        addToast("New applicant created and selected!", "success");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 w-full">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Create New Application</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Job</label>
                    <select
                        value={formData.jobId}
                        onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2.5 border"
                        required
                    >
                        <option value="">-- Select a Job --</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Applicant</label>
                    <div className="flex gap-2">
                        <select
                            value={formData.applicantId}
                            onChange={(e) => setFormData({ ...formData, applicantId: e.target.value })}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2.5 border"
                            required
                        >
                            <option value="">-- Select an Applicant --</option>
                            {applicants.map(app => (
                                <option key={app.id} value={app.id}>{app.name} ({app.email})</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setIsApplicantModalOpen(true)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md border border-gray-300 transition-colors whitespace-nowrap text-sm font-medium"
                        >
                            + New Applicant
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${BTN_CLASS} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? "Creating..." : "Create Application"}
                    </button>
                </div>
            </form>

            <Transition show={isApplicantModalOpen}>
                <Dialog className="relative z-50" onClose={() => setIsApplicantModalOpen(false)}>
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    </TransitionChild>

                    <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                        <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
                                <DialogTitle className="font-bold text-lg p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                                    Create New Applicant
                                </DialogTitle>
                                <div className="p-6">
                                    <ApplicantForm
                                        onSuccess={handleApplicantCreated}
                                        onCancel={() => setIsApplicantModalOpen(false)}
                                    />
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
