"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{ margin: 32, color: "#08152B", fontFamily: "Arial, sans-serif" }}><main><h1>This page could not load.</h1><p>Try again to reload MOTEKRA.</p><button onClick={reset} style={{ padding: 16 }}>Try again</button><p><Link prefetch={false} href="/">Return to Home</Link></p></main></body></html>;
}
