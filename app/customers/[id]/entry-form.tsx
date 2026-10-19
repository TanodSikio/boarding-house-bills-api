"use client";

import { useActionState } from "react";
import { recordEntry } from "../actions";

export function EntryForm({ customerId }: { customerId: string }) {
  const [state, action, pending] = useActionState(recordEntry.bind(null, customerId), { message: "", amount: "" });
  return <form action={action} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border p-4">
    <label className="grid gap-1">Amount
      <input name="amount" type="number" min="0.01" step="0.01" required defaultValue={state.amount} className="w-40 rounded border px-3 py-2" />
    </label>
    <button name="kind" value="due" disabled={pending} className="rounded bg-neutral-900 px-4 py-2 text-white">Add due</button>
    <button name="kind" value="payment" disabled={pending} className="rounded border px-4 py-2">Record payment</button>
    {state.message && <p role="alert" className="w-full text-red-700">{state.message}</p>}
  </form>;
}
