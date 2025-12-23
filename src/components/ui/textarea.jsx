// src/components/ui/textarea.jsx
import * as React from "react";
import { cn } from "../ui/libs/utils";

export const Textarea = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-300  px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";