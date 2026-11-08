/**
 * Spinner — accessible loading indicator in multiple sizes.
 */
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
};

export default function Spinner({ size = "md", className, label = "Loading…" }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <Loader2 size={sizeMap[size] ?? sizeMap.md} className="animate-spin text-saffron-500" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

