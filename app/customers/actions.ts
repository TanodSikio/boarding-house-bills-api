"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { addEntry, readCustomer } from "@/lib/customers";
import { CustomerSchema, EntrySchema } from "@/lib/definitions";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export type PostState = { message: string; name: string; balance: string };
export type EntryState = { message: string; amount: string };

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addCustomer(_prev: PostState, form: FormData): Promise<PostState> {
  const typed = { name: String(form.get("name") ?? ""), balance: String(form.get("balance") ?? "") };
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") return { message: "Only the admin can add customers.", ...typed };

  const parsed = CustomerSchema.safeParse(typed);
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the customer details.", ...typed };
  try {
    await db.insert(customers).values(parsed.data);
  } catch {
    return { message: "Something went wrong while saving the customer.", ...typed };
  }
  revalidatePath("/customers");
  return { message: "", name: "", balance: "" };
}

export async function recordEntry(customerId: string, _prev: EntryState, form: FormData): Promise<EntryState> {
  const amount = String(form.get("amount") ?? "");
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") return { message: "Only the admin can add dues and payments.", amount };

  const parsed = EntrySchema.safeParse({ kind: form.get("kind"), amount });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the entry details.", amount };
  const customer = await readCustomer(customerId);
  if (!customer) return { message: "This customer was removed.", amount };
  if (parsed.data.kind === "payment" && parsed.data.amount > customer.balance) {
    return { message: "The payment cannot be more than the amount owed.", amount };
  }

  try {
    const entry = await addEntry(customerId, parsed.data.kind, parsed.data.amount);
    if (!entry) return { message: "The balance changed. Refresh and try again.", amount };
  } catch {
    return { message: "Something went wrong while saving the entry.", amount };
  }
  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
  return { message: "", amount: "" };
}
