"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, BookOpen, Award, Users, Loader2, X, Send, GraduationCap } from "lucide-react"

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
        className="relative w-full h-80"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white shadow-md border border-slate-100 flex flex-col items-center justify-center p-6 text-center backface-hidden" style={{ backfaceVisibility: "hidden" }}>
          <Avatar member={member} size="md" />
          <h3 className="font-bold text-[#0a1128] mt-4 mb-1">{member.name}</h3>
          <p className="text-[#1E3A8A] text-sm font-semibold mb-1">{member.title}</p>
          <p className="text-slate-500 text-xs">{member.department}</p>
          <p className="text-slate-400 text-[11px] mt-4">Click to see details</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0a1128] shadow-md border border-[#1E3A8A]/30 flex flex-col p-6 text-white backface-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-slate-300 text-xs leading-relaxed mb-4 grow">{member.bio}</p>
          {member.specializations?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {member.specializations.slice(0, 3).map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-[#1E3A8A]/60 text-blue-200 text-[11px]">{s}</span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 text-center">
            {member.publications != null && (
              <div><p className="text-xl font-bold text-[#f5b041]">{member.publications}</p><p className="text-[10px] text-slate-400">Papers</p></div>
            )}
            {member.awards != null && (
              <div><p className="text-xl font-bold text-[#f5b041]">{member.awards}</p><p className="text-[10px] text-slate-400">Awards</p></div>
            )}
            {member.students != null && (
              <div><p className="text-xl font-bold text-[#f5b041]">{member.students}+</p><p className="text-[10px] text-slate-400">Students</p></div>
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
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", experience: "", qualification: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("")
  const facultySliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/faculty")
      .then(r => r.json())
      .then(data => { setFaculty(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const directors = faculty.filter(m => m.isDirector).sort((a, b) => a.displayOrder - b.displayOrder)
  const regularFaculty = faculty.filter(m => !m.isDirector).sort((a, b) => a.displayOrder - b.displayOrder)

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" })
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/teaching-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        setFormError(data.error || "Failed to submit. Please try again.")
        setSubmitting(false)
        return
      }
      setSubmitted(true)
    } catch {
      setFormError("Network error. Please try again.")
    }
    setSubmitting(false)
  }

  const resetForm = () => {
    setShowApplyForm(false)
    setSubmitted(false)
    setFormError("")
    setFormData({ name: "", email: "", phone: "", subject: "", experience: "", qualification: "", message: "" })
  }

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

            {/* Faculty Members Slider */}
            {regularFaculty.length > 0 && (
              <div className="mb-20">
                <h3 className="text-2xl font-bold text-[#0a1128] mb-6 text-center">Faculty Members</h3>
                <div className="relative">
                  <button onClick={() => scroll(facultySliderRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <div ref={facultySliderRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 scroll-smooth px-2">
                    {regularFaculty.map(m => (
                      <div key={m.id} className="flex-none w-56">
                        <FacultyCard member={m} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => scroll(facultySliderRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Join Our Faculty CTA */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a1128] via-[#1E3A8A] to-[#7C3AED] p-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <GraduationCap className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-3">Join Our Faculty</h3>
            <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg">
              Are you an educator passionate about shaping future leaders? We're looking for talented faculty members to join the RIC family.
            </p>
            <button
              onClick={() => setShowApplyForm(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-[#1E3A8A] font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Apply to Teach at RIC
            </button>
          </div>
        </motion.div>
      </div>

      {/* Teaching Application Modal */}
      <AnimatePresence>
        {showApplyForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm} />
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-[#0a1128]">Teaching Application</h3>
                  <p className="text-sm text-slate-500">Apply to join our faculty team</p>
                </div>
                <button onClick={resetForm} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {submitted ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0a1128] mb-2">Application Submitted!</h4>
                  <p className="text-slate-500 mb-6">Thank you for your interest. We'll review your application and get back to you soon.</p>
                  <button onClick={resetForm} className="px-6 py-2.5 rounded-xl bg-[#1E3A8A] text-white font-semibold hover:bg-[#1E3A8A]/90 transition-colors">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{formError}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"
                        placeholder="Your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Email *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"
                        placeholder="email@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Phone *</label>
                      <input required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"
                        placeholder="+92 300 0000000" />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Subject / Department *</label>
                      <input required value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"
                        placeholder="e.g. Computer Science, Mathematics" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Experience *</label>
                      <input required value={formData.experience} onChange={e => setFormData(p => ({ ...p, experience: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"
                        placeholder="e.g. 5 years" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Highest Qualification *</label>
                      <input required value={formData.qualification} onChange={e => setFormData(p => ({ ...p, qualification: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"
                        placeholder="e.g. PhD, MS, MBA" />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Additional Message</label>
                      <textarea rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors resize-none"
                        placeholder="Tell us about yourself, your research interests, etc." />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E3A8A] text-white font-semibold hover:bg-[#1E3A8A]/90 disabled:opacity-60 transition-colors"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
