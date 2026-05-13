"use client"

import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CareerCTASection } from "@/components/sections/career-cta-section"
import { Footer } from "@/components/footer"

// Dynamic imports for heavy 3D components
const CustomCursor = dynamic(() => import("@/components/custom-cursor").then(mod => mod.CustomCursor), { ssr: false })
const CampusSection = dynamic(() => import("@/components/sections/campus-section").then(mod => mod.CampusSection), { ssr: false })
const VirtualTourSection = dynamic(() => import("@/components/sections/virtual-tour-section").then(mod => mod.VirtualTourSection), { ssr: false })

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section with 3D */}
      <HeroSection />
      
      {/* 3D Campus Section */}
      <CampusSection />
      
      {/* Virtual Tour Section */}
      <VirtualTourSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Career CTA Section */}
      <CareerCTASection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
