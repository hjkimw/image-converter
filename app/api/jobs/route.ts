import { NextResponse } from "next/server";
import { notImplemented } from "@/lib/server/adapters";

export async function POST() {
  return NextResponse.json(notImplemented("job_queue"), { status: 501 });
}
