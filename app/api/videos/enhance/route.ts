import { NextResponse } from "next/server";
import { notImplemented } from "@/lib/server/adapters";

export async function POST() {
  return NextResponse.json(notImplemented("ai_video_enhancement"), { status: 501 });
}
