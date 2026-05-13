"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { LeadFormSection } from "@/components/sections/lead-form-section"
import { MapSection } from "@/components/sections/map-section"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section - Customized for Contact */}
      <HeroSection 
        title="Contact" 
        highlightedText="Us" 
        subtitle="Have questions about admissions, programs, or campus life? Our team is here to help you every step of the way."
      />
      
      {/* Inquiry Form Section */}
      <LeadFormSection />
      
      {/* Map & Location Section */}
      <MapSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
