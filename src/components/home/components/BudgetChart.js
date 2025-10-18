import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../../lib/utils";

// Constants for budget categories
export const AVAILABLE_CATEGORIES = [
  { 
    name: 'Housing', 
    type: 'housing', 
    color: '#4F46E5',
    protected: true,
    editable: true,
    minPercentage: 0,
    maxPercentage: 50
  },
  { 
    name: 'Vehicle', 
    type: 'vehicle', 
    color: '#10B981',
    protected: false,
    editable: true,
    minPercentage: 0,
    maxPercentage: 20
  },
  { 
    name: 'Education', 
    type: 'education', 
    color: '#F59E0B',
    protected: false,
    editable: true,
    minPercentage: 0,
    maxPercentage: 30
  },
  { 
    name: 'Savings', 
    type: 'savings', 
    color: '#6366F1',
    protected: true,
    editable: true,
    minPercentage: 10,
    maxPercentage: 40
  },
  { 
    name: 'Groceries', 
    type: 'groceries', 
    color: '#EC4899',
    protected: true,
    editable: true,
    minPercentage: 5,
    maxPercentage: 20
  },
  { 
    name: 'Entertainment', 
    type: 'entertainment', 
    color: '#8B5CF6',
    protected: false,
    editable: true,
    minPercentage: 0,
    maxPercentage: 15
  },
  { 
    name: 'Healthcare', 
    type: 'healthcare', 
    color: '#EF4444',
    protected: true,
    editable: true,
    minPercentage: 5,
    maxPercentage: 20
  }
];

// Category Icon Component
const CategoryIcon = ({ type }) => {
  const iconClasses = "w-6 h-6";
  
  switch (type) {
    case 'housing':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'vehicle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 15a2 2 0 100 4 2 2 0 000-4zM18 15a2 2 0 100 4 2 2 0 000-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12l2-4h12l2 4v5H4v-5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h8" />
        </svg>
      );
    case 'education':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
    case 'savings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'groceries':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'entertainment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'healthcare':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

// Responsive Slider Component
const ResponsiveSliderWithLabel = ({ 
  value, 
  onChange, 
  color, 
  isDisabled,
  label,
  amount,
  icon: Icon,
  onCalculate,
  isCalculatable,
  type
}) => (
  <div className="w-full">
    {/* Desktop (Vertical) Layout */}
    <div className="hidden md:flex flex-col items-center space-y-4 min-w-[100px]">
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

        <div className="relative h-full py-3 mx-4">
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

        <div className="mt-2 text-sm font-medium" style={{ color }}>
          {value}%
        </div>

        {isCalculatable && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCalculate}
            className="mt-2 text-xs whitespace-nowrap hover:bg-gray-100"
            style={{ 
              borderColor: color,
              color: color,
            }}
          >
            Buy it
          </Button>
        )}
      </div>
    </div>

    {/* Mobile (Horizontal) Layout */}
    <div className="md:hidden w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
            {Icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{label}</span>
            {amount && (
              <span className="text-xs text-gray-600">{amount}</span>
            )}
          </div>
        </div>
        <div className="text-sm font-medium" style={{ color }}>
          {value}%
        </div>
      </div>

      <div className="relative px-6">
        {/* Percentage Markers */}
        <div className="absolute -top-4 w-full flex justify-between text-xs text-gray-500 px-2">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>

        {/* Horizontal Slider */}
        <div className="relative w-full h-12">
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
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            )}
            value={[value]}
            onValueChange={onChange}
            min={0}
            max={100}
            step={1}
            disabled={isDisabled}
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

      {isCalculatable && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCalculate}
          className="w-full text-xs hover:bg-gray-100"
          style={{ 
            borderColor: color,
            color: color,
          }}
        >
          Buy it
        </Button>
      )}
    </div>
  </div>
);

// Main BudgetChart Component
function BudgetChart({
  categories,
  hoveredCategory,
  onHover,
  onClick,
  formatCurrency,
  netSalary,
  onUpdateCategory,
  onRemoveCategory,
  onAddCategory,
}) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const isOverBudget = totalPercentage > 100;

  const handleSliderChange = (category, newValue) => {
    onUpdateCategory(category, newValue[0]);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>Adjust the sliders to allocate your budget</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {onAddCategory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="whitespace-nowrap"
              >
                Add Category
              </Button>
            )}
            <div className={`text-right ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
              <div className="text-sm font-medium">Total Allocation</div>
              <div className="text-lg font-bold">{totalPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {showAddCategory && AVAILABLE_CATEGORIES && (
          <div className="mt-4 p-4 border border-dashed rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AVAILABLE_CATEGORIES
                .filter(cat => !categories.some(existing => existing.name === cat.name))
                .map((category) => (
                  <Button
                    key={category.name}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddCategory(category);
                      setShowAddCategory(false);
                    }}
                    className="text-xs md:text-sm justify-start"
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-8">
          {/* Mobile Categories List */}
          <div className="w-full md:hidden space-y-6">
            {categories.map((category) => (
              <div key={category.name} className="relative">
                {onRemoveCategory && !category.protected && (
                  <button
                    onClick={() => onRemoveCategory(category)}
                    className="absolute -top-2 right-0 w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 text-gray-500 hover:text-red-500 flex items-center justify-center z-10"
                    aria-label="Remove category"
                  >
                    ×
                  </button>
                )}
                <ResponsiveSliderWithLabel
                  value={category.percentage}
                  onChange={(value) => handleSliderChange(category, value)}
                  color={category.color}
                  isDisabled={!category.editable}
                  label={category.name}
                  amount={netSalary ? formatCurrency(netSalary * (category.percentage / 100)) : null}
                  icon={<CategoryIcon type={category.type} />}
                  onCalculate={() => onClick(category)}
                  isCalculatable={category.type === 'vehicle' || category.type === 'housing'}
                  type={category.type}
                />
              </div>
            ))}
          </div>

          {/* Desktop Categories List */}
          <div className="hidden md:block w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="flex gap-8 min-w-max pb-2">
              {categories.map((category) => (
                <div key={category.name} className="relative">
                  {onRemoveCategory && !category.protected && (
                    <button
                      onClick={() => onRemoveCategory(category)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 text-gray-500 hover:text-red-500 flex items-center justify-center z-10"
                      aria-label="Remove category"
                    >
                      ×
                    </button>
                  )}
                  <ResponsiveSliderWithLabel
                    value={category.percentage}
                    onChange={(value) => handleSliderChange(category, value)}
                    color={category.color}
                    isDisabled={!category.editable}
                    label={category.name}
                    amount={netSalary ? formatCurrency(netSalary * (category.percentage / 100)) : null}
                    icon={<CategoryIcon type={category.type} />}
                    onCalculate={() => onClick(category)}
                    isCalculatable={category.type === 'vehicle' || category.type === 'housing'}
                    type={category.type}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  onMouseEnter={(_, index) => onHover(index)}
                  onMouseLeave={() => onHover(null)}
                  onClick={(_, index) => onClick(categories[index])}
                >
                  {categories.map((category, index) => (
                    <Cell
                      key={category.name}
                      fill={category.color}
                      opacity={hoveredCategory === index ? 1 : 0.8}
                      stroke={hoveredCategory === index ? '#fff' : 'none'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length && netSalary) {
                      const data = payload[0].payload;
                      const amount = (parseFloat(netSalary) * (data.percentage / 100));
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-gray-600">{data.percentage.toFixed(1)}% of income</p>
                          <p className="text-lg font-bold">{formatCurrency(amount)}</p>
                          {(data.type === 'vehicle' || data.type === 'housing') && (
                            <p className="text-xs text-blue-600 mt-1">Click to calculate</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {isOverBudget && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Total allocation exceeds 100%</span>
              </div>
              <p className="text-sm text-red-500 mt-1">
                Please adjust your allocations to ensure the total does not exceed 100% of your income.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetChart;