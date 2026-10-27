import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo/site";
export { ServicesPage as default } from "@/components/services/services-page";
export const metadata = { ...pageMetadata("Services — End-to-end Digital Solutions.", "Explore proposed UI/UX design, web development, mobile application development, product strategy and brand design, with scope and availability awaiting confirmation.", "/services"), ...(services.some((service) => service.publication === "approved") ? {} : { robots: { index: false, follow: false } }) };

