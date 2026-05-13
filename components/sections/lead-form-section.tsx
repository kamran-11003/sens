"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Phone, GraduationCap, Send, Check, Loader2, Mail, MapPin, FileText } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const programs = [
  "Computer Science",
  "Business Administration",
  "Design & Arts",
  "Medical Sciences",
  "Law & Justice",
  "Engineering"
]

export function LeadFormSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error ?? "Submission failed. Please try again.")
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50 to-blue-50/20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium mb-4">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">
            Begin Your <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take the first step towards your future. Fill out the form below and 
            our admissions team will get in touch with you.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl p-8 relative overflow-hidden shadow-2xl border border-blue-100">
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1E3A8A] via-[#7C3AED] to-[#F59E0B]" />
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    className="py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      className="w-20 h-20 mx-auto rounded-full bg-[#10B981] flex items-center justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-[#0a1128]">Application Received!</h3>
                    <p className="text-slate-500 mb-6">
                      Thank you for your interest. Our team will contact you within 24 hours.
                    </p>
                    <motion.button
                      className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                      onClick={() => {
                        setIsSubmitted(false)
                        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Another
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-xl font-bold mb-6 text-[#0a1128]">Request Information</h3>
                    
                    {/* Name Field */}
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block text-slate-700">Full Name</label>
                      <div className="relative">
                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          focusedField === "name" ? "text-[#1E3A8A]" : "text-slate-400"
                        }`} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-2 transition-all outline-none text-[#0a1128] ${
                            focusedField === "name" 
                              ? "border-[#1E3A8A] shadow-[0_0_20px_rgba(30,58,138,0.1)]" 
                              : "border-slate-100"
                          }`}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Email Field */}
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block text-slate-700">Email Address</label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          focusedField === "email" ? "text-[#7C3AED]" : "text-slate-400"
                        }`} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-2 transition-all outline-none text-[#0a1128] ${
                            focusedField === "email" 
                              ? "border-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.1)]" 
                              : "border-slate-100"
                          }`}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Phone Field */}
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block text-slate-700">Phone Number</label>
                      <div className="relative">
                        <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          focusedField === "phone" ? "text-[#F59E0B]" : "text-slate-400"
                        }`} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-2 transition-all outline-none text-[#0a1128] ${
                            focusedField === "phone" 
                              ? "border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                              : "border-slate-100"
                          }`}
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Query Subject */}
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block text-slate-700">Subject of Query</label>
                      <div className="relative">
                        <FileText className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          focusedField === "subject" ? "text-[#10B981]" : "text-slate-400"
                        }`} />
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-2 transition-all outline-none text-[#0a1128] ${
                            focusedField === "subject" 
                              ? "border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                              : "border-slate-100"
                          }`}
                          placeholder="What is your query about?"
                          required
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block text-slate-700">Your Message / Query</label>
                      <div className="relative">
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border-2 transition-all outline-none text-[#0a1128] min-h-30 ${
                            focusedField === "message" 
                              ? "border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                              : "border-slate-100"
                          }`}
                          placeholder="Describe your query in detail..."
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-linear-to-r from-[#F59E0B] to-[#F97316] text-white font-semibold flex items-center justify-center gap-2 ripple"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Application
                        </>
                      )}
                    </motion.button>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <p className="text-xs text-center text-slate-400">
                      By submitting, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-[#0a1128]">Contact Information</h3>
            
            <div className="space-y-6">
              <motion.div
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#0a1128]">Campus Address</h4>
                  <p className="text-slate-500">
                    Jinnah Chowk, Near STEP School,<br />
                    Daska, Sialkot, Punjab
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#0a1128]">Admissions Hotline</h4>
                  <p className="text-slate-500">
                    0307-0002393<br />
                    Mon - Sat: 9:00 AM - 4:00 PM
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-start gap-4"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#0a1128]">Email Us</h4>
                  <p className="text-slate-500">
                    admissions@ric.edu.pk<br />
                    info@ric.edu.pk
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white shadow-lg border border-blue-50 text-center">
                <div className="text-2xl font-bold gradient-text">24h</div>
                <div className="text-sm text-slate-500">Response Time</div>
              </div>
              <div className="p-4 rounded-2xl bg-white shadow-lg border border-blue-50 text-center">
                <div className="text-2xl font-bold gradient-text">98%</div>
                <div className="text-sm text-slate-500">Satisfaction Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
