import { NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { addEntry, readCustomer, readEntries } from "@/lib/customers";
import { EntrySchema } from "@/lib/definitions";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const profile = await getProfile(request);
  if (!profile) return new NextResponse("", { status: 401 });
  const { id } = await params;
  if (!await readCustomer(id)) return new NextResponse("", { status: 404 });
  return NextResponse.json(await readEntries(id));
}

export async function POST(request: Request, { params }: Context) {
  const profile = await getProfile(request);
  if (!profile) return new NextResponse("", { status: 401 });
  if (profile.role !== "admin") return new NextResponse("", { status: 403 });

  const { id } = await params;
  const customer = await readCustomer(id);
  if (!customer) return new NextResponse("", { status: 404 });
  const body = await request.json().catch(() => null);
  const parsed = EntrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid entry." }, { status: 400 });
  if (parsed.data.kind === "payment" && parsed.data.amount > customer.balance) {
    return NextResponse.json({ error: "The payment cannot be more than the amount owed." }, { status: 400 });
  }
  const entry = await addEntry(id, parsed.data.kind, parsed.data.amount);
  if (!entry) return NextResponse.json({ error: "The balance changed. Refresh and try again." }, { status: 400 });
  return NextResponse.json(entry, { status: 201 });
}
