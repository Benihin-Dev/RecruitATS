import { prisma } from "@/lib/prisma";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";
import ApplicationControls from "./controls";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getApplication(id: string) {
    return await prisma.application.findUnique({
        where: { id },
        include: {
            applicant: true,
            job: true,
            notes: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const application = await getApplication(id);

    if (!application) {
        return notFound();
    }


    return (
        <div className="max-w-7xl mx-auto pb-8 pt-24 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{application.applicant.name}</h1>
                        <span className="text-gray-400 text-sm">#{application.id.slice(-6)}</span>
                    </div>
                    <p className="text-gray-500 flex items-center gap-2">
                        Applied for <span className="font-semibold text-primary">{application.job.title}</span>
                        <span className="text-gray-300">•</span>
                        <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
                <div>
                    <ApplicationStatusBadge status={application.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Applicant & Job Info (2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Applicant Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            <h3 className="font-semibold text-gray-900">Applicant Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                <p className="mt-1 text-gray-900 font-medium">{application.applicant.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                                <p className="mt-1 text-gray-900 font-medium">{application.applicant.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                                <p className="mt-1 text-gray-900">{application.applicant.address || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resume</label>
                                <div className="mt-2">
                                    {/* @ts-ignore */}
                                    {application.resumeUrl ? (
                                        <div className="flex items-center gap-3">
                                            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                View Application Resume
                                            </a>
                                            {application.applicant.resumeUrl && application.applicant.resumeUrl !== application.resumeUrl && (
                                                <span className="text-xs text-gray-400">(Overrides profile resume)</span>
                                            )}
                                        </div>
                                    ) : application.applicant.resumeUrl ? (
                                        <a href={application.applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            View Profile Resume
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">No resume available</span>
                                    )}
                                </div>
                            </div>
                            {application.applicant.profileInfo && (
                                <div className="md:col-span-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Professional Bio</label>
                                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-100">
                                        {application.applicant.profileInfo}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <h3 className="font-semibold text-gray-900">Position Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Job Title</label>
                                <p className="mt-1 text-gray-900 font-medium">{application.job.title}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                                <p className="mt-1 text-gray-900">{application.job.location}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                                <p className="mt-1 text-gray-900">{application.job.jobType}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mode</label>
                                <p className="mt-1 text-gray-900">{application.job.workMode}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Description</label>
                                <p className="text-sm text-gray-600 leading-relaxed max-h-32 overflow-y-auto">
                                    {application.job.briefDesc}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Controls (1/3) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <ApplicationControls application={application} />
                    </div>
                </div>
            </div>
        </div>
    );
}
