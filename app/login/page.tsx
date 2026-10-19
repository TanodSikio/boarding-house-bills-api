import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await getProfile()) redirect("/customers");
  return <main className="mx-auto w-full max-w-5xl px-6 py-12">
    <h1 className="text-3xl font-bold">Sign in to Tindahan Ledger</h1>
    <p className="mt-2 text-neutral-600">Sign in with your account or create a client account.</p>
    <LoginForm />
  </main>;
}
