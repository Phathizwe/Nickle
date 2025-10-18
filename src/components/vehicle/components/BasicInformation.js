import React from 'react';
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { formatCurrency } from '../utils/formatters';

export const BasicInformation = ({
  netSalary,
  setNetSalary,
  budgetPercentage,
  setBudgetPercentage,
  currentPercentage,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="netSalary">Monthly Net Salary</Label>
        <Input
          id="netSalary"
          type="number"
          value={netSalary}
          onChange={(e) => setNetSalary(e.target.value)}
          placeholder="Enter your net salary"
        />
      </div>

      <div>
        <Label>Target Budget Percentage</Label>
        <div className="flex items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="number"
              value={Math.round((parseFloat(netSalary) * budgetPercentage) / 100) || 0}
              onChange={(e) => {
                const newAmount = parseFloat(e.target.value) || 0;
                const newPercentage = (newAmount / parseFloat(netSalary)) * 100;
                setBudgetPercentage(Math.min(Math.max(newPercentage, 0), 50));
              }}
              className="w-32 text-right"
              disabled={!netSalary}
            />
            <span className="text-sm text-gray-500">
              ({budgetPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
        <Slider
          value={[budgetPercentage]}
          onValueChange={(value) => setBudgetPercentage(value[0])}
          min={0}
          max={50}
          step={0.1}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Current: {currentPercentage}% of net salary
        </p>
      </div>
    </div>
  );
};

export default BasicInformation;