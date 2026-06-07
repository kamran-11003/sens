import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// ── helpers ────────────────────────────────────────────────────────────────

function scoreDocument(content: string, query: string): number {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  const lower = content.toLowerCase()
  return words.reduce((total, word) => {
    const matches = (lower.match(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length
    return total + matches
  }, 0)
}

function extractRelevantSentences(content: string, query: string, maxSentences = 5): string {
  const sentences = content.split(/(?<=[.!?])\s+/)
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  const scored = sentences.map(s => ({
    text: s.trim(),
    score: queryWords.filter(w => s.toLowerCase().includes(w)).length,
  }))
  const relevant = scored
    .filter(s => s.score > 0 && s.text.length > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .map(s => s.text)
  if (relevant.length > 0) return relevant.join(" ")
  return sentences.filter(s => s.length > 20).slice(0, 3).join(" ")
}

function appendPageLinks(reply: string, lower: string): string {
  if (lower.includes("admission") || lower.includes("apply") || lower.includes("enroll")) {
    return reply + " You can start your application at our [Admissions](/admissions) page."
  }
  if (lower.includes("fee") || lower.includes("cost") || lower.includes("tuition") || lower.includes("payment")) {
    return reply + " Check our [Fee Structure](/fee-structure) for full details."
  }
  if (lower.includes("program") || lower.includes("course") || lower.includes("degree")) {
    return reply + " Browse all our programs at the [Programs](/programs) page."
  }
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("address")) {
    return reply + " Reach us directly via our [Contact](/contact) page."
  }
  return reply
}

// ── route ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message: string = (body?.message ?? "").trim()
    if (!message) return NextResponse.json({ reply: "Please type a message." })

    const [documents, rules] = await Promise.all([
      prisma.botDocument.findMany({ where: { active: true } }),
      prisma.botRule.findMany({ where: { active: true }, orderBy: { priority: "desc" } }),
    ])

    const lower = message.toLowerCase()
    const isGreeting = ["hi", "hello", "hey", "salam", "assalam", "good morning", "good afternoon", "good evening"]
      .some(g => lower.includes(g))

    // Score docs by keyword relevance
    const topDocs = documents
      .map(d => ({ doc: d, score: scoreDocument(d.content, message) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    // ── path A: OpenAI available (preferred) ───────────────────────────────
    if (OPENAI_API_KEY) {
      const context = topDocs.length > 0
        ? topDocs.map(x => `[${x.doc.title}]\n${x.doc.content}`).join("\n\n---\n\n")
        : rules.map(r => r.rule).join("\n")

      const systemPrompt = `You are a helpful admissions assistant for Riphah International College, Lahore, Pakistan. Answer ONLY based on the provided context. Be concise (2-4 sentences). Use a friendly, professional tone. If the context doesn't have an answer, say you'll direct them to the admissions office.`

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context:\n${context}\n\nUser question: ${message}` }
      ]

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages, max_tokens: 500, temperature: 0.2 }),
      })

      if (!resp.ok) {
        console.error('OpenAI error', await resp.text())
      } else {
        const data = await resp.json()
        const text = data?.choices?.[0]?.message?.content ?? ''
        const reply = appendPageLinks(String(text).trim(), lower)
        return NextResponse.json({ reply })
      }
    }

    // ── path B: Gemini available (fallback) ───────────────────────────────
    if (GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

      const context = topDocs.length > 0
        ? topDocs.map(x => `[${x.doc.title}]\n${x.doc.content}`).join("\n\n---\n\n")
        : rules.map(r => r.rule).join("\n")

      const prompt = `You are a helpful admissions assistant for Riphah International College, Lahore, Pakistan.
Answer ONLY based on the provided context. Be concise (2-4 sentences). Use a friendly, professional tone.
If the context doesn't have an answer, say you'll direct them to the admissions office.

Context:
${context}

User question: ${message}`

      const result = await model.generateContent(prompt)
      const reply = appendPageLinks(result.response.text().trim(), lower)
      return NextResponse.json({ reply })
    }

    // ── path B: keyword fallback (no API key) ─────────────────────────────
    let reply = ""
    if (topDocs.length > 0) {
      const extracted = extractRelevantSentences(topDocs[0].doc.content, message)
      reply = isGreeting
        ? `Asalam-o-Alaikum! Welcome to Riphah International College. ${extracted}`
        : extracted
    } else {
      const defaultRule = rules.find(r => r.title.toLowerCase().includes("default") || r.priority === 0)
      reply = isGreeting
        ? "Asalam-o-Alaikum! Welcome to Riphah International College. How can I help you today? Ask me about programs, admissions, fee structure, faculty, or events."
        : (defaultRule?.rule ?? "Thank you for your question! For detailed information, please contact our admissions office or use the contact form on our website.")
    }

    return NextResponse.json({ reply: appendPageLinks(reply, lower) })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { reply: "I'm having trouble right now. Please try again in a moment." },
      { status: 500 }
    )
  }
}

