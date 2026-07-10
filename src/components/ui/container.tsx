import { type ReactNode } from "react";

const sizes = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  form: "max-w-xl",
  wide: "max-w-2xl",
} as const;

export function Container({
  children,
  className = "",
  size = "default",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  size?: keyof typeof sizes;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={`mx-auto px-4 py-8 sm:px-6 sm:py-12 ${sizes[size]} ${className}`}
    >
      {children}
    </Tag>
  );
}
