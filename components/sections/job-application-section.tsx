"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Phone, Briefcase, Upload, Send,
  Check, Loader2, Layers, Award, Users, X,
} from "lucide-react"

const POSITIONS = [
  "Professor", "Associate Professor", "Assistant Professor",
  "Lecturer", "Researcher", "Lab Assistant", "Administrative Staff",
]

const DEPARTMENTS = [
  "Computer Science", "Business Administration", "Design & Arts",
  "Medical Sciences", "Law & Justice", "Engineering",
]

export function JobApplicationSection() {
  const [name, setName]               = useState("")
  const [email, setEmail]             = useState("")
  const [phone, setPhone]             = useState("")
  const [position, setPosition]       = useState("")
  const [department, setDepartment]   = useState("")
  const [experience, setExperience]   = useState("")
  const [qualification, setQual]      = useState("")
  const [summary, setSummary]         = useState("")
  const [cvFile, setCvFile]           = useState<File | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [isSubmitted, setSubmitted]   = useState(false)
  const [error, setError]             = useState("")
  const [formEnabled, setFormEnabled] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => setFormEnabled(d.teaching_form_enabled !== "false"))
      .catch(() => setFormEnabled(true))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      let cvUrl = ""
      if (cvFile) {
        const fd = new FormData()
        fd.append("cv", cvFile)
        const upRes = await fetch("/api/upload/cv", { method: "POST", body: fd })
        const upData = await upRes.json()
        if (!upRes.ok) throw new Error(upData.error || "CV upload failed")
        cvUrl = upData.url
      }

      const res = await fetch("/api/teaching-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: `${position} — ${department}`,
          experience: experience.trim(),
          qualification: qualification.trim(),
          message: summary.trim(),
          cvUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Submission failed")
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setName(""); setEmail(""); setPhone(""); setPosition(""); setDepartment("")
    setExperience(""); setQual(""); setSummary(""); setCvFile(null); setSubmitted(false); setError("")
  }

  if (!formEnabled) {
    return (
      <section id="careers" className="py-20 md:py-32 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto bg-slate-50 rounded-3xl p-12 border border-slate-100">
            <Briefcase className="w-14 h-14 mx-auto mb-4 text-slate-300" />
            <h2 className="text-2xl font-bold text-[#0a1128] mb-3">Applications Currently Closed</h2>
            <p className="text-slate-500 text-sm">
              Teaching job applications are not being accepted at this time. Please check back later or contact us at <strong>0307-0002393</strong>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="careers" className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-white" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
            Careers
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">
            Join Our <span className="gradient-text">Academic Legacy</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We are always looking for passionate educators and professionals to join our
            world-class faculty. Build your career with Riphah.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2">
              {/* Promo Side */}
              <div className="p-8 md:p-12 bg-[#0a1128] text-white">
                <h3 className="text-3xl font-bold mb-6">Why teach <span className="text-[#f5b041]">at Riphah?</span></h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-6 h-6 text-[#f5b041]" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">State-of-the-art Labs</h4>
                      <p className="text-slate-400 text-sm">Access to premium research facilities and modern smart classrooms.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#f5b041]" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Professional Growth</h4>
                      <p className="text-slate-400 text-sm">Continuous training programs and international research opportunities.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-[#f5b041]" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Collaborative Culture</h4>
                      <p className="text-slate-400 text-sm">Work alongside leading industry experts and dedicated educators.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-sm italic text-slate-400">
                    &ldquo;Riphah provided me the platform to bridge the gap between academic theory
                    and industrial innovation.&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700" />
                    <div>
                      <div className="text-sm font-bold">Dr. Sarah Ahmed</div>
                      <div className="text-xs text-slate-500">Head of CS Department</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Side */}
              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      className="h-full flex flex-col items-center justify-center text-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                        <Check className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0a1128] mb-2">Application Submitted!</h3>
                      <p className="text-slate-500 mb-8 max-w-xs">Our HR department will review your profile and contact you within 5–7 business days.</p>
                      <button onClick={resetForm} className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                        Apply for another role
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" required value={name} onChange={e => setName(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128]"
                              placeholder="John Doe" />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Email *</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128]"
                              placeholder="john@example.com" />
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Phone *</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128]"
                              placeholder="+92 300 0000000" />
                          </div>
                        </div>

                        {/* Position */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Position *</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select required value={position} onChange={e => setPosition(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128] appearance-none">
                              <option value="">Select Position</option>
                              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Department *</label>
                          <select required value={department} onChange={e => setDepartment(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128] appearance-none">
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Years of Experience *</label>
                          <input type="text" required value={experience} onChange={e => setExperience(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128]"
                            placeholder="e.g. 5 years" />
                        </div>

                        {/* Qualification */}
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Highest Qualification *</label>
                          <input type="text" required value={qualification} onChange={e => setQual(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128]"
                            placeholder="e.g. PhD Computer Science, FAST-NUCES" />
                        </div>

                        {/* CV Upload */}
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">CV / Resume (PDF or Word, max 5MB)</label>
                          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                            onChange={e => setCvFile(e.target.files?.[0] ?? null)} />
                          <div
                            onClick={() => fileRef.current?.click()}
                            className="w-full px-4 py-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between gap-3 text-slate-400 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <Upload className="w-5 h-5 flex-shrink-0" />
                              <span className="text-sm font-medium">{cvFile ? cvFile.name : "Click to upload CV (PDF/DOC/DOCX)"}</span>
                            </div>
                            {cvFile && (
                              <button type="button" onClick={e => { e.stopPropagation(); setCvFile(null) }}
                                className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-sm font-bold text-[#0a1128]">Professional Summary</label>
                          <textarea value={summary} onChange={e => setSummary(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-[#0a1128] min-h-[100px] resize-none"
                            placeholder="Briefly describe your specialization and expertise..." />
                        </div>
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-200 disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
                        ) : (
                          <>Submit Application <Send className="w-5 h-5" /></>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
