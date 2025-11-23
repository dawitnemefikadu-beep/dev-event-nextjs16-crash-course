import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript:{
        ignoreBuildErrors: true
    },
    cacheComponents: false,
    images:{
        remotePatterns: [
            {
                protocol:'https',
                hostname:'res.cloudinary.com',
            }
        ]
    },

  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
