import { prisma } from "@/lib/prisma";
import ApplicantForm from "@/components/ApplicantForm";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';


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
        <div className="w-11/12 mx-auto pb-10 pt-20 px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Edit Applicant: <span className="text-orange-600">{applicant.name}</span></h2>
            <ApplicantForm initialData={applicant} isEditMode={true} />
        </div>
    );
}
