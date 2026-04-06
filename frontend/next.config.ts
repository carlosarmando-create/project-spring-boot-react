import type { NextConfig } from "next";

function toRemotePattern(value: string) {
  try {
    const url = new URL(value);
    return {
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
    };
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
      array.findIndex(
        (candidate) =>
          candidate.protocol === pattern.protocol &&
          candidate.hostname === pattern.hostname &&
          candidate.port === pattern.port,
      ) === index,
  );

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns,
  },
};

export default nextConfig;
