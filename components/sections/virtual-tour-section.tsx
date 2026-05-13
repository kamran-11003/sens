"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, FlaskConical, Library, GraduationCap, Dumbbell, Coffee } from "lucide-react"

interface TourScene {
  id: string
  name: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
}

const tourScenes: TourScene[] = [
  {
    id: "library",
    name: "Central Library",
    description: "Explore our 5-floor library with over 100,000 books and digital resources",
    icon: Library,
    color: "#1E3A8A"
  },
  {
    id: "labs",
    name: "Research Labs",
    description: "State-of-the-art laboratories equipped with cutting-edge technology",
    icon: FlaskConical,
    color: "#7C3AED"
  },
  {
    id: "lecture",
    name: "Lecture Halls",
    description: "Modern lecture halls with interactive displays and 500+ seating",
    icon: GraduationCap,
    color: "#F59E0B"
  },
  {
    id: "sports",
    name: "Sports Complex",
    description: "Olympic-standard facilities including pool, gym, and athletics track",
    icon: Dumbbell,
    color: "#10B981"
  },
  {
    id: "cafeteria",
    name: "Student Hub",
    description: "Multi-cuisine cafeteria and student activity center",
    icon: Coffee,
    color: "#EF4444"
  }
]

export function VirtualTourSection() {
  const [currentScene, setCurrentScene] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const scene = tourScenes[currentScene]
  const Icon = scene.icon
  
  const nextScene = () => setCurrentScene((prev) => (prev + 1) % tourScenes.length)
  const prevScene = () => setCurrentScene((prev) => (prev - 1 + tourScenes.length) % tourScenes.length)

  return (
    <section id="tour" className="py-20 md:py-32 relative overflow-hidden bg-linear-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium mb-4">
            Virtual Experience
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">360° Campus Tour</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our campus from anywhere in the world. Navigate through 
            different locations and discover what makes us unique.
          </p>
        </motion.div>
        
        {/* Main Tour Viewer */}
        <motion.div
          className="relative rounded-3xl overflow-hidden glass"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Video Container */}
          <div className="relative aspect-video md:aspect-21/9">
            <AnimatePresence mode="wait">
              {/* Actual campus video — same for every scene */}
              <video
                ref={videoRef}
                key="campus-video"
                src="/campus-tour.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Scene overlay label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-linear-to-t from-black/70 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${scene.color}cc` }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">{scene.name}</h3>
                </div>
                <p className="text-white/70 text-sm md:text-base max-w-md">{scene.description}</p>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Arrows */}
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center"
              onClick={prevScene}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
            
            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center"
              onClick={nextScene}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          </div>
          
          {/* Scene Navigation */}
          <div className="p-4 md:p-6 border-t border-white/10">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {tourScenes.map((s, index) => {
                const SceneIcon = s.icon
                return (
                  <motion.button
                    key={s.id}
                    className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                      index === currentScene 
                        ? "glass" 
                        : "hover:bg-white/5"
                    }`}
                    onClick={() => setCurrentScene(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: index === currentScene ? `${s.color}30` : `${s.color}10` 
                      }}
                    >
                      <SceneIcon 
                        className="w-5 h-5" 
                        style={{ color: s.color }} 
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm whitespace-nowrap">{s.name}</div>
                      <div className="text-xs text-muted-foreground">Click to explore</div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
