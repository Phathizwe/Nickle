import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Slider } from "../../ui/slider";
import { 
  Shield, 
  Fuel, 
  PiggyBank, 
  Car, 
  Wrench, // Use instead of Tool
  Droplet, 
  Receipt, 
  Settings, // Add for maintenance
  MoreHorizontal,
  RotateCcw,
  AlertTriangle 
} from 'lucide-react';

// Define expense types with icons and descriptions
export const EXPENSE_TYPES = [
  { 
    value: 'insurance', 
    label: 'Insurance', 
    color: '#4F46E5', 
    icon: Shield,
    description: 'Vehicle insurance and related costs'
  },
  { 
    value: 'petrol', 
    label: 'Petrol', 
    color: '#10B981', 
    icon: Fuel,
    description: 'Fuel and energy costs'
  },
  { 
    value: 'pledge', 
    label: 'Pledge (Savings)', 
    color: '#F59E0B', 
    icon: PiggyBank,
    description: 'Savings for future vehicle expenses'
  },
  { 
    value: 'service', 
    label: 'Service', 
    color: '#3B82F6', 
    icon: Wrench,
    description: 'Regular vehicle servicing costs'
  },
  { 
    value: 'maintenance', 
    label: 'Maintenance', 
    color: '#EF4444', 
    icon: Settings, // Changed from Tool to Settings
    description: 'General maintenance and repairs'
  },
  { 
    value: 'wash', 
    label: 'Car Wash', 
    color: '#06B6D4', 
    icon: Droplet,
    description: 'Vehicle cleaning and detailing'
  },
  { 
    value: 'license', 
    label: 'License', 
    color: '#8B5CF6', 
    icon: Receipt,
    description: 'Vehicle license and registration fees'
  },
  { 
    value: 'other', 
    label: 'Other', 
    color: '#6B7280', 
    icon: MoreHorizontal,
    description: 'Other vehicle-related expenses'
  }
];

export const EXPENSE_COLORS = EXPENSE_TYPES.reduce((acc, type) => ({
  ...acc,
  [type.value]: type.color
}), {});

export const DEFAULT_EXPENSES = {
  insurance: '500',
  petrol: '500',
  additional: [
    {
      name: 'Knocks and Dents Micro-Insurance',
      amount: '0',
      type: 'insurance'
    },
    {
      name: 'Vehicle Maintenance Pledge',
      amount: '0',
      type: 'pledge'
    },
    {
      name: 'License Disc Renewal Pledge',
      amount: '70',
      type: 'license'
    },
    {
      name: 'Car Washes',
      amount: '0',
      type: 'wash'
    }
  ]
};

// ExpenseIcon Component
const ExpenseIcon = ({ type, size = "default", showTooltip = true }) => {
  const expenseType = EXPENSE_TYPES.find(t => t.value === type) || EXPENSE_TYPES.find(t => t.value === 'other');
  const Icon = expenseType.icon;
  
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8"
  }[size];

  const iconElement = (
    <div 
      className={`
        rounded-xl bg-white shadow-sm border border-gray-100
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        hover:shadow-md hover:scale-105
        ${size === 'small' ? 'p-1' : 'p-2'}
      `}
      style={{ 
        color: expenseType.color,
        backgroundColor: `${expenseType.color}10`
      }}
    >
      <Icon className={sizeClasses} />
    </div>
  );

  return showTooltip ? (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {iconElement}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-white shadow-lg border border-gray-200"
        >
          <div className="text-sm">
            <div className="font-medium text-gray-900">{expenseType.label}</div>
            <div className="text-gray-500 text-xs">{expenseType.description}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : iconElement;
};

// ExpenseTypeSelect Component
const ExpenseTypeSelect = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="bg-white w-full">
      <SelectValue>
        <div className="flex items-center gap-2">
          <ExpenseIcon 
            type={value} 
            size="small" 
            showTooltip={false} 
          />
          <span>{EXPENSE_TYPES.find(t => t.value === value)?.label}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {EXPENSE_TYPES.map((type) => (
        <SelectItem 
          key={type.value} 
          value={type.value}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ExpenseIcon 
              type={type.value} 
              size="small" 
              showTooltip={false}
            />
            <span>{type.label}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Main MonthlyExpenses Component
export default function MonthlyExpenses({
  insurance,
  setInsurance,
  petrol,
  setPetrol,
  additionalExpenses,
  setAdditionalExpenses,
  newExpense,
  setNewExpense,
  newExpenseAmount,
  setNewExpenseAmount,
  netSalary,
  budgetPercentage
}) {
  const [hoveredExpense, setHoveredExpense] = useState(null);
  const [newExpenseType, setNewExpenseType] = useState('other');

  const resetToDefaults = () => {
    setInsurance(DEFAULT_EXPENSES.insurance);
    setPetrol(DEFAULT_EXPENSES.petrol);
    setAdditionalExpenses(DEFAULT_EXPENSES.additional);
    setNewExpense('');
    setNewExpenseAmount('');
    setNewExpenseType('other');
  };

  const monthlyVehicleBudget = netSalary * (budgetPercentage / 100);
  const allExpenses = [
    { name: 'Insurance', amount: insurance, type: 'insurance', color: EXPENSE_COLORS.insurance },
    { name: 'Petrol', amount: petrol, type: 'petrol', color: EXPENSE_COLORS.petrol },
    ...additionalExpenses.map(exp => ({
      ...exp,
      color: EXPENSE_COLORS[exp.type] || EXPENSE_COLORS.other
    }))
  ].filter(expense => parseFloat(expense.amount) > 0);

  const totalExpenses = allExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const expenseThreshold = monthlyVehicleBudget * 0.3;
  const isOverExpenseThreshold = totalExpenses > expenseThreshold;
  const expensePercentage = (totalExpenses / monthlyVehicleBudget) * 100;

  const handleSliderChange = (type, newValue) => {
    switch (type) {
      case 'insurance':
        setInsurance(newValue[0].toString());
        break;
      case 'petrol':
        setPetrol(newValue[0].toString());
        break;
      default:
        const index = additionalExpenses.findIndex(exp => exp.name === type);
        if (index !== -1) {
          const newExpenses = [...additionalExpenses];
          newExpenses[index].amount = newValue[0].toString();
          setAdditionalExpenses(newExpenses);
        }
        break;
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Monthly Vehicle Expenses</CardTitle>
            <CardDescription>Estimate your monthly vehicle running costs</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetToDefaults}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <div className="text-right w-full md:w-auto">
              <div className="text-sm font-medium">Total Monthly Expenses</div>
              <div className={`text-lg font-bold ${isOverExpenseThreshold ? 'text-red-500' : 'text-green-500'}`}>
                R{totalExpenses.toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">
                {expensePercentage.toFixed(1)}% of vehicle budget
              </div>
            </div>
          </div>
        </div>

        {isOverExpenseThreshold && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">High Running Costs Warning</span>
            </div>
            <p className="text-sm text-red-500 mt-1">
              Monthly running costs exceed 30% of your vehicle budget.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6 overflow-visible">
        <div className="space-y-8">
          {/* Desktop Summary Cards */}
          <div className="hidden md:grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="font-medium text-indigo-700">Insurance</div>
              <div className="text-indigo-600">
                R{parseFloat(insurance || 0).toFixed(0)}
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-700">Petrol</div>
              <div className="text-green-600">
                R{parseFloat(petrol || 0).toFixed(0)}
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="font-medium text-red-700">Additional</div>
              <div className="text-red-600">
                R{additionalExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0).toFixed(0)}
              </div>
            </div>
          </div>
          
          {/* Expense Sliders */}
          <div className="w-full space-y-6">
            {allExpenses.map((expense, index) => (
              <div key={index} className="relative">
                {expense.type !== 'insurance' && expense.type !== 'petrol' && (
                  <button
                    onClick={() => {
                      const newExpenses = additionalExpenses.filter((_, i) => i !== index - 2);
                      setAdditionalExpenses(newExpenses);
                    }}
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
                        {monthlyVehicleBudget > 0 && (
                          <span className="text-xs text-gray-500">
                            {((parseFloat(expense.amount) / monthlyVehicleBudget) * 100).toFixed(1)}% of budget
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-medium" style={{ color: expense.color }}>
                      R{parseFloat(expense.amount).toFixed(0)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Slider
                      value={[parseFloat(expense.amount) || 0]}
                      onValueChange={(value) => 
                        handleSliderChange(
                          expense.type === 'maintenance' ? expense.name : expense.type, 
                          value
                        )
                      }
                      min={0}
                      max={5000}
                      step={100}
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
              <Label>Add Additional Expense</Label>
              <div className="text-sm text-gray-500">
                Available: R{(monthlyVehicleBudget - totalExpenses).toFixed(0)}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-end gap-2">
              <div className="w-full">
                <Input
                  placeholder="Expense name"
                  value={newExpense}
                  onChange={(e) => setNewExpense(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={newExpenseType}
                  onValueChange={setNewExpenseType}
                  defaultValue="other"
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-32">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button 
                onClick={() => {
                  if (newExpense && newExpenseAmount) {
                    setAdditionalExpenses([...additionalExpenses, { 
                      name: newExpense,
                      amount: newExpenseAmount,
                      type: newExpenseType || 'other'
                    }]);
                    setNewExpense('');
                    setNewExpenseAmount('');
                    setNewExpenseType('other');
                  }
                }}
                disabled={!newExpense || !newExpenseAmount}
                className="w-full md:w-auto"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Budget Progress Bar - Desktop Only */}
          {monthlyVehicleBudget > 0 && (
            <div className="hidden md:block w-full bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Monthly Vehicle Budget</span>
                <span>R{monthlyVehicleBudget.toFixed(0)}</span>
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
                <span>30%</span>
                <span>60%</span>
                <span>90%</span>
                <span>120%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}