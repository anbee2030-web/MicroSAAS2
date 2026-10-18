import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse" | "ghost" | "danger" | "dangerSolid" | "sidebar";
type Size = "md" | "sm";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200",
    size === "md" ? "h-11 px-4 text-sm" : "h-9 px-3 text-sm",
    variant === "primary" && "bg-pine text-surface hover:bg-pine-bright",
    variant === "secondary" && "border border-line bg-surface text-ink hover:border-brass",
    variant === "inverse" && "bg-surface text-pine hover:bg-white",
    variant === "ghost" && "text-ink hover:bg-paper-deep",
    variant === "danger" && "text-danger hover:bg-danger-soft",
    variant === "dangerSolid" && "bg-danger text-surface hover:bg-[#732f28]",
    variant === "sidebar" && "justify-start text-sidebar-muted hover:bg-white/5 hover:text-surface",
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  ref?: React.Ref<HTMLButtonElement>;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
