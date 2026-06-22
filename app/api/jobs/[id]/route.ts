import { NextResponse } from "next/server";
import { notImplemented } from "@/lib/server/adapters";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return NextResponse.json(
    {
      ...notImplemented("job_status"),
      jobId: id,
    },
    { status: 501 },
  );
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return NextResponse.json(
    {
      ...notImplemented("job_cancel"),
      jobId: id,
    },
    { status: 501 },
  );
}
