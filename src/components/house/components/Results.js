import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";

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

const Results = ({
  affordableHousePrice = 0,
  downPayment = 0,
  estimatedMonthlyRepayment = 0,
  estimatedMonthlyExpenses = 0,
  netSalary = 0,
  bondInitiationFee = 0,
  bondRegistrationRate = 0,
  formatCurrency
}) => {
  const loanAmount = affordableHousePrice - Number(downPayment);
  const transferDuty = calculateTransferDuty(affordableHousePrice);
  const bondRegistrationCost = loanAmount * (bondRegistrationRate / 100);
  const totalMonthlyCost = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
  const incomePercentage = ((totalMonthlyCost / Number(netSalary)) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>Based on your inputs and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Affordable House Price:</span>
            <span className="text-xl font-bold">{formatCurrency(affordableHousePrice)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Down Payment:</span>
            <span>{formatCurrency(downPayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Loan Amount:</span>
            <span>{formatCurrency(loanAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transfer Duty:</span>
            <span>{formatCurrency(transferDuty)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bond Registration Cost:</span>
            <span>{formatCurrency(bondRegistrationCost)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bond Initiation Fee:</span>
            <span>{formatCurrency(bondInitiationFee)}</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monthly Bond Repayment:</span>
            <span className="text-lg font-semibold">{formatCurrency(estimatedMonthlyRepayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monthly Expenses:</span>
            <span className="text-lg font-semibold">{formatCurrency(estimatedMonthlyExpenses)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Monthly Cost:</span>
            <span className="text-xl font-bold">
              {formatCurrency(totalMonthlyCost)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Percentage of Income:</span>
            <span className="font-semibold">
              {incomePercentage}%
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Additional Costs to Consider:</h4>
          <ul className="text-sm space-y-1">
            <li>• Legal fees for transfer and bond registration</li>
            <li>• Property inspection fees</li>
            <li>• Moving costs</li>
            <li>• Initial repairs or renovations</li>
            <li>• Furniture and appliances</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Results;