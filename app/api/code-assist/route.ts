import { NextResponse } from 'next/server';
import { getCodeSuggestions, getMissionHint } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { code, mission, type } = await req.json();

    let result = "";
    if (type === "suggest") {
        result = await getCodeSuggestions(code, mission);
    } else if (type === "hint") {
        result = await getMissionHint(code, mission);
    } else {
        return NextResponse.json({ error: "Invalid assistance type" }, { status: 400 });
    }
    
    return NextResponse.json({ message: result });
  } catch (error: any) {
    return NextResponse.json({ message: "COMMS_FAILURE: " + error.message }, { status: 500 });
  }
}
