// src/components/home/components/CategoryList.js
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Slider } from "../../ui/slider";

export const CategoryList = ({
  categories,
  netSalary,
  onUpdateCategory,
  onCategoryClick,
  updateCategoryAmount,
  formatCurrency,
}) => {
  const getTotalPercentage = (categories) => {
    return categories.reduce((sum, cat) => sum + cat.percentage, 0);
  };

  const handleSliderChange = (category, newValue) => {
    onUpdateCategory(category, newValue[0]);
  };

  const handleAmountChange = (category, newAmount) => {
    if (!netSalary) return;
    const newPercentage = (newAmount / netSalary) * 100;
    onUpdateCategory(category, newPercentage);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <CardTitle className="text-lg md:text-xl">Budget Breakdown</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total: {formatCurrency(netSalary)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => {
            const amount = netSalary ? (parseFloat(netSalary) * (category.percentage / 100)) : 0;
            return (
              <div
                key={category.name}
                className="p-3 md:p-4 rounded-lg transition-colors bg-gray-50"
              >
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
                        onChange={(e) => handleAmountChange(category, parseFloat(e.target.value))}
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
                    onValueChange={(value) => handleSliderChange(category, value)}
                    min={0}
                    max={100}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Allocation</span>
              <span className={getTotalPercentage(categories) > 100 ? 'text-red-500' : 'text-gray-900'}>
                {getTotalPercentage(categories).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;