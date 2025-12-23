// src/components/ui/label.jsx
import * as React from "react";
import { cn } from "../ui/libs/utils";

export const Label = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <label
      className={cn("text-sm font-medium leading-none", className)}
      ref={ref}
      {...props}
    />
  )
);
Label.displayName = "Label";