"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, GraduationCap, DollarSign, Percent, Info } from "lucide-react"

interface ProgramFee {
  id: string
  name: string
  baseFee: number
  duration: number
}

const programs: ProgramFee[] = [
  { id: "cs", name: "Computer Science", baseFee: 45000, duration: 4 },
  { id: "business", name: "Business Administration", baseFee: 40000, duration: 2 },
  { id: "design", name: "Design & Arts", baseFee: 38000, duration: 4 },
  { id: "medicine", name: "Medical Sciences", baseFee: 65000, duration: 5 },
  { id: "law", name: "Law & Justice", baseFee: 42000, duration: 3 },
  { id: "engineering", name: "Engineering", baseFee: 48000, duration: 4 },
]

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 500
    const steps = 20
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}
    </span>
  )
}

export function FeeCalculatorSection() {
  const [selectedProgram, setSelectedProgram] = useState(programs[0])
  const [installments, setInstallments] = useState(false)
  const [scholarship, setScholarship] = useState(0)
  
  const baseFee = selectedProgram.baseFee
  const scholarshipAmount = (baseFee * scholarship) / 100
  const finalFee = baseFee - scholarshipAmount
  const installmentFee = installments ? Math.ceil(finalFee / 4) : finalFee
  const totalYearlyFee = finalFee * (installments ? 1 : 1)

  return (
    <section id="fees" className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-blue-50/20" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-medium mb-4">
            Financial Planning
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">
            Fee <span className="gradient-text">Calculator</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Plan your education investment. Calculate your fees based on program, 
            scholarships, and payment options.
          </p>
        </motion.div>
        
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-blue-100">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                {/* Program Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3 text-[#0a1128]">
                    <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                    Select Program
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProgram.id}
                      onChange={(e) => {
                        const program = programs.find(p => p.id === e.target.value)
                        if (program) setSelectedProgram(program)
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[#0a1128] focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 outline-none appearance-none cursor-pointer transition-all"
                    >
                      {programs.map((program) => (
                        <option key={program.id} value={program.id} className="text-black">
                          {program.name} ({program.duration} years)
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Installments Toggle */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3 text-[#0a1128]">
                    <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                    Payment Plan
                  </label>
                  <div className="flex gap-3">
                    <motion.button
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        !installments 
                          ? "bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] text-white" 
                          : "bg-slate-100 text-slate-500"
                      }`}
                      onClick={() => setInstallments(false)}
                      whileTap={{ scale: 0.98 }}
                    >
                      Full Payment
                    </motion.button>
                    <motion.button
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                        installments 
                          ? "bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] text-white" 
                          : "bg-slate-100 text-slate-500"
                      }`}
                      onClick={() => setInstallments(true)}
                      whileTap={{ scale: 0.98 }}
                    >
                      Quarterly
                    </motion.button>
                  </div>
                </div>
                
                {/* Scholarship Slider */}
                <div>
                  <label className="flex items-center justify-between text-sm font-medium mb-3 text-[#0a1128]">
                    <span className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[#10B981]" />
                      Scholarship
                    </span>
                    <span className="text-[#10B981] font-bold">{scholarship}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scholarship}
                    onChange={(e) => setScholarship(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${scholarship * 2}%, #e2e8f0 ${scholarship * 2}%, #e2e8f0 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                {/* Info Box */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700">Merit Scholarships Available</p>
                    <p className="text-slate-500">Up to 50% scholarship based on academic performance</p>
                  </div>
                </div>
              </div>
              
              {/* Results */}
              <div className="flex flex-col">
                <div className="flex-1 p-6 rounded-2xl bg-slate-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Calculator className="w-5 h-5 text-[#1E3A8A]" />
                    <span className="font-semibold text-[#0a1128]">Fee Breakdown</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Base Fee (per year)</span>
                      <span className="font-semibold text-[#0a1128]">
                        $<AnimatedNumber value={baseFee} />
                      </span>
                    </div>
                    
                    <AnimatePresence>
                      {scholarship > 0 && (
                        <motion.div
                          className="flex justify-between items-center pb-3 border-b border-slate-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <span className="text-[#10B981]">Scholarship ({scholarship}%)</span>
                          <span className="font-semibold text-[#10B981]">
                            -$<AnimatedNumber value={scholarshipAmount} />
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Annual Fee</span>
                      <span className="font-semibold text-[#0a1128]">
                        $<AnimatedNumber value={finalFee} />
                      </span>
                    </div>
                    
                    {installments && (
                      <motion.div
                        className="flex justify-between items-center pb-3 border-b border-slate-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="text-slate-500">Per Quarter</span>
                        <span className="font-semibold text-[#0a1128]">
                          $<AnimatedNumber value={installmentFee} />
                        </span>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-[#0a1128]">Total ({selectedProgram.duration} years)</span>
                      <span className="text-2xl font-bold gradient-text">
                        $<AnimatedNumber value={finalFee * selectedProgram.duration} />
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white font-semibold ripple"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply for Scholarship
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
