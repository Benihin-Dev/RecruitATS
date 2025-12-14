import { NextRequest, NextResponse } from "next/server";
const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Read file and extract text from PDF
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text from PDF
        const pdfData = await pdfParse(buffer);
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length === 0) {
            return NextResponse.json({
                error: "Could not extract text from PDF. Please ensure it's a text-based PDF, not a scanned image."
            }, { status: 400 });
        }

        // Parse resume using regex patterns (no AI needed!)
        const parsedData = parseResumeText(resumeText);

        return NextResponse.json({
            success: true,
            data: parsedData
        });

    } catch (error: any) {
        console.error("Resume parsing error:", error);
        return NextResponse.json({
            error: error.message || "Failed to parse resume",
            details: error.toString()
        }, { status: 500 });
    }
}

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

    // Extract name (usually first line or first few words)
    const name = lines[0] || "";

    // Extract skills (look for common skill keywords)
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
    const experienceSection = extractSection(text, ['experience', 'work history', 'employment', 'professional experience']);
    const educationSection = extractSection(text, ['education', 'academic', 'qualification']);
    const summarySection = extractSection(text, ['summary', 'profile', 'about', 'objective']);

    // Extract address (look for common patterns)
    const addressRegex = /\d+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/;
    const addressMatch = text.match(addressRegex);
    const address = addressMatch ? addressMatch[0] : "";

    return {
        name: name,
        email: email,
        phone: phone,
        address: address,
        coreSkills: coreSkills || "Please review and add skills",
        experience: experienceSection || "Please review and add experience",
        education: educationSection || "Please review and add education",
        profileInfo: summarySection || ""
    };
}

function extractSection(text: string, keywords: string[]): string {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = -1;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase().trim();
        if (keywords.some(keyword => lineLower.includes(keyword) && lineLower.length < 50)) {
            sectionStart = i + 1;
            break;
        }
    }

    if (sectionStart === -1) return "";

    // Find section end (next section header or end of document)
    const commonHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'references'];
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
