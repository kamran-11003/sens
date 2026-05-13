"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { FacultySection } from "@/components/sections/faculty-section"
import { JobApplicationSection } from "@/components/sections/job-application-section"
import { Footer } from "@/components/footer"

export default function FacultyPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section - Customized for Faculty */}
      <HeroSection 
        title="Our Expert" 
        highlightedText="Faculty" 
        subtitle="Learn from world-class educators and industry experts who are dedicated to shaping the next generation of global leaders."
        showButtons={false}
      />
      
      {/* Faculty Section */}
      <FacultySection />
      
      {/* Job Application Section */}
      <JobApplicationSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
