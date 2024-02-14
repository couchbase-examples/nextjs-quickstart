export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Couchbase Next.js Quickstart",
  description:
    "A quickstart for building a Next.js app with Couchbase Server",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Doc",
      href: "/api-doc",
    },
  ],
  links: {
    twitter: "https://twitter.com/jellydn",
    github: "https://github.com/jellydn/next-swagger-doc",
    docs: "https://next-swagger-doc.productsway.com",
  },
}
