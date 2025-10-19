import React, { useState } from 'react';
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { formatCurrency } from '../utils/formatters';
import SearchForVehicleWithinBudget from './SearchForVehicleWithinBudget';
import { Search, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Car } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const ResultsEnhanced = ({
  affordableCarPrice,
  estimatedMonthlyRepayment,
  estimatedMonthlyExpenses,
  netSalary,
  budgetPercentage,
  deposit,
  interestRate,
  term,
}) => {
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);

  // Calculate key metrics
  const targetBudget = parseFloat(netSalary || 0) * (budgetPercentage / 100);
  const totalMonthlyCost = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
  const remainingBudget = targetBudget - totalMonthlyCost;
  const budgetUtilization = (totalMonthlyCost / targetBudget) * 100;
  const isWithinBudget = totalMonthlyCost <= targetBudget;

  // Data for pie chart
  const chartData = [
    { name: 'Monthly Repayment', value: estimatedMonthlyRepayment, color: '#3b82f6' },
    { name: 'Monthly Expenses', value: estimatedMonthlyExpenses, color: '#10b981' },
    { name: 'Remaining Budget', value: Math.max(0, remainingBudget), color: '#e5e7eb' },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Main Results Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Your Vehicle Budget</h3>
                <p className="text-sm text-gray-600">Based on your financial profile</p>
              </div>
            </div>

            {/* Maximum Car Budget - Hero Number */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Maximum Car Budget</p>
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {formatCurrency(affordableCarPrice)}
              </p>
              <p className="text-sm text-gray-600">
                With {formatCurrency(deposit)} deposit at {interestRate}% over {term} months
              </p>
            </div>

            {/* Budget Status Indicator */}
            <div className={`rounded-lg p-4 mb-6 ${
              isWithinBudget 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                {isWithinBudget ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${
                    isWithinBudget ? 'text-green-900' : 'text-amber-900'
                  }`}>
                    {isWithinBudget 
                      ? '✓ Within Your Budget' 
                      : '⚠ Slightly Over Budget'}
                  </p>
                  <p className={`text-sm ${
                    isWithinBudget ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {isWithinBudget
                      ? `You're using ${budgetUtilization.toFixed(0)}% of your ${budgetPercentage}% vehicle budget`
                      : `Consider adjusting your inputs to stay within your ${budgetPercentage}% budget`}
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Monthly Repayment</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(estimatedMonthlyRepayment)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Monthly Expenses</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(estimatedMonthlyExpenses)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Total Monthly Cost</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalMonthlyCost)}
                </p>
              </div>
            </div>

            {/* Budget Comparison */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Budget Target</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(targetBudget)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Total Cost</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(totalMonthlyCost)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
                  </span>
                  <span className={`text-sm font-bold ${
                    remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {remainingBudget >= 0 ? (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {formatCurrency(remainingBudget)}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" />
                        {formatCurrency(Math.abs(remainingBudget))}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Breakdown Card */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Monthly Cost Breakdown</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button 
          onClick={() => setShowVehicleSearch(!showVehicleSearch)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12 text-base font-semibold"
        >
          <Search className="h-5 w-5" />
          {showVehicleSearch ? 'Hide Vehicle Search' : 'Search for Vehicles Within Budget'}
        </Button>
      </div>

      {showVehicleSearch && (
        <div className="mt-6">
          <SearchForVehicleWithinBudget affordableCarPrice={affordableCarPrice} />
        </div>
      )}
    </>
  );
};

export default ResultsEnhanced;

