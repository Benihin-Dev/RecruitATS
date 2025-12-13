import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import JobForm from "@/components/JobForm";

export default async function EditJob({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await prisma.job.findUnique({
        where: { id },
    });

    if (!job) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Edit Job: {job.title}
                    </h2>
                </div>
            </div>

            <JobForm initialData={job} isEditMode={true} />
        </div>
    );
}
