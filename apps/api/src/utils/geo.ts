import type { IncomingHttpHeaders } from "http";

type GeoInfo = {
  country?: string;
  region?: string;
  city?: string;
};

const pickHeader = (headers: IncomingHttpHeaders, key: string): string | undefined => {
  const value = headers[key];
  if (typeof value === "string" && value.length > 0) return value;
  if (Array.isArray(value) && value.length > 0) return value[0];
  return undefined;
};

export const getGeoFromHeaders = (headers: IncomingHttpHeaders): GeoInfo => {
  const country =
    pickHeader(headers, "cf-ipcountry") ??
    pickHeader(headers, "x-vercel-ip-country") ??
    pickHeader(headers, "x-country");
  const region =
    pickHeader(headers, "x-vercel-ip-country-region") ??
    pickHeader(headers, "x-region");
  const city = pickHeader(headers, "x-vercel-ip-city") ?? pickHeader(headers, "x-city");

  return {
    country,
    region,
    city
  };
};
