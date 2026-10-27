import { ButtonLink, Eyebrow } from "@/components/ui/primitives";

export default function NotFound() {
  return <section className="status-page"><div className="container"><Eyebrow>404 / page unavailable</Eyebrow><h1>A different<br /><span className="accent">direction.</span></h1><p className="lead">This page does not exist or its content has not been approved for publication.</p><ButtonLink href="/">Back to Home</ButtonLink></div></section>;
}
