import Link from "next/link";
import { redirect } from "next/navigation";
import { getApiBaseUrl } from "@/lib/public-env";

type RedirectStatusPayload = {
  success: boolean;
  status?: "PAUSED" | "NOT_FOUND";
  message?: string;
};

const API_BASE_URL = getApiBaseUrl();

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ shortCode: string }>;
};

const ResolveErrorPage = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => (
  <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-slate-300">{description}</p>
      <div className="mt-5">
        <Link className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500" href="/">
          Go to homepage
        </Link>
      </div>
    </div>
  </main>
);

export default async function PublicRedirectPage({ params }: PageProps) {
  const { shortCode } = await params;
  const encodedCode = encodeURIComponent(shortCode);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/r/${encodedCode}`, {
      method: "GET",
      redirect: "manual",
      cache: "no-store"
    });
  } catch (_error) {
    return (
      <ResolveErrorPage
        description="Our redirect service is currently unavailable. Please try again in a moment."
        title="Service Temporarily Unavailable"
      />
    );
  }

  if ([301, 302, 307, 308].includes(response.status)) {
    const destination = response.headers.get("location");
    if (destination) {
      redirect(destination);
    }
  }

  let payload: RedirectStatusPayload | null = null;
  try {
    payload = (await response.json()) as RedirectStatusPayload;
  } catch {
    payload = null;
  }

  if (response.status === 410 || payload?.status === "PAUSED") {
    return (
      <ResolveErrorPage
        description={
          payload?.message ??
          "This short link has been paused by the owner or platform administrator."
        }
        title="This Link Is Temporarily Disabled"
      />
    );
  }

  if (response.status === 404 || payload?.status === "NOT_FOUND") {
    return (
      <ResolveErrorPage
        description={
          payload?.message ??
          "The short URL you requested does not exist or may have been removed."
        }
        title="Link Not Found"
      />
    );
  }

  return (
    <ResolveErrorPage
      description="We couldn't process this short URL right now. Please retry shortly."
      title="Unable To Resolve Link"
    />
  );
}
