// src/components/home/components/BudgetInput.js
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Coins, AlertCircle } from 'lucide-react';

export const BudgetInput = ({ netSalary, setNetSalary }) => {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'Guest';
  
  // Ref to track if this is the first render
  const isInitialRender = useRef(true);

  // Log for debugging
  console.log('BudgetInput received netSalary:', netSalary);

  const formatCurrency = (value) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format with thousand separators
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setNetSalary(value);
  };

  // Format the display value for the input
  const displayValue = netSalary ? formatCurrency(netSalary) : '';

  return (
    <Card className="mb-4 md:mb-8">
      <CardHeader className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full">
            <Coins className="h-6 w-6 text-blue-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome{user ? ' back' : ''}, {firstName}!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's start planning your financial future. Enter your monthly income below to create a personalized budget plan.
          </p>
        </div>

        {/* Non-user Info Banner */}
        {!user && (
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                Want to save your calculations and access premium features?
                <a href="/pricing" className="font-semibold ml-1 hover:underline">
                  Sign up for free
                </a>
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="netSalary"
              className="text-sm font-medium text-gray-700"
            >
              Monthly Net Salary
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-lg">R</span>
              </div>
              <Input
                id="netSalary"
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder="Enter your monthly take-home salary"
                className="pl-8 text-lg font-medium"
              />
            </div>
            <p className="text-sm text-gray-500">
              Enter your take-home pay after tax and deductions
            </p>
          </div>

          {/* Quick Tips */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">Tips for accurate budgeting:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
              <li>Include your base salary and any regular bonuses</li>
              <li>Exclude irregular income or once-off payments</li>
              <li>Use your average monthly income if it varies</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};