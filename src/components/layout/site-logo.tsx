import Image from "next/image";
import Link from "next/link";

type SiteLogoProps = {
  name: string;
  href?: string;
  showName?: boolean;
  size?: number;
};

export function SiteLogo({
  name,
  href = "/",
  showName = true,
  size = 36,
}: SiteLogoProps) {
  const content = (
    <>
      <Image
        src="/logo.png"
        alt={name}
        width={size}
        height={size}
        className="rounded-full"
        priority
      />
      {showName && (
        <span className="text-lg font-semibold text-[var(--color-text)]">{name}</span>
      )}
    </>
  );

  if (!showName) {
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label={name}>
        <Image
          src="/logo.png"
          alt={name}
          width={size}
          height={size}
          className="rounded-full"
          priority
        />
      </Link>
    );
  }

  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      {content}
    </Link>
  );
}
