import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Slider } from "../../ui/slider";

// Category Icon Component
const ExpenseIcon = ({ type }) => {
  const iconClasses = "w-6 h-6";
  
  switch (type) {
    case 'insurance':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'rates':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'utility':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'maintenance':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const colorMap = {
  insurance: '#4F46E5', // Indigo
  rates: '#10B981',     // Green
  utility: '#F59E0B',   // Amber
  maintenance: '#EF4444', // Red
  default: '#6B7280'    // Gray
};

export default function MonthlyExpenses({ 
  expenses, 
  setExpenses, 
  handleAddExpense, 
  handleRemoveExpense,
  newExpense,
  setNewExpense,
  newExpenseAmount,
  setNewExpenseAmount,
  netSalary,
  budgetPercentage
}) {
  const [hoveredExpense, setHoveredExpense] = useState(null);
  
  const monthlyHousingBudget = netSalary * (budgetPercentage / 100);
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const expenseThreshold = monthlyHousingBudget * 0.5;
  const isOverExpenseThreshold = totalExpenses > expenseThreshold;
  const expensePercentage = (totalExpenses / monthlyHousingBudget) * 100;

  const handleSliderChange = (index, newValue) => {
    const newExpenses = [...expenses];
    newExpenses[index].amount = newValue[0].toString();
    setExpenses(newExpenses);
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Estimate your monthly housing expenses</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Total Monthly Expenses</div>
            <div className={`text-lg font-bold ${isOverExpenseThreshold ? 'text-red-500' : 'text-green-500'}`}>
              R{totalExpenses.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">
              {expensePercentage.toFixed(1)}% of housing budget
            </div>
          </div>
        </div>

        {isOverExpenseThreshold && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">High Monthly Expenses Warning</span>
            </div>
            <p className="text-sm text-red-500 mt-1">
              Monthly expenses exceed 50% of your housing budget.
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-8">
          {/* Expense Type Summary - Desktop Only */}
          <div className="hidden md:grid w-full grid-cols-4 gap-4 text-sm">
            {Object.entries({
              Insurance: expenses.filter(e => e.type === 'insurance'),
              'Rates & Taxes': expenses.filter(e => e.type === 'rates'),
              Utilities: expenses.filter(e => e.type === 'utility'),
              Maintenance: expenses.filter(e => e.type === 'maintenance'),
            }).map(([category, items]) => (
              <div key={category} className={`p-3 rounded-lg ${
                category === 'Insurance' ? 'bg-indigo-50' :
                category === 'Rates & Taxes' ? 'bg-green-50' :
                category === 'Utilities' ? 'bg-amber-50' : 'bg-red-50'
              }`}>
                <div className={`font-medium ${
                  category === 'Insurance' ? 'text-indigo-700' :
                  category === 'Rates & Taxes' ? 'text-green-700' :
                  category === 'Utilities' ? 'text-amber-700' : 'text-red-700'
                }`}>{category}</div>
                <div className={
                  category === 'Insurance' ? 'text-indigo-600' :
                  category === 'Rates & Taxes' ? 'text-green-600' :
                  category === 'Utilities' ? 'text-amber-600' : 'text-red-600'
                }>
                  R{items.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0).toFixed(0)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Expense Sliders */}
          <div className="w-full space-y-6">
            {expenses.map((expense, index) => (
              <div key={index} className="relative">
                {expense.type !== 'default' && (
                  <button
                    onClick={() => handleRemoveExpense(index)}
                    className="absolute -top-2 right-0 w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 text-gray-500 hover:text-red-500 flex items-center justify-center z-10"
                    aria-label="Remove expense"
                  >
                    ×
                  </button>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
                        <ExpenseIcon type={expense.type} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{expense.name}</span>
                        {monthlyHousingBudget > 0 && (
                          <span className="text-xs text-gray-500">
                            {((parseFloat(expense.amount) / monthlyHousingBudget) * 100).toFixed(1)}% of budget
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium" style={{ color: colorMap[expense.type] || colorMap.default }}>
                      R{parseFloat(expense.amount).toFixed(0)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Slider
                      value={[parseFloat(expense.amount) || 0]}
                      onValueChange={(value) => handleSliderChange(index, value)}
                      min={0}
                      max={5000}
                      step={100}
                      disabled={expense.type === 'default'}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>R0</span>
                      <span>R2,500</span>
                      <span>R5,000</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Expense */}
          <div className="w-full p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="newExpense">Add New Monthly Expense</Label>
              <div className="text-sm text-gray-500">
                Available: R{(monthlyHousingBudget - totalExpenses).toFixed(0)}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-end gap-2">
              <div className="w-full md:flex-grow">
                <Input
                  id="newExpense"
                  value={newExpense}
                  onChange={(e) => setNewExpense(e.target.value)}
                  placeholder="Expense name"
                  className="bg-white"
                />
              </div>
              <div className="w-full md:w-32">
                <Input
                  type="number"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="Amount"
                  className="bg-white"
                />
              </div>
              <Button 
                onClick={handleAddExpense}
                disabled={!newExpense || !newExpenseAmount}
                className="w-full md:w-auto whitespace-nowrap"
              >
                Add Expense
              </Button>
            </div>
          </div>

          {/* Budget Progress Bar - Desktop Only */}
          {monthlyHousingBudget > 0 && (
            <div className="hidden md:block w-full bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Monthly Housing Budget</span>
                <span>R{monthlyHousingBudget.toFixed(0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    isOverExpenseThreshold ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}