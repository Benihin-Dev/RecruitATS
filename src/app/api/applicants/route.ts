
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Prevent static generation - this route requires database access
export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, resumeUrl, address, nationalId, dob, gender, profileInfo } = body;

        if (!name || !email) {
            return NextResponse.json({ message: "Name and Email are required" }, { status: 400 });
        }

        const applicant = await prisma.applicant.create({
            data: {
                name,
                email,
                phone,
                resumeUrl,
                address,
                nationalId,
                dob: dob ? new Date(dob) : null,
                gender,
                profileInfo,
                // Calculate age roughly if needed, but schema has separate field. 
                // Can be derived or stored. Let's start with just storing what's passed or null.
            },
        });

        return NextResponse.json(applicant, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create applicant" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const applicants = await prisma.applicant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { applications: true } }
            }
        });
        return NextResponse.json(applicants);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch applicants" }, { status: 500 });
    }
}
