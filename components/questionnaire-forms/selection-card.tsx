// Custom Selection Card Component
import { CheckCircle } from "lucide-react";
export const SelectionCard = ({
  value,
  currentValue,
  onChange,
  icon: Icon,
  title,
  description,
  color = "blue",
}: {
  value: string;
  currentValue: string;
  onChange: (value: string) => void;
  icon: any;
  title: string;
  description?: string;
  color?: "blue" | "green" | "purple" | "orange";
}) => {
  const isSelected = currentValue === value;

  const colorClasses = {
    blue: {
      selected:
        "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25",
      unselected:
        "bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    green: {
      selected:
        "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-500 shadow-lg shadow-green-500/25",
      unselected:
        "bg-white hover:bg-green-50 border-slate-200 hover:border-green-300 text-slate-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    purple: {
      selected:
        "bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/25",
      unselected:
        "bg-white hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    orange: {
      selected:
        "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/25",
      unselected:
        "bg-white hover:bg-orange-50 border-slate-200 hover:border-orange-300 text-slate-700",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  };

  return (
    <div
      onClick={() => onChange(value)}
      className={`
        relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
        ${
          isSelected
            ? colorClasses[color].selected
            : colorClasses[color].unselected
        }
      `}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 size-6 bg-white rounded-full flex items-center justify-center shadow-md">
          <CheckCircle className="size-4 text-green-500" />
        </div>
      )}
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div
          className={`
          size-10 sm:size-12 rounded-xl flex items-center justify-center transition-all duration-300
          ${isSelected ? "bg-white/20" : colorClasses[color].iconBg}
        `}
        >
          <Icon
            className={`size-5 sm:size-6 ${
              isSelected ? "text-white" : colorClasses[color].iconColor
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-sm sm:text-base mb-1 ${
              isSelected ? "text-white" : "text-slate-800"
            }`}
          >
            {title}
          </h4>
          {description && (
            <p
              className={`text-xs sm:text-sm ${
                isSelected ? "text-white/80" : "text-slate-500"
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
