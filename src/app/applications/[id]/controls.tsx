
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteApplication(application.id);
        if (res.success) {
            router.push("/jobs"); // Redirect to jobs or dashboard after deletion
            router.refresh();
        } else {
            alert("Failed to delete application");
        }
        setIsDeleting(false);
    };

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true);
        try {
            await fetch(`/api/applications/${application.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            setStatus(newStatus);
            router.refresh();
        } catch (e) {
            alert("Failed to update status");
        } finally {
            setLoading(false);
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
        <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">Update Status</h4>
                <div className="flex space-x-2">
                    {["NEW", "REVIEW", "INTERVIEW", "OFFER", "REJECTED"].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            disabled={loading || status === s}
                            className={`px-3 py-1 rounded text-sm font-medium ${status === s
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Notes</h4>
                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                    {application.notes.map((n: any) => (
                        <div key={n.id} className="bg-gray-50 p-3 rounded text-sm">
                            <p className="text-gray-800">{n.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                    {application.notes.length === 0 && <p className="text-gray-500 text-sm">No notes yet.</p>}
                </div>
                <form onSubmit={handleAddNote}>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note..."
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !note}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Add Note
                        </button>
                    </div>
                </form>
            </div>
            <div>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Delete Application
                </button>
            </div>

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
