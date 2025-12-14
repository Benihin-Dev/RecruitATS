
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const jobs = await prisma.job.findMany({
            where: {
                recruiterId: (session.user as any).id
            },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, briefDesc, location, keyResponsibilities, requiredQualifications, jobType, workMode } = body;

        // Use current user's email to associate job. 
        // Spec says 'recruiterId', we need to make sure User model has jobs relation.
        // Assuming session.user.email is present.

        // Note: Schema 'Job' model expects 'recruiterId' which links to 'User.id'.
        // We need to fetch the User ID from the session email first because session usually holds email.

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const job = await prisma.job.create({
            data: {
                title,
                briefDesc, // Mapped from old 'description'
                location,
                keyResponsibilities,
                requiredQualifications,
                jobType,
                workMode,
                recruiter: {
                    connect: { id: user.id },
                },
            },
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json(
            { message: "Failed to create job" },
            { status: 500 }
        );
    }
}
