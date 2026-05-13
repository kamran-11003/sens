"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { EventsSection } from "@/components/sections/events-section"
import { Footer } from "@/components/footer"

export default function EventsPage() {
  return (
    <main className="relative min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section - Customized for Events */}
      <HeroSection 
        title="Campus" 
        highlightedText="Events & Life" 
        subtitle="Discover a vibrant campus life filled with academic seminars, cultural festivals, sports tournaments, and innovation summits."
      />
      
      {/* Events Section */}
      <EventsSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
