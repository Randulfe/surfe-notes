import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary";
  children: string;
}

export const Button = ({
  variant = "primary",
  children,
  ...props
}: ButtonProps) => {
  if (typeof children !== "string") {
    children = "";
  }
  return (
    <button
      {...props}
      className={`ring-offset-background focus-visible:ring-ring text-md inline-flex items-center justify-center gap-2 rounded-md p-4 font-semibold whitespace-nowrap transition-colors hover:cursor-pointer focus-visible:ring-0 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variant === "primary" ? "bg-primary text-lighter hover:bg-primary/90" : "bg-secondary text-primary hover:bg-secondary/80"}`}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
};
