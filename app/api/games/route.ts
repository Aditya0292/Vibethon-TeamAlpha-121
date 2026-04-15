import { NextResponse } from "next/server"
import { GAME_LEVELS } from "@/lib/game-constants"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const game = searchParams.get("game")

    if (!game) {
      return NextResponse.json({ levels: GAME_LEVELS })
    }

    if (game === "knn" || game === "neural_lite") {
      return NextResponse.json({ levels: GAME_LEVELS[game as keyof typeof GAME_LEVELS] })
    }

    return NextResponse.json({ error: "Invalid game. Use 'knn' or 'neural_lite'." }, { status: 400 })
  } catch (error) {
    console.error("GET /api/games failed:", error)
    return NextResponse.json({ error: "Failed to fetch game levels." }, { status: 500 })
  }
}
