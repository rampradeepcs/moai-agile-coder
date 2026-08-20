import type { NextConfig } from "next";

// Static export for GitHub Pages. The Pages workflow sets NEXT_PUBLIC_BASE_PATH
// to "/<repo>" so the app serves from https://<user>.github.io/<repo>/.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
