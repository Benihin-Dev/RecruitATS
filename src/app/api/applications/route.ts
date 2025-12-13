
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { jobId, applicantId } = await req.json();

        if (!jobId || !applicantId) {
            return NextResponse.json({ message: "Job ID and Applicant ID are required" }, { status: 400 });
        }

        // Check if already applied
        const existing = await prisma.application.findFirst({
            where: {
                jobId,
                applicantId
            }
        });

        if (existing) {
            return NextResponse.json({ message: "Applicant already applied to this job" }, { status: 409 });
        }

        const application = await prisma.application.create({
            data: {
                jobId,
                applicantId,
                status: "NEW"
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create application" },
            { status: 500 }
        );
    }
}
