"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/public-env";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL = getApiBaseUrl();

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      await register({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-semibold">Register</h1>
      <form className="space-y-4 rounded border bg-white p-4" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full bg-brand-600 text-white" disabled={loading} type="submit">
          {loading ? "Creating account..." : "Create account"}
        </button>
        <a
          className="block w-full rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium"
          href={`${API_BASE_URL}/auth/google`}
        >
          Continue with Google
        </a>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link className="text-brand-600" href="/login">
          Login
        </Link>
      </p>
    </main>
  );
}
