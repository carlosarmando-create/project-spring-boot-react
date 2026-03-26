import { AuthSession } from "@/lib/types";

const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const SERVER_API_URL = process.env.API_URL_INTERNAL ?? CLIENT_API_URL;
const CLIENT_ASSET_URL = process.env.NEXT_PUBLIC_API_ASSET_URL ?? "http://localhost:8080";
const SERVER_ASSET_URL = process.env.API_ASSET_URL_INTERNAL ?? CLIENT_ASSET_URL;

function getApiUrl() {
  return typeof window === "undefined" ? SERVER_API_URL : CLIENT_API_URL;
}

export function resolveAssetUrl(path?: string | null) {
  if (!path) return "/plant-placeholder.svg";
  if (path.startsWith("http")) return path;
  const baseUrl = typeof window === "undefined" ? SERVER_ASSET_URL : CLIENT_ASSET_URL;
  return `${baseUrl}${path}`;
}

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Ocurrió un error al conectar con la API";
    try {
      const payload = await response.json();
      message = payload.message ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function loginRequest(email: string, password: string) {
  return apiFetch<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
