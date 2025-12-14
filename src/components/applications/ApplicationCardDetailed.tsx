import Link from 'next/link';
import ApplicationStatusBadge from '@/components/ApplicationStatusBadge';

interface ApplicationCardProps {
    application: any; // Type to be refined if possible, but matching usage
}

export default function ApplicationCardDetailed({ application }: ApplicationCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col relative pb-3 md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 min-w-0 ">
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                            {application.applicant.name}
                        </h3>
                    </div>
                    <div className='absolute top-0 right-0'>
                        <ApplicationStatusBadge status={application.status} />
                    </div>
                    <p className="text-sm font-medium text-primary mb-3">
                        Applied for: <span className="text-gray-700">{application.job.title}</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-0 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            {application.applicant.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            {application.applicant.phone || "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {application.applicant.profileInfo && (
                        <p className="text-sm text-gray-600 line-clamp mb-0 italic">
                            &quot;{application.applicant.profileInfo}&quot;
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Link href={`/applications/${application.id}`} className="w-full">
                        <button className="w-full whitespace-nowrap px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm shadow-sm">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
