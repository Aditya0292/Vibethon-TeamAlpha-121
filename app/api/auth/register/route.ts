import { NextResponse } from "next/server"
import crypto from "crypto"
import { createUser, getUserByEmail, setUserPassword } from "@/lib/store"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim() : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 })
    }

    // Validate email not already taken
    if (getUserByEmail(email)) {
      return NextResponse.json({ success: false, error: "EMAIL_TAKEN" }, { status: 409 })
    }

    let userId: string = crypto.randomUUID()

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
      }

      if (data.user?.id) userId = data.user.id
    }

    createUser({
      id: userId,
      name,
      email,
      xp: 0,
      level: "Beginner",
      badges: [],
      completed_msns: [],
      skill_vector: {
        python: 0.1,
        tf: 0.1,
        pytorch: 0.1,
        nlp: 0.1,
        cv: 0.1,
        data_eng: 0.1
      },
      updated_at: new Date().toISOString()
    })
    // Keep a local hash for fallback auth mode and local dev resilience.
    await setUserPassword(email, password)

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error("POST /api/auth/register failed:", error)
    return NextResponse.json({ success: false, error: "REGISTRATION_FAILED" }, { status: 500 })
  }
}

