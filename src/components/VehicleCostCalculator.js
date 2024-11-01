import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";

const VehicleCostCalculator = () => {
  const [netSalary, setNetSalary] = useState('');
  const [budgetPercentage, setBudgetPercentage] = useState(30);
  const [insurance, setInsurance] = useState('');
  const [petrol, setPetrol] = useState('');
  const [additionalExpenses, setAdditionalExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [affordableCarPrice, setAffordableCarPrice] = useState('0.00');
  const [deposit, setDeposit] = useState('0');
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(13);
  const [balloonPayment, setBalloonPayment] = useState(0);
  const [estimatedMonthlyRepayment, setEstimatedMonthlyRepayment] = useState(0);
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [calculationName, setCalculationName] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('vehicleCalculations');
    if (savedData) {
      setSavedCalculations(JSON.parse(savedData));
    }
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0).replace('ZAR', 'R');
  };

  const calculateMonthlyRepaymentForPrice = (price) => {
    if (!price || !interestRate) return 0;
    const principal = price - parseFloat(deposit || 0);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(term);
    const balloon = (parseFloat(balloonPayment) / 100) * price;

    if (monthlyRate === 0) {
      return (principal - balloon) / numberOfPayments;
    }

    const monthlyPayment = (principal - (balloon / Math.pow(1 + monthlyRate, numberOfPayments))) *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const calculateAffordablePrice = () => {
    const totalMonthlyExpenses = parseFloat(insurance || 0) + 
      parseFloat(petrol || 0) + 
      additionalExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

    const targetTotalMonthly = (parseFloat(netSalary) * (budgetPercentage / 100));
    const availableForRepayment = targetTotalMonthly - totalMonthlyExpenses;

    let low = 0;
    let high = 10000000;
    let bestPrice = 0;
    let iterations = 0;
    const maxIterations = 50;
    const tolerance = 1;

    while (low <= high && iterations < maxIterations) {
      const mid = (low + high) / 2;
      const monthlyRepayment = calculateMonthlyRepaymentForPrice(mid);

      if (Math.abs(monthlyRepayment - availableForRepayment) < tolerance) {
        bestPrice = mid;
        break;
      }

      if (monthlyRepayment < availableForRepayment) {
        low = mid + tolerance;
        bestPrice = mid;
      } else {
        high = mid - tolerance;
      }

      iterations++;
    }

    setAffordableCarPrice(Math.max(bestPrice, 0).toFixed(2));
    const finalMonthlyRepayment = calculateMonthlyRepaymentForPrice(bestPrice);
    setEstimatedMonthlyRepayment(finalMonthlyRepayment);
    setEstimatedMonthlyExpenses(totalMonthlyExpenses);
  };

  const addExpense = () => {
    if (newExpense && newExpenseAmount) {
      setAdditionalExpenses([...additionalExpenses, { 
        name: newExpense, 
        amount: newExpenseAmount 
      }]);
      setNewExpense('');
      setNewExpenseAmount('');
    }
  };

  const removeExpense = (index) => {
    setAdditionalExpenses(additionalExpenses.filter((_, i) => i !== index));
  };

  const calculateCurrentPercentage = () => {
    if (!netSalary) return 0;
    const totalMonthlyCosts = estimatedMonthlyRepayment + estimatedMonthlyExpenses;
    return ((totalMonthlyCosts / parseFloat(netSalary)) * 100).toFixed(1);
  };

  const saveCalculation = () => {
    const calculation = {
      id: Date.now(),
      name: calculationName || "Calculation " + new Date().toLocaleDateString(),
      date: new Date().toISOString(),
      values: {
        netSalary,
        budgetPercentage,
        insurance,
        petrol,
        additionalExpenses,
        deposit,
        term,
        interestRate,
        balloonPayment,
        affordableCarPrice,
        estimatedMonthlyRepayment,
        estimatedMonthlyExpenses
      }
    };

    const updatedCalculations = [calculation, ...savedCalculations];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem('vehicleCalculations', JSON.stringify(updatedCalculations));
    setCalculationName('');
    setShowHistory(false);
  };

  const loadCalculation = (calculation) => {
    const values = calculation.values;
    setNetSalary(values.netSalary);
    setBudgetPercentage(values.budgetPercentage);
    setInsurance(values.insurance);
    setPetrol(values.petrol);
    setAdditionalExpenses(values.additionalExpenses);
    setDeposit(values.deposit);
    setTerm(values.term);
    setInterestRate(values.interestRate);
    setBalloonPayment(values.balloonPayment);
    calculateAffordablePrice();
    setShowHistory(false);
  };

  return (
    <div className="w-full max-w-[600px] mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚗</span>
          <h1 className="text-xl font-semibold">Vehicle Cost Calculator</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={saveCalculation}
          >
            Save
          </Button>
        </div>
      </div>

      <p className="text-gray-600">
        Calculate your maximum car budget while keeping total monthly costs at {budgetPercentage}% of your salary
      </p>

      {/* History Panel */}
      {showHistory && (
        <Card>
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Saved Calculations</h3>
              <Input
                type="text"
                placeholder="Name this calculation"
                value={calculationName}
                onChange={(e) => setCalculationName(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  onClick={() => loadCalculation(calc)}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{calc.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(calc.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p>{formatCurrency(calc.values.affordableCarPrice)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calculator Form */}
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
          <Label>Target Budget Percentage ({budgetPercentage}%)</Label>
          <Slider
            value={[budgetPercentage]}
            onValueChange={(value) => setBudgetPercentage(value[0])}
            min={30}
            max={50}
            step={1}
          />
          <p className="text-sm text-gray-500">
            Current: {calculateCurrentPercentage()}% of net salary
          </p>
        </div>

        <div>
          <Label htmlFor="insurance">Monthly Insurance</Label>
          <Input
            id="insurance"
            type="number"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            placeholder="Enter insurance cost"
          />
        </div>

        <div>
          <Label htmlFor="petrol">Monthly Petrol</Label>
          <Input
            id="petrol"
            type="number"
            value={petrol}
            onChange={(e) => setPetrol(e.target.value)}
            placeholder="Enter petrol cost"
          />
        </div>

        <div>
          <Label>Additional Monthly Expenses</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Expense name"
              value={newExpense}
              onChange={(e) => setNewExpense(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
            />
            <Button onClick={addExpense}>+</Button>
          </div>
          {additionalExpenses.map((expense, index) => (
            <div key={index} className="flex justify-between items-center mt-2 p-2 bg-gray-50 rounded">
              <span>{expense.name}</span>
              <div className="flex items-center gap-2">
                <span>{formatCurrency(expense.amount)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExpense(index)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={calculateAffordablePrice} className="w-full">
          Calculate Maximum Car Budget
        </Button>

        <div>
          <Label>Deposit ({formatCurrency(deposit)})</Label>
          <Slider
            value={[parseFloat(deposit) || 0]}
            onValueChange={(value) => setDeposit(value[0].toString())}
            min={0}
            max={parseFloat(affordableCarPrice) || 100000}
            step={1000}
          />
        </div>

        <div>
          <Label>Interest Rate ({interestRate}%)</Label>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={0}
            max={20}
            step={0.1}
          />
        </div>

        <div>
          <Label>Term ({term} months)</Label>
          <Slider
            value={[term]}
            onValueChange={(value) => setTerm(value[0])}
            min={12}
            max={72}
            step={12}
          />
        </div>

        <div>
          <Label>Balloon Payment ({balloonPayment}%)</Label>
          <Slider
            value={[balloonPayment]}
            onValueChange={(value) => setBalloonPayment(value[0])}
            min={0}
            max={50}
            step={1}
          />
        </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleCostCalculator;