import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "../motion/tactile";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export function ButtonLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Magnetic><Link prefetch={false} href={href} className={`button ${secondary ? "button-secondary" : "button-primary"}`}>{children}<Arrow /></Link></Magnetic>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function DraftNote({ children }: { children: ReactNode }) {
  return <p className="draft-note"><span aria-hidden="true" className="status-dot" />{children}</p>;
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return <div className="empty-state"><span className="empty-symbol" aria-hidden="true">↗</span><h2>{title}</h2><p>{children}</p></div>;
}
