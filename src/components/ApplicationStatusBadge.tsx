
import { ApplicationStatus } from "@prisma/client";

export default function ApplicationStatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        NEW: "bg-blue-100 text-blue-800",
        REVIEW: "bg-yellow-100 text-yellow-800",
        INTERVIEW: "bg-purple-100 text-purple-800",
        OFFER: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-xl py-1 ${colors[status] || "bg-gray-100 text-gray-800"
                }`}
        >
            {status}
        </span>
    );
}
