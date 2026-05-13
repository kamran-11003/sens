"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useSpring, PanInfo, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  rating: number
  image: string
  year: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Emma Thompson",
    role: "Software Engineer",
    company: "Google",
    quote: "The education I received here transformed my career. The faculty's dedication and the hands-on learning approach prepared me for the real world like nowhere else could.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=47",
    year: "Class of 2020"
  },
  {
    id: "2",
    name: "James Rodriguez",
    role: "Investment Banker",
    company: "Goldman Sachs",
    quote: "The business program's focus on practical skills and industry connections helped me land my dream job. The alumni network is incredibly supportive.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=12",
    year: "Class of 2019"
  },
  {
    id: "3",
    name: "Sarah Chen",
    role: "UX Designer",
    company: "Apple",
    quote: "The design program pushed me to think creatively and develop a unique perspective. The mentorship I received was invaluable for my growth as a designer.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=44",
    year: "Class of 2021"
  },
  {
    id: "4",
    name: "Michael Park",
    role: "Medical Resident",
    company: "Johns Hopkins",
    quote: "The medical program's rigorous curriculum and clinical exposure gave me the foundation I needed. The simulation labs are world-class.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=15",
    year: "Class of 2018"
  },
  {
    id: "5",
    name: "Priya Sharma",
    role: "Product Manager",
    company: "Microsoft",
    quote: "Riphah taught me to think critically and lead with empathy. The diverse community enriched my perspective immensely.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=49",
    year: "Class of 2020"
  }
]

const colors = ["#1E3A8A", "#7C3AED", "#F59E0B", "#10B981", "#EF4444"]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(0)
  const springX = useSpring(x, { damping: 30, stiffness: 200 })

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (info.offset.x > 100 && currentIndex > 0) setCurrentIndex(currentIndex - 1)
    else if (info.offset.x < -100 && currentIndex < testimonials.length - 1) setCurrentIndex(currentIndex + 1)
    x.set(0)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, testimonials.length - 1)))
  }

  useEffect(() => {
    if (isDragging) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isDragging])

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#1E3A8A]/10 to-[#7C3AED]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-sm font-medium mb-4">
            Student Stories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">What Our Alumni Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our successful graduates who are making an impact around the world.
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Cards */}
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              style={{ x: springX }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[currentIndex].id}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="glass rounded-3xl p-8 md:p-12 relative select-none"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6 mt-4">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-8">
                    {testimonials[currentIndex].quote}
                  </p>

                  {/* Author row */}
                  <div className="flex items-center gap-4">
                    {/* Circle avatar */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background shrink-0"
                      style={{ ['--tw-ring-color' as string]: colors[currentIndex % colors.length] }}
                    >
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimonials[currentIndex].name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].role} · {testimonials[currentIndex].company}
                      </p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: colors[currentIndex % colors.length] }}>
                        {testimonials[currentIndex].year}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Avatar strip (other testimonials) */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((t, index) => (
              <motion.button
                key={t.id}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`relative rounded-full overflow-hidden transition-all duration-300 shrink-0 ${
                  index === currentIndex
                    ? "w-14 h-14 ring-2 ring-offset-2 ring-[#1E3A8A] ring-offset-background"
                    : "w-10 h-10 opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                  unoptimized
                />
              </motion.button>
            ))}
          </div>

          {/* Arrow navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.button
              className="w-11 h-11 rounded-full glass flex items-center justify-center disabled:opacity-30"
              onClick={() => goToSlide(currentIndex - 1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Pill dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  animate={{ width: index === currentIndex ? 28 : 8 }}
                  className={`h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-[#1E3A8A]" : "bg-muted-foreground/25"
                  }`}
                />
              ))}
            </div>

            <motion.button
              className="w-11 h-11 rounded-full glass flex items-center justify-center disabled:opacity-30"
              onClick={() => goToSlide(currentIndex + 1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentIndex === testimonials.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
