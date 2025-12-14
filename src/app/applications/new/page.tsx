import { prisma } from "@/lib/prisma";
import ApplicationForm from "@/components/ApplicationForm";

export const dynamic = 'force-dynamic';


export default async function NewApplicationPage() {
    const jobs = await prisma.job.findMany({ select: { id: true, title: true, location: true } });
    const applicants = await prisma.applicant.findMany({ select: { id: true, name: true, email: true, resumeUrl: true } });

    return (
        <div className=" w-11/12 mx-auto pt-24 pb-12  sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600 sm:text-4xl">
                    Create New Application
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Manually link an applicant to a job opening.
                </p>
            </div>
            <ApplicationForm jobs={jobs} applicants={applicants} />
        </div>
    );
}
