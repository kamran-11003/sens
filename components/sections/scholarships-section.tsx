"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, CheckCircle, ChevronRight, Sparkles, Target, Users, GraduationCap } from "lucide-react"

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

export function ScholarshipsSection() {
  const [selectedScholarship, setSelectedScholarship] = useState(scholarships[0])

  return (
    <section id="scholarships" className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50/50 to-white" />
      
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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scholarship.color} flex items-center justify-center text-white`}>
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
                  <ChevronRight className={`w-5 h-5 transition-transform ${selectedScholarship.id === scholarship.id ? "rotate-90 text-[#F59E0B]" : "text-slate-300"}`} />
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
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedScholarship.color} flex items-center justify-center text-white mb-6`}>
                {selectedScholarship.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-[#0a1128] mb-2">{selectedScholarship.name}</h3>
              <p className="text-slate-600 mb-6">{selectedScholarship.description}</p>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-[#0a1128] mb-3">Eligibility Criteria</div>
                <ul className="space-y-2">
                  {selectedScholarship.criteria.map((criterion, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
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

              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] text-white font-medium hover:shadow-lg hover:shadow-[#1E3A8A]/25 transition-all duration-300">
                Apply for This Scholarship
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
