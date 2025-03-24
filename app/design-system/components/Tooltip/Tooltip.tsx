import { forwardRef } from "react";

interface TooltipProps {
  children: React.ReactNode;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        role="dialog"
        className="bg-lighter focus-visible:border-primary absolute top-7 left-0 z-10 flex min-w-48 flex-col gap-3 rounded-md border-1 border-solid border-gray-200 p-4 shadow-md focus:outline-none"
      >
        {children}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
