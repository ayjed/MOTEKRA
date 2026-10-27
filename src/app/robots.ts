import type { MetadataRoute } from "next";
import { getSiteOrigin,isIndexable } from "@/lib/seo/site";
export default function robots():MetadataRoute.Robots {const origin=getSiteOrigin();if(!origin||!isIndexable())return {rules:{userAgent:'*',disallow:'/'}};return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/motion-lab','/work/evidence/']},sitemap:`${origin}/sitemap.xml`};}
