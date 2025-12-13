"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Toaster } from "@/components/ui/Toaster";
import { updateApplicant } from "@/app/actions";

interface ApplicantFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function ApplicantForm({ initialData, isEditMode = false }: ApplicantFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState(initialData || {
        name: "",
        email: "",
        nationalId: "",
        dob: "",
        gender: "Male",
        address: "",
        phone: "",
        profileInfo: "",
        resumeUrl: ""
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: "success" | "error" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                const res = await updateApplicant(initialData.id, formData);
                if (res.success) {
                    setToast({ msg: "Applicant Updated Successfully!", type: "success" });
                    setTimeout(() => router.push("/applicants"), 1500);
                } else {
                    setToast({ msg: "Failed to update applicant", type: "error" });
                }
            } else {
                const res = await fetch("/api/applicants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    setToast({ msg: "Applicant Added Successfully!", type: "success" });
                    setTimeout(() => router.push("/applicants"), 1500);
                } else {
                    setToast({ msg: "Failed to add applicant", type: "error" });
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

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1">
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">National ID</label>
                    <div className="mt-1">
                        <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="mt-1">
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="mt-1">
                        {/* Handle date value appropriately if it comes as ISO string from DB */}
                        <input type="date" name="dob" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1">
                        <input type="text" name="address" value={formData.address} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Resume Link (URL)</label>
                    <div className="mt-1">
                        <input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} placeholder="https://..."
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Profile Info (Bio)</label>
                    <div className="mt-1">
                        <textarea name="profileInfo" rows={3} value={formData.profileInfo} onChange={handleChange}
                            className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
                    Cancel
                </button>
                <PrimaryButton type="submit" isLoading={loading}>
                    {isEditMode ? "Update Applicant" : "Save Applicant"}
                </PrimaryButton>
            </div>
        </form>
    );
}
