import { NextResponse } from "next/server"
import { auth } from "@/lib/server"

export async function POST() {
  try {
    await auth()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 })
  }
}

