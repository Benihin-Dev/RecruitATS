import { prisma } from "@/lib/prisma";
import ApplicationListManager from "@/components/applications/ApplicationListManager";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';


export default async function ApplicationsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    const applications = await prisma.application.findMany({
        where: {
            job: {
                recruiterId: (session.user as any).id
            }
        },
        include: {
            job: true,
            applicant: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className=" w-11/12 mx-auto pb-12 pt-24 px-4 sm:px-6">
            <h1 className="text-3xl font-bold font-sans text-gray-900 mb-2">Applications</h1>
            <p className="text-gray-600 mb-8">Manage and track candidates across all job postings.</p>

            <ApplicationListManager applications={applications} />
        </div>
    );
}
