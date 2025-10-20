import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Home as HomeIcon, Sparkles, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';

const HouseCalculatorEmotional = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [netSalary, setNetSalary] = useState(() => {
    return location.state?.netSalary || localStorage.getItem('initialNetSalary') || '';
  });

  const [budgetPercentage, setBudgetPercentage] = useState(30);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(10);
  const [term, setTerm] = useState(240); // 20 years
  const [interestRate, setInterestRate] = useState(11.5);
  const [rates, setRates] = useState(1500);
  const [insurance, setInsurance] = useState(800);
  const [maintenance, setMaintenance] = useState(1000);
  
  const [celebrateResults, setCelebrateResults] = useState(false);

  const calculateResults = () => {
    const salary = parseFloat(netSalary);
    if (!salary) return null;

    const monthlyBudget = salary * (budgetPercentage / 100);
    const monthlyExpenses = parseFloat(rates) + parseFloat(insurance) + parseFloat(maintenance);
    const availableForRepayment = monthlyBudget - monthlyExpenses;

    if (availableForRepayment <= 0) return null;

    const monthlyRate = interestRate / 12 / 100;
    const loanAmount = availableForRepayment * 
      ((Math.pow(1 + monthlyRate, term) - 1) / 
      (monthlyRate * Math.pow(1 + monthlyRate, term)));

    const totalPrice = loanAmount / (1 - (downPaymentPercentage / 100));
    const downPayment = totalPrice * (downPaymentPercentage / 100);

    // Calculate transfer duty
    const calculateTransferDuty = (value) => {
      if (value <= 1000000) return 0;
      if (value <= 1375000) return (value - 1000000) * 0.03;
      if (value <= 1925000) return 11250 + (value - 1375000) * 0.06;
      if (value <= 2475000) return 44250 + (value - 1925000) * 0.08;
      if (value <= 11000000) return 88250 + (value - 2475000) * 0.11;
      return 1026000 + (value - 11000000) * 0.13;
    };

    const transferDuty = calculateTransferDuty(totalPrice);
    const bondRegistration = loanAmount * 0.02;
    const bondInitiation = 7000;

    return {
      affordableHousePrice: Math.round(totalPrice),
      downPayment: Math.round(downPayment),
      monthlyRepayment: Math.round(availableForRepayment),
      monthlyExpenses: Math.round(monthlyExpenses),
      totalMonthlyCost: Math.round(monthlyBudget),
      transferDuty: Math.round(transferDuty),
      bondRegistration: Math.round(bondRegistration),
      bondInitiation,
      totalUpfront: Math.round(downPayment + transferDuty + bondRegistration + bondInitiation),
      isWithinBudget: availableForRepayment > 0
    };
  };

  const results = calculateResults();

  useEffect(() => {
    if (results && results.affordableHousePrice > 0) {
      if (!celebrateResults) {
        setCelebrateResults(true);
        setTimeout(() => setCelebrateResults(false), 1500);
      }
    }
  }, [results?.affordableHousePrice]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R 0';
    return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <>
      <Meta
        title="Home Affordability Calculator | Nickle"
        description="Calculate how much house you can afford based on your salary. Free, instant results."
        keywords="home affordability calculator, house budget, bond calculator, South Africa"
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HomeIcon className="h-4 w-4" />
              Home Affordability Calculator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Find Your Dream Home Budget
            </h1>
            <p className="text-gray-600">
              Adjust the sliders and watch your budget update instantly
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Inputs */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Monthly Take-Home Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                      R
                    </span>
                    <Input
                      type="text"
                      value={netSalary ? netSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''}
                      onChange={(e) => setNetSalary(e.target.value.replace(/[^0-9]/g, ''))}
                      className="pl-8 text-lg font-semibold"
                      placeholder="25000"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      Budget for Housing
                    </label>
                    <span className="text-lg font-bold text-green-600">
                      {budgetPercentage}%
                    </span>
                  </div>
                  <Slider
                    value={[budgetPercentage]}
                    onValueChange={(value) => setBudgetPercentage(value[0])}
                    min={20}
                    max={40}
                    step={1}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 25-30% of your salary
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Loan Details</h3>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Down Payment
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {downPaymentPercentage}%
                      </span>
                    </div>
                    <Slider
                      value={[downPaymentPercentage]}
                      onValueChange={(value) => setDownPaymentPercentage(value[0])}
                      min={0}
                      max={30}
                      step={5}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Loan Term
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {term / 12} years
                      </span>
                    </div>
                    <Slider
                      value={[term]}
                      onValueChange={(value) => setTerm(value[0])}
                      min={120}
                      max={360}
                      step={12}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Interest Rate
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {interestRate}%
                      </span>
                    </div>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(value) => setInterestRate(value[0])}
                      min={8}
                      max={15}
                      step={0.25}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Monthly Expenses</h3>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Rates & Taxes
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(rates)}
                      </span>
                    </div>
                    <Slider
                      value={[rates]}
                      onValueChange={(value) => setRates(value[0])}
                      min={500}
                      max={5000}
                      step={100}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Home Insurance
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(insurance)}
                      </span>
                    </div>
                    <Slider
                      value={[insurance]}
                      onValueChange={(value) => setInsurance(value[0])}
                      min={300}
                      max={3000}
                      step={100}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Maintenance
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(maintenance)}
                      </span>
                    </div>
                    <Slider
                      value={[maintenance]}
                      onValueChange={(value) => setMaintenance(value[0])}
                      min={500}
                      max={5000}
                      step={100}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Results */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6">
              {results && results.affordableHousePrice > 0 ? (
                <>
                  <Card className={cn(
                    "border-2 transition-all duration-500",
                    celebrateResults ? "border-green-400 scale-105 shadow-2xl" : "border-green-200 shadow-xl"
                  )}>
                    <CardContent className="p-8">
                      {celebrateResults && (
                        <div className="text-center mb-4">
                          <Sparkles className="h-12 w-12 text-yellow-500 mx-auto animate-bounce" />
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <p className="text-sm text-gray-600 mb-2">You can afford a home worth</p>
                        <p className="text-5xl font-bold text-green-600 mb-4">
                          {formatCurrency(results.affordableHousePrice)}
                        </p>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
                          results.isWithinBudget 
                            ? "bg-green-100 text-green-700" 
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {results.isWithinBudget ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Within Budget
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              Adjust Inputs
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Monthly Bond Repayment</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(results.monthlyRepayment)}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-1">Monthly Expenses</p>
                          <p className="text-xl font-semibold text-gray-900">
                            {formatCurrency(results.monthlyExpenses)}
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total Monthly Cost</span>
                            <span className="text-xl font-bold text-green-600">
                              {formatCurrency(results.totalMonthlyCost)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Upfront Costs</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Down Payment</span>
                          <span className="text-sm font-semibold">{formatCurrency(results.downPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Transfer Duty</span>
                          <span className="text-sm font-semibold">{formatCurrency(results.transferDuty)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bond Registration</span>
                          <span className="text-sm font-semibold">{formatCurrency(results.bondRegistration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Bond Initiation</span>
                          <span className="text-sm font-semibold">{formatCurrency(results.bondInitiation)}</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-semibold text-gray-900">Total Upfront</span>
                          <span className="text-lg font-bold text-blue-600">{formatCurrency(results.totalUpfront)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-8 text-center">
                    <HomeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter your salary to see your home budget
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HouseCalculatorEmotional;

