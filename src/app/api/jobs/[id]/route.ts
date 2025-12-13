
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const job = await prisma.job.findUnique({
            where: { id: String(id) },
            include: {
                applications: {
                    include: {
                        applicant: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch job" },
            { status: 500 }
        );
    }
}
