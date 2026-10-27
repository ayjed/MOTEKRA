import { contactConfig } from "@/lib/contact/config";
import { handleContact } from "@/lib/contact/handler";
export const runtime="nodejs";
export async function POST(request:Request){return handleContact(request);}
// No recipient, API key or sender is returned to the browser.
export function GET(){return Response.json({available:Boolean(contactConfig())},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});}
