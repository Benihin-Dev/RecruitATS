
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';


export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const { status } = await req.json();

        const application = await prisma.application.update({
            where: { id: String(id) },
            data: { status },
        });

        return NextResponse.json(application);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update application" },
            { status: 500 }
        );
    }
}
