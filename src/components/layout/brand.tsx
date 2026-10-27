import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return <Link prefetch={false} href="/" className="brand" aria-label="MOTEKRA home">
    <Image src="/assets/brand/motekra-mark.png" alt="" width={48} height={48} priority />
    <span>MOTEKRA</span>
  </Link>;
}
