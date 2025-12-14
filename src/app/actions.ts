"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Job Actions ---

export async function deleteJob(id: string) {
    try {
        await prisma.job.delete({
            where: { id },
        });
        revalidatePath("/jobs");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete job:", error);
        return { success: false, error: "Failed to delete job" };
    }
}

export async function updateJob(id: string, data: any) {
    try {
        await prisma.job.update({
            where: { id },
            data: {
                title: data.title,
                location: data.location,
                jobType: data.jobType,
                workMode: data.workMode,
                briefDesc: data.briefDesc,
                keyResponsibilities: data.keyResponsibilities,
                requiredQualifications: data.requiredQualifications,
            },
        });
        revalidatePath("/jobs");
        revalidatePath(`/jobs/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update job:", error);
        return { success: false, error: "Failed to update job" };
    }
}

// --- Applicant Actions ---

export async function deleteApplicant(id: string) {
    try {
        await prisma.applicant.delete({
            where: { id },
        });
        revalidatePath("/applicants");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete applicant:", error);
        return { success: false, error: "Failed to delete applicant" };
    }
}

export async function updateApplicant(id: string, data: any) {
    try {
        await prisma.applicant.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                nationalId: data.nationalId,
                dob: data.dob,
                gender: data.gender,
                address: data.address,
                phone: data.phone,
                profileInfo: data.profileInfo,
                resumeUrl: data.resumeUrl,
                coreSkills: data.coreSkills,
                experience: data.experience,
                education: data.education,
            }
        });
        revalidatePath("/applicants");
        revalidatePath(`/applicants/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update applicant:", error);
        return { success: false, error: "Failed to update applicant" };
    }
}

// --- Application Actions ---


export async function deleteApplication(id: string) {
    try {
        await prisma.application.delete({
            where: { id },
        });
        revalidatePath("/applications");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete application:", error);
        return { success: false, error: "Failed to delete application" };
    }
}

export async function createApplicant(data: any) {
    try {
        // Basic validation could go here
        const applicant = await prisma.applicant.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                resumeUrl: data.resumeUrl,
                nationalId: data.nationalId,
                address: data.address,
                dob: data.dob ? new Date(data.dob) : undefined,
                gender: data.gender,
                profileInfo: data.profileInfo,
                coreSkills: data.coreSkills,
                experience: data.experience,
                education: data.education,
            },
        });
        revalidatePath("/applicants");
        return { success: true, data: applicant };
    } catch (error) {
        console.error("Failed to create applicant:", error);
        return { success: false, error: "Failed to create applicant" };
    }
}

export async function createApplication(data: any) {
    try {
        const application = await prisma.application.create({
            data: {
                jobId: data.jobId,
                applicantId: data.applicantId,
                status: data.status || "NEW",
                // resumeUrl: data.resumeUrl, // Temporarily disabled due to migration failure
            },
        });
        revalidatePath("/applications");
        revalidatePath("/dashboard");
        return { success: true, data: application };
    } catch (error) {
        console.error("Failed to create application:", error);
        return { success: false, error: "Failed to create application" };
    }
}

export async function updateApplicationStatus(id: string, status: any) {
    try {
        await prisma.application.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/applications");
        revalidatePath(`/applications/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update application status:", error);
        return { success: false, error: "Failed to update application status" };
    }
}

