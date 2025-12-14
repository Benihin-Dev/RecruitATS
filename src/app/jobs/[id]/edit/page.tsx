import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import JobForm from "@/components/JobForm";

export const dynamic = 'force-dynamic';


interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
    const { id } = await params;

    const job = await prisma.job.findUnique({
        where: { id },
    });

    if (!job) {
        notFound();
    }

    return (
        <div className="w-11/12 mx-auto pb-12 pt-24 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600 sm:text-4xl">
                    Edit Job Posting
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Update the details for <span className="font-semibold text-gray-900">{job.title}</span>.
                </p>
            </div>
            <JobForm initialData={job} isEditMode={true} />
        </div>
    );
}
