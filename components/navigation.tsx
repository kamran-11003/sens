"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogIn, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const navItems = [
  { name: "Programs", href: "/programs" },
  { name: "Faculty", href: "/faculty" },
  { name: "Events", href: "/events" },
  { name: "Admissions", href: "/admissions" },
  { name: "Fee Structure", href: "/fee-structure" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-500`}
        style={{
          background: "rgba(10, 17, 40, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(245, 176, 65, 0.15)",
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                style={{ transformPerspective: 600 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <Image src="/riphahdaska-logo.png" alt="Riphah International College Logo" width={36} height={36} className="object-contain" />
              </motion.div>
            </motion.div>
            <span className="text-base md:text-lg lg:text-[1.5rem] font-bold text-white font-[var(--font-poppins)] hidden sm:block">
              Riphah International College
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-[#e2e8f0] no-underline text-[0.95rem] font-medium hover:text-[#f5b041] transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.a>
            ))}

            {/* Login dropdown */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
            >
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#f5b041]/60 text-[#f5b041] text-[0.9rem] font-semibold hover:bg-[#f5b041]/10 transition-colors">
                <LogIn className="w-4 h-4" /> Login
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              {/* pt-2 keeps the menu reachable while moving the cursor down */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-48 rounded-xl overflow-hidden bg-[#152243] border border-[#f5b041]/20 shadow-xl">
                  <Link href="/admin" className="block px-4 py-3 text-sm text-[#e2e8f0] hover:bg-white/5 hover:text-[#f5b041] no-underline transition-colors">
                    Admin Portal
                  </Link>
                  <Link href="/teacher" className="block px-4 py-3 text-sm text-[#e2e8f0] hover:bg-white/5 hover:text-[#f5b041] no-underline border-t border-white/10 transition-colors">
                    Teacher Portal
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-xl border border-white/10 bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#0a1128]/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-24 left-6 right-6 rounded-2xl p-6"
              style={{
                background: "rgba(21, 34, 67, 0.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(245, 176, 65, 0.2)",
              }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-[#e2e8f0] hover:text-[#f5b041] py-2 border-b border-white/10 no-underline"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    href="/admissions"
                    className="w-full py-3 rounded-lg border border-[#f5b041] text-[#f5b041] text-center font-semibold no-underline"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Apply Now
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/admin"
                      className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#f5b041] text-[#0a1128] text-center font-semibold no-underline"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" /> Admin
                    </Link>
                    <Link
                      href="/teacher"
                      className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 border border-white/15 text-white text-center font-semibold no-underline"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" /> Teacher
                    </Link>
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
