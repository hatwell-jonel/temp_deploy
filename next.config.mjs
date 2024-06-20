import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
  redirects: async () => [
    {
      permanent: false,
      destination: "/fims/purchasing/snp-requisition",
      source: "/",
    },
    {
      permanent: false,
      destination: "/fims/purchasing/snp-requisition",
      source: "/fims",
    },
    {
      permanent: false,
      destination: "/fims/purchasing/snp-requisition",
      source: "/fims/purchasing",
    },
    {
      permanent: false,
      destination: "/fims/accounting/loa-mgmt",
      source: "/fims/accounting",
    },
  ],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
