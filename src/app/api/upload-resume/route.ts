import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use require for pdf-parse due to module compatibility
const pdf = require('pdf-parse');

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        // Check Supabase credentials
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({
                error: "Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file."
            }, { status: 500 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text from PDF
        let extractedText = "";
        let parsedData = null;

        try {
            const pdfData = await pdf(buffer);
            extractedText = pdfData.text;

            // Parse the extracted text
            if (extractedText && extractedText.trim().length > 0) {
                parsedData = parseResumeText(extractedText);
            }
        } catch (pdfError) {
            console.warn("PDF text extraction failed, continuing with upload only:", pdfError);
            // Continue with upload even if text extraction fails
        }

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileName = `${timestamp}-${randomString}-${file.name}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('resumes')
            .upload(fileName, buffer, {
                contentType: 'application/pdf',
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({
                error: "Failed to upload resume. Make sure the 'resumes' bucket exists in Supabase Storage and is public.",
                details: error.message
            }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(fileName);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName,
            parsedData: parsedData, // Include parsed resume data
            textExtracted: !!extractedText
        });

    } catch (error: any) {
        console.error("Resume upload error:", error);
        return NextResponse.json({
            error: error.message || "Failed to upload resume",
            details: error.toString()
        }, { status: 500 });
    }
}

// Helper function to parse resume text
function parseResumeText(text: string) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Extract email
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : "";

    // Extract phone
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatch = text.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : "";

    // Extract name (usually first line)
    const name = lines[0] || "";

    // Extract skills
    const skillKeywords = [
        'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
        'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'aws', 'docker',
        'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'c++',
        'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'flutter', 'django',
        'flask', 'spring', 'express', 'nextjs', 'redux', 'tailwind', 'bootstrap'
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
}

function extractSection(text: string, keywords: string[]): string {
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
}
