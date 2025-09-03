import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    outline: "text-gray-700 border border-gray-300 bg-white"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;