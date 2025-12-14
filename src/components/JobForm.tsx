"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Toaster } from "@/components/ui/Toaster";
import { updateJob } from "@/app/actions";

interface JobFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function JobForm({ initialData, isEditMode = false }: JobFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState(initialData || {
        title: "",
        briefDesc: "",
        keyResponsibilities: "",
        requiredQualifications: "",
        location: "",
        jobType: "Full-time",
        workMode: "On-site"
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: "success" | "error" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                const res = await updateJob(initialData.id, formData);
                if (res.success) {
                    setToast({ msg: "Job Updated Successfully!", type: "success" });
                    setTimeout(() => {
                        router.refresh();
                        router.push(`/jobs/${initialData.id}`);
                    }, 1500);
                } else {
                    setToast({ msg: "Failed to update job", type: "error" });
                }
            } else {
                const res = await fetch("/api/jobs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    setToast({ msg: "Job Posted Successfully!", type: "success" });
                    setTimeout(() => {
                        router.refresh();
                        router.push("/jobs");
                    }, 1500);
                } else {
                    setToast({ msg: "Failed to create job", type: "error" });
                }
            }
        } catch (error) {
            setToast({ msg: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClassName = "mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 sm:text-sm ease-in-out hover:bg-white";
    const labelClassName = "block text-sm font-semibold text-gray-700 mb-1";
    const sectionClassName = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
            {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            {/* Core Info Section */}
            <div className={sectionClassName}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </span>
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className={labelClassName}>Job Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange}
                            placeholder="e.g. Senior Software Engineer"
                            className={inputClassName} />
                    </div>

                    <div>
                        <label className={labelClassName}>Location</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleChange}
                            placeholder="e.g. New York, NY"
                            className={inputClassName} />
                    </div>

                    <div>
                        <label className={labelClassName}>Work Mode</label>
                        <div className="relative">
                            <select name="workMode" value={formData.workMode} onChange={handleChange}
                                className={`${inputClassName} appearance-none cursor-pointer`}>
                                <option>On-site</option>
                                <option>Remote</option>
                                <option>Hybrid</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>Job Type</label>
                        <div className="relative">
                            <select name="jobType" value={formData.jobType} onChange={handleChange}
                                className={`${inputClassName} appearance-none cursor-pointer`}>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Internship</option>
                                <option>Contract</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className={sectionClassName}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-blue-50 text-blue-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </span>
                    Job Details
                </h3>
                <div className="space-y-6">
                    <div>
                        <label className={labelClassName}>Brief Description</label>
                        <textarea name="briefDesc" rows={3} required value={formData.briefDesc} onChange={handleChange}
                            placeholder="A short overview of the role..."
                            className={inputClassName} />
                    </div>

                    <div>
                        <label className={labelClassName}>Key Responsibilities</label>
                        <textarea name="keyResponsibilities" rows={5} value={formData.keyResponsibilities} onChange={handleChange}
                            className={inputClassName}
                            placeholder="- Lead the development team&#10;- Architect scalable solutions" />
                        <p className="mt-2 text-xs text-gray-500">Use hyphens (-) to create a bulleted list.</p>
                    </div>

                    <div>
                        <label className={labelClassName}>Required Qualifications</label>
                        <textarea name="requiredQualifications" rows={5} value={formData.requiredQualifications} onChange={handleChange}
                            className={inputClassName}
                            placeholder="- 5+ years of experience&#10;- Proficiency in React" />
                        <p className="mt-2 text-xs text-gray-500">Use hyphens (-) to create a bulleted list.</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => router.back()}
                    className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors">
                    Cancel
                </button>
                <PrimaryButton type="submit" isLoading={loading} className="px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                    {isEditMode ? "Save Changes" : "Post Job"}
                </PrimaryButton>
            </div>
        </form>
    );
}

