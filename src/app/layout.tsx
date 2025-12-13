
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATS - Applicant Tracking System",
  description: "Recruitment made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-gray-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
