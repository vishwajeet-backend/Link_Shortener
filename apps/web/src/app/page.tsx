"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";

type CreatedUrl = {
  shortUrl: string;
  shortCode: string;
};

const featureCards = [
  {
    title: "Instant URL Shortening",
    description: "Create production-ready short links in seconds with globally unique short codes."
  },
  {
    title: "Global Access",
    description: "Share links that can be opened anywhere, from any region, on any device."
  },
  {
    title: "Click Tracking",
    description: "Track total clicks, trends, and visit behavior from your analytics dashboard."
  },
  {
    title: "Admin Monitored Safety",
    description: "Role-based controls let admins pause or remove harmful links immediately."
  },
  {
    title: "Fast Redirect Engine",
    description: "Low-latency status-aware redirects keep links responsive and reliable."
  },
  {
    title: "QR Support (Coming Soon)",
    description: "Generate downloadable QR codes for each short URL with campaign attribution."
  }
];

const faqItems = [
  {
    q: "Can I manage all my links from one dashboard?",
    a: "Yes. You can view, filter, and track all your links and clicks from the user dashboard."
  },
  {
    q: "Is this role-based platform secure for teams?",
    a: "Yes. JWT auth, refresh rotation, and RBAC protect all user and admin operations."
  },
  {
    q: "Can admins disable malicious links?",
    a: "Yes. Admins can pause, activate, or delete URLs with audit-friendly notifications."
  }
];

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedUrl | null>(null);

  const appTagline = useMemo(
    () => "The enterprise-grade URL shortener built for modern growth teams.",
    []
  );

  const onShorten = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setCreated(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const originalUrl = String(formData.get("originalUrl") ?? "").trim();
    if (!originalUrl) return;

    if (!token) {
      router.push("/register");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest<CreatedUrl>("/urls", {
        method: "POST",
        token,
        body: { originalUrl }
      });
      setCreated(data);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to shorten URL");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link className="text-lg font-bold text-indigo-700" href="/">
            PurpleMerit Links
          </Link>
          <div className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link className="font-medium text-slate-800" href="/login">
              Login
            </Link>
            <Link className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white" href="/register">
              Signup
            </Link>
          </div>
        </nav>
      </header>

      <main id="home" className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-8 md:pt-16">
        <section className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Trusted by teams and creators
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Shorten, secure, and scale your links globally.
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">{appTagline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white" href="/register">
                Start for free
              </Link>
              <Link className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold" href="/login">
                Go to dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold">Shorten URL instantly</h2>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              {user ? `Welcome ${user.name}. Create your next short link.` : "Paste your long URL and create a short link."}
            </p>
            <form className="space-y-3" onSubmit={onShorten}>
              <input
                className="h-11"
                name="originalUrl"
                placeholder="https://example.com/your-long-url"
                required
                suppressHydrationWarning
                type="url"
              />
              <button
                className="h-11 w-full bg-indigo-600 text-white disabled:opacity-60"
                disabled={submitting}
                suppressHydrationWarning
                type="submit"
              >
                {submitting ? "Shortening..." : "Shorten URL"}
              </button>
            </form>
            {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
            {created ? (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm font-semibold text-emerald-800">Short URL created</p>
                <p className="mt-1 break-all text-sm">{created.shortUrl}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 text-center md:mt-20">
          <h3 className="text-2xl font-semibold">Why teams choose PurpleMerit Links</h3>
          <p className="mx-auto mt-2 max-w-3xl text-slate-600">
            Reliable redirects, deep analytics, and admin controls designed for growth-stage SaaS teams.
          </p>
        </section>

        <section className="mt-12" id="features">
          <h3 className="text-2xl font-semibold md:text-3xl">Powerful features for modern campaigns</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={feature.title}>
                <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 md:grid-cols-3" id="about">
          {[
            "Paste your long URL and click shorten.",
            "Share the short link across channels instantly.",
            "Track engagement and manage safety from dashboard."
          ].map((step, index) => (
            <div className="rounded-xl border border-slate-200 bg-white p-5" key={step}>
              <p className="text-sm font-semibold text-indigo-600">Step {index + 1}</p>
              <p className="mt-2 text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h3 className="text-2xl font-semibold md:text-3xl">Frequently asked questions</h3>
          <div className="mt-5 space-y-3">
            {faqItems.map((item) => (
              <details className="rounded-xl border border-slate-200 bg-white p-4" key={item.q}>
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} PurpleMerit Links. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link href="/login">Login</Link>
            <Link href="/register">Signup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
