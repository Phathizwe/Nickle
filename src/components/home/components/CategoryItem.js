// src/components/home/components/CategoryItem.js
import React from 'react';
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Slider } from "../../ui/slider";

export const CategoryItem = ({
  category,
  amount,
  netSalary,
  onUpdateCategory,
  onCategoryClick,
  updateCategoryAmount,
}) => (
  <div className="p-3 md:p-4 rounded-lg transition-colors bg-gray-50">
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 md:w-4 md:h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium text-sm md:text-base">{category.name}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ml-5 md:ml-auto">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={Math.round(amount)}
            onChange={(e) => updateCategoryAmount(category, parseFloat(e.target.value))}
            className="w-24 md:w-32 text-right text-sm md:text-base"
            disabled={!netSalary}
          />
          <span className="text-xs md:text-sm text-gray-500">
            ({category.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(category.type === 'vehicle' || category.type === 'housing') && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-sm whitespace-nowrap"
              onClick={() => onCategoryClick(category)}
            >
              Buy it
            </Button>
          )}
        </div>
      </div>
    </div>
    <div className="mt-2">
      <Slider
        value={[category.percentage]}
        onValueChange={(value) => onUpdateCategory(category, value[0])}
        min={0}
        max={100}
        step={0.1}
        className="mt-2"
      />
    </div>
  </div>
);