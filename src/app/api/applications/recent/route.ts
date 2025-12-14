import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get applications from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const applications = await prisma.application.findMany({
            where: {
                job: {
                    recruiterId: (session.user as any).id
                },
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            include: {
                applicant: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                job: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Failed to fetch recent applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}
