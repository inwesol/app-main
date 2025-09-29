import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  className,
  id,
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        "w-full px-4 py-3 border border-slate-300 rounded-lg",
        "transition-all duration-200 resize-none",
        "text-slate-700 placeholder-slate-400",
        "bg-white/80 backdrop-blur-sm",
        "hover:border-slate-400 outline-none",
        className
      )}
    />
  );
};
