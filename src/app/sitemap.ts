import type { MetadataRoute } from "next";
import { getSiteOrigin,isIndexable } from "@/lib/seo/site";
import { approvedSeoPaths } from "@/lib/seo/routes";
export default function sitemap():MetadataRoute.Sitemap {const origin=getSiteOrigin();return origin&&isIndexable()?approvedSeoPaths().map(path=>({url:`${origin}${path}`})):[];}
