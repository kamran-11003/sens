"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { GraduationCap, Users, Award, Building2, Globe, BookOpen } from "lucide-react"

interface StatItemProps {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
  delay: number
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold gradient-text block truncate px-1 tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

function StatItem({ icon, value, suffix, label, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group bg-[#050d1f]"
    >
      <div className="p-6 md:p-8 text-center flex flex-col items-center justify-center h-full transition-colors duration-300 group-hover:bg-white/3">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-linear-to-br from-[#1E3A8A]/40 to-[#7C3AED]/40 border border-white/10 flex items-center justify-center text-white/70">
          {icon}
        </div>
        
        <AnimatedCounter value={value} suffix={suffix} />
        
        <p className="mt-2 text-white/40 text-sm font-medium">{label}</p>
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  const stats = [
    { icon: <GraduationCap className="w-8 h-8" />, value: 50000, suffix: "+", label: "Alumni Worldwide" },
    { icon: <Users className="w-8 h-8" />, value: 15000, suffix: "+", label: "Current Students" },
    { icon: <Award className="w-8 h-8" />, value: 98, suffix: "%", label: "Placement Rate" },
    { icon: <Building2 className="w-8 h-8" />, value: 200, suffix: "+", label: "Partner Companies" },
    { icon: <Globe className="w-8 h-8" />, value: 85, suffix: "+", label: "Countries Represented" },
    { icon: <BookOpen className="w-8 h-8" />, value: 150, suffix: "+", label: "Programs Offered" },
  ]

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#050d1f]">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#1E3A8A]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#7C3AED]/10 rounded-full blur-[80px]" />
      </div>

      {/* Fine grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-sm font-medium mb-4 tracking-wide">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Numbers That <span className="gradient-text">Speak</span>
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto">
            Decades of excellence in education, research, and student success
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
