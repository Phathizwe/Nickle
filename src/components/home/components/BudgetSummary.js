// src/components/home/components/BudgetSummary.js
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { format } from 'date-fns';

export const BudgetSummary = ({ budget, formatCurrency }) => {
  const totalBudget = Object.values(budget.data.categories)
    .reduce((sum, category) => sum + (category.percentage || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{budget.name}</CardTitle>
        <p className="text-sm text-gray-500">
          Last updated: {format(new Date(budget.updatedAt), 'PPP')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Monthly Income:</span>
            <span className="font-medium">
              {formatCurrency(budget.data.salary)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Allocated:</span>
            <span className="font-medium">
              {totalBudget.toFixed(1)}%
            </span>
          </div>
          {budget.notes && (
            <p className="text-sm text-gray-600 mt-4 pt-4 border-t">
              {budget.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};