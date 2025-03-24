import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "tertiary";
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
      className={`ring-offset-background focus-visible:ring-ring text-md inline-flex w-full items-center justify-center gap-2 rounded-md p-4 font-semibold whitespace-nowrap transition-colors hover:cursor-pointer focus-visible:ring-0 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variant === "primary" ? "bg-primary text-lighter hover:bg-primary/90" : variant === "secondary" ? "bg-secondary text-primary hover:bg-secondary/80" : "text-primary border-primary hover:bg-light border-2 border-solid bg-transparent"} transition-all duration-200`}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
};
