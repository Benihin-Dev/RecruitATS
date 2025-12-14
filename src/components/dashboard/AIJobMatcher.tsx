"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Match {
    applicant: any;
    score: number;
    reasons: string[];
}

interface JobMatch {
    job: any;
    matches: Match[];
}

export default function AIJobMatcher() {
    const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAndMatchJobs();
    }, []);

    const fetchAndMatchJobs = async () => {
        try {
            // Fetch jobs and applicants
            const [jobsRes, applicantsRes] = await Promise.all([
                fetch('/api/jobs'),
                fetch('/api/applicants')
            ]);

            if (jobsRes.ok && applicantsRes.ok) {
                const jobs = await jobsRes.json();
                const applicants = await applicantsRes.json();

                // Filter only jobs with no or few applications
                const openJobs = jobs.filter((job: any) => (job._count?.applications || 0) < 3);

                // Calculate matches for each job
                const matches = openJobs.slice(0, 3).map((job: any) => ({
                    job,
                    matches: calculateMatches(job, applicants).slice(0, 5)
                }));

                setJobMatches(matches);
            }
        } catch (error) {
            console.error("Failed to fetch data for matching:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateMatches = (job: any, applicants: any[]): Match[] => {
        return applicants
            .map(applicant => {
                const { score, reasons } = calculateMatchScore(job, applicant);
                return { applicant, score, reasons };
            })
            .filter(match => match.score > 20) // Only show matches above 20%
            .sort((a, b) => b.score - a.score);
    };

    const calculateMatchScore = (job: any, applicant: any): { score: number; reasons: string[] } => {
        let score = 0;
        const reasons: string[] = [];

        // Extract keywords from job
        const jobText = `${job.title} ${job.briefDesc} ${job.keyResponsibilities || ''} ${job.requiredQualifications || ''}`.toLowerCase();
        const applicantText = `${applicant.name} ${applicant.email} ${applicant.profileInfo || ''} ${applicant.address || ''}`.toLowerCase();

        // Common tech keywords
        const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql'];

        // Check for tech skill matches
        const matchedSkills = techKeywords.filter(skill =>
            jobText.includes(skill) && applicantText.includes(skill)
        );

        if (matchedSkills.length > 0) {
            score += matchedSkills.length * 15;
            reasons.push(`${matchedSkills.length} matching skill${matchedSkills.length > 1 ? 's' : ''}: ${matchedSkills.slice(0, 3).join(', ')}`);
        }

        // Check for experience level keywords
        const experienceLevels = ['senior', 'junior', 'mid-level', 'lead', 'manager', 'intern', 'entry'];
        const jobLevel = experienceLevels.find(level => jobText.includes(level));
        const applicantLevel = experienceLevels.find(level => applicantText.includes(level));

        if (jobLevel && applicantLevel && jobLevel === applicantLevel) {
            score += 20;
            reasons.push(`Experience level match: ${jobLevel}`);
        }

        // Location match
        if (job.location && applicant.address) {
            const jobLocation = job.location.toLowerCase();
            const applicantLocation = applicant.address.toLowerCase();
            if (applicantLocation.includes(jobLocation) || jobLocation.includes(applicantLocation.split(',')[0])) {
                score += 15;
                reasons.push('Location match');
            }
        }

        // Education keywords
        const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'graduate'];
        const hasEducationRequirement = educationKeywords.some(edu => jobText.includes(edu));
        const hasEducation = educationKeywords.some(edu => applicantText.includes(edu));

        if (hasEducationRequirement && hasEducation) {
            score += 10;
            reasons.push('Education background');
        }

        // General keyword overlap
        const jobWords = jobText.split(/\s+/).filter(w => w.length > 4);
        const applicantWords = applicantText.split(/\s+/).filter(w => w.length > 4);
        const commonWords = jobWords.filter(w => applicantWords.includes(w));

        if (commonWords.length > 5) {
            score += Math.min(commonWords.length * 2, 20);
        }

        // Cap score at 100
        score = Math.min(score, 100);

        if (reasons.length === 0) {
            reasons.push('General profile compatibility');
        }

        return { score, reasons };
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 70) return 'Excellent Match';
        if (score >= 50) return 'Good Match';
        return 'Potential Match';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-500">Analyzing matches...</span>
                </div>
            </div>
        );
    }

    if (jobMatches.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI-Powered Job Matching</h3>
                </div>
                <p className="text-gray-500 text-center py-8">No open positions or applicants to match at the moment.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-black to-gray-800 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">AI-Powered Job Matching</h3>
                        <p className="text-sm text-gray-500">Smart recommendations based on skills and experience</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Analysis</span>
                </div>
            </div>

            <div className="space-y-6">
                {jobMatches.map(({ job, matches }) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <Link href={`/jobs/${job.id}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                                    {job.title}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">{job.location} • {job.workMode}</p>
                            </div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                {matches.length} Match{matches.length !== 1 ? 'es' : ''}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches.slice(0, 3).map((match) => (
                                <Link
                                    key={match.applicant.id}
                                    href={`/applicants/${match.applicant.id}`}
                                    className="group p-4 bg-gray-50 rounded-lg hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 border border-gray-200 hover:border-purple-200 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                                {match.applicant.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate">{match.applicant.email}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md border text-xs font-bold ${getScoreColor(match.score)}`}>
                                            {match.score}%
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-700">{getScoreLabel(match.score)}</p>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                            {match.reasons.slice(0, 2).map((reason, idx) => (
                                                <li key={idx} className="flex items-start gap-1">
                                                    <svg className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                    <span className="line-clamp-1">{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
