import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ModernSlider } from '../ui/modern-slider';
import { Car, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';

const VehicleCalculatorMobile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [netSalary, setNetSalary] = useState(() => {
    return location.state?.netSalary || localStorage.getItem('initialNetSalary') || '';
  });

  const [budgetPercentage, setBudgetPercentage] = useState(15);
  const [deposit, setDeposit] = useState(0);
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(11.5);
  const [insurance, setInsurance] = useState(1500);
  const [petrol, setPetrol] = useState(2000);
  
  const [celebrateResults, setCelebrateResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculateResults = () => {
    const salary = parseFloat(netSalary);
    if (!salary) return null;

    const monthlyBudget = salary * (budgetPercentage / 100);
    const monthlyExpenses = parseFloat(insurance) + parseFloat(petrol);
    const availableForRepayment = monthlyBudget - monthlyExpenses;

    if (availableForRepayment <= 0) return null;

    const monthlyRate = interestRate / 12 / 100;
    const loanAmount = availableForRepayment * 
      ((Math.pow(1 + monthlyRate, term) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, term)));

    const totalPrice = loanAmount + parseFloat(deposit);

    return {
      affordableCarPrice: Math.round(totalPrice),
      monthlyRepayment: Math.round(availableForRepayment),
      monthlyExpenses: Math.round(monthlyExpenses),
      totalMonthlyCost: Math.round(monthlyBudget),
      deposit: parseFloat(deposit),
      isWithinBudget: availableForRepayment > 0
    };
  };

  const results = calculateResults();

  useEffect(() => {
    if (results && results.affordableCarPrice > 0) {
      if (!celebrateResults) {
        setCelebrateResults(true);
        setTimeout(() => setCelebrateResults(false), 1500);
      }
    }
  }, [results?.affordableCarPrice]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R 0';
    return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <Meta
        title="Car Affordability Calculator | Nickle"
        description="Calculate how much car you can afford based on your salary. Free, instant results."
        keywords="car affordability calculator, car budget, vehicle finance, South Africa"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-8">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm md:text-base">Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3">
              <Car className="h-3 w-3 md:h-4 md:w-4" />
              Car Affordability Calculator
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Find Your Perfect Car Budget
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Adjust the controls and watch your budget update instantly
            </p>
          </div>

          {/* Results Card - Mobile First */}
          {results && results.affordableCarPrice > 0 && (
            <Card className={cn(
              "mb-6 border-2 transition-all duration-500",
              celebrateResults ? "border-blue-400 scale-[1.02] shadow-2xl" : "border-blue-200 shadow-xl"
            )}>
              <CardContent className="p-4 md:p-8">
                {celebrateResults && (
                  <div className="text-center mb-3">
                    <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 mx-auto animate-bounce" />
                  </div>
                )}

                <div className="text-center mb-4">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">You can afford a car worth</p>
                  <p className="text-3xl md:text-5xl font-bold text-blue-600 mb-3">
                    {formatCurrency(results.affordableCarPrice)}
                  </p>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold",
                    results.isWithinBudget 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {results.isWithinBudget ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                        Within Budget
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                        Adjust Inputs
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                    <p className="text-xs text-gray-600 mb-1">Monthly Repayment</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900">
                      {formatCurrency(results.monthlyRepayment)}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <p className="text-xs text-gray-600 mb-1">Monthly Expenses</p>
                    <p className="text-lg md:text-xl font-semibold text-gray-900">
                      {formatCurrency(results.monthlyExpenses)}
                    </p>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Monthly Cost</span>
                    <span className="text-xl md:text-2xl font-bold text-blue-600">
                      {formatCurrency(results.totalMonthlyCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="space-y-4 md:space-y-6">
            {/* Salary Input */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Monthly Take-Home Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">
                    R
                  </span>
                  <Input
                    type="text"
                    value={netSalary ? netSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''}
                    onChange={(e) => setNetSalary(e.target.value.replace(/[^0-9]/g, ''))}
                    className="pl-8 text-lg md:text-xl font-semibold h-12 md:h-14"
                    placeholder="15000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget Percentage */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-gray-900">
                    Budget for Car
                  </label>
                  <span className="text-xl md:text-2xl font-bold text-blue-600">
                    {budgetPercentage}%
                  </span>
                </div>
                <ModernSlider
                  value={[budgetPercentage]}
                  onValueChange={(value) => setBudgetPercentage(value[0])}
                  min={5}
                  max={30}
                  step={1}
                  color="blue"
                  className="mb-3"
                />
                <p className="text-xs text-gray-500">
                  Recommended: 10-15% of your salary
                </p>
              </CardContent>
            </Card>

            {/* Essential Controls */}
            <Card>
              <CardContent className="p-4 md:p-6 space-y-5">
                {/* Deposit */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Deposit
                    </label>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {formatCurrency(deposit)}
                    </span>
                  </div>
                  <ModernSlider
                    value={[deposit]}
                    onValueChange={(value) => setDeposit(value[0])}
                    min={0}
                    max={100000}
                    step={5000}
                    color="blue"
                  />
                </div>

                {/* Term */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Loan Term
                    </label>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {term} months
                    </span>
                  </div>
                  <ModernSlider
                    value={[term]}
                    onValueChange={(value) => setTerm(value[0])}
                    min={12}
                    max={72}
                    step={6}
                    color="purple"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options - Collapsible */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
                >
                  <span>Advanced Options</span>
                  {showAdvanced ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="space-y-5 pt-3 border-t">
                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Interest Rate
                        </label>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {interestRate}%
                        </span>
                      </div>
                      <ModernSlider
                        value={[interestRate]}
                        onValueChange={(value) => setInterestRate(value[0])}
                        min={7}
                        max={20}
                        step={0.5}
                        color="purple"
                      />
                    </div>

                    {/* Insurance */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Insurance
                        </label>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {formatCurrency(insurance)}
                        </span>
                      </div>
                      <ModernSlider
                        value={[insurance]}
                        onValueChange={(value) => setInsurance(value[0])}
                        min={500}
                        max={5000}
                        step={100}
                        color="green"
                      />
                    </div>

                    {/* Petrol */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Petrol
                        </label>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {formatCurrency(petrol)}
                        </span>
                      </div>
                      <ModernSlider
                        value={[petrol]}
                        onValueChange={(value) => setPetrol(value[0])}
                        min={500}
                        max={5000}
                        step={100}
                        color="green"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Empty State */}
          {(!results || results.affordableCarPrice <= 0) && (
            <Card className="mt-6 border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm md:text-base">
                  Enter your salary to see your car budget
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleCalculatorMobile;

