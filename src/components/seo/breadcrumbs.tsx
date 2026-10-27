import Link from "next/link";
import { breadcrumbSchema,type Crumb } from "@/lib/seo/schema";
import { JsonLd } from "./json-ld";
export function Breadcrumbs({items}:{items:readonly Crumb[]}){return <><nav className="seo-breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item,index)=><li key={item.path}>{index<items.length-1?<Link prefetch={false} href={item.path}>{item.name}</Link>:<span aria-current="page">{item.name}</span>}</li>)}</ol></nav><JsonLd data={breadcrumbSchema(items)}/></>;}
