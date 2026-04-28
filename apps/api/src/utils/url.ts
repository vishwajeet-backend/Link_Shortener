const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export const normalizeUrl = (input: string): string => {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only HTTP/HTTPS URLs are allowed");
  }

  parsed.hash = "";
  const pathname = parsed.pathname.replace(/\/+$/, "");
  parsed.pathname = pathname || "/";

  return parsed.toString();
};

export const isValidPublicUrl = (input: string): boolean => {
  try {
    const parsed = new URL(input);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return false;
    if (!parsed.hostname) return false;

    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local")) return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      const octets = host.split(".").map(Number);
      const [a, b] = octets;
      if (a === 10) return false;
      if (a === 127) return false;
      if (a === 192 && b === 168) return false;
      if (a === 172 && b >= 16 && b <= 31) return false;
    }

    return true;
  } catch {
    return false;
  }
};
