"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const campusHighlights = [
  { label: "Acres Campus", value: "50+" },
  { label: "Buildings", value: "25+" },
  { label: "Wi-Fi Coverage", value: "100%" },
  { label: "Security", value: "24/7" },
]

const scrollLabels = [
  { progress: 0,    title: "Welcome to Our Campus",   sub: "A world-class learning environment awaits you" },
  { progress: 0.25, title: "Academic Excellence",     sub: "State-of-the-art lecture halls and research labs" },
  { progress: 0.5,  title: "Student Life",            sub: "Vibrant campus culture and modern student facilities" },
  { progress: 0.75, title: "Sports & Recreation",     sub: "Olympic-standard sports complex and open grounds" },
  { progress: 1,    title: "Plan Your Campus Visit",  sub: "Come experience it in person — we'd love to show you around" },
]

export function CampusSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const labelRef    = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video   = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.pause()
    video.load()

    let currentLabelIndex = -1
    let rafId = 0
    let targetTime = 0
    let lastProgress = -1

    const seekFrame = () => {
      rafId = 0
      if (!video.duration) return
      if ('fastSeek' in video) {
        ;(video as HTMLVideoElement & { fastSeek(t: number): void }).fastSeek(targetTime)
      } else {
        (video as HTMLVideoElement).currentTime = targetTime
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end:   "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (video.duration) {
          targetTime = self.progress * video.duration
          if (!rafId) rafId = requestAnimationFrame(seekFrame)
        }

        if (progressRef.current && self.progress !== lastProgress) {
          lastProgress = self.progress
          progressRef.current.style.width = `${self.progress * 100}%`
        }

        let closest = 0
        let closestDist = Infinity
        scrollLabels.forEach((item, i) => {
          const d = Math.abs(self.progress - item.progress)
          if (d < closestDist) { closestDist = d; closest = i }
        })

        if (closest !== currentLabelIndex) {
          currentLabelIndex = closest
          const item = scrollLabels[closest]
          const els = [labelRef.current, subRef.current].filter(Boolean) as HTMLElement[]
          gsap.to(els, {
            opacity: 0, y: -10, duration: 0.2,
            onComplete: () => {
              if (labelRef.current) labelRef.current.textContent = item.title
              if (subRef.current)   subRef.current.textContent   = item.sub
              gsap.to(els, { opacity: 1, y: 0, duration: 0.4 })
            },
          })
        }
      },
    })

    return () => {
      trigger.kill()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section ref={sectionRef} id="campus" style={{ height: "320vh" }} className="relative">
      {/* Sticky cinematic viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Scroll-scrubbed campus video */}
        <video
          ref={videoRef}
          src="/campus-tour.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Top badge */}
        <div className="absolute top-8 left-0 right-0 z-20 px-6">
          <div className="container mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-sm tracking-wide">
              Campus Tour
            </span>
          </div>
        </div>

        {/* Dynamic scroll label — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-14">
          <div className="container mx-auto max-w-3xl">
            <h2
              ref={labelRef}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-xl leading-tight"
            >
              Welcome to Our Campus
            </h2>
            <p
              ref={subRef}
              className="text-base md:text-lg text-white/65 mb-6 max-w-lg"
            >
              A world-class learning environment awaits you
            </p>

            {/* Scroll progress bar */}
            <div className="w-full max-w-xs h-0.5 bg-white/20 rounded-full overflow-hidden mb-3">
              <div
                ref={progressRef}
                className="h-full bg-white rounded-full"
                style={{ width: "0%", transition: "none" }}
              />
            </div>

            {/* Step dots */}
            <div className="flex gap-2.5">
              {scrollLabels.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/35" />
              ))}
            </div>
          </div>
        </div>

        {/* Side stats — desktop only */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
          {campusHighlights.map((stat) => (
            <div
              key={stat.label}
              className="text-right backdrop-blur-md bg-black/20 border border-white/10 rounded-xl px-4 py-3"
            >
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
          <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        </div>

      </div>
    </section>
  )
}
