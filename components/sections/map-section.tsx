"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Car, Navigation, ExternalLink, Copy, Check, Clock, Route } from "lucide-react"

const COLLEGE_ADDRESS = "Jinnah Chowk, Near STEP School, Daska, Sialkot, Pakistan"
const COLLEGE_DEST = "Riphah+International+College+Jinnah+Chowk+Daska+Sialkot+Pakistan"

const COLLEGE_MAPS_LINK = "https://maps.app.goo.gl/JqD1j7nN727etnVc9"

// Default embed shows the college pinned on the map
const DEFAULT_EMBED =
  "https://maps.google.com/maps?q=Riphah+International+College+Jinnah+Chowk+Daska+Sialkot+Pakistan&output=embed&z=16"

const routes = [
  {
    id: "1",
    name: "From Sialkot City",
    origin: "Sialkot+City+Punjab+Pakistan",
    via: "Sialkot–Daska Road",
    duration: "~35 min",
    distance: "35 km",
    color: "#1E3A8A",
    link: "https://maps.app.goo.gl/Dq9t2nCKweoAwT1k6",
  },
  {
    id: "2",
    name: "From Gujranwala",
    origin: "Gujranwala+Punjab+Pakistan",
    via: "GT Road via Wazirabad",
    duration: "~45 min",
    distance: "42 km",
    color: "#10B981",
    link: "https://maps.app.goo.gl/xAfbxRUE7tfAXSdp6",
  },
  {
    id: "3",
    name: "From Mundekey Goraya",
    origin: "Mundeke+Goraya+Sialkot+Pakistan",
    via: "Daska–Goraya Road",
    duration: "~15 min",
    distance: "12 km",
    color: "#7C3AED",
    link: "https://maps.app.goo.gl/JqD1j7nN727etnVc9",
  },
  {
    id: "4",
    name: "From Wazirabad",
    origin: "Wazirabad+Gujranwala+Punjab+Pakistan",
    via: "Wazirabad–Daska Road",
    duration: "~20 min",
    distance: "16 km",
    color: "#F59E0B",
    link: "https://maps.app.goo.gl/uLMMkYmZZUMyTYwm8",
  },
]

export function MapSection() {
  const [copied, setCopied] = useState(false)
  const [activeRoute, setActiveRoute] = useState<(typeof routes)[0] | null>(null)

  const copyAddress = () => {
    navigator.clipboard.writeText(COLLEGE_ADDRESS).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectRoute = (route: (typeof routes)[0]) => {
    setActiveRoute((prev) => (prev?.id === route.id ? null : route))
  }

  const mapSrc = activeRoute
    ? `https://maps.google.com/maps?saddr=${activeRoute.origin}&daddr=${COLLEGE_DEST}&output=embed`
    : DEFAULT_EMBED

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
            Select a route below to see directions straight to our campus — or click any card to load the live route on the map.
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
            {/* Active route banner */}
            <AnimatePresence>
              {activeRoute && (
                <motion.div
                  key={activeRoute.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5 mb-3 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md"
                  style={{ backgroundColor: activeRoute.color }}
                >
                  <Route className="w-4 h-4 shrink-0" />
                  <span>Showing route: {activeRoute.name} → Riphah International College</span>
                  <button
                    onClick={() => setActiveRoute(null)}
                    className="ml-auto opacity-70 hover:opacity-100 text-xs underline"
                  >
                    Reset
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-100 aspect-video lg:aspect-4/3">
              {/* Re-mount iframe when src changes so the route reloads */}
              <iframe
                key={mapSrc}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0, width: "100%", height: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={
                  activeRoute
                    ? `Route from ${activeRoute.name} to Riphah International College`
                    : "Riphah International College — Daska, Sialkot"
                }
              />

              {/* Get Directions button overlay */}
              <div className="absolute bottom-4 right-4 z-10">
                <motion.a
                  href={activeRoute ? activeRoute.link : COLLEGE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow-lg text-sm hover:shadow-xl transition-shadow"
                  style={{
                    background: activeRoute
                      ? activeRoute.color
                      : "linear-gradient(to right, #1E3A8A, #7C3AED)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation className="w-4 h-4" />
                  {activeRoute ? "Open in Maps" : "Get Directions"}
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
            <p className="text-xs text-slate-400 -mt-1 mb-1">
              Click a route to preview it on the map
            </p>

            {routes.map((route, index) => {
              const isActive = activeRoute?.id === route.id
              return (
                <motion.button
                  key={route.id}
                  onClick={() => selectRoute(route)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all group text-left ${
                    isActive
                      ? "bg-white border-2 shadow-lg"
                      : "bg-slate-50 hover:bg-white border-slate-100 hover:border-blue-100 hover:shadow-md"
                  }`}
                  style={isActive ? { borderColor: route.color } : {}}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Color dot */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                    style={{ backgroundColor: isActive ? route.color : `${route.color}18` }}
                  >
                    <Car className="w-5 h-5" style={{ color: isActive ? "#fff" : route.color }} />
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

                  {isActive ? (
                    <Route className="w-4 h-4 shrink-0" style={{ color: route.color }} />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-slate-200 group-hover:text-[#1E3A8A] transition-colors shrink-0" />
                  )}
                </motion.button>
              )
            })}

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
