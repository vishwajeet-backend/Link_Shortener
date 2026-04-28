const readRequired = (name: "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_APP_URL", value?: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const getApiBaseUrl = (): string =>
  readRequired("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);

export const getAppPublicUrl = (): string =>
  readRequired("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL);
