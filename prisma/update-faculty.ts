// Faculty-only sync. Safe to run against production: it ONLY rewrites the
// FacultyMember table and leaves users, programs, applications, events, and the
// chatbot data untouched.
//
// Usage (requires DATABASE_URL — and DIRECT_URL if your provider uses it):
//   DATABASE_URL="postgresql://..." npx tsx prisma/update-faculty.ts
//
// Or with a .env file present:
//   npx tsx prisma/update-faculty.ts

import { PrismaClient } from "@prisma/client"
import { FACULTY } from "./faculty-data"

const prisma = new PrismaClient()

async function main() {
  console.log("Syncing faculty...")
  await prisma.facultyMember.deleteMany()
  for (const f of FACULTY) {
    await prisma.facultyMember.create({ data: f })
  }
  console.log(`  Faculty: ${FACULTY.length} records written`)
  console.log("Done.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
