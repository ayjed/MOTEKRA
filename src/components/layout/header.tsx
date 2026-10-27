import { Brand } from "./brand";
import { ButtonLink } from "../ui/primitives";
import { Navigation } from "./navigation";

export function Header() {
  return <header className="site-header"><div className="container header-inner">
    <Brand />
    <Navigation />
    <div className="header-actions"><ButtonLink href="/contact">Start a Project</ButtonLink></div>
  </div></header>;
}
