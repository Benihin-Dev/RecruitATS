
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ApplicantList from "@/components/ApplicantList";

export const dynamic = 'force-dynamic';


export default async function ApplicantsPage() {
    const session = await getServerSession(authOptions);
    let applicants: any[] = [];

    if (session?.user && (session.user as any).id) {
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
    }

    return <ApplicantList applicants={applicants} />;
}
