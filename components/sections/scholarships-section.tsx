"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award, CheckCircle, ChevronRight, Sparkles, Target, Users, GraduationCap,
  X, Upload, Loader2, Send, Phone, Check,
} from "lucide-react"

const scholarships = [
  {
    id: 1,
    name: "Merit Excellence Scholarship",
    amount: "100%",
    description: "Full tuition coverage for academically outstanding students",
    icon: <Award className="w-6 h-6" />,
    criteria: ["90%+ in qualifying exam", "Outstanding extracurriculars", "Leadership qualities"],
    color: "from-[#F59E0B] to-[#EF4444]",
  },
  {
    id: 2,
    name: "Need-Based Financial Aid",
    amount: "Up to 75%",
    description: "Supporting deserving students with demonstrated financial need",
    icon: <Users className="w-6 h-6" />,
    criteria: ["Family income below threshold", "Academic merit", "Community involvement"],
    color: "from-[#1E3A8A] to-[#7C3AED]",
  },
  {
    id: 3,
    name: "Sports Excellence Award",
    amount: "50-100%",
    description: "For national and international level athletes",
    icon: <Target className="w-6 h-6" />,
    criteria: ["National/State level achievement", "Maintaining academic standards", "Team participation"],
    color: "from-[#10B981] to-[#3B82F6]",
  },
  {
    id: 4,
    name: "Research Innovation Grant",
    amount: "Variable",
    description: "Funding for students pursuing groundbreaking research",
    icon: <Sparkles className="w-6 h-6" />,
    criteria: ["Research proposal approval", "Faculty recommendation", "Innovation potential"],
    color: "from-[#7C3AED] to-[#EC4899]",
  },
]

interface FormData {
  firstName: string
  lastName: string
  phone: string
  documentUrl: string
  documentType: string
}

const BLANK: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  documentUrl: "",
  documentType: "result",
}

export function ScholarshipsSection() {
  const [selectedScholarship, setSelectedScholarship] = useState(scholarships[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formEnabled, setFormEnabled] = useState(true)

  const [formData, setFormData] = useState<FormData>(BLANK)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => setFormEnabled(d.scholarship_form_enabled !== "false"))
      .catch(() => setFormEnabled(true))
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setUploading(true)
    setUploadError("")
    setUploadSuccess(false)
    const fd = new FormData()
    fd.append("document", file)
    try {
      const res = await fetch("/api/upload/scholarship", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "File upload failed")
      setFormData(prev => ({ ...prev, documentUrl: data.url }))
      setUploadSuccess(true)
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/scholarship-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipName: selectedScholarship.name,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          documentUrl: formData.documentUrl,
          documentType: formData.documentType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Submission failed")
      setIsSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData(BLANK)
    setSelectedFile(null)
    setUploadSuccess(false)
    setUploadError("")
    setIsSubmitted(false)
    setSubmitError("")
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#1E3A8A] focus:bg-white outline-none transition-all text-[#0a1128] text-sm"

  return (
    <section id="scholarships" className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-blue-50/50 to-white pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-medium mb-4">
            Financial Support
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a1128] mb-4 text-balance">
            Scholarships & <span className="gradient-text">Financial Aid</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            We believe financial constraints should never limit your potential. Explore our comprehensive scholarship programs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Scholarship List */}
          <div className="space-y-4">
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedScholarship(scholarship)}
                className={`bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-sm border border-transparent ${
                  selectedScholarship.id === scholarship.id
                    ? "ring-2 ring-[#1E3A8A] shadow-md shadow-blue-100"
                    : "hover:border-blue-100 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${scholarship.color} flex items-center justify-center text-white`}
                  >
                    {scholarship.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0a1128]">{scholarship.name}</h3>
                    <p className="text-sm text-slate-500">{scholarship.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold gradient-text">{scholarship.amount}</div>
                    <div className="text-xs text-slate-400">Tuition Waiver</div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${
                      selectedScholarship.id === scholarship.id ? "rotate-90 text-[#F59E0B]" : "text-slate-300"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Scholarship Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedScholarship.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 sticky top-24 shadow-xl border border-blue-100"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-linear-to-br ${selectedScholarship.color} flex items-center justify-center text-white mb-6`}
              >
                {selectedScholarship.icon}
              </div>

              <h3 className="text-2xl font-bold text-[#0a1128] mb-2">{selectedScholarship.name}</h3>
              <p className="text-slate-600 mb-6">{selectedScholarship.description}</p>

              <div className="mb-6">
                <div className="text-sm font-medium text-[#0a1128] mb-3">Eligibility Criteria</div>
                <ul className="space-y-2">
                  {selectedScholarship.criteria.map((criterion, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 mb-6">
                <div>
                  <div className="text-sm text-slate-500">Scholarship Amount</div>
                  <div className="text-3xl font-bold text-[#1E3A8A]">{selectedScholarship.amount}</div>
                </div>
                <GraduationCap className="w-12 h-12 text-[#1E3A8A]" />
              </div>

              {formEnabled ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 rounded-xl bg-linear-to-r from-[#1E3A8A] to-[#7C3AED] text-white font-medium hover:shadow-lg hover:shadow-[#1E3A8A]/25 transition-all duration-300 cursor-pointer"
                >
                  Apply for This Scholarship
                </button>
              ) : (
                <div className="w-full py-4 rounded-xl bg-slate-100 text-slate-500 font-medium text-center text-sm">
                  Scholarship applications are currently closed
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col z-10 border border-blue-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-linear-to-r from-[#1E3A8A]/5 to-[#7C3AED]/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-indigo-100 text-indigo-800">
                      Application
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0a1128]">{selectedScholarship.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Complete the form below to apply</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                      <Check className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#0a1128] mb-2">Application Submitted!</h4>
                    <p className="text-slate-500 text-sm max-w-xs mb-8">
                      Your scholarship application has been received. The admissions board will review your credentials and contact you within 5 business days.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-3 rounded-xl bg-[#0a1128] text-white font-semibold hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">First Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="e.g. Kamran"
                          className={inputCls}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="e.g. Chohan"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. +92 300 1234567"
                          className={`${inputCls} pl-11`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Document Type *</label>
                      <select
                        required
                        value={formData.documentType}
                        onChange={e => setFormData(prev => ({ ...prev, documentType: e.target.value }))}
                        className={`${inputCls} bg-slate-50`}
                      >
                        <option value="result">Academic Result / Transcript</option>
                        <option value="sports">Sports Achievement / Certificate</option>
                        <option value="extracurricular">Extracurricular Certificate</option>
                        <option value="income">Family Income Proof (Need-based)</option>
                        <option value="other">Other Document</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Upload Supporting Document *</label>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#1E3A8A] rounded-2xl py-7 px-4 bg-white hover:bg-slate-50/50 cursor-pointer transition-all">
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {uploading ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
                            <span className="text-xs text-slate-500 font-medium">Uploading...</span>
                          </div>
                        ) : uploadSuccess ? (
                          <div className="flex flex-col items-center gap-1.5 text-emerald-600">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium truncate max-w-55">
                              {selectedFile?.name ?? "Document uploaded"}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <Upload className="w-6 h-6 text-slate-400" />
                            <span className="text-xs text-slate-600 font-medium">Click to choose file</span>
                            <span className="text-[10px] text-slate-400">PDF, JPG, PNG, DOCX · Max 10 MB</span>
                          </div>
                        )}
                      </label>
                      {uploadError && <p className="text-xs text-red-600 font-medium">{uploadError}</p>}
                    </div>

                    {submitError && (
                      <p className="text-sm text-red-600 font-medium text-center">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.documentUrl ||
                        uploading ||
                        !formData.firstName.trim() ||
                        !formData.lastName.trim() ||
                        !formData.phone.trim()
                      }
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-linear-to-r from-[#1E3A8A] to-[#7C3AED] text-white font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Application
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
