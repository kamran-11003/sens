"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Bot, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

interface FAQNode {
  id: string
  label: string
  answer?: string
  children?: FAQNode[]
}

const MAIN_FAQ: FAQNode[] = [
  {
    id: "admissions",
    label: "📋 Admissions",
    children: [
      {
        id: "a1",
        label: "How to apply?",
        answer:
          "Apply online through our [Admissions Portal](/admissions). Fill the form with your personal details and academic background. Admissions are open for the 2026 session!",
      },
      {
        id: "a2",
        label: "Eligibility requirements?",
        answer:
          "Requirements vary by program:\n• Intermediate: Matric / O-Levels required\n• ADP Programs: Intermediate / F.Sc required\n\nContact us at 0307-0002393 for specific requirements.",
      },
      {
        id: "a3",
        label: "Application deadline?",
        answer:
          "Admissions are currently open for the 2026 academic session. Apply early — seats are limited! Visit [Admissions](/admissions) to apply now.",
      },
      {
        id: "a4",
        label: "Documents needed?",
        answer:
          "Typically required:\n• CNIC / B-Form copy\n• Matric / F.Sc marksheet\n• 2 passport-size photos\n\nContact admissions at 0307-0002393 for the complete list.",
      },
    ],
  },
  {
    id: "programs",
    label: "📚 Programs",
    children: [
      {
        id: "p1",
        label: "ADP Computer Science",
        answer:
          "2-year Associate Degree in Computer Science. Covers programming, databases, networking, and software engineering. Graduates can enter BS programs or employment directly.",
      },
      {
        id: "p2",
        label: "ADP Business & Management",
        answer:
          "2-year ADP covering accounting, marketing, economics, and management. Opens doors to BS Business or direct employment.",
      },
      {
        id: "p3",
        label: "Intermediate (FSc / ICS / ICOM / FA)",
        answer:
          "2-year Intermediate programs:\n• FSc Pre-Medical\n• FSc Pre-Engineering\n• ICS (Computer Science)\n• ICOM (Commerce)\n• FA (Arts)",
      },
      {
        id: "p4",
        label: "ADP Health Sciences",
        answer:
          "2-year program covering fundamentals of health and biology. Prepares students for medical and allied health professional programs.",
      },
      {
        id: "p5",
        label: "View all programs",
        answer:
          "Browse our full program catalog at the [Programs](/programs) page — ADP Business, Science, Computer, Health Sciences, Digital Skills, and Intermediate.",
      },
    ],
  },
  {
    id: "fees",
    label: "💰 Fee Structure",
    children: [
      {
        id: "f1",
        label: "Program fees?",
        answer:
          "Fees vary by program. Visit our [Fee & Scholarships](/fee-structure) page for the full structure, or call 0307-0002393.",
      },
      {
        id: "f2",
        label: "Payment methods?",
        answer:
          "Fees can be paid:\n• In full at once\n• In quarterly instalments\n\nPayment via bank transfer or at the college accounts office.",
      },
      {
        id: "f3",
        label: "Scholarships available?",
        answer:
          "Yes! We offer:\n• Merit Excellence (100% waiver)\n• Need-Based Aid (up to 75%)\n• Sports Excellence (50–100%)\n• Research Innovation Grant\n\nVisit [Fee & Scholarships](/fee-structure) to apply.",
      },
    ],
  },
  {
    id: "scholarships",
    label: "🏆 Scholarships",
    children: [
      {
        id: "s1",
        label: "Merit Excellence Scholarship",
        answer:
          "Full 100% tuition waiver for students scoring 90%+ in qualifying exams with outstanding extracurricular involvement and leadership.",
      },
      {
        id: "s2",
        label: "Need-Based Financial Aid",
        answer:
          "Up to 75% tuition support for students with demonstrated financial need and academic merit. Requires income documentation.",
      },
      {
        id: "s3",
        label: "Sports Excellence Award",
        answer:
          "50–100% scholarship for national or state-level athletes who maintain academic standards and participate in college teams.",
      },
      {
        id: "s4",
        label: "How to apply for scholarship?",
        answer:
          "Visit [Fee & Scholarships](/fee-structure), select your scholarship, and click **Apply**. You need your name, phone number, and a supporting document.",
      },
    ],
  },
  {
    id: "faculty",
    label: "👩‍🏫 Faculty & Careers",
    children: [
      {
        id: "fc1",
        label: "Meet our faculty",
        answer:
          "Our faculty includes experienced educators and industry professionals. Visit the [Faculty](/faculty) page to meet our team.",
      },
      {
        id: "fc2",
        label: "Teach at RIC?",
        answer:
          "We are always looking for passionate educators! Visit [Faculty](/faculty) and scroll to the **Join Our Faculty** section to submit your application.",
      },
      {
        id: "fc3",
        label: "Campus facilities?",
        answer:
          "Our campus features smart classrooms, computer labs, science labs, a library, sports grounds, and student common areas. Located at Jinnah Chowk, Daska.",
      },
    ],
  },
  {
    id: "contact",
    label: "📍 Contact & Location",
    children: [
      {
        id: "c1",
        label: "Phone & Email",
        answer:
          "📞 Phone: 0307-0002393\n📧 Email: info@ric.edu.pk\n\nOr submit an inquiry via our [Contact](/contact) page.",
      },
      {
        id: "c2",
        label: "Campus address",
        answer:
          "📍 Jinnah Chowk, Near STEP School\nDaska, Sialkot, Pakistan\n\nOpen: Mon–Sat, 8:00 AM – 4:00 PM",
      },
    ],
  },
]

type Msg = { from: "bot" | "user"; text: string }

function renderText(text: string) {
  const segments = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return segments.map((seg, i) => {
    const linkMatch = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} className="underline text-blue-600 hover:text-blue-500 transition-colors">
          {linkMatch[1]}
        </a>
      )
    }
    const boldMatch = seg.match(/^\*\*([^*]+)\*\*$/)
    if (boldMatch) return <strong key={i}>{boldMatch[1]}</strong>
    return <span key={i}>{seg}</span>
  })
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [stack, setStack] = useState<FAQNode[][]>([MAIN_FAQ])
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Asalam-o-Alaikum! 👋 Welcome to **Riphah International College**.\n\nHow can I help you today? Please select a topic:",
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isOpen])

  const currentOptions = stack[stack.length - 1]

  const handleSelect = (node: FAQNode) => {
    const next: Msg[] = [...messages, { from: "user", text: node.label }]

    if (node.answer) {
      next.push({ from: "bot", text: node.answer })
      next.push({
        from: "bot",
        text: "Is there anything else I can help you with? Use the menu below to explore more topics.",
      })
      setStack([MAIN_FAQ])
    } else if (node.children) {
      const cleanLabel = node.label.replace(/[📋📚💰🏆👩‍🏫📍]/gu, "").trim()
      next.push({ from: "bot", text: `Here are topics under **${cleanLabel}**:` })
      setStack(prev => [...prev, node.children!])
    }

    setMessages(next)
  }

  const goBack = () => {
    if (stack.length > 1) setStack(prev => prev.slice(0, -1))
  }

  const handleReset = () => {
    setStack([MAIN_FAQ])
    setMessages([
      {
        from: "bot",
        text: "Asalam-o-Alaikum! 👋 Welcome to **Riphah International College**.\n\nHow can I help you today? Please select a topic:",
      },
    ])
  }

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <motion.button
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] shadow-lg flex items-center justify-center"
          onClick={() => setIsOpen(v => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{ boxShadow: "0 0 20px rgba(30, 58, 138, 0.4)" }}
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="msg"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && (
            <motion.span
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
              style={{ maxHeight: "min(600px, calc(100dvh - 7rem))" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#7C3AED] p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">RIC Assistant</h3>
                      <p className="text-xs text-white/70">Online • FAQ Bot</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-white/60 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Restart
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50"
                style={{ minHeight: "180px", maxHeight: "260px" }}
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
                        msg.from === "bot" ? "bg-[#1E3A8A]" : "bg-[#F59E0B]"
                      }`}
                    >
                      {msg.from === "bot" ? (
                        <Bot className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[9px] font-bold">YOU</span>
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line break-words ${
                        msg.from === "bot"
                          ? "bg-white border border-slate-100 text-[#0a1128] rounded-tl-none shadow-sm"
                          : "bg-[#1E3A8A] text-white rounded-tr-none"
                      }`}
                    >
                      {msg.from === "bot" ? renderText(msg.text) : msg.text}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {/* Options */}
              <div className="flex-shrink-0 border-t border-slate-100 bg-white">
                {stack.length > 1 && (
                  <div className="px-4 pt-3 pb-1">
                    <button
                      onClick={goBack}
                      className="flex items-center gap-1 text-xs text-[#1E3A8A] font-semibold hover:underline"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  </div>
                )}
                <div className="p-3 pt-1 flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: "210px" }}>
                  {currentOptions.map(node => (
                    <button
                      key={node.id}
                      onClick={() => handleSelect(node)}
                      className="w-full text-left text-[13px] px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-[#1E3A8A]/25 text-[#0a1128] font-medium transition-all flex items-center justify-between group"
                    >
                      <span>{node.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1E3A8A] flex-shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
