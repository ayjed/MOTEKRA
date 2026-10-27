"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="status-page"><div className="container"><p className="eyebrow">Something interrupted the page</p><h1>Let’s try<br /><span className="accent">that again.</span></h1><p className="lead" role="alert">This page could not load. Try again or return to Home.</p><div className="button-group"><button className="button button-primary" onClick={reset}>Try again</button><Link prefetch={false} href="/" className="button button-secondary">Back to Home</Link></div></div></section>;
}
