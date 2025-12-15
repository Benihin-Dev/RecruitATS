"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Buttons";
import { Toaster } from "@/components/ui/Toaster";
import { updateApplicant } from "@/app/actions";

interface ApplicantFormProps {
    initialData?: any;
    isEditMode?: boolean;
    onSuccess?: (data: any) => void;
    onCancel?: () => void;
}

export default function ApplicantForm({ initialData, isEditMode = false, onSuccess, onCancel }: ApplicantFormProps) {
    const router = useRouter();

    const [formData, setFormData] = useState(initialData || {
        name: "",
        email: "",
        nationalId: "",
        dob: "",
        gender: "Male",
        address: "",
        phone: "",
        profileInfo: "",
        resumeUrl: "",
        coreSkills: "",
        experience: "",
        education: ""
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: "success" | "error" } | null>(null);
    const [parsing, setParsing] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            setToast({ msg: "Please upload a PDF file", type: "error" });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setToast({ msg: "File size must be less than 5MB", type: "error" });
            return;
        }

        setUploading(true);
        setToast({ msg: "Uploading and parsing resume...", type: "success" });

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('resume', file);

            const response = await fetch('/api/upload-resume', {
                method: 'POST',
                body: uploadFormData,
            });

            const result = await response.json();

            if (result.success && result.url) {
                // Auto-fill form with uploaded URL and parsed data
                setFormData((prev: any) => ({
                    ...prev,
                    resumeUrl: result.url,
                    // Auto-fill with parsed data if available
                    ...(result.parsedData && {
                        name: result.parsedData.name || prev.name,
                        email: result.parsedData.email || prev.email,
                        phone: result.parsedData.phone || prev.phone,
                        address: result.parsedData.address || prev.address,
                        coreSkills: result.parsedData.coreSkills || prev.coreSkills,
                        experience: result.parsedData.experience || prev.experience,
                        education: result.parsedData.education || prev.education,
                        profileInfo: result.parsedData.profileInfo || prev.profileInfo,
                    })
                }));

                const message = result.textExtracted
                    ? "Resume uploaded and parsed! Review the auto-filled fields."
                    : "Resume uploaded successfully!";
                setToast({ msg: message, type: "success" });
            } else {
                setToast({ msg: result.error || "Failed to upload resume", type: "error" });
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            setToast({ msg: "Failed to upload resume. Please try again.", type: "error" });
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleResumeParse = () => {
        if (!resumeText.trim()) return;

        setParsing(true);
        setToast({ msg: "Parsing resume...", type: "success" });

        try {
            // Parse resume text using smart pattern matching
            const parsed = parseResumeText(resumeText);

            // Auto-fill form with parsed data
            setFormData((prev: any) => ({
                ...prev,
                name: parsed.name || prev.name,
                email: parsed.email || prev.email,
                phone: parsed.phone || prev.phone,
                address: parsed.address || prev.address,
                coreSkills: parsed.coreSkills || prev.coreSkills,
                experience: parsed.experience || prev.experience,
                education: parsed.education || prev.education,
                profileInfo: parsed.profileInfo || prev.profileInfo,
            }));

            setToast({ msg: "Resume parsed successfully! Review and edit as needed.", type: "success" });
            setResumeText(""); // Clear the textarea
        } catch (error) {
            console.error("Resume parsing error:", error);
            setToast({ msg: "Failed to parse resume. Please fill manually.", type: "error" });
        } finally {
            setParsing(false);
        }
    };

    const parseResumeText = (text: string) => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // Extract email
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const emailMatch = text.match(emailRegex);
        const email = emailMatch ? emailMatch[0] : "";

        // Extract phone
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
        const phoneMatch = text.match(phoneRegex);
        const phone = phoneMatch ? phoneMatch[0] : "";

        // Extract name (usually first line or first few words)
        const name = lines[0] || "";

        // Extract skills
        const skillKeywords = [
            'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
            'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'aws', 'docker',
            'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'c++',
            'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'flutter'
        ];

        const textLower = text.toLowerCase();
        const foundSkills = skillKeywords.filter(skill => textLower.includes(skill));
        const coreSkills = foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');

        // Extract sections
        const experienceSection = extractSection(text, ['experience', 'work history', 'employment']);
        const educationSection = extractSection(text, ['education', 'academic', 'qualification']);
        const summarySection = extractSection(text, ['summary', 'profile', 'about', 'objective']);

        return {
            name,
            email,
            phone,
            address: "",
            coreSkills: coreSkills || "",
            experience: experienceSection || "",
            education: educationSection || "",
            profileInfo: summarySection || ""
        };
    };

    const extractSection = (text: string, keywords: string[]): string => {
        const lines = text.split('\n');
        let sectionStart = -1;

        for (let i = 0; i < lines.length; i++) {
            const lineLower = lines[i].toLowerCase().trim();
            if (keywords.some(keyword => lineLower.includes(keyword) && lineLower.length < 50)) {
                sectionStart = i + 1;
                break;
            }
        }

        if (sectionStart === -1) return "";

        const commonHeaders = ['experience', 'education', 'skills', 'projects', 'certifications'];
        let sectionEnd = -1;
        for (let i = sectionStart; i < lines.length; i++) {
            const lineLower = lines[i].toLowerCase().trim();
            if (commonHeaders.some(header => lineLower === header || lineLower.startsWith(header + ':'))) {
                sectionEnd = i;
                break;
            }
        }

        if (sectionEnd === -1) sectionEnd = Math.min(sectionStart + 15, lines.length);
        return lines.slice(sectionStart, sectionEnd).join('\n').trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                const res = await updateApplicant(initialData.id, formData);
                if (res.success) {
                    setToast({ msg: "Applicant Updated Successfully!", type: "success" });
                    if (onSuccess) onSuccess(formData);
                    else setTimeout(() => {
                        router.refresh();
                        router.push("/applicants");
                    }, 1500);
                } else {
                    setToast({ msg: "Failed to update applicant", type: "error" });
                }
            } else {
                const res = await fetch("/api/applicants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const data = await res.json();
                    setToast({ msg: "Applicant Added Successfully!", type: "success" });
                    if (onSuccess) onSuccess(data);
                    else setTimeout(() => {
                        router.refresh();
                        router.push("/applicants");
                    }, 1500);
                } else {
                    setToast({ msg: "Failed to add applicant", type: "error" });
                }
            }
        } catch (error) {
            setToast({ msg: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClassName = "mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 sm:text-sm ease-in-out hover:bg-white";
    const labelClassName = "block text-sm font-semibold text-gray-700 mb-1";
    const sectionClassName = "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
            {toast && <Toaster message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

            {/* Smart Resume Parser Section */}
            {!isEditMode && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-black to-gray-800 rounded-lg flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                Smart Resume Parser
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">NEW</span>
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Paste resume text below and click "Parse" to automatically fill all fields!
                            </p>
                            <div className="space-y-3">
                                <textarea
                                    placeholder="Paste resume text here (copy from PDF, Word, LinkedIn, etc.)..."
                                    rows={4}
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleResumeParse}
                                    disabled={parsing || !resumeText.trim()}
                                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${parsing || !resumeText.trim()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-black to-gray-800 text-white hover:shadow-lg hover:scale-105'
                                        }`}
                                >
                                    {parsing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Parsing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                            Parse Resume
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={sectionClassName}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    Personal Details
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                    <div className="">
                        <label className={labelClassName}>Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                            className={inputClassName} placeholder="John Doe" />
                    </div>

                    <div>
                        <label className={labelClassName}>Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange}
                            className={inputClassName} placeholder="john@example.com" />
                    </div>

                    <div>
                        <label className={labelClassName}>Phone</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                            className={inputClassName} placeholder="+94772206096" />
                    </div>

                    <div>
                        <label className={labelClassName}>National ID</label>
                        <input type="text" name="nationalId" value={formData.nationalId} onChange={handleChange}
                            className={inputClassName} placeholder="ID-199945621478" />
                    </div>

                    <div>
                        <label className={labelClassName}>Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={handleChange}
                            className={inputClassName} />
                    </div>

                    <div>
                        <label className={labelClassName}>Gender</label>
                        <div className="relative">
                            <select name="gender" value={formData.gender} onChange={handleChange}
                                className={`${inputClassName} appearance-none cursor-pointer`}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClassName}>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange}
                            className={inputClassName} placeholder="123 Main St, Springfield" />
                    </div>
                </div>
            </div>

            <div className={sectionClassName}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-purple-50 text-purple-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </span>
                    Professional Profile
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className={labelClassName}>Resume</label>
                        <p className="text-xs text-gray-500 mb-3">Upload PDF or paste URL</p>

                        {/* Upload Option */}
                        <div className="mb-4">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResumeFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                <div className={`px-4 py-3 border-2 border-dashed rounded-xl text-center transition-all ${uploading
                                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                        : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10'
                                    }`}>
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-3 py-2">
                                            {/* Animated Upload Icon */}
                                            <div className="relative">
                                                <svg className="w-12 h-12 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                                <svg className="absolute inset-0 w-12 h-12 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                </svg>
                                            </div>

                                            {/* Loading Text */}
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-700">Processing Resume...</p>
                                                <p className="text-xs text-gray-500">Uploading and extracting data</p>
                                            </div>

                                            {/* Animated Progress Bar */}
                                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full animate-progress"></div>
                                            </div>

                                            {/* Loading Dots */}
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 text-primary py-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                            </svg>
                                            <span className="font-medium">Click to upload PDF</span>
                                            <span className="text-xs text-gray-500">(Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Manual URL Option */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Or paste resume URL</p>
                            <input
                                type="url"
                                name="resumeUrl"
                                value={formData.resumeUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/resume.pdf or uploaded file URL"
                                className={inputClassName}
                            />
                            {formData.resumeUrl && (
                                <a
                                    href={formData.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline mt-1 inline-block"
                                >
                                    View Resume →
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelClassName}>Profile Info (Bio)</label>
                        <textarea name="profileInfo" rows={4} value={formData.profileInfo} onChange={handleChange}
                            className={inputClassName} placeholder="Experienced developer with a passion for..." />
                    </div>
                </div>
            </div>

            {/* Professional Details Section */}
            <div className={sectionClassName}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </span>
                    Professional Details
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className={labelClassName}>Core Skills</label>
                        <p className="text-xs text-gray-500 mb-2">List your key technical and professional skills</p>
                        <textarea
                            name="coreSkills"
                            value={formData.coreSkills || ""}
                            onChange={handleChange}
                            rows={3}
                            placeholder="JavaScript, React, Node.js, Python, SQL, Project Management..."
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label className={labelClassName}>Professional Experience</label>
                        <p className="text-xs text-gray-500 mb-2">Describe your work history and relevant experience</p>
                        <textarea
                            name="experience"
                            value={formData.experience || ""}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Senior Developer at Tech Corp (2020-2023)&#10;- Led team of 5 developers&#10;- Built scalable web applications"
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label className={labelClassName}>Education</label>
                        <p className="text-xs text-gray-500 mb-2">Your educational background and qualifications</p>
                        <textarea
                            name="education"
                            value={formData.education || ""}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Bachelor of Science in Computer Science&#10;University of Technology, 2018"
                            className={inputClassName}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <button type="button" onClick={() => onCancel ? onCancel() : router.back()}
                    className="px-6 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors">
                    Cancel
                </button>
                <PrimaryButton type="submit" isLoading={loading} className="px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                    {isEditMode ? "Update Applicant" : "Save Applicant"}
                </PrimaryButton>
            </div>
        </form>
    );
}

