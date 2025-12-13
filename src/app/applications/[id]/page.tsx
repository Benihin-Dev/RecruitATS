
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ApplicationDetailServer id={id} />;
}

import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

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

// Ensure this part is server-only
import ApplicationControls from "./controls"; // Functionally separate file

async function ApplicationDetailServer({ id }: { id: string }) {
    const application = await getApplication(id);

    if (!application) {
        return <div>Application not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Application Details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Applied for {application.job.title}</p>
                    </div>
                    <ApplicationStatusBadge status={application.status} />
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Applicant Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{application.applicant.name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900">{application.applicant.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{application.applicant.phone || 'N/A'}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">简历 (Resume)</dt>
                            <dd className="mt-1 text-sm text-indigo-600 truncate">
                                {application.applicant.resumeUrl ? <a href={application.applicant.resumeUrl} target="_blank">View Resume</a> : "No resume attached"}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ApplicationControls application={application} />
        </div>
    );
}
