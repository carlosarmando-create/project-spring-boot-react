import { AuthSession } from "@/lib/types";

const SESSION_KEY = "plant-store-session";

export function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function hasRole(session: AuthSession | null, role: "ROLE_ADMIN" | "ROLE_CUSTOMER") {
  return !!session?.roles.includes(role);
}
