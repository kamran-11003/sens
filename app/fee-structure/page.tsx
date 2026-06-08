"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { ScholarshipsSection } from "@/components/sections/scholarships-section"
import { Footer } from "@/components/footer"

export default function FeeStructurePage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section - Customized for Fee Structure */}
      <HeroSection 
        title="Fee &" 
        highlightedText="Scholarships" 
        subtitle="Investment in your future starts here. Explore our transparent fee structure and generous merit-based scholarship programs."
      />
      
      <div className="space-y-0">
        {/* Scholarships Section */}
        <ScholarshipsSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}

