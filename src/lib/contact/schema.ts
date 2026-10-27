export const projectTypes = ["ui-ux-design", "web-development", "mobile-app-development", "product-strategy", "brand-visual-design", "not-sure"] as const;
export type ContactField = "name" | "email" | "projectType" | "message";
export type FieldErrors = Partial<Record<ContactField, string>>;
export interface Inquiry { name: string; email: string; projectType: string; message: string; }
export function validateInquiry(value: Record<string, unknown>): { data: Inquiry; errors: FieldErrors } {
  const text=(key:string)=>typeof value[key]==="string" ? value[key].trim() : "";
  const data={name:text("name"),email:text("email").toLowerCase(),projectType:text("projectType"),message:text("message")};
  const errors:FieldErrors={};
  if(data.name.length<2||data.name.length>100||/[\r\n\x00-\x1f]/.test(data.name)) errors.name="Enter a name between 2 and 100 characters.";
  if(data.email.length>254||!isEmail(data.email)) errors.email="Enter a valid email address.";
  if(!(projectTypes as readonly string[]).includes(data.projectType)) errors.projectType="Choose a project area, or select Not sure yet.";
  if(data.message.length<20||data.message.length>5000||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(data.message)) errors.message="Tell us about your project in 20 to 5,000 characters.";
  return {data,errors};
}
export function isEmail(value:string) { const local=value.split("@")[0]??"";return local.length<=64&&!local.startsWith(".")&&!local.endsWith(".")&&!local.includes("..")&& /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(value) && !/[\r\n]/.test(value); }
