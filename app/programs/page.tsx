"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { ProgramsSection } from "@/components/sections/programs-section"
import { Footer } from "@/components/footer"

export default function ProgramsPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section - Customized for Programs */}
      <HeroSection 
        title="Academic" 
        highlightedText="Programs" 
        subtitle="Explore our diverse range of undergraduate and postgraduate programs designed to provide you with the skills and knowledge for a successful career."
      />
      
      {/* Programs Section */}
      <ProgramsSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
