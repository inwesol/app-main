import { CheckCircle } from "lucide-react";

// Compact Selection Button Component
export const CompactSelectionButton = ({
  value,
  currentValue,
  onChange,
  icon: Icon,
  label,
  color = "green",
}: {
  value: string;
  currentValue: string;
  onChange: (value: string) => void;
  icon: any;
  label: string;
  color?: "green" | "blue";
}) => {
  const isSelected = currentValue === value;

  const colorClasses = {
    green: {
      selected:
        "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg shadow-green-500/25",
      unselected:
        "bg-white hover:bg-green-50 border-slate-200 hover:border-green-300 text-slate-700",
      iconColor: "text-green-600",
    },
    blue: {
      selected:
        "bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 text-white border-primary-blue-200 shadow-lg shadow-blue-500/25",
      unselected:
        "bg-white hover:bg-primary-blue-50 border-slate-200 hover:border-primary-blue-300 text-slate-700",
      iconColor: "text-primary-blue-600",
    },
  };

  return (
    <div
      onClick={() => onChange(value)}
      className={`
        relative flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]
        ${
          isSelected
            ? colorClasses[color].selected
            : colorClasses[color].unselected
        }
      `}
    >
      {isSelected && (
        <div className="absolute -top-1 -right-1 size-5 bg-white rounded-full flex items-center justify-center">
          <CheckCircle className="size-3 text-green-500" />
        </div>
      )}
      <Icon
        className={`size-4 sm:size-5 ${
          isSelected ? "text-white" : colorClasses[color].iconColor
        }`}
      />
      <span
        className={`font-medium text-xs sm:text-sm ml-2 sm:ml-3 ${
          isSelected ? "text-white" : "text-slate-700"
        }`}
      >
        {label}
      </span>
    </div>
  );
};
