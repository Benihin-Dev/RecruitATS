
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
    try {
        const { applicationId, content } = await req.json();

        if (!applicationId || !content) {
            return NextResponse.json({ message: "Content and Application ID are required" }, { status: 400 });
        }

        const note = await prisma.note.create({
            data: {
                content,
                applicationId
            }
        });

        return NextResponse.json(note, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: "Failed to create note" }, { status: 500 });
    }
}
