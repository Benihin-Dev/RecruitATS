
"use client";

import { useSession } from "next-auth/react";
import Dashboard from "@/components/dashboard/Dashboard";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return <Dashboard />;
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50/50 to-white overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}
