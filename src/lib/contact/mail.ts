import type { ContactConfig } from "./config";
import type { Inquiry } from "./schema";
export class DeliveryError extends Error {constructor(public status:number){super('Email provider did not confirm acceptance');}}
export async function deliverInquiry(config:ContactConfig,data:Inquiry,reference:string,fetchApi:typeof fetch=fetch) {
 const response=await fetchApi('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${config.apiKey}`,'Content-Type':'application/json','Idempotency-Key':`motekra-inquiry/${reference}`},body:JSON.stringify({from:config.from,to:[config.recipient],reply_to:data.email,subject:`MOTEKRA inquiry — ${data.projectType}`,text:`Website inquiry\nReference: ${reference}\nName: ${data.name}\nReply email: ${data.email}\nProject area: ${data.projectType}\n\n${data.message}`}),signal:AbortSignal.timeout(12000),redirect:'error',cache:'no-store'});
 if(!response.ok)throw new DeliveryError(response.status);
 const payload:unknown=await response.json();if(!payload||typeof payload!=='object'||!('id' in payload)||typeof payload.id!=='string'||!payload.id)throw new DeliveryError(502);
}
