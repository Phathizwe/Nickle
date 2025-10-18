import React from 'react';
import { Button } from "../../ui/button";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../../lib/utils";

const VerticalSliderWithLabel = ({ 
  value, 
  onChange, 
  color, 
  isDisabled,
  label,
  amount,
  icon: Icon,
  onCalculate,
  isCalculatable
}) => (
  <div className="flex flex-col items-center space-y-4 min-w-[100px]">
    {/* Icon and Label */}
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
        {Icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {amount && (
        <span className="text-xs text-gray-600">{amount}</span>
      )}
    </div>

    {/* Vertical Slider */}
    <div className="h-64 flex flex-col items-center relative">
      {/* Percentage Markers */}
      <div className="absolute -left-6 h-full flex flex-col justify-between text-xs text-gray-500">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      {/* Custom Vertical Slider */}
      <div className="relative h-full py-3 mx-4">
        {/* Slider Track Background (Groove) */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[3px] h-full rounded-full bg-gray-200"
          style={{
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              ${color}33,
              ${color}33 2px,
              transparent 2px,
              transparent 8px
            )`
          }}
        />

        <SliderPrimitive.Root
          className={cn(
            "relative flex items-center touch-none select-none h-full w-5",
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          )}
          value={[value]}
          onValueChange={onChange}
          orientation="vertical"
          min={0}
          max={100}
          step={1}
          disabled={isDisabled}
        >
          <SliderPrimitive.Track className="relative grow rounded-full w-[3px] bg-transparent">
            <SliderPrimitive.Range 
              className="absolute w-full rounded-full"
              style={{ backgroundColor: color }} 
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              "block w-5 h-5 rounded-full border-2 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              "shadow-md hover:scale-110"
            )}
            style={{ borderColor: color }}
          />
        </SliderPrimitive.Root>
      </div>

      {/* Value Display */}
      <div className="mt-2 text-sm font-medium" style={{ color }}>
        {value}%
      </div>

      {/* Calculate Button for applicable categories */}
      {isCalculatable && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCalculate}
          className="mt-2 text-xs whitespace-nowrap"
        >
          Calculate
        </Button>
      )}
    </div>
  </div>
);

export default VerticalSliderWithLabel;