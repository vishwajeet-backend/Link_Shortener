import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <h1 className="text-4xl font-bold text-white">Contact us</h1>
        <p className="mt-3 text-slate-300">We usually respond within one business day.</p>
        <form className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <input placeholder="Your name" />
          <input placeholder="Work email" type="email" />
          <textarea
            className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 placeholder:text-slate-400"
            placeholder="How can we help?"
          />
          <button className="bg-indigo-600 text-white hover:bg-indigo-500" type="button">
            Send message
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
