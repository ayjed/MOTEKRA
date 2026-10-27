import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { organizationSchema,websiteSchema } from "@/lib/seo/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { isIndexable } from "@/lib/seo/site";
import { MotionProvider } from "@/components/motion/motion-provider";
import { RouteTransition } from "@/components/motion/route-transition";
import { CustomCursor } from "@/components/ui/custom-cursor";
import "@/styles/globals.css";
import "@/styles/motion.css";

const displayFont = localFont({ src: "../styles/fonts/manrope-latin-variable.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });

export const metadata: Metadata = {
  title: { default: "MOTEKRA | Digital products for what’s next", template: "%s | MOTEKRA" },
  description: "MOTEKRA — digital product design and development. Company and independent work, with clear attribution.",
  robots: { index: isIndexable(), follow: isIndexable() },
  icons: { icon: "/assets/brand/motekra-mark.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body id="top">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <CustomCursor />
        <JsonLd data={organizationSchema()}/>
        <JsonLd data={websiteSchema()}/>
        <MotionProvider>
          <Header />
          <RouteTransition>
            <main id="main-content" tabIndex={-1}>{children}</main>
          </RouteTransition>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
