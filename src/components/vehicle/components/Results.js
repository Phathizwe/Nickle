import React, { useState } from 'react';
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { formatCurrency } from '../utils/formatters';
import SearchForVehicleWithinBudget from './SearchForVehicleWithinBudget';
import { Search } from 'lucide-react';

export const Results = ({
  affordableCarPrice,
  estimatedMonthlyRepayment,
  estimatedMonthlyExpenses,
  netSalary,
  budgetPercentage,
}) => {
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);

  return (
    <>
      <Card className="bg-gray-50">
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Maximum Car Budget</p>
              <p className="text-2xl font-bold">{formatCurrency(affordableCarPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Monthly Repayment</p>
              <p className="text-xl">{formatCurrency(estimatedMonthlyRepayment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Expenses</p>
              <p className="text-xl">{formatCurrency(estimatedMonthlyExpenses)}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-500">Total Monthly Vehicle Costs</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(estimatedMonthlyRepayment + estimatedMonthlyExpenses)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Target: {formatCurrency(parseFloat(netSalary || 0) * (budgetPercentage / 100))}
              </p>
            </div>
            <Button 
              onClick={() => setShowVehicleSearch(!showVehicleSearch)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mt-4"
            >
              <Search className="h-4 w-4" />
              {showVehicleSearch ? 'Hide Vehicle Search' : 'Search for Vehicles Within Budget'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showVehicleSearch && (
        <SearchForVehicleWithinBudget affordableCarPrice={affordableCarPrice} />
      )}
    </>
  );
};

export default Results;