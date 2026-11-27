import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { SITE } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/services", "/new-patients", "/team", "/book", "/contact", ...SERVICES.map((s) => `/services/${s.slug}`)];
  return pages.map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/book" ? 0.9 : 0.7,
  }));
}
