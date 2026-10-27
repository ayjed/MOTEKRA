import type { Metadata } from "next";
export function getSiteOrigin(value=process.env.SITE_URL):string|null {if(!value?.trim())return null;try{const url=new URL(value);if(url.protocol!=="https:"||url.username||url.password||url.pathname!=="/"||url.search||url.hash||['localhost','127.0.0.1','[::1]'].includes(url.hostname))return null;return url.origin;}catch{return null;}}
export function isIndexable(){return process.env.SITE_INDEXABLE==='true'&&getSiteOrigin()!==null;}
export function absoluteSiteUrl(path:string){const origin=getSiteOrigin();return origin&&path.startsWith('/')&&!path.startsWith('//')?`${origin}${path}`:null;}
export function socialImageFor(path:string){return `/assets/social/${path==='/'?'home':path.startsWith('/insights/')?'insights':path.startsWith('/work/')?'work':path.startsWith('/team/')?'founder':path.slice(1).replaceAll('/','-')}.png`;}
export function pageMetadata(title:string,description:string,path:string):Metadata {
 const origin=getSiteOrigin(),url=absoluteSiteUrl(path),image=absoluteSiteUrl(socialImageFor(path));const fullTitle=`${title} | MOTEKRA`;
 return {title:path==='/'?{absolute:fullTitle}:title,description,...(origin?{metadataBase:new URL(origin)}:{}),alternates:url?{canonical:url}:undefined,robots:{index:isIndexable(),follow:isIndexable()},openGraph:{title:fullTitle,description,type:'website',siteName:'MOTEKRA',locale:'en',...(url?{url}:{}),...(image?{images:[{url:image,width:1200,height:630,alt:`MOTEKRA — ${title}`}]}:{})},twitter:{card:'summary_large_image',title:fullTitle,description,...(image?{images:[{url:image,alt:`MOTEKRA — ${title}`}]}:{})}};
}
