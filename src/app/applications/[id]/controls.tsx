
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { deleteApplication } from "@/app/actions";

export default function ApplicationControls({ application }: { application: any }) {
    const router = useRouter();
    const [status, setStatus] = useState(application.status);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    // Delete state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Status update state
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState("");

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteApplication(application.id);
        if (res.success) {
            router.push("/jobs");
            router.refresh();
        } else {
            alert("Failed to delete application");
        }
        setIsDeleting(false);
    };

    const initiateStatusChange = (newStatus: string) => {
        setPendingStatus(newStatus);
        setShowStatusModal(true);
    };

    const confirmStatusChange = async () => {
        if (!pendingStatus) return;

        setLoading(true);
        setShowStatusModal(false); // Close modal immediately

        try {
            await fetch(`/api/applications/${application.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: pendingStatus })
            });
            setStatus(pendingStatus);
            router.refresh();
        } catch (e) {
            alert("Failed to update status");
        } finally {
            setLoading(false);
            setPendingStatus("");
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) return;
        setLoading(true);

        try {
            await fetch(`/api/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId: application.id, content: note })
            });
            setNote("");
            router.refresh();
        } catch (e) {
            alert("Failed to add note");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow sm:rounded-lg p-6 border border-gray-100">
            <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                    {["NEW", "REVIEW", "INTERVIEW", "OFFER", "REJECTED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => initiateStatusChange(s)}
                            disabled={loading || status === s}
                            className={`px-4 py-1 rounded-md text-sm font-semibold transition-all duration-200
        ${status === s
                                    ? s === "NEW"
                                        ? "bg-green-500 text-white shadow-md"
                                        : s === "REVIEW"
                                            ? "bg-yellow-500 text-white shadow-md"
                                            : s === "INTERVIEW"
                                                ? "bg-blue-500 text-white shadow-md"
                                                : s === "OFFER"
                                                    ? "bg-orange-500 text-white shadow-md"
                                                    : "bg-red-500 text-white shadow-md"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

            </div>

            <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Notes & Activity</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 max-h-80 overflow-y-auto space-y-3">
                    {application.notes.length === 0 ? (
                        <p className="text-gray-400 text-sm py-4 text-center italic">No notes added yet.</p>
                    ) : (
                        application.notes.map((n: any) => (
                            <div key={n.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-gray-800 text-sm mb-1">{n.content}</p>
                                <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={handleAddNote} className="relative">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a private note..."
                        className="w-full border border-gray-200 rounded-lg p-3 pr-24 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-white"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={loading || !note}
                        className="absolute bottom-3 right-3 inline-flex justify-center py-1.5 px-3 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        Post Note
                    </button>
                </form>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Delete Application
                </button>
            </div>

            {/* Confirmation Modal for Status */}
            <ConfirmationModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onConfirm={confirmStatusChange}
                title="Update Application Status"
                message={`Are you sure you want to change the status to "${pendingStatus}"? This might trigger notifications.`}
                confirmText={`Change to ${pendingStatus}`}
                isLoading={loading}
            />

            {/* Confirmation Modal for Delete */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Application"
                message={`Are you sure you want to delete this application? This action cannot be undone.`}
                confirmText="Delete Application"
                isLoading={isDeleting}
            />
        </div>
    )
}
