import { prisma } from "@/lib/prisma";
import ApplicantForm from "@/components/ApplicantForm";
import { notFound } from "next/navigation";

export default async function EditApplicant({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const applicant = await prisma.applicant.findUnique({
        where: { id },
    });

    if (!applicant) {
        notFound();
    }

    // Convert date to generic string or keep as Date, Form handles it
    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Edit Applicant: {applicant.name}</h2>
            <ApplicantForm initialData={applicant} isEditMode={true} />
        </div>
    );
}
