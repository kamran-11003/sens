"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Phone, GraduationCap, Send, Check, Loader2, Mail,
  MapPin, ChevronRight, ChevronLeft, Calendar, Users, BookOpen, School,
} from "lucide-react"

interface Program { id: string; title: string; category: string }

interface FormData {
  studentName: string; dob: string; gender: string; fatherName: string; cnic: string
  lastSchool: string; lastGrade: string; percentage: string; programId: string
  guardianPhone: string; guardianEmail: string; address: string
}

const BLANK: FormData = {
  studentName: "", dob: "", gender: "", fatherName: "", cnic: "",
  lastSchool: "", lastGrade: "", percentage: "", programId: "",
  guardianPhone: "", guardianEmail: "", address: "",
}

export function AdmissionFormSection({ preselectedProgramId }: { preselectedProgramId?: string }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({ ...BLANK, programId: preselectedProgramId ?? "" })
  const [programs, setPrograms] = useState<Program[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [formEnabled, setFormEnabled] = useState(true)

  useEffect(() => {
    fetch("/api/programs").then(r => r.json()).then(setPrograms).catch(() => {})
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => setFormEnabled(d.admission_form_enabled !== "false"))
      .catch(() => setFormEnabled(true))
  }, [])

  useEffect(() => {
    if (preselectedProgramId) setFormData(prev => ({ ...prev, programId: preselectedProgramId }))
  }, [preselectedProgramId])

  const set = (field: keyof FormData, value: string) => setFormData(prev => ({ ...prev, [field]: value }))

  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: formData.programId,
          name: formData.studentName,
          dob: formData.dob,
          gender: formData.gender,
          fatherName: formData.fatherName,
          cnic: formData.cnic,
          lastInstitution: formData.lastSchool,
          grade: formData.lastGrade,
          percentage: formData.percentage,
          phone: formData.guardianPhone,
          email: formData.guardianEmail,
          address: formData.address,
        }),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error ?? "Submission failed")
        setIsSubmitting(false)
        return
      }
      setIsSubmitted(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls = (focus: string) =>
    `w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 ${focus} focus:bg-white outline-none transition-all text-[#0a1128]`

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1E3A8A]"><User className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-[#0a1128]">Personal Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Student Full Name</label>
                <input type="text" value={formData.studentName} onChange={e => set("studentName", e.target.value)} className={inputCls("focus:border-[#1E3A8A]")} placeholder="Enter full name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Father&apos;s Name</label>
                <input type="text" value={formData.fatherName} onChange={e => set("fatherName", e.target.value)} className={inputCls("focus:border-[#1E3A8A]")} placeholder="Father's full name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="date" value={formData.dob} onChange={e => set("dob", e.target.value)} className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all text-[#0a1128]`} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Gender</label>
                <select value={formData.gender} onChange={e => set("gender", e.target.value)} className={inputCls("focus:border-[#1E3A8A]") + " appearance-none"} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">CNIC / B-Form Number</label>
                <input type="text" value={formData.cnic} onChange={e => set("cnic", e.target.value)} className={inputCls("focus:border-[#1E3A8A]")} placeholder="xxxxx-xxxxxxx-x" required />
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#7C3AED]"><BookOpen className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-[#0a1128]">Academic Background</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Last Attended Institution</label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={formData.lastSchool} onChange={e => set("lastSchool", e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#7C3AED] focus:bg-white outline-none transition-all text-[#0a1128]" placeholder="School / College Name" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Last Completed Grade</label>
                <input type="text" value={formData.lastGrade} onChange={e => set("lastGrade", e.target.value)} className={inputCls("focus:border-[#7C3AED]")} placeholder="e.g. Matric / O-Levels" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Percentage / GPA</label>
                <input type="text" value={formData.percentage} onChange={e => set("percentage", e.target.value)} className={inputCls("focus:border-[#7C3AED]")} placeholder="e.g. 85%" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Program Applied For</label>
                <select value={formData.programId} onChange={e => set("programId", e.target.value)} className={inputCls("focus:border-[#7C3AED]") + " appearance-none"} required>
                  <option value="">Select a Program</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F59E0B]"><Users className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-[#0a1128]">Guardian & Contact Details</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Guardian Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" value={formData.guardianPhone} onChange={e => set("guardianPhone", e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#F59E0B] focus:bg-white outline-none transition-all text-[#0a1128]" placeholder="+92 XXX XXXXXXX" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Guardian Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={formData.guardianEmail} onChange={e => set("guardianEmail", e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#F59E0B] focus:bg-white outline-none transition-all text-[#0a1128]" placeholder="email@example.com" required />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea value={formData.address} onChange={e => set("address", e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#F59E0B] focus:bg-white outline-none transition-all text-[#0a1128] min-h-25" placeholder="Full residential address" required />
                </div>
              </div>
            </div>
          </motion.div>
        )
      default: return null
    }
  }

  if (!formEnabled) {
    return (
      <section className="py-20 md:py-32 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-md mx-auto bg-slate-50 rounded-3xl p-12 border border-slate-100">
            <GraduationCap className="w-14 h-14 mx-auto mb-4 text-slate-300" />
            <h2 className="text-2xl font-bold text-[#0a1128] mb-3">Admissions Currently Closed</h2>
            <p className="text-slate-500 text-sm">
              Online admission applications are not being accepted at this time. Please check back later or contact us at <strong>0307-0002393</strong> for more information.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50 to-blue-50/20 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto shadow-2xl rounded-[2.5rem] overflow-hidden bg-white border border-blue-50">
          <div className="grid lg:grid-cols-5 h-full">
            {/* Sidebar */}
            <div className="lg:col-span-2 bg-[#0a1128] p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
              <div className="relative z-10">
                <GraduationCap className="w-12 h-12 text-[#f5b041] mb-6" />
                <h2 className="text-3xl font-bold mb-4">Join our <span className="text-[#f5b041]">Academic Community</span></h2>
                <p className="text-slate-400 mb-12">Complete the form to submit your application for the 2026 Academic Session.</p>
                <div className="space-y-8">
                  {[
                    { s: 1, label: "Personal Details", icon: User },
                    { s: 2, label: "Academics", icon: BookOpen },
                    { s: 3, label: "Guardian Information", icon: Users },
                  ].map(item => (
                    <div key={item.s} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${step >= item.s ? "bg-[#f5b041] border-[#f5b041] text-[#0a1128]" : "border-white/20 text-white/40"}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-semibold ${step >= item.s ? "text-[#f5b041]" : "text-white/40"}`}>Step 0{item.s}</span>
                        <span className={`font-medium ${step >= item.s ? "text-white" : "text-white/40"}`}>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 p-8 md:p-12">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div key="success" className="h-full flex flex-col items-center justify-center text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0a1128] mb-4">Application Submitted!</h3>
                    <p className="text-slate-600 mb-8">Your application has been received. We will review it and contact you within 3–5 business days.</p>
                    <button onClick={() => { setIsSubmitted(false); setStep(1); setFormData({ ...BLANK, programId: preselectedProgramId ?? "" }) }} className="px-6 py-3 rounded-xl bg-[#0a1128] text-white font-semibold hover:bg-[#1E3A8A] transition-colors">Submit Another Application</button>
                  </motion.div>
                ) : (
                  <form key="form" onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
                    {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                      {step > 1 ? (
                        <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                      ) : <div />}
                      {step < 3 ? (
                        <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a1128] text-white font-semibold hover:bg-[#1E3A8A] transition-colors">
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f5b041] text-[#0a1128] font-semibold hover:bg-[#e9a030] transition-colors disabled:opacity-60">
                          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Application</>}
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
