import type { ComponentPropsWithoutRef } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "tertiary";
  status?: "error" | "success" | "warning";
  size?: "s" | "m" | "l";
  children: string;
}

export const Button = ({
  variant = "primary",
  status = "success",
  size = "m",
  children,
  ...props
}: ButtonProps) => {
  if (typeof children !== "string") {
    children = "";
  }

  const getStatusColors = () => {
    switch (status) {
      case "error":
        return variant === "primary"
          ? "bg-red-600 text-white hover:bg-red-700"
          : variant === "secondary"
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "text-red-600 border-red-600  border-[1px] hover:bg-red-50";
      case "warning":
        return variant === "primary"
          ? "bg-yellow-500 text-white hover:bg-yellow-600"
          : variant === "secondary"
            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            : "text-yellow-600 border-yellow-600  border-[1px] hover:bg-yellow-50";
      case "success":
      default:
        return variant === "primary"
          ? "bg-primary text-lighter hover:bg-primary/90"
          : variant === "secondary"
            ? "bg-secondary text-primary hover:bg-secondary/80"
            : "text-primary border-primary border-[1px] hover:bg-light";
    }
  };

  return (
    <button
      {...props}
      className={`ring-offset-background focus-visible:ring-ring inline-flex w-full items-center justify-center gap-2 rounded-md whitespace-nowrap transition-colors hover:cursor-pointer focus-visible:ring-0 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${getStatusColors()} transition-all duration-200 ${size === "s" ? "p-2 text-sm font-normal" : size === "m" ? "text-md p-4 font-medium" : "p-6 text-lg font-semibold"}`}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
};
