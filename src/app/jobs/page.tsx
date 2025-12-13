
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PrimaryButton } from "@/components/ui/Buttons";
import JobCard from "../../components/JobCard";

// Helper to calculate days ago
const daysAgo = (date: Date) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
};

export default async function JobsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jobs: any[] = [];
    try {
        jobs = await prisma.job.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { applications: true } },
            },
        });
    } catch {
        console.error("Failed to fetch jobs");
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Open Positions</h1>
                    <p className="text-gray-500 mt-2">Manage your job postings and applications.</p>
                </div>
                <Link href="/jobs/new">
                    <PrimaryButton className="shadow-lg shadow-primary/30">+ Post New Job</PrimaryButton>
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-medium text-gray-900">No jobs posted yet</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first job posting.</p>
                    <Link href="/jobs/new"><PrimaryButton>Create Job</PrimaryButton></Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}
