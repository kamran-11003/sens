import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AdmissionFormSection } from "@/components/sections/admission-form-section"
import { Footer } from "@/components/footer"

interface Props {
  searchParams: Promise<{ program?: string }>
}

export default async function AdmissionsPage({ searchParams }: Props) {
  const { program } = await searchParams
  return (
    <main className="dark relative min-h-screen bg-background text-white">
      <Navigation />
      <HeroSection
        title="Admission"
        highlightedText="Portal"
        subtitle="Your journey to academic excellence starts here. Join Riphah International College and build a future of innovation and leadership."
      />
      <AdmissionFormSection preselectedProgramId={program} />
      <Footer />
    </main>
  )
}
