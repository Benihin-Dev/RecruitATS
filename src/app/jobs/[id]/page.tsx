
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";
import { PrimaryButton } from "@/components/ui/Buttons";

async function getJob(id: string) {
    try {
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                applications: {
                    include: { applicant: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return job;
    } catch (e) {
        return null;
    }
}

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await getJob(id);

    if (!job) {
        notFound();
    }

    return (
        <div className="w-11/12 mx-auto pb-8 pt-24 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between bg-white px-6 py-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-3xl font-bold font-sans text-gray-900 leading-tight">
                            {job.title}
                        </h2>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {job.jobType || "Full-time"}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 text-sm text-gray-500 mt-2">
                        <div className="flex items-center mt-2 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location} ({job.workMode})
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {job.applications.length} Applicants
                        </div>
                    </div>
                </div>
                {/* Actions */}
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    {/* Link to manual add application page if we had one, or edit */}
                    <Link href={`./${job.id}/edit`}>
                        <PrimaryButton>Edit Job</PrimaryButton>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Job Details */}
                <div className="lg:col-span-2">
                    <section className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Job Details
                        </h3>

                        <div className="space-y-6">
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Description</h4>
                                <p className="text-gray-700 leading-relaxed">{job.briefDesc}</p>
                            </div>

                            {/* Key Responsibilities */}
                            {job.keyResponsibilities && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Responsibilities</h4>
                                    <ul className="space-y-2">
                                        {job.keyResponsibilities.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                <span>{line.trim().replace(/^[•\-*]\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Required Qualifications */}
                            {job.requiredQualifications && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Required Qualifications</h4>
                                    <ul className="space-y-2">
                                        {job.requiredQualifications.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                <span>{line.trim().replace(/^[•\-*]\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar: Applications */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Applications</h3>
                            {/* Filter placeholder */}
                        </div>
                        <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                            {job.applications.length === 0 ? (
                                <li className="px-6 py-8 text-center text-gray-500 italic">No applications received yet.</li>
                            ) : (
                                job.applications.map((app) => (
                                    <li key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <Link href={`/applications/${app.id}`} className="block px-6 py-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-primary">{app.applicant.name}</span>
                                                <ApplicationStatusBadge status={app.status} />
                                            </div>
                                            <p className="text-xs text-gray-400">{app.applicant.email}</p>
                                            <p className="text-xs text-secondary-text mt-2 text-right">
                                                Applied {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
