import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib/utils"

const ModernSlider = React.forwardRef(({ className, color = "blue", showValue = false, value, onValueChange, formatValue, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    setLocalValue(newValue);
    onValueChange?.(newValue);
  };

  const colorClasses = {
    blue: {
      track: "bg-blue-100",
      range: "bg-gradient-to-r from-blue-500 to-blue-600",
      thumb: "border-blue-600 bg-white shadow-blue-200",
      glow: "shadow-blue-400"
    },
    green: {
      track: "bg-green-100",
      range: "bg-gradient-to-r from-green-500 to-green-600",
      thumb: "border-green-600 bg-white shadow-green-200",
      glow: "shadow-green-400"
    },
    purple: {
      track: "bg-purple-100",
      range: "bg-gradient-to-r from-purple-500 to-purple-600",
      thumb: "border-purple-600 bg-white shadow-purple-200",
      glow: "shadow-purple-400"
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="relative">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={localValue}
        onValueChange={handleValueChange}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        {...props}
      >
        <SliderPrimitive.Track className={cn(
          "relative h-3 w-full grow overflow-hidden rounded-full transition-all",
          colors.track
        )}>
          <SliderPrimitive.Range className={cn(
            "absolute h-full transition-all",
            colors.range,
            isDragging && "shadow-lg"
          )} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(
          "block h-6 w-6 rounded-full border-3 transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-grab active:cursor-grabbing",
          colors.thumb,
          isDragging ? cn("scale-125 shadow-lg", colors.glow) : "shadow-md"
        )} />
      </SliderPrimitive.Root>
      
      {showValue && formatValue && (
        <div className={cn(
          "absolute -top-8 left-1/2 transform -translate-x-1/2",
          "bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-semibold",
          "transition-all duration-200",
          isDragging ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}>
          {formatValue(localValue[0])}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  )
})
ModernSlider.displayName = "ModernSlider"

export { ModernSlider }

