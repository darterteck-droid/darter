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
    "bg-accent-400 text-background hover:bg-accent-300 shadow-[0_0_20px_rgba(201,165,144,0.15)] hover:shadow-[0_0_30px_rgba(201,165,144,0.25)] transition-all",
  secondary:
    "bg-surface-elevated text-text-primary hover:bg-border transition-colors",
  ghost:
    "border border-accent-400/50 text-accent-400 hover:border-accent-400 hover:bg-accent-400/10 transition-all",
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
