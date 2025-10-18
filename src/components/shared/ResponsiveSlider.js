import React from 'react';
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";
import { Input } from "../../components/ui/input";

export function ResponsiveSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  formatLabel,
  color = "#4F46E5",
  disabled = false,
  showMarks = true,
  marks = [0, 25, 50, 75, 100],
  prefix = '',
  suffix = ''
}) {
  const formattedValue = formatValue ? formatValue(value) : value;
  const displayLabel = formatLabel ? formatLabel(label) : label;

  return (
    <div className="w-full space-y-4">
      {/* Label and Value Display */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{displayLabel}</span>
        <span className="text-sm font-medium" style={{ color }}>
          {prefix}{formattedValue}{suffix}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative px-2 py-4">
        {showMarks && (
          <div className="absolute -top-1 w-full flex justify-between text-xs text-gray-500">
            {marks.map((mark) => (
              <span key={mark}>{prefix}{mark}{suffix}</span>
            ))}
          </div>
        )}

        <div className="relative w-full h-12">
          {/* Track Background with Markers */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full h-[3px] rounded-full bg-gray-200"
            style={{
              backgroundImage: `repeating-linear-gradient(
                to right,
                ${color}33,
                ${color}33 2px,
                transparent 2px,
                transparent 8px
              )`
            }}
          />

          <SliderPrimitive.Root
            className={cn(
              "relative flex h-5 w-full touch-none select-none items-center",
              disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
            value={[value]}
            onValueChange={(newValue) => onChange(newValue[0])}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          >
            <SliderPrimitive.Track className="relative h-[3px] w-full grow rounded-full bg-transparent">
              <SliderPrimitive.Range 
                className="absolute h-full rounded-full"
                style={{ backgroundColor: color }} 
              />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
              className={cn(
                "block h-5 w-5 rounded-full border-2 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "shadow-md hover:scale-110"
              )}
              style={{ borderColor: color }}
            />
          </SliderPrimitive.Root>
        </div>
      </div>
    </div>
  );
}