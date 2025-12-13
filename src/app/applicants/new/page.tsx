import ApplicantForm from "@/components/ApplicantForm";

export default function NewApplicant() {
    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Add New Applicant</h2>
            <ApplicantForm />
        </div>
    );
}
