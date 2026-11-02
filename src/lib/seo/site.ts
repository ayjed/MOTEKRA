import type { Metadata } from "next";

export function getSiteOrigin(
  value = process.env.SITE_URL ?? (process.env.NODE_ENV === "production" ? "https://www.motekra.com" : "")
): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export function isIndexable(): boolean {
  if (process.env.SITE_INDEXABLE !== undefined) {
    return process.env.SITE_INDEXABLE === "true" && getSiteOrigin() !== null;
  }
  return process.env.NODE_ENV === "production" && getSiteOrigin() !== null;
}

export function robotsMetadata(indexable = isIndexable()): Metadata["robots"] {
  if (!indexable) {
    return {
      index: false,
      follow: false,
    };
  }
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  };
}

export function absoluteSiteUrl(path: string): string | null {
  const origin = getSiteOrigin();
  return origin && path.startsWith("/") && !path.startsWith("//") ? `${origin}${path}` : null;
}

export function socialImageFor(path: string): string {
  return `/assets/social/${
    path === "/"
      ? "home"
      : path.startsWith("/insights/")
        ? "insights"
        : path.startsWith("/work/")
          ? "work"
          : path.startsWith("/team/")
            ? "founder"
            : path.slice(1).replaceAll("/", "-")
  }.png`;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const origin = getSiteOrigin();
  const url = absoluteSiteUrl(path);
  const image = absoluteSiteUrl(socialImageFor(path));
  const fullTitle = `${title} | MOTEKRA`;

  return {
    title: path === "/" ? { absolute: fullTitle } : title,
    description,
    ...(origin ? { metadataBase: new URL(origin) } : {}),
    alternates: url ? { canonical: url } : undefined,
    robots: robotsMetadata(),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: "MOTEKRA",
      locale: "en",
      ...(url ? { url } : {}),
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: `MOTEKRA — ${title}` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [{ url: image, alt: `MOTEKRA — ${title}` }] } : {}),
    },
  };
}

