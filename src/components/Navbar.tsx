"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrimaryButton } from "@/components/ui/Buttons";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) => `
    relative px-3 py-2 text-sm font-medium transition-colors duration-200
    ${isActive(path) ? "text-primary" : "text-gray-600 hover:text-primary"}
  `;

  return (
    <nav
      className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border border-white/20 shadow-lg h-16"
          : "bg-transparent h-20"
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Recruit
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                ATS
              </span>
            </span>
          </Link>

          {/* Centered Links (Desktop) */}
          {session && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/jobs" className={navLinkClass("/jobs")}>
                Jobs
                {isActive("/jobs") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></span>
                )}
              </Link>
              <Link href="/applicants" className={navLinkClass("/applicants")}>
                Applicants
                {isActive("/applicants") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></span>
                )}
              </Link>
            </div>
          )}

          {/* Right: Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 leading-none">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Recruiter</p>
                </div>
                <p className="  text-gray-300">|</p>
                <Link
                  href="/api/auth/signout"
                  className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                >
                  Sign Out
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-600 font-medium hover:text-primary transition-colors"
                >
                  Log In
                </Link>
                <Link href="/auth/signup">
                  <PrimaryButton className="py-2 px-5 text-sm shadow-lg shadow-primary/20">
                    Get Started
                  </PrimaryButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <button className="md:hidden text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
