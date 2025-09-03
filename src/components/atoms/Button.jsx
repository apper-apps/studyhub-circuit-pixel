import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false, 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    accent: "bg-gradient-to-r from-accent to-yellow-500 text-white shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-success to-emerald-600 text-white shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;