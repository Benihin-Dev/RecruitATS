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
                    setTimeout(() => router.push("/jobs"), 1500);
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
                    setTimeout(() => router.push("/jobs"), 1500);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg border border-gray-100">
            {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            {/* Core Info */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <div className="mt-1">
                        <input type="text" name="title" required value={formData.title} onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1">
                        <input type="text" name="location" required value={formData.location} onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Job Type</label>
                    <select name="jobType" value={formData.jobType} onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Work Mode</label>
                    <select name="workMode" value={formData.workMode} onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        <option>On-site</option>
                        <option>Remote</option>
                        <option>Hybrid</option>
                    </select>
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Brief Description</label>
                    <div className="mt-1">
                        <textarea name="briefDesc" rows={3} required value={formData.briefDesc} onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md p-2" />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Key Responsibilities</label>
                    <div className="mt-1">
                        <textarea name="keyResponsibilities" rows={4} value={formData.keyResponsibilities} onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            placeholder="- Responsibility 1&#10;- Responsibility 2" />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Required Qualifications</label>
                    <div className="mt-1">
                        <textarea name="requiredQualifications" rows={4} value={formData.requiredQualifications} onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            placeholder="- Qualification 1&#10;- Qualification 2" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3">
                    Cancel
                </button>
                <PrimaryButton type="submit" isLoading={loading}>
                    {isEditMode ? "Update Job" : "Post Job"}
                </PrimaryButton>
            </div>
        </form>
    );
}
