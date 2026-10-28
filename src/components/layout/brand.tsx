import Image from "next/image";
import Link from "next/link";

interface BrandProps {
  theme?: "dark" | "light";
  className?: string;
}

export function Brand({ theme = "dark", className = "" }: BrandProps) {
  const isLight = theme === "light";
  return (
    <Link
      prefetch={false}
      href="/"
      className={`brand ${isLight ? "brand-light" : ""} ${className}`}
      aria-label="MOTEKRA home"
    >
      <Image
        src="/assets/brand/motekra-mark.png"
        alt=""
        width={40}
        height={40}
        priority
        className="brand-mark-img"
      />
      <span className="brand-wordmark-wrap">
        <Image
          src={isLight ? "/assets/brand/motekra-wordmark-white.png" : "/assets/brand/motekra-wordmark.png"}
          alt="MOTEKRA"
          width={142}
          height={13}
          priority
          className="brand-wordmark-img"
        />
        <span className="sr-only">MOTEKRA</span>
      </span>
    </Link>
  );
}

