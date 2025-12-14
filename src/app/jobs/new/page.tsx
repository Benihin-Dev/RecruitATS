
"use client";

import { useSession } from "next-auth/react";
import JobForm from "@/components/JobForm";

export default function NewJob() {
    const { data: session } = useSession();

    if (session === undefined) return null;

    return (
        <div className="w-11/12 mx-auto pb-10 pt-20 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Post a New Job
                    </h2>
                </div>
            </div>

            <JobForm />
        </div>
    );
}
