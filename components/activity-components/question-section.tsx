import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({
  title,
  subtitle,
  children,
  className,
  icon,
}) => {
  return (
    <Card
      className={cn(
        "mb-6 bg-gradient-to-br from-primary-green-50/50 to-primary-blue-50/50 border-primary-green-100/60",
        className
      )}
    >
      <CardHeader>
        <div>
          <div className="flex gap-3 items-center">
            {icon && (
              <div className="p-2 bg-primary-green-100 rounded-lg">{icon}</div>
            )}
            <CardTitle className="text-primary-green-600 text-lg sm:text-xl">
              {title}
            </CardTitle>
          </div>
          <div>
            {subtitle && (
              <p className="text-sm text-slate-600 leading-relaxed mt-2">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
