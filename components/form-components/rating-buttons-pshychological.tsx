"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const allowedAnswers = [
  "Strongly Disagree",
  "Somewhat Disagree",
  "A Little Disagree",
  "Neutral",
  "A Little Agree",
  "Somewhat Agree",
  "Strongly Agree",
] as const;

type AllowedAnswer = (typeof allowedAnswers)[number];

interface RatingButtonsPsychologicalProps {
  value?: AllowedAnswer;
  onChange: (val: AllowedAnswer) => void;
  disabled?: boolean;
  lowLabel: string;
  highLabel: string;
}

export default function RatingButtonsPsychological({
  value,
  onChange,
  disabled,
  lowLabel,
  highLabel,
}: RatingButtonsPsychologicalProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs md:text-sm text-slate-600 font-medium">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-3">
        {allowedAnswers.map((option) => (
          <Button
            key={option}
            type="button"
            variant={value === option ? "default" : "outline"}
            onClick={() => onChange(option)}
            disabled={disabled}
            className={cn(
              "flex-1 h-12 md:h-10 text-sm font-medium transition-all duration-200 rounded-full",
              value === option
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-102"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 hover:shadow-md"
            )}
          >
            <span className="text-xs leading-none text-wrap">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
