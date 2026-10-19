import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyUser } from "@/lib/auth";
import { readCustomer, readEntries } from "@/lib/customers";
import { EntryForm } from "./entry-form";
import { signOut } from "../actions";

function money(amount: number) {
  return `₱ ${amount.toFixed(2)}`;
}

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await verifyUser();
  const { id } = await params;
  const customer = await readCustomer(id);
  if (!customer) notFound();
  const entries = await readEntries(id);
  return <main className="mx-auto w-full max-w-5xl px-6 py-10">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><Link href="/customers" className="text-sm text-neutral-600 hover:underline">← Customers</Link>
        <h1 className="mt-2 text-3xl font-bold">{customer.name}</h1>
        <p className="mt-2 text-neutral-600">Balance: <strong className="text-neutral-900">{money(customer.balance)}</strong> · Last paid: {customer.lastPaid}</p>
      </div>
      <form action={signOut}><button className="rounded border px-4 py-2">Sign out</button></form>
    </div>
    {profile.role === "admin" && <EntryForm customerId={customer.id} />}
    <section className="mt-10">
      <h2 className="text-xl font-semibold">History</h2>
      {entries.length === 0 ? <p className="mt-4 text-neutral-600">No dues or payments recorded yet.</p> :
        <ul className="mt-4 divide-y rounded-lg border">
          {entries.map((entry) => <li key={entry.id} className="flex flex-wrap justify-between gap-2 px-4 py-3">
            <span className="capitalize">{entry.kind}</span><span className="tabular-nums">{entry.kind === "due" ? "+" : "−"}{money(entry.amount)}</span>
            <time className="w-full text-sm text-neutral-500">{entry.createdAt.toLocaleString()}</time>
          </li>)}
        </ul>}
    </section>
  </main>;
}
