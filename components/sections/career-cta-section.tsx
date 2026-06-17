"use client"

import { motion } from "framer-motion"
import { ArrowRight, Briefcase, GraduationCap, Sparkles } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Lazy-load the GLB viewer (heavy three.js + large model) only on the client.
const ModelViewer = dynamic(
  () => import("@/components/model-viewer").then((mod) => mod.ModelViewer),
  { ssr: false }
)

export function CareerCTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          className="relative rounded-[3rem] overflow-hidden bg-[#0a1128] p-12 md:p-20 text-white shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-full h-full -z-10 overflow-hidden">
            <motion.div 
              className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#f5b041] text-sm font-semibold mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Careers at Riphah</span>
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-[var(--font-poppins)] leading-[1.1]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Build Your <span className="text-[#f5b041]">Academic Future</span> With Us
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-slate-400 max-w-lg mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Join our community of world-class educators, innovators, and leaders. 
                We provide the platform for you to excel and inspire.
              </motion.p>
              
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#f5b041]" />
                  </div>
                  <span className="font-medium text-slate-300">Expert Faculty</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[#f5b041]" />
                  </div>
                  <span className="font-medium text-slate-300">Great Benefits</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-6">
              {/* Teacher 3D model — drag to rotate 360° */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <ModelViewer
                  className="w-full max-w-[440px] h-[520px] drop-shadow-[0_20px_40px_rgba(245,176,65,0.25)]"
                  models={[{ src: "/teacher-3d-model.glb", position: [0, 0, 0], scale: 1.8 }]}
                  cameraPosition={[0, 0, 4.2]}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link href="/faculty#careers">
                  <motion.div
                    className="group relative px-10 py-6 rounded-2xl bg-gradient-to-r from-[#f5b041] to-[#d68910] text-[#0a1128] font-bold text-xl flex items-center gap-3 shadow-[0_20px_50px_rgba(245,176,65,0.3)] no-underline cursor-pointer overflow-hidden"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Explore Career Opportunities</span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                    
                    {/* Button Shine Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                      animate={{
                        translateX: ["100%", "-100%"],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
