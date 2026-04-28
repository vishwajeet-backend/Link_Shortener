import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-extrabold text-white">404</h1>
        <p className="mt-3 text-slate-300">This page does not exist or may have been moved.</p>
        <Link className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-500" href="/">
          Go back home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
