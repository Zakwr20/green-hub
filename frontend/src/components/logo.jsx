import * as React from "react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, align = "left", className, ...props }) {
  const alignment =
    align === "center"
      ? "justify-center text-center"
      : "justify-start text-left";

  return (
    <h1
      className={cn(
        "italic font-bold text-xl font-heading",
        alignment,
        className
      )}
      {...props}
    >
      G
    </h1>
  );
}
