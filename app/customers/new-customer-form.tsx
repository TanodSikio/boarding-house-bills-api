"use client";

import { useActionState } from "react";
import { addCustomer } from "./actions";

export function NewCustomerForm() {
  const [state, action, pending] = useActionState(addCustomer, { message: "", name: "", balance: "" });
  return <form action={action} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border p-4">
    <label className="grid gap-1">New customer
      <input name="name" required minLength={2} defaultValue={state.name} placeholder="Name" className="rounded border px-3 py-2" />
    </label>
    <label className="grid gap-1">Amount owed
      <input name="balance" type="number" min="0" step="0.01" required defaultValue={state.balance} placeholder="0.00" className="w-40 rounded border px-3 py-2" />
    </label>
    <button disabled={pending} className="rounded bg-neutral-900 px-4 py-2 text-white">{pending ? "Saving…" : "Add customer"}</button>
    {state.message && <p role="alert" className="w-full text-red-700">{state.message}</p>}
  </form>;
}
