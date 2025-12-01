// src/components/ui/button.jsx
import * as React from "react";
import { cn } from "../ui/libs/utils";

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-white hover:bg-primary-700",
      outline: "border border-gray-300  hover:bg-gray-50 text-gray-900",
      ghost: "hover:bg-gray-100 text-gray-900",
    };
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";