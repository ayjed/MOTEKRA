import { notFound } from "next/navigation";
import { publishableArticles } from "@/lib/data/articles";
import { articleMetadata } from "@/lib/seo/schema";
import { ArticleTemplate } from "@/components/insights/article-template";
export const dynamicParams=false;
export function generateStaticParams(){return publishableArticles().map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=publishableArticles().find(post=>post.slug===slug);return article?articleMetadata(article):{title:'Article unavailable',robots:{index:false,follow:false}};}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=publishableArticles().find(post=>post.slug===slug);if(!article)notFound();return <ArticleTemplate article={article}/>;}
