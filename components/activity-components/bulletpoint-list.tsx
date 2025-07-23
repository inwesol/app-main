import React from "react";
import { Circle, Plus, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulletPointItem {
  id: string;
  title: string;
  description: string;
}

interface BulletPointListProps {
  items: BulletPointItem[];
  onItemChange: (
    id: string,
    field: "title" | "description",
    value: string
  ) => void;
  onAddItem: () => void;
  onDeleteItem?: (id: string) => void;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
  maxItems?: number;
}

export const BulletPointList: React.FC<BulletPointListProps> = ({
  items,
  onItemChange,
  onAddItem,
  onDeleteItem,
  titlePlaceholder = "Enter title...",
  descriptionPlaceholder = "Enter description...",
  maxItems = 3,
}) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="border border-emerald-200/60 rounded-lg p-4 bg-gradient-to-r from-emerald-50/30 to-cyan-50/30 backdrop-blur-sm relative group"
        >
          <div className="flex items-center gap-3 mb-3 justify-between w-full">
            {/* <Circle className="size-2 fill-emerald-500 text-emerald-500 shrink-0 mt-2" /> */}
            <input
              type="text"
              value={item.title}
              onChange={(e) => onItemChange(item.id, "title", e.target.value)}
              placeholder={`${titlePlaceholder} ${index + 1}`}
              className={cn(
                "flex-1 px-3 py-2 border border-emerald-200 rounded-md outline-none",

                "transition-all duration-200",
                "text-slate-700 placeholder-slate-400",
                "bg-white/60 backdrop-blur-sm"
              )}
            />
            {/* Delete Button */}
            {onDeleteItem && (
              <button
                onClick={() => onDeleteItem(item.id)}
                className={cn(
                  "w-8 h-8 rounded-full",
                  "bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700",
                  "flex items-center justify-center",
                  "opacity-0 group-hover:opacity-100 transition-all duration-200",
                  "hover:scale-110 shadow-sm hover:shadow-md"
                )}
                title="Delete this person"
              >
                <Trash className="size-4" />
              </button>
            )}
          </div>
          <textarea
            value={item.description}
            onChange={(e) =>
              onItemChange(item.id, "description", e.target.value)
            }
            placeholder={descriptionPlaceholder}
            rows={3}
            className={cn(
              "w-full px-3 py-2 border border-primary-green-200 rounded-md",
              "transition-all duration-200 resize-none outline-none",
              "text-slate-700 placeholder-slate-400",
              "bg-white/60 backdrop-blur-sm"
            )}
          />
        </div>
      ))}

      {items.length < maxItems && (
        <button
          onClick={onAddItem}
          className={cn(
            "w-full py-3 border-2 border-dashed border-primary-green-300/60 rounded-lg",
            "text-primary-green-600 hover:border-primary-green-400 hover:text-primary-green-700",
            "transition-all duration-200 hover:bg-primary-green-50/30",
            "flex items-center justify-center gap-2"
          )}
        >
          <Plus className="size-4" />
          Add another person
        </button>
      )}
    </div>
  );
};
