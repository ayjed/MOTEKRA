import { isEmail } from "./schema";
export interface ContactConfig { origin:string; apiKey:string; from:string; recipient:string; trustProxy:boolean; }
export function contactConfig(env:Readonly<Record<string,string|undefined>>=process.env):ContactConfig|null {
 try {const origin=new URL(env.CONTACT_ORIGIN??env.SITE_URL??'');const local=['127.0.0.1','localhost','[::1]'].includes(origin.hostname);if(origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password||(origin.protocol!=='https:'&&!(local&&origin.protocol==='http:')))return null;
 const apiKey=env.RESEND_API_KEY??'',from=env.CONTACT_FROM??'',recipient=env.CONTACT_EMAIL??'';
 if(env.CONTACT_DELIVERY_ENABLED!=='true'||!apiKey.startsWith('re_')||apiKey.length<10||!isEmail(from)||!isEmail(recipient))return null;
 return {origin:origin.origin,apiKey,from,recipient,trustProxy:env.CONTACT_TRUST_PROXY==='true'};
 }catch{return null;}
}
