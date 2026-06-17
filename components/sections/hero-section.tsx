"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { HeroScene } from "@/components/hero-scene"

// Lazy-load the GLB viewer (heavy three.js + large models) only on the client.
const ModelViewer = dynamic(
  () => import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  { ssr: false }
)

interface HeroSectionProps {
  title?: string
  highlightedText?: string
  subtitle?: string
  showButtons?: boolean
  /** Which 3D content to show behind the hero. Defaults to the procedural scene. */
  heroModel?: "default" | "students" | "teacher"
}

export function HeroSection({
  title = "Shaping",
  highlightedText = "Future Leaders",
  subtitle = "Experience world-class education in a futuristic campus designed for innovation, creativity, and structural excellence.",
  showButtons = true,
  heroModel = "default",
}: HeroSectionProps) {
  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center overflow-hidden" style={{ paddingTop: "80px", backgroundColor: "#0a1128" }}>
      {/* Background Campus Image — very faint behind everything */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/riphahdaska.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.30,
        }}
      />
      {/* Dark gradient overlay to blend image into the navy theme */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg, rgba(10,17,40,0.3) 0%, rgba(10,17,40,0.55) 60%, rgba(10,17,40,0.85) 100%)",
        }}
      />

      {/* 3D Canvas Background — sits on top of background image */}
      {heroModel === "default" ? (
        <div className="absolute inset-0 z-[2]" style={{ pointerEvents: "auto" }}>
          <HeroScene />
        </div>
      ) : heroModel === "students" ? (
        <ModelViewer
          className="absolute top-24 bottom-0 right-0 w-[65%] md:w-[50%] z-[2]"
          models={[
            { src: "/malestudent.glb", position: [-1.3, 0, 0], scale: 1.7 },
            { src: "/femalestudentmodel.glb", position: [1.3, 0, 0], scale: 1.7 },
          ]}
          cameraPosition={[0, 0, 7.5]}
        />
      ) : (
        <ModelViewer
          className="absolute top-24 bottom-0 right-0 w-[65%] md:w-[50%] z-[2]"
          models={[{ src: "/teacher-3d-model.glb", position: [0, 0, 0], scale: 2.3 }]}
          cameraPosition={[0, 0, 6]}
        />
      )}
      
      {/* Content — left-aligned like react-frontend */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 w-full" style={{ pointerEvents: "none" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ pointerEvents: "none" }}
        >
          {/* Badge */}
          <motion.span 
            className="inline-block mb-8 px-4 py-2 rounded-full text-[0.85rem] font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(245, 176, 65, 0.15)",
              color: "#f5b041",
              border: "1px solid rgba(245, 176, 65, 0.3)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Admissions Open 2026
          </motion.span>

          {/* Heading — gold gradient matching react-frontend */}
          <motion.h1 
            className="font-[var(--font-poppins)] text-[4.5rem] md:text-[5.5rem] lg:text-[6rem] font-extrabold leading-[1.1] text-white mb-6 max-w-[900px]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {title}{" "}
            <span 
              className="bg-clip-text"
              style={{
                background: "linear-gradient(135deg, #f5b041, #d68910)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {highlightedText}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-[1.2rem] text-[#94a3b8] max-w-[600px] mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {subtitle}
          </motion.p>

          {/* Buttons */}
          {showButtons && <motion.div
            className="flex flex-col sm:flex-row gap-4"
            style={{ pointerEvents: "auto" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.a
              href="/admissions"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#f5b041] text-[#0a1128] font-[var(--font-poppins)] text-[1.1rem] font-bold no-underline cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#f39c12",
                boxShadow: "0 0 40px rgba(245, 176, 65, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            
            <motion.a
              href="#tour"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-[var(--font-poppins)] text-[1.1rem] font-semibold no-underline"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Virtual Tour
            </motion.a>
          </motion.div>}
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}

