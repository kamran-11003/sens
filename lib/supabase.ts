import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

// Server-side only — uses service role key to bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const BUCKETS = {
  cv: "cv-uploads",
  faculty: "faculty-images",
  taskDocs: "task-docs",
  submissions: "task-submissions",
} as const
