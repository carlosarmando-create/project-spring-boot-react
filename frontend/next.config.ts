import type { NextConfig } from "next";

function toRemotePattern(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

const remotePatterns = [
  process.env.NEXT_PUBLIC_API_ASSET_URL ?? "http://localhost:8080",
  process.env.API_ASSET_URL_INTERNAL ?? "http://backend:8080",
]
  .map(toRemotePattern)
  .filter((pattern): pattern is NonNullable<ReturnType<typeof toRemotePattern>> => pattern !== null)
  .filter(
    (pattern, index, array) =>
      array.findIndex((candidate) => candidate.toString() === pattern.toString()) === index,
  );

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns,
  },
};

export default nextConfig;
