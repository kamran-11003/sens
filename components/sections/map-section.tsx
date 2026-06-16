"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Car, Navigation, ExternalLink, Copy, Check, Clock } from "lucide-react"

const COLLEGE_ADDRESS = "Jinnah Chowk, Near STEP School, Daska, Sialkot, Pakistan"

const MAPS_EMBED =
  "https://maps.google.com/maps?q=Riphah+International+College+Jinnah+Chowk+Daska+Sialkot+Pakistan&output=embed&z=16"

const COLLEGE_MAPS_LINK = "https://maps.app.goo.gl/JqD1j7nN727etnVc9"

const routes = [
  {
    id: "1",
    name: "From Sialkot City",
    via: "Sialkot–Daska Road",
    duration: "~35 min",
    distance: "35 km",
    color: "#1E3A8A",
    link: "https://maps.app.goo.gl/Dq9t2nCKweoAwT1k6",
  },
  {
    id: "2",
    name: "From Gujranwala",
    via: "GT Road via Wazirabad",
    duration: "~45 min",
    distance: "42 km",
    color: "#10B981",
    link: "https://maps.app.goo.gl/xAfbxRUE7tfAXSdp6",
  },
  {
    id: "3",
    name: "From Mundekey Goraya",
    via: "Daska–Goraya Road",
    duration: "~15 min",
    distance: "12 km",
    color: "#7C3AED",
    link: "https://maps.app.goo.gl/JqD1j7nN727etnVc9",
  },
  {
    id: "4",
    name: "From Wazirabad",
    via: "Wazirabad–Daska Road",
    duration: "~20 min",
    distance: "16 km",
    color: "#F59E0B",
    link: "https://maps.app.goo.gl/uLMMkYmZZUMyTYwm8",
  },
]

export function MapSection() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(COLLEGE_ADDRESS).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-b from-blue-50/20 via-slate-50 to-white pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] text-sm font-medium mb-4">
            Location
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0a1128]">
            Find Your <span className="gradient-text">Way</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conveniently located at Jinnah Chowk, Daska — easily reachable from Sialkot, Gujranwala, Wazirabad, and surrounding areas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Google Map Embed */}
          <motion.div
            className="lg:col-span-2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-100 aspect-video lg:aspect-4/3">
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0, width: "100%", height: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Riphah International College — Daska, Sialkot"
              />

              {/* Get Directions button overlay */}
              <div className="absolute bottom-4 right-4 z-10">
                <motion.a
                  href={COLLEGE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#1E3A8A] to-[#7C3AED] text-white font-semibold shadow-lg text-sm hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </motion.a>
              </div>
            </div>

            {/* College pin label below map */}
            <div className="flex items-center gap-2.5 mt-4 px-1">
              <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0" />
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-[#0a1128]">Riphah International College</span> — Jinnah Chowk, Near STEP School, Daska, Sialkot
              </p>
            </div>
          </motion.div>

          {/* Routes Sidebar */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-[#0a1128] mb-1">Getting Here</h3>

            {routes.map((route, index) => (
              <motion.a
                key={route.id}
                href={route.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.08 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Color dot */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${route.color}18` }}
                >
                  <Car className="w-5 h-5" style={{ color: route.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#0a1128] text-sm leading-tight">{route.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">via {route.via}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3" style={{ color: route.color }} />
                    <span className="text-xs font-semibold" style={{ color: route.color }}>
                      {route.duration}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{route.distance}</span>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-200 group-hover:text-[#1E3A8A] transition-colors shrink-0" />
              </motion.a>
            ))}

            {/* Address Card */}
            <div className="mt-1 p-4 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#0a1128] text-sm mb-1">Campus Address</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Jinnah Chowk, Near STEP School,<br />
                    Daska, Sialkot, Pakistan
                  </p>
                </div>
              </div>
              <button
                onClick={copyAddress}
                className="flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#7C3AED] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Address
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
