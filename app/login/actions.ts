"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CredentialsSchema } from "@/lib/definitions";

export type LoginState = { message: string; email: string };

export async function authenticate(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "");
  const parsed = CredentialsSchema.safeParse({ email, password: form.get("password") });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check your details.", email };

  const supabase = await createClient();
  const result = form.get("intent") === "signup"
    ? await supabase.auth.signUp(parsed.data)
    : await supabase.auth.signInWithPassword(parsed.data);
  if (result.error) return { message: result.error.message, email };
  redirect("/customers");
}
