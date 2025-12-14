import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as { id: string }).id;

        // Get date 7 days ago (start of day)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch applications from the last 7 days
        const applications = await prisma.application.findMany({
            where: {
                job: {
                    recruiterId: userId
                },
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                createdAt: true
            }
        });

        // Fetch jobs from the last 7 days
        const jobs = await prisma.job.findMany({
            where: {
                recruiterId: userId,
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                createdAt: true
            }
        });

        // Create a map for each day
        const trends: { date: string; applications: number; jobs: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const appsCount = applications.filter(app => {
                const appDate = new Date(app.createdAt).toISOString().split('T')[0];
                return appDate === dateStr;
            }).length;

            const jobsCount = jobs.filter(job => {
                const jobDate = new Date(job.createdAt).toISOString().split('T')[0];
                return jobDate === dateStr;
            }).length;

            trends.push({
                date: dateStr,
                applications: appsCount,
                jobs: jobsCount
            });
        }

        return NextResponse.json(trends);
    } catch (error) {
        console.error("Failed to fetch trends:", error);
        return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
    }
}
