/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/': ['./node_modules/@couchbase/**/*'],
    '/api/user': ['./node_modules/@couchbase/**/*'],
  },
};

export default nextConfig;
