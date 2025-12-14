import ApplicantForm from "@/components/ApplicantForm";

export default function NewApplicant() {
    return (
        <div className="w-11/12 mx-auto pb-10 pt-24 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold  mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">Add New Applicant</h2>
            <ApplicantForm />
        </div>
    );
}
