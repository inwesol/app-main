"use client";

import React, { useState, useRef, useEffect, ComponentType } from "react";

interface SliderProps {
  // will integrate in future (pre-coaching, post-coaching)
  currentQuestionData: {
    id?: number;
    text: string;
    lowLabel: string;
    highLabel: string;
    title?: string;
    description?: string;
    color?: string;
    icon?: ComponentType<{ className?: string }>;
  };
  value: number;
  onChange: (question: string, value: number) => void;
  from: string;
  min: string;
  max: string;
}

function Slider({
  currentQuestionData,
  value,
  onChange,
  from,
  min,
  max,
}: SliderProps) {
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // custom text mapping
  const getValueText = (value: number) => {
    if (from === "psychologicalWellbeing") {
      const textMap1: { [key: number]: string } = {
        1: "Strongly Disagree",
        2: "Somewhat Disagree",
        3: "A Little Disagree",
        4: "Neutral",
        5: "A little agree",
        6: "Somewhat Agree",
        7: "Strongly Agree",
      };
      return textMap1[value];
    } else {
      const textMap2: { [key: number]: string } = {
        1: "Strongly Disagree",
        2: "Disagree",
        3: "Neutral",
        4: "Agree",
        5: "Strongly Agree",
      };
      return textMap2[value];
    }
  };

  // Calculate tooltip position based on slider value
  const updateTooltipPosition = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      console.log("slider:", slider);
      const rect = slider.getBoundingClientRect();
      console.log("rect:", rect);
      const percentage = ((value - 1) / (Number(max) - 1)) * 100;
      const thumbPosition = (percentage / 100) * (rect.width - 20) + 10; // Account for thumb width
      setTooltipPosition(thumbPosition);
    }
  };

  // Show tooltip and clear any existing hide timeout
  const showTooltipWithDelay = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  // Hide tooltip after delay
  const hideTooltipWithDelay = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 1500); // Hide after 1.5 seconds of inactivity
  };

  // Update tooltip position when value changes or on resize
  useEffect(() => {
    updateTooltipPosition();

    const handleResize = () => {
      updateTooltipPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [value]);

  const handleSliderChange = (newValue: number) => {
    onChange(currentQuestionData.text, newValue);
    showTooltipWithDelay();
  };

  const handleSliderInteraction = () => {
    showTooltipWithDelay();
  };

  const handleSliderEnd = () => {
    hideTooltipWithDelay();
  };

  return (
    <div className="space-y-6 sm:p-6 p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-slate-200 shadow-lg">
      <div className="relative">
        {/* Tooltip */}
        <div
          className={`absolute -top-16 -translate-x-1/2 transition-all duration-300 ease-out z-10 ${
            showTooltip
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          style={{ left: `${tooltipPosition}px` }}
        >
          <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg relative">
            <div className="text-center">
              <div className="font-bold text-lg">{value}</div>
              <div className="text-xs opacity-90 text-nowrap">
                {getValueText(value)}
              </div>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2">
              <div className="border-x-4 border-t-4 border-x-transparent border-t-slate-800"></div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          onMouseDown={handleSliderInteraction}
          onTouchStart={handleSliderInteraction}
          onMouseUp={handleSliderEnd}
          onTouchEnd={handleSliderEnd}
          onFocus={handleSliderInteraction}
          onBlur={handleSliderEnd}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #10b981 ${
              ((value - 1) / (Number(max) - 1)) * 100
            }%, #e2e8f0 ${
              ((value - 1) / (Number(max) - 1)) * 100
            }%, #e2e8f0 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between items-center gap-2">
        <div className="text-center">
          <div className="font-semibold text-slate-600 text-sm">
            {currentQuestionData.lowLabel}
          </div>
          <div className="text-slate-500 text-xs">(1)</div>
        </div>

        <div className="text-center sm:px-6 sm:py-3 px-3 py-1 rounded-xl bg-white/80 shadow-md text-primary-blue-600">
          <div className="font-bold text-xl sm:text-3xl">
            {value}/{max}
          </div>
          <div className="font-semibold text-sm">{getValueText(value)}</div>
        </div>

        <div className="text-center">
          <div className="font-semibold text-slate-600 text-sm">
            {currentQuestionData.highLabel}
          </div>
          <div className="text-slate-500 text-xs">({max})</div>
        </div>
      </div>
    </div>
  );
}

export default Slider;
