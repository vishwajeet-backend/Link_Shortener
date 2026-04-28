"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/auth/google-button";
import { getApiBaseUrl } from "@/lib/public-env";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL = getApiBaseUrl();

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace(user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      await login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      });
      const role = useAuthStore.getState().user?.role;
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="hidden bg-slate-900 md:block">
        <img
          alt="Analytics workspace"
          className="h-full w-full object-cover"
          loading="lazy"
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop"
        />
      </section>
      <section className="mx-auto flex w-full max-w-md items-center px-6 py-10">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="mb-1 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mb-6 text-sm text-slate-300">Log in to manage your links and analytics.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button className="w-full bg-indigo-600 text-white hover:bg-indigo-500" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="my-4 text-center text-xs text-slate-500">or</div>
          <GoogleButton href={`${API_BASE_URL}/auth/google`} />
          <p className="mt-5 text-sm text-slate-300">
            No account?{" "}
            <Link className="text-indigo-400" href="/register">
              Register
            </Link>
          </p>
          <Link
            className="mt-4 block w-full text-center text-sm text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
            href="/"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
