"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface FacultyMember {
  id: string
  name: string
  title: string
  department: string
  bio: string
  specializations: string[]
  publications: number | null
  awards: number | null
  students: number | null
  image: string
  isDirector: boolean
  displayOrder: number
}

function Avatar({ member, size = "md" }: { member: FacultyMember; size?: "sm" | "md" | "lg" }) {
  const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  const sizeMap = { sm: "w-16 h-16 text-xl", md: "w-24 h-24 text-2xl", lg: "w-32 h-32 text-3xl" }
  if (member.image) {
    return <img src={member.image} alt={member.name} className={`${sizeMap[size]} rounded-full object-cover`} />
  }
  return (
    <div className={`${sizeMap[size]} rounded-full bg-linear-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center text-white font-bold`}>
      {initials}
    </div>
  )
}

function DirectorSlider({ directors }: { directors: FacultyMember[] }) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const member = directors[index]

  const go = (d: number) => {
    setDir(d)
    setIndex(i => (i + d + directors.length) % directors.length)
  }

  const initials = member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#0a1128] shadow-2xl min-h-110 flex flex-col md:flex-row">
      {/* Left — full data */}
      <div className="flex-1 p-10 md:p-14 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={member.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#f5b041]/20 text-[#f5b041] text-xs font-semibold uppercase tracking-widest mb-5">
              {member.department}
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">{member.name}</h3>
            <p className="text-[#f5b041] font-semibold text-lg mb-6">{member.title}</p>
            <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-xl">{member.bio}</p>
            {member.specializations?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {member.specializations.map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-sm border border-white/10">{s}</span>
                ))}
              </div>
            )}
            <div className="flex gap-8">
              {member.publications != null && (
                <div><p className="text-2xl font-bold text-[#f5b041]">{member.publications}</p><p className="text-slate-400 text-xs mt-0.5">Papers</p></div>
              )}
              {member.awards != null && (
                <div><p className="text-2xl font-bold text-[#f5b041]">{member.awards}</p><p className="text-slate-400 text-xs mt-0.5">Awards</p></div>
              )}
              {member.students != null && (
                <div><p className="text-2xl font-bold text-[#f5b041]">{member.students}+</p><p className="text-slate-400 text-xs mt-0.5">Students</p></div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots + nav */}
        {directors.length > 1 && (
          <div className="flex items-center gap-4 mt-10">
            <button onClick={() => go(-1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-1.5">
              {directors.map((_: FacultyMember, i: number) => (
                <button key={i} onClick={() => { setDir(i > index ? 1 : -1); setIndex(i) }}
                  className={`h-2 rounded-full transition-all ${ i === index ? "w-6 bg-[#f5b041]" : "w-2 bg-white/30" }`}
                />
              ))}
            </div>
            <button onClick={() => go(1)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Right — large image */}
      <div className="hidden md:flex w-96 shrink-0 items-center justify-center relative overflow-hidden bg-linear-to-br from-[#1E3A8A]/40 to-[#0a1128]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={member.id + "-img"}
            custom={dir}
            initial={{ opacity: 0, scale: 1.08, x: dir * 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: dir * -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-end justify-center"
          >
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-56 h-56 rounded-full bg-linear-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center text-white text-6xl font-bold mb-16">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-r from-[#0a1128] via-[#0a1128]/10 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function FacultyCard({ member }: { member: FacultyMember }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="perspective-1000 cursor-pointer" style={{ perspective: "1000px" }} onClick={() => setFlipped(f => !f)}>
      <motion.div
        className="relative w-full h-96"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white shadow-md border border-slate-100 flex flex-col items-center justify-center p-8 text-center backface-hidden" style={{ backfaceVisibility: "hidden" }}>
          <Avatar member={member} size="lg" />
          <h3 className="text-xl font-bold text-[#0a1128] mt-5 mb-1">{member.name}</h3>
          <p className="text-[#1E3A8A] text-base font-semibold mb-1">{member.title}</p>
          <p className="text-slate-500 text-sm">{member.department}</p>
          <p className="text-slate-400 text-xs mt-5">Click to see details</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0a1128] shadow-md border border-[#1E3A8A]/30 flex flex-col p-7 text-white backface-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-slate-200 text-base leading-relaxed mb-5 grow flex items-center">{member.bio}</p>
          {member.specializations?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {member.specializations.slice(0, 3).map(s => (
                <span key={s} className="px-3 py-1 rounded-full bg-[#1E3A8A]/60 text-blue-200 text-sm">{s}</span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-center">
            {member.publications != null && (
              <div><p className="text-2xl font-bold text-[#f5b041]">{member.publications}</p><p className="text-xs text-slate-400 mt-0.5">Papers</p></div>
            )}
            {member.awards != null && (
              <div><p className="text-2xl font-bold text-[#f5b041]">{member.awards}</p><p className="text-xs text-slate-400 mt-0.5">Awards</p></div>
            )}
            {member.students != null && (
              <div><p className="text-2xl font-bold text-[#f5b041]">{member.students}+</p><p className="text-xs text-slate-400 mt-0.5">Students</p></div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function FacultySection() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/faculty")
      .then(r => r.json())
      .then(data => { setFaculty(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const directors = faculty.filter(m => m.isDirector).sort((a, b) => a.displayOrder - b.displayOrder)
  const regularFaculty = faculty.filter(m => !m.isDirector).sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <section id="faculty" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50 to-blue-50/20 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-medium mb-4">Our Team</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">Meet Our <span className="gradient-text">Faculty</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our distinguished faculty brings decades of academic expertise and real-world experience to the classroom.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" /></div>
        ) : (
          <>
            {/* Directors Slider */}
            {directors.length > 0 && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-[#0a1128] mb-8 text-center">Directors &amp; Principals</h3>
                <DirectorSlider directors={directors} />
              </motion.div>
            )}

            {/* Faculty Members Grid */}
            {regularFaculty.length > 0 && (
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#0a1128] mb-8 text-center">Faculty Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {regularFaculty.map(m => (
                    <FacultyCard key={m.id} member={m} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
