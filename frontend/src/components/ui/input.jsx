// src/components/ui/input.jsx
import * as React from "react";
import { cn } from "../ui/libs/utils";

export const Input = React.forwardRef(
  ({ className = "", type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "input-base",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";