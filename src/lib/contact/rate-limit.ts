// Best effort per warm serverless instance. No database or durable/shared store.
// Provider quotas and host-level abuse controls remain essential at launch.
interface Bucket {count:number;expires:number;}
export function createContactLimiter(){const buckets=new Map<string,Bucket>();return {take(quotas:readonly {key:string;limit:number;windowMs:number}[],now=Date.now()) {for(const [key,bucket] of buckets)if(bucket.expires<=now)buckets.delete(key);for(const quota of quotas){const bucket=buckets.get(quota.key);if(bucket&&bucket.count>=quota.limit)return {allowed:false,retryAfter:Math.max(1,Math.ceil((bucket.expires-now)/1000))};}for(const quota of quotas){const bucket=buckets.get(quota.key);if(bucket)bucket.count++;else buckets.set(quota.key,{count:1,expires:now+quota.windowMs});}return {allowed:true,retryAfter:0};}};}
export const contactLimiter=createContactLimiter();
