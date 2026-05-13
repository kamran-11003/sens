"use client"

import { motion } from "framer-motion"
import { Building2, TrendingUp, Briefcase, DollarSign } from "lucide-react"

const companies = [
  { name: "Google", logo: "G" },
  { name: "Microsoft", logo: "M" },
  { name: "Amazon", logo: "A" },
  { name: "Apple", logo: "" },
  { name: "Meta", logo: "M" },
  { name: "Netflix", logo: "N" },
  { name: "Tesla", logo: "T" },
  { name: "IBM", logo: "IBM" },
  { name: "Intel", logo: "I" },
  { name: "Oracle", logo: "O" },
  { name: "Adobe", logo: "A" },
  { name: "Salesforce", logo: "SF" },
]

const placementStats = [
  { icon: <Briefcase className="w-6 h-6" />, value: "98%", label: "Placement Rate" },
  { icon: <DollarSign className="w-6 h-6" />, value: "$95K", label: "Average Package" },
  { icon: <TrendingUp className="w-6 h-6" />, value: "$180K", label: "Highest Package" },
  { icon: <Building2 className="w-6 h-6" />, value: "500+", label: "Recruiting Partners" },
]

export function PlacementsSection() {
  return (
    <section id="placements" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/5 via-background to-[#7C3AED]/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium mb-4">
            Career Success
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Where Our <span className="gradient-text">Graduates Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our alumni are making an impact at the world&apos;s leading companies
          </p>
        </motion.div>

        {/* Placement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {placementStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-dark rounded-2xl p-6 text-center group hover:glow transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#7C3AED] flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-8"
            >
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 w-32 h-20 glass-dark rounded-xl flex items-center justify-center group hover:glow transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-muted-foreground group-hover:gradient-text transition-all duration-300">
                    {company.logo || company.name[0]}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>


      </div>
    </section>
  )
}
