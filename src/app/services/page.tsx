import { services } from "@/content/services";
import { pageMetadata } from "@/lib/seo/site";
export { ServicesPage as default } from "@/components/services/services-page";
export const metadata = {
  ...pageMetadata(
    "Services - Digital Product Design & Engineering",
    "Explore MOTEKRA's digital services across UI/UX design, web development, mobile app development, product strategy, and brand identity systems.",
    "/services"
  ),
  ...(services.some((service) => service.publication === "approved")
    ? {}
    : { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }),
};

