import Link from "next/link";
import { type ReactNode } from "react";

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
}) {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent",
    secondary:
      "bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-200",
    ghost: "bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent",
  };

  const classes = `inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  color = "zinc",
}: {
  children: ReactNode;
  color?: "zinc" | "indigo" | "green" | "amber" | "violet";
}) {
  const colors = {
    zinc: "bg-zinc-100 text-zinc-700",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function Input({
  label,
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  error,
  children,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className={`flex items-start gap-3 text-sm text-zinc-700 ${className}`}>
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          {...props}
        />
        <span>
          {label}
          {children}
        </span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
