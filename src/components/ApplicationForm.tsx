"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Toaster } from "@/components/ui/Toaster";
import { createApplication } from "@/app/actions";

interface ApplicationFormProps {
    jobs: any[];
    applicants: any[];
}

export default function ApplicationForm({ jobs, applicants }: ApplicationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: "success" | "error" } | null>(null);

    const [formData, setFormData] = useState({
        jobId: "",
        applicantId: "",
        resumeUrl: "",
        status: "NEW"
    });

    // Auto-fill resume URL when applicant is selected
    useEffect(() => {
        if (formData.applicantId) {
            const applicant = applicants.find(a => a.id === formData.applicantId);
            // Only set if resumeUrl is currently empty to avoid overwriting user edits
            // But if they switch applicants, we probably want to reset it? 
            // Let's set it if it matches the PREVIOUS applicant's resume or is empty.
            // Simpler: Just set it. The user can edit it afterwards.
            if (applicant && applicant.resumeUrl) {
                setFormData(prev => ({ ...prev, resumeUrl: applicant.resumeUrl }));
            }
        }
    }, [formData.applicantId, applicants]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await createApplication(formData);
            if (res.success) {
                setToast({ msg: "Application Created Successfully!", type: "success" });
                setTimeout(() => {
                    router.refresh();
                    router.push("/applications");
                }, 1500);
            } else {
                setToast({ msg: "Failed to create application", type: "error" });
            }
        } catch (error) {
            setToast({ msg: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClassName = "mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 sm:text-sm ease-in-out hover:bg-white";
    const labelClassName = "block text-sm font-semibold text-gray-700 mb-1";
    const sectionClassName = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
            {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            <div className={sectionClassName}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </span>
                    Application Details
                </h3>

                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                    <div className=" ">
                        <label className={labelClassName}>Applicant</label>
                        <div className="relative">
                            <select name="applicantId" required value={formData.applicantId} onChange={handleChange}
                                className={`${inputClassName} appearance-none cursor-pointer`}>
                                <option value="">Select an Applicant</option>
                                {applicants.map(applicant => (
                                    <option key={applicant.id} value={applicant.id}>
                                        {applicant.name} ({applicant.email})
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className=" ">
                        <label className={labelClassName}>Job Position</label>
                        <div className="relative">
                            <select name="jobId" required value={formData.jobId} onChange={handleChange}
                                className={`${inputClassName} appearance-none cursor-pointer`}>
                                <option value="">Select a Job</option>
                                {jobs.map(job => (
                                    <option key={job.id} value={job.id}>
                                        {job.title} - {job.location}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <label className={labelClassName}>Resume URL (for this application)</label>
                        <p className="text-xs text-gray-500 mb-2">You can override the applicant's default resume here.</p>
                        <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange}
                            placeholder="https://..."
                            className={inputClassName} />
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 opacity-0 mb-2">You can override the applicant's default resume here.</p>
                        <label className={labelClassName}>Status</label>
                        <div className="relative">
                            <select name="status" value={formData.status} onChange={handleChange}
                                className={`${inputClassName} appearance-none cursor-pointer`}>
                                <option value="NEW">New</option>
                                <option value="REVIEW">Review</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="OFFER">Offer</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => router.back()}
                    className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors">
                    Cancel
                </button>
                <PrimaryButton type="submit" isLoading={loading} className="px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                    Create Application
                </PrimaryButton>
            </div>
        </form>
    );
}
