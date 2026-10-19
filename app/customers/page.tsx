import Link from "next/link";
import { verifyUser } from "@/lib/auth";
import { readCustomers } from "@/lib/customers";
import { NewCustomerForm } from "./new-customer-form";
import { signOut } from "./actions";

export default async function CustomersPage() {
  const profile = await verifyUser();
  const customers = await readCustomers();
  return <main className="mx-auto w-full max-w-5xl px-6 py-10">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">Customers</h1><p className="mt-1 text-neutral-600">Signed in as {profile.email} · {profile.role}</p></div>
      <form action={signOut}><button className="rounded border px-4 py-2">Sign out</button></form>
    </div>
    {profile.role === "admin" && <NewCustomerForm />}
    {customers.length === 0 ? <p className="mt-8 text-neutral-600">No customers yet.</p> :
      <ul className="mt-8 divide-y rounded-lg border">
        {customers.map((customer) => <li key={customer.id}>
          <Link href={`/customers/${customer.id}`} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-neutral-50">
            <span className="font-medium">{customer.name}</span>
            <span className="tabular-nums">₱ {customer.balance.toFixed(2)}</span>
          </Link>
        </li>)}
      </ul>}
  </main>;
}
