"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  programs: [
    { name: "Computer Science", href: "#programs" },
    { name: "Business Administration", href: "#programs" },
    { name: "Design & Arts", href: "#programs" },
    { name: "Medical Sciences", href: "#programs" },
    { name: "Engineering", href: "#programs" },
  ],
  quickLinks: [
    { name: "About Us", href: "#" },
    { name: "Admissions", href: "/admissions" },
    { name: "Campus Life", href: "#campus" },
    { name: "Research", href: "#" },
    { name: "Careers", href: "#" },
  ],
  resources: [
    { name: "Student Portal", href: "/dashboard" },
    { name: "Library", href: "#" },
    { name: "Academic Calendar", href: "#events" },
    { name: "Fee Structure", href: "#" },
    { name: "Scholarships", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/ric.edu.pk", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/ric.edu.pk", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/ric-edu-pk", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-[#0a1128] pt-20 pb-8 text-white overflow-hidden">
      {/* Background Building Image — dimmed and blended */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/riphahdaska.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.1,
        }}
      />
      {/* Dark gradient overlay to ensure readability */}
      <div 
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a1128]/80 to-[#0a1128]"
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1E3A8A]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="#hero" className="flex items-center gap-3 mb-6 no-underline">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Image src="/ric-logo.png" alt="RIC Logo" width={48} height={48} className="rounded-xl object-contain" />
              </motion.div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]">Riphah International College</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              Shaping future leaders through innovative education, world-class 
              faculty, and a commitment to excellence since 1950.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Jinnah Chowk, Near STEP School, Daska</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>0307-0002393</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>info@ric.edu.pk</span>
              </div>
            </div>
          </div>
          
          {/* Programs */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#f5b041] transition-colors no-underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#f5b041] transition-colors no-underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-[#f5b041] transition-colors no-underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#f5b041]/20 transition-colors border border-white/10"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-slate-300 hover:text-[#f5b041]" />
              </motion.a>
            ))}
          </div>
          
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Riphah International College. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors no-underline">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors no-underline">Terms of Service</a>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-24 left-6 w-12 h-12 rounded-full glass flex items-center justify-center z-40"
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  )
}
