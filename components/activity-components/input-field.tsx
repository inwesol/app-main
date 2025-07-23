import React from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  placeholder = "",
  className,
  type = "text",
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full px-4 py-3 border border-slate-300 rounded-lg outline-none",
        "transition-all duration-200",
        "text-slate-700 placeholder-slate-400",
        "bg-white/80 backdrop-blur-sm",
        "hover:border-slate-400",
        className
      )}
    />
  );
};
