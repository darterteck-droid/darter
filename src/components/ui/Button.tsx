import Link from "next/link";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
};

const variants = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-[0_4px_16px_rgba(140,104,80,0.18)] hover:shadow-[0_8px_28px_rgba(140,104,80,0.28)] transition-all focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-surface-sunken transition-colors focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ghost:
    "border border-accent-500 text-accent-600 hover:bg-accent-100 hover:border-accent-600 transition-all focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
