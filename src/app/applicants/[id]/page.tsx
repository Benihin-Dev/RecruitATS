
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { notFound } from "next/navigation";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";
import { SecondaryButton } from "@/components/ui/Buttons";

async function getApplicant(id: string) {
    try {
        return await prisma.applicant.findUnique({
            where: { id },
            include: {
                applications: {
                    include: { job: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    } catch (e) { return null; }
}

export default async function ApplicantDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const applicant = await getApplicant(id);

    if (!applicant) notFound();

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold font-sans text-gray-900">{applicant.name}</h1>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 text-sm text-gray-500">
                                <div className="flex items-center mt-2 sm:mt-0">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {applicant.email}
                                </div>
                                {applicant.phone && (
                                    <div className="flex items-center mt-2 sm:mt-0">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {applicant.phone}
                                    </div>
                                )}
                                {applicant.address && (
                                    <div className="flex items-center mt-2 sm:mt-0">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {applicant.address}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            {applicant.resumeUrl && (
                                <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <SecondaryButton>View Resume</SecondaryButton>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-5 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium text-gray-500">National ID:</span> {applicant.nationalId || "-"}</div>
                    <div><span className="font-medium text-gray-500">Date of Birth:</span> {applicant.dob ? new Date(applicant.dob).toLocaleDateString() : "-"}</div>
                    <div><span className="font-medium text-gray-500">Gender:</span> {applicant.gender || "-"}</div>
                    <div><span className="font-medium text-gray-500">Added:</span> {new Date(applicant.createdAt).toLocaleDateString()}</div>
                </div>
                {applicant.profileInfo && (
                    <div className="border-t border-gray-200 px-6 py-5">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Profile / Bio</h3>
                        <p className="text-gray-900">{applicant.profileInfo}</p>
                    </div>
                )}
            </div>

            {/* Applications History */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Application History</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {applicant.applications.length === 0 ? (
                        <li className="px-6 py-8 text-center text-gray-500 italic">No applications found.</li>
                    ) : (
                        applicant.applications.map(app => (
                            <li key={app.id} className="hover:bg-gray-50 transition-colors">
                                <Link href={`/applications/${app.id}`} className="block px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-primary text-lg">{app.job.title}</p>
                                            <p className="text-sm text-gray-500">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <ApplicationStatusBadge status={app.status} />
                                            <svg className="h-5 w-5 text-gray-400 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
