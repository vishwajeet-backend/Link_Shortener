"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api-client";

type User = {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

type AuthResponse = {
  user: User;
  tokens: { accessToken: string; refreshToken: string };
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  hydrate: () => void;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (payload: AuthResponse) => void;
};

const ACCESS_KEY = "ls_access_token";
const REFRESH_KEY = "ls_refresh_token";
const USER_KEY = "ls_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as User) : null;
    set({ accessToken, refreshToken, user, isHydrated: true });
  },
  login: async ({ email, password }) => {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password }
    });

    localStorage.setItem(ACCESS_KEY, data.tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, data.tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    set({
      user: data.user,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken
    });
  },
  register: async ({ name, email, password }) => {
    const data = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });

    localStorage.setItem(ACCESS_KEY, data.tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, data.tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    set({
      user: data.user,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken
    });
  },
  logout: async () => {
    const { accessToken, refreshToken } = get();
    if (accessToken && refreshToken) {
      try {
        await apiRequest<null>("/auth/logout", {
          method: "POST",
          token: accessToken,
          body: { refreshToken }
        });
      } catch {
        // no-op
      }
    }

    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  },
  setSession: (payload) => {
    localStorage.setItem(ACCESS_KEY, payload.tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, payload.tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    set({
      user: payload.user,
      accessToken: payload.tokens.accessToken,
      refreshToken: payload.tokens.refreshToken
    });
  }
}));
