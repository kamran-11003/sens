"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Bus, Train, Car, Navigation } from "lucide-react"

interface TransportRoute {
  id: string
  name: string
  type: "bus" | "train" | "car"
  duration: string
  icon: any
  color: string
}

const routes: TransportRoute[] = [
  { id: "1", name: "Metro Line 5", type: "train", duration: "15 min", icon: Train, color: "#1E3A8A" },
  { id: "2", name: "Bus Route 42", type: "bus", duration: "20 min", icon: Bus, color: "#10B981" },
  { id: "3", name: "Highway Exit 12", type: "car", duration: "10 min", icon: Car, color: "#F59E0B" },
]

function AnimatedDot({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      animate={{
        x: [0, 100, 200],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export function MapSection() {
  const [activeRoute, setActiveRoute] = useState<string | null>(null)

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-slate-50 to-white" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-medium mb-4">
            Location
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">
            Find Your <span className="gradient-text">Way</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conveniently located at Jinnah Chowk with easy access from all parts of Daska.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Map */}
          <motion.div
            className="lg:col-span-2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-2xl border border-blue-100 aspect-video lg:aspect-[4/3]">
              {/* Stylized Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/5 to-[#7C3AED]/5">
                {/* Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 58, 138, 0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                
                {/* Roads */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                  {/* Main roads */}
                  <path d="M 0 150 L 400 150" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="8" />
                  <path d="M 200 0 L 200 300" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="8" />
                  <path d="M 50 0 L 350 300" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="4" />
                  <path d="M 0 100 Q 100 100 150 150 T 300 200 T 400 150" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="4" fill="none" />
                  
                  {/* Animated route lines */}
                  <motion.path
                    d="M 50 200 Q 100 150 150 150 T 200 100"
                    stroke="#1E3A8A"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.path
                    d="M 350 50 Q 300 100 250 120 T 200 100"
                    stroke="#10B981"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.path
                    d="M 100 280 Q 150 200 180 150 T 200 100"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </svg>
                
                {/* Landmarks */}
                <div className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    className="relative"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-white text-[#0a1128] text-sm font-semibold shadow-md border border-blue-50">
                        Riphah International College
                      </span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Other landmarks */}
                {[
                  { x: "20%", y: "60%", label: "Metro Station", color: "#1E3A8A" },
                  { x: "75%", y: "25%", label: "Bus Terminal", color: "#10B981" },
                  { x: "30%", y: "85%", label: "Highway Exit", color: "#F59E0B" },
                ].map((landmark, index) => (
                  <motion.div
                    key={landmark.label}
                    className="absolute"
                    style={{ left: landmark.x, top: landmark.y }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: landmark.color }}
                    />
                    <motion.div
                      className="absolute w-6 h-6 rounded-full -inset-1.5"
                      style={{ backgroundColor: landmark.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation Button */}
              <motion.button
                className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] text-white font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </motion.button>
            </div>
          </motion.div>
          
          {/* Transport Options */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-[#0a1128]">Getting Here</h3>
            
            {routes.map((route, index) => {
              const Icon = route.icon
              return (
                <motion.div
                  key={route.id}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    activeRoute === route.id 
                      ? "bg-white shadow-xl border border-blue-100 ring-2 ring-blue-500/10" 
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100"
                  }`}
                  onClick={() => setActiveRoute(activeRoute === route.id ? null : route.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${route.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: route.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#0a1128]">{route.name}</h4>
                      <p className="text-sm text-slate-500">
                        {route.duration} from city center
                      </p>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                  </div>
                  
                  {activeRoute === route.id && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      {route.type === "train" && "Take Metro Line 5 and exit at Innovation Hub station. The campus is a 2-minute walk."}
                      {route.type === "bus" && "Bus Route 42 stops directly at the campus entrance. Buses run every 10 minutes."}
                      {route.type === "car" && "Take Highway Exit 12 and follow signs to Innovation District. Free parking available."}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
            
            {/* Contact Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
              <h4 className="font-semibold mb-2 text-[#0a1128]">Campus Address</h4>
              <p className="text-sm text-slate-600 mb-3">
                Jinnah Chowk, Near STEP School,<br />
                Daska, Sialkot
              </p>
              <button className="text-sm font-medium text-[#1E3A8A] hover:underline">
                Copy Address
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
