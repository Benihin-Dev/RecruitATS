
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import ApplicantCard from "@/components/ApplicantCard";

export default async function ApplicantsPage() {
    let applicants: any[] = [];
    try {
        applicants = await prisma.applicant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { applications: true } }
            }
        });
    } catch (e) {
        console.error("Fetch error", e);
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Talent Pool</h1>
                    <p className="text-gray-500 mt-2">View and manage your candidate database.</p>
                </div>
                <div className="flex gap-4">
                    <input type="text" placeholder="Search candidates..." className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm w-full md:w-64" />
                    <Link href="/applicants/new">
                        <PrimaryButton>+ Add Candidate</PrimaryButton>
                    </Link>
                </div>
            </div>

            {applicants.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-medium text-gray-900">No applicants yet</h3>
                    <p className="text-gray-500 mb-6">Add candidates manually or wait for applications.</p>
                    <div className=" w-full flex item-center justify-center ">  <Link href="/applicants/new"><PrimaryButton>Add Candidate</PrimaryButton></Link></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applicants.map((applicant: any) => (
                        <ApplicantCard key={applicant.id} applicant={applicant} />
                    ))}
                </div>
            )}
        </div>
    )
}
