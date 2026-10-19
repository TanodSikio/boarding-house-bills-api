"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(authenticate, { message: "", email: "" });
  return (
    <form action={action} className="mt-6 grid max-w-md gap-4">
      <label className="grid gap-1">Email
        <input name="email" type="email" required autoComplete="email" defaultValue={state.email} className="rounded border px-3 py-2" />
      </label>
      <label className="grid gap-1">Password
        <input name="password" type="password" required minLength={6} autoComplete="current-password" className="rounded border px-3 py-2" />
      </label>
      {state.message && <p role="alert" className="text-red-700">{state.message}</p>}
      <div className="flex gap-3">
        <button name="intent" value="signin" disabled={pending} className="rounded bg-neutral-900 px-4 py-2 text-white">{pending ? "Please wait…" : "Sign in"}</button>
        <button name="intent" value="signup" disabled={pending} className="rounded border px-4 py-2">Create a client account</button>
      </div>
    </form>
  );
}
