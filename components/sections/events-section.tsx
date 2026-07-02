"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, MapPin, Clock, Users, Loader2, Check, Send } from "lucide-react"

interface Event {
  id: string
  title: string
  type: string
  date: string
  time: string | null
  location: string
  description: string
  attendees: number | null
  image: string | null
  active: boolean
}

const TYPE_COLORS: Record<string, string> = {
  "Open House":        "#1E3A8A",
  "Workshop":          "#7C3AED",
  "Career Fair":       "#10B981",
  "Seminar":           "#F59E0B",
  "Sports":            "#EF4444",
  "Cultural":          "#EC4899",
  "Academic":          "#06B6D4",
}

function typeColor(type: string) { return TYPE_COLORS[type] ?? "#1E3A8A" }

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  const color = typeColor(event.type)
  const dateObj = new Date(event.date)
  const day   = dateObj.getDate().toString().padStart(2, "0")
  const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase()
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={onClick} className="cursor-pointer group">
      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Color band */}
        <div className="h-2" style={{ backgroundColor: color }} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Date badge */}
            <div className="flex-none rounded-xl overflow-hidden text-center border border-slate-100 shadow-sm">
              <div className="px-3 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: color }}>{month}</div>
              <div className="px-3 py-1.5 text-xl font-bold text-[#0a1128]">{day}</div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium mb-2" style={{ backgroundColor: `${color}12`, color }}>{event.type}</span>
              <h3 className="font-bold text-[#0a1128] leading-snug mb-2 line-clamp-2">{event.title}</h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <MapPin className="w-3 h-3" />{event.location}
              </div>
              {event.time && (
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Clock className="w-3 h-3" />{event.time}
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4 line-clamp-2 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

function EventModal({ event, onClose }: { event: Event | null; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Reset the form whenever a different event is opened
  useEffect(() => {
    setForm({ name: "", phone: "", email: "", note: "" })
    setSubmitted(false)
    setError("")
    setSubmitting(false)
  }, [event?.id])

  if (!event) return null
  const color = typeColor(event.type)
  const dateObj = new Date(event.date)

  const register = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, ...form }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Failed to register. Please try again.")
        setSubmitting(false)
        return
      }
      setSubmitted(true)
    } catch {
      setError("Network error. Please try again.")
    }
    setSubmitting(false)
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] outline-none text-sm transition-colors"

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.92, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 28 }}
        >
          <div className="relative h-32 flex items-end p-6" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` }}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium mb-2">{event.type}</span>
              <h2 className="text-xl font-bold text-white leading-tight">{event.title}</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4" style={{ color }} />
                {dateObj.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
              {event.time && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" style={{ color }} />{event.time}
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4" style={{ color }} />{event.location}
              </div>
              {event.attendees != null && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4" style={{ color }} />{event.attendees.toLocaleString()}+ Attendees
                </div>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">{event.description}</p>

            {/* Registration */}
            <div className="pt-2 border-t border-slate-100">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a1128] mb-1">You&apos;re registered!</h3>
                  <p className="text-slate-500 text-sm mb-5">Thanks for signing up for <span className="font-semibold">{event.title}</span>. We&apos;ll be in touch with the details.</p>
                  <button onClick={onClose} className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: color }}>
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={register} className="space-y-3">
                  <h3 className="font-bold text-[#0a1128]">Register for this event</h3>
                  {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="Full name *" />
                  <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder="Phone number *" />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="Email (optional)" />
                  <textarea rows={2} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Anything we should know? (optional)" />
                  <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 transition-opacity" style={{ backgroundColor: color }}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Registering..." : "Register Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Event | null>(null)

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(data => { setEvents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="events" className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-b from-white via-slate-50 to-blue-50/20 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-medium mb-4">Campus Life</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">Upcoming <span className="gradient-text">Events</span></h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Stay connected with the latest happenings and opportunities at our campus.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(e => e.active).map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <EventCard event={event} onClick={() => setSelected(event)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <EventModal event={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
