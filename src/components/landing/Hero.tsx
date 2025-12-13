
"use client";

import Link from "next/link";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <span className="inline-block py-1.5 px-4 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6 animate-fade-in border border-orange-100 shadow-sm">
                    ✨ The #1 ATS for Fast-Growing Teams
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 animate-slide-up leading-tight">
                    Hire the best. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-red-600">Forget the rest.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    Streamline your entire recruiting pipeline from sourcing to offer letter.
                    Modern, fast, and delightful to use.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Link href="/auth/signup">
                        <PrimaryButton className="text-lg px-10 py-4 h-14 w-full sm:w-auto shadow-glow font-bold">
                            Start Hiring Free
                        </PrimaryButton>
                    </Link>
                    <Link href="/auth/signin">
                        <SecondaryButton className="text-lg px-10 py-4 h-14 w-full sm:w-auto font-bold">
                            View Demo
                        </SecondaryButton>
                    </Link>
                </div>

                {/* Dashboard Preview Mockup */}
                <div className="mt-20 relative max-w-5xl mx-auto rounded-2xl shadow-strong border border-gray-200 overflow-hidden animate-slide-up bg-white" style={{ animationDelay: '0.4s' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 opacity-50"></div>
                    <div className="bg-white p-4 h-[400px] flex flex-col relative">
                        {/* Browser Chrome */}
                        <div className="flex space-x-2 mb-6 border-b border-gray-100 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <div className="ml-4 w-1/3 h-4 bg-gray-100 rounded-full"></div>
                        </div>
                        {/* UI Placeholder */}
                        <div className="flex-1 flex gap-6">
                            <div className="w-1/4 bg-gray-50/50 rounded-xl p-4 space-y-4 border border-gray-100">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-10 bg-white rounded-lg shadow-soft"></div>
                                <div className="h-10 bg-white rounded-lg shadow-soft"></div>
                                <div className="h-10 bg-white rounded-lg shadow-soft"></div>
                            </div>
                            <div className="flex-1 bg-gray-50/50 rounded-xl p-6 grid grid-cols-2 gap-6 border border-gray-100">
                                <div className="bg-white h-32 rounded-xl shadow-soft p-5 border border-gray-100 flex flex-col justify-between">
                                    <div className="w-12 h-12 rounded-lg bg-orange-100 mb-2 flex items-center justify-center text-orange-600">💼</div>
                                    <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                                </div>
                                <div className="bg-white h-32 rounded-xl shadow-soft p-5 border border-gray-100 flex flex-col justify-between">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 mb-2 flex items-center justify-center text-blue-600">👥</div>
                                    <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                                </div>
                                <div className="col-span-2 bg-white flex-1 rounded-xl shadow-soft mt-2 p-5 border border-gray-100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
