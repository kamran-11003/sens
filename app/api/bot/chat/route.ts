import { NextResponse } from "next/server"

// The chatbot is now a static FAQ bot on the frontend.
// This route is kept as a no-op stub.
export async function POST() {
  return NextResponse.json({
    reply: "Please use the FAQ options in the chat widget to get assistance.",
  })
}
