"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, ArrowRight, GraduationCap, Briefcase, Code, Stethoscope, Laptop, BookOpen, Monitor, Microscope, Zap, Loader2 } from "lucide-react"
import Link from "next/link"

type CategoryId = "all" | "adp-business" | "adp-science" | "adp-computer" | "adp-health" | "digital-skills" | "intermediate"

interface Program {
  id: string
  title: string
  category: string
  shortDesc: string
  fullDesc: string
  duration: string
  highlights: string[]
  iconName: string
  color: string
}

const categories: { id: CategoryId; label: string }[] = [
  { id: "all",            label: "All Programs" },
  { id: "adp-business",   label: "ADP Business & Mgmt" },
  { id: "adp-science",    label: "ADP Science" },
  { id: "adp-computer",   label: "ADP Computer" },
  { id: "adp-health",     label: "ADP Health Sciences" },
  { id: "digital-skills", label: "Digital & Business Skills" },
  { id: "intermediate",   label: "Intermediate" },
]

const categoryColors: Record<string, string> = {
  all:            "#1E3A8A",
  "adp-business": "#1E3A8A",
  "adp-science":  "#10B981",
  "adp-computer": "#06B6D4",
  "adp-health":   "#EF4444",
  "digital-skills":"#7C3AED",
  intermediate:   "#F59E0B",
}

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  Briefcase, Code, Stethoscope, Laptop, BookOpen, Monitor, Microscope, Zap, GraduationCap,
}

function getIcon(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  return (ICON_MAP[name] ?? GraduationCap) as React.ComponentType<React.SVGProps<SVGSVGElement>>
}

function ProgramCard({ program, onClick }: { program: Program; onClick: () => void }) {
  const Icon = getIcon(program.iconName)
  return (
    <motion.div className="w-full cursor-pointer group" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick}>
      <div className="relative h-full rounded-2xl overflow-hidden bg-white shadow-md border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 p-6 flex flex-col">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" style={{ background: `linear-gradient(135deg, ${program.color}, transparent)` }} />
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shrink-0" style={{ backgroundColor: `${program.color}18` }}>
          <Icon className="w-6 h-6" style={{ color: program.color }} />
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium mb-3 w-fit" style={{ backgroundColor: `${program.color}12`, color: program.color }}>
          <Clock className="w-3 h-3" />{program.duration}
        </span>
        <h3 className="text-base font-bold text-[#0a1128] mb-1.5 leading-snug">{program.title}</h3>
        <p className="text-sm text-slate-500 mb-4 grow leading-relaxed">{program.shortDesc}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {program.highlights.slice(0, 3).map((h) => (
            <span key={h} className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: `${program.color}10`, color: program.color }}>{h}</span>
          ))}
        </div>
        <motion.div className="flex items-center gap-1.5 text-sm font-semibold mt-auto" style={{ color: program.color }} whileHover={{ x: 3 }}>
          View Details <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  )
}

function ProgramModal({ program, onClose }: { program: Program | null; onClose: () => void }) {
  if (!program) return null
  const Icon = getIcon(program.iconName)
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
          initial={{ scale: 0.92, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28 }}
        >
          <div className="relative h-36 flex items-end p-6" style={{ background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}90 100%)` }}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{program.title}</h2>
                <p className="text-white/75 text-sm">{program.shortDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Clock className="w-4 h-4" />
              <span>Duration: <span className="font-semibold text-[#0a1128]">{program.duration}</span></span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-5 text-sm">{program.fullDesc}</p>
            <h4 className="font-semibold text-[#0a1128] mb-3 text-sm">Program Highlights</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {program.highlights.map((h) => (
                <span key={h} className="px-3 py-1.5 rounded-xl text-sm font-medium" style={{ backgroundColor: `${program.color}12`, color: program.color }}>{h}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <Link href={`/admissions?program=${program.id}`} className="flex-1 py-3 rounded-xl text-white font-semibold text-center text-sm no-underline shadow-lg" style={{ backgroundColor: program.color }}>
                Apply Now
              </Link>
              <button onClick={onClose} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function ProgramsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/programs")
      .then(r => r.json())
      .then(data => { setPrograms(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeCategory === "all" ? programs : programs.filter(p => p.category === activeCategory)
  const accentColor = categoryColors[activeCategory] ?? "#1E3A8A"

  return (
    <section id="programs" className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50 to-blue-50/20 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-sm font-medium mb-4">Academic Programs</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">Choose Your <span className="gradient-text">Path</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore our diverse range of programs designed to prepare you for success in your chosen field.</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div className="flex flex-wrap justify-center gap-2 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.id
            const color = categoryColors[cat.id]
            const count = cat.id === "all" ? programs.length : programs.filter(p => p.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
                style={isActive
                  ? { backgroundColor: color, color: "#fff", borderColor: color, boxShadow: `0 4px 14px ${color}40` }
                  : { backgroundColor: "transparent", color: "#64748b", borderColor: "#e2e8f0" }
                }
              >
                {cat.label}
                <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full" style={isActive ? { backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" } : { backgroundColor: "#f1f5f9", color: "#94a3b8" }}>
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" /></div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {filtered.map((program, index) => (
                <motion.div key={program.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}>
                  <ProgramCard program={program} onClick={() => setSelectedProgram(program)} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </section>
  )
}
