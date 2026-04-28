import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const plans = [
  { name: "Starter", price: "Free", details: "Perfect for individuals and small projects." },
  { name: "Growth", price: "$19/mo", details: "More links, analytics depth, and priority support." },
  { name: "Scale", price: "$79/mo", details: "Advanced governance, team controls, and enterprise support." }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <h1 className="text-4xl font-bold text-white">Simple pricing for every stage</h1>
        <p className="mt-3 text-slate-300">Start free and scale as your traffic grows.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5" key={plan.name}>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-1 text-3xl font-bold text-indigo-400">{plan.price}</p>
              <p className="mt-2 text-slate-300">{plan.details}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
