import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">Tindahan Ledger</p>
      <h1 className="mt-4 max-w-2xl text-5xl font-bold tracking-tight">A clear record of every customer balance.</h1>
      <p className="mt-5 max-w-xl text-lg text-neutral-600">Keep customer dues and payments together, with a history you can check any time.</p>
      <Link href="/customers" className="mt-8 inline-flex rounded bg-neutral-900 px-5 py-3 text-white">Open the ledger</Link>
    </main>
  );
}
