import { Sparkles } from "lucide-react";
import { ComponentType, ReactElement } from "react";

interface HeaderProps {
  headerIcon: ComponentType<{ className?: string }>;
  headerText: string;
  headerDescription: string;
}
export default function Header({
  headerIcon: HeaderIcon,
  headerText,
  headerDescription,
}: HeaderProps) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="relative inline-flex items-center justify-center size-12 sm:size-16 bg-gradient-to-r from-primary-blue-500 to-primary-green-500 rounded-2xl sm:rounded-3xl mb-3 sm:mb-4  shadow-lg hover:scale-105 transition-transform duration-300">
        <HeaderIcon className="size-5 sm:size-8 text-white" />
        <div className="absolute -top-2 -right-2 size-6 bg-white rounded-full flex items-center justify-center shadow-md sm:size-8 sm:-top-3 sm:-right-3">
          <Sparkles className="size-3 sm:size-4 text-primary-blue-500" />
        </div>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-blue-700 to-primary-green-700 bg-clip-text text-transparent mb-3 sm:mb-4">
        {headerText}
      </h1>
      <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
        {headerDescription}
      </p>
    </div>
  );
}
