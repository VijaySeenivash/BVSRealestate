import React from "react";
import { CheckCircle2, Clock, Lock, ShieldAlert } from "lucide-react";
import { PropertyStatus } from "@/config/site";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PropertyStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const styles = {
    AVAILABLE: "bg-emerald-600/95 text-white border-emerald-500/50 shadow-emerald-900/20",
    RESERVED: "bg-amber-500/95 text-navy-950 font-extrabold border-amber-400/60 shadow-amber-900/20",
    SOLD: "bg-slate-700/95 text-slate-200 border-slate-600/50 shadow-slate-900/20",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-black tracking-wider uppercase rounded-full shadow-sm backdrop-blur-md border",
        styles[status],
        sizeClasses[size],
        className
      )}
    >
      {status === "AVAILABLE" && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}

      {status === "RESERVED" && (
        <Clock className="h-3 w-3 mr-1 text-navy-900 stroke-[2.5]" />
      )}

      {status === "SOLD" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
      )}

      <span>{status}</span>
    </span>
  );
}
