import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { getProfile } from "@/lib/auth";
import { CustomerSchema } from "@/lib/definitions";

export async function GET(request: Request) {
  const profile = await getProfile(request);
  if(!profile) return new NextResponse("", { status: 401 });
  return NextResponse.json(await db.select().from(customers));
}

export async function POST(request: Request) {
  const profile = await getProfile(request);
  if(!profile) return new NextResponse("", { status: 401 });
  if(profile.role !== "admin") return new NextResponse("", { status: 403 });
  
  const body = await request.json().catch(() => null);
  const parsed = CustomerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid customer." }, { status: 400 });
  const [row] = await db.insert(customers).values(parsed.data).returning();
  return NextResponse.json(row, { status: 201 });
}
