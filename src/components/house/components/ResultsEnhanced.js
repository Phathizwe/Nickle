import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Home, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// Utility function for transfer duty calculation
const calculateTransferDuty = (propertyValue) => {
  const value = Number(propertyValue);
  
  if (value <= 1000000) return 0;
  if (value <= 1375000) return (value - 1000000) * 0.03;
  if (value <= 1925000) return 11250 + (value - 1375000) * 0.06;
  if (value <= 2475000) return 44250 + (value - 1925000) * 0.08;
  if (value <= 11000000) return 88250 + (value - 2475000) * 0.11;
  return 1026000 + (value - 11000000) * 0.13;
};

const ResultsEnhanced = ({
  affordableHousePrice = 0,
  downPayment = 0,
  estimatedMonthlyRepayment = 0,
  estimatedMonthlyExpenses = 0,
  netSalary = 0,
  bondInitiationFee = 0,
  bondRegistrationRate = 0,
  housingBudgetPercentage = 30,
  formatCurrency
}) => {
  const loanAmount = affordableHousePrice - Number(downPayment);
  const transferDuty = calculateTransferDuty(affordableHousePrice);
  const bondRegistrationCost = loanAmount * (bondRegistrationRate / 100);
  const totalMonthlyCost = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
  const incomePercentage = ((totalMonthlyCost / Number(netSalary)) * 100);
  const targetBudget = Number(netSalary) * (housingBudgetPercentage / 100);
  const remainingBudget = targetBudget - totalMonthlyCost;
  const isWithinBudget = totalMonthlyCost <= targetBudget;

  // Data for monthly cost pie chart
  const monthlyChartData = [
    { name: 'Bond Repayment', value: estimatedMonthlyRepayment, color: '#3b82f6' },
    { name: 'Monthly Expenses', value: estimatedMonthlyExpenses, color: '#10b981' },
    { name: 'Remaining Budget', value: Math.max(0, remainingBudget), color: '#e5e7eb' },
  ];

  // Data for upfront costs bar chart
  const upfrontCostsData = [
    { name: 'Down Payment', amount: Number(downPayment), color: '#3b82f6' },
    { name: 'Transfer Duty', amount: transferDuty, color: '#8b5cf6' },
    { name: 'Bond Registration', amount: bondRegistrationCost, color: '#ec4899' },
    { name: 'Bond Initiation', amount: bondInitiationFee, color: '#f59e0b' },
  ];

  const totalUpfrontCosts = upfrontCostsData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Your Home Budget</h3>
              <p className="text-sm text-gray-600">Based on your financial profile</p>
            </div>
          </div>

          {/* Affordable House Price - Hero Number */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Affordable House Price</p>
            <p className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(affordableHousePrice)}
            </p>
            <p className="text-sm text-gray-600">
              With {formatCurrency(downPayment)} down payment ({((Number(downPayment) / affordableHousePrice) * 100).toFixed(0)}%)
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
                    ? `You're using ${incomePercentage.toFixed(0)}% of your income (target: ${housingBudgetPercentage}%)`
                    : `Consider adjusting to stay within your ${housingBudgetPercentage}% housing budget`}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Costs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Monthly Bond Repayment</p>
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
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(totalMonthlyCost)}
              </p>
            </div>
          </div>

          {/* Budget Comparison */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Budget Target ({housingBudgetPercentage}% of income)</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(targetBudget)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total Monthly Cost</span>
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

      {/* Upfront Costs Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Upfront Costs Breakdown
          </CardTitle>
          <CardDescription>
            Total upfront costs: {formatCurrency(totalUpfrontCosts)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={upfrontCostsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {upfrontCostsData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
              <span className="font-bold text-gray-900">Total Upfront</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(totalUpfrontCosts)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Breakdown</CardTitle>
          <CardDescription>How your monthly housing budget is allocated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {monthlyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Considerations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Additional Costs to Consider</CardTitle>
          <CardDescription className="text-blue-700">
            Don't forget these expenses when planning your home purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Legal Fees</p>
                <p className="text-sm text-gray-600">Transfer and bond registration attorneys</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Property Inspection</p>
                <p className="text-sm text-gray-600">Professional home inspection fees</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Moving Costs</p>
                <p className="text-sm text-gray-600">Transportation and relocation expenses</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Initial Repairs</p>
                <p className="text-sm text-gray-600">Renovations and maintenance</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Furniture & Appliances</p>
                <p className="text-sm text-gray-600">Essential items for your new home</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Emergency Fund</p>
                <p className="text-sm text-gray-600">3-6 months of expenses recommended</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsEnhanced;

