import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ModernSlider } from '../ui/modern-slider';
import { Home as HomeIcon, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { exportHouseCalculatorToPDF } from '../../utils/pdfExport';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';
import { useAuth } from '../auth/AuthProvider';

const HouseCalculatorMobile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [netSalary, setNetSalary] = useState(() => {
    return location.state?.netSalary || localStorage.getItem('initialNetSalary') || '';
  });

  const [budgetPercentage, setBudgetPercentage] = useState(30);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(10);
  const [term, setTerm] = useState(240);
  const [interestRate, setInterestRate] = useState(11.5);
  const [rates, setRates] = useState(1500);
  const [insurance, setInsurance] = useState(800);
  const [maintenance, setMaintenance] = useState(1000);
  
  const [celebrateResults, setCelebrateResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      isWithinBudget: availableForRepayment > 0,
      // Detailed breakdown for cashflow statement
      breakdown: {
        bondRepayment: Math.round(availableForRepayment),
        rates: parseFloat(rates),
        insurance: parseFloat(insurance),
        maintenance: parseFloat(maintenance)
      }
    };
  };

  const results = calculateResults();

  // Save results to localStorage for budget overview
  useEffect(() => {
    if (results && results.affordableHousePrice > 0) {
      localStorage.setItem('houseCalculation', JSON.stringify(results));
    }
  }, [results]);

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

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pb-8">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm md:text-base">Back to Home</span>
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3">
              <HomeIcon className="h-3 w-3 md:h-4 md:w-4" />
              Home Affordability Calculator
            </div>
            <div className="flex items-center justify-center gap-4 mb-2">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Find Your Dream Home Budget
              </h1>
              {user && results && results.affordableHousePrice > 0 && (
                <Button
                  onClick={() => exportHouseCalculatorToPDF(netSalary, results, {
                    budgetPercentage,
                    downPaymentPercentage,
                    term,
                    interestRate
                  })}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              )}
            </div>
            <p className="text-sm md:text-base text-gray-600">
              Adjust the controls and watch your budget update instantly
            </p>
          </div>

          {/* Results Card - Mobile First */}
          {results && results.affordableHousePrice > 0 && (
            <>
              <Card className={cn(
                "mb-4 border-2 transition-all duration-500",
                celebrateResults ? "border-green-400 scale-[1.02] shadow-2xl" : "border-green-200 shadow-xl"
              )}>
                <CardContent className="p-4 md:p-8">
                  {celebrateResults && (
                    <div className="text-center mb-3">
                      <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 mx-auto animate-bounce" />
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">You can afford a home worth</p>
                    <p className="text-3xl md:text-5xl font-bold text-green-600 mb-3">
                      {formatCurrency(results.affordableHousePrice)}
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
                    <div className="bg-green-50 rounded-lg p-3 md:p-4">
                      <p className="text-xs text-gray-600 mb-1">Bond Repayment</p>
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
                      <span className="text-xl md:text-2xl font-bold text-green-600">
                        {formatCurrency(results.totalMonthlyCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upfront Costs */}
              <Card className="mb-6 border-2 border-blue-200">
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm md:text-base">Upfront Costs</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Down Payment</span>
                      <span className="font-semibold">{formatCurrency(results.downPayment)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transfer Duty</span>
                      <span className="font-semibold">{formatCurrency(results.transferDuty)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bond Registration</span>
                      <span className="font-semibold">{formatCurrency(results.bondRegistration)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bond Initiation</span>
                      <span className="font-semibold">{formatCurrency(results.bondInitiation)}</span>
                    </div>
                    <div className="border-t pt-2.5 flex justify-between">
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Total Upfront</span>
                      <span className="text-lg md:text-xl font-bold text-blue-600">{formatCurrency(results.totalUpfront)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Controls */}
          <div className="space-y-4 md:space-y-6">
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
                    placeholder="25000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-gray-900">
                    Budget for Housing
                  </label>
                  <span className="text-xl md:text-2xl font-bold text-green-600">
                    {budgetPercentage}%
                  </span>
                </div>
                <ModernSlider
                  value={[budgetPercentage]}
                  onValueChange={(value) => setBudgetPercentage(value[0])}
                  min={20}
                  max={40}
                  step={1}
                  color="green"
                  className="mb-3"
                />
                <p className="text-xs text-gray-500">
                  Recommended: 25-30% of your salary
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Down Payment
                    </label>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {downPaymentPercentage}%
                    </span>
                  </div>
                  <ModernSlider
                    value={[downPaymentPercentage]}
                    onValueChange={(value) => setDownPaymentPercentage(value[0])}
                    min={0}
                    max={30}
                    step={5}
                    color="green"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Loan Term
                    </label>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {term / 12} years
                    </span>
                  </div>
                  <ModernSlider
                    value={[term]}
                    onValueChange={(value) => setTerm(value[0])}
                    min={120}
                    max={360}
                    step={12}
                    color="purple"
                  />
                </div>
              </CardContent>
            </Card>

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
                        min={8}
                        max={15}
                        step={0.25}
                        color="purple"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Rates & Taxes
                        </label>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {formatCurrency(rates)}
                        </span>
                      </div>
                      <ModernSlider
                        value={[rates]}
                        onValueChange={(value) => setRates(value[0])}
                        min={500}
                        max={5000}
                        step={100}
                        color="blue"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Home Insurance
                        </label>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {formatCurrency(insurance)}
                        </span>
                      </div>
                      <ModernSlider
                        value={[insurance]}
                        onValueChange={(value) => setInsurance(value[0])}
                        min={300}
                        max={3000}
                        step={100}
                        color="blue"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">
                          Maintenance
                        </label>
                        <span className="text-base md:text-lg font-bold text-gray-900">
                          {formatCurrency(maintenance)}
                        </span>
                      </div>
                      <ModernSlider
                        value={[maintenance]}
                        onValueChange={(value) => setMaintenance(value[0])}
                        min={500}
                        max={5000}
                        step={100}
                        color="blue"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sign-up CTA */}
          {!user && results && results.affordableHousePrice > 0 && (
            <Card className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-lg">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">
                      💾 Save This Calculation
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Sign up to save your house budget, see it alongside your car budget, and access a beautiful dashboard that shows all your financial commitments in one place.
                    </p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Sign Up - It's Free
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(!results || results.affordableHousePrice <= 0) && (
            <Card className="mt-6 border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <HomeIcon className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm md:text-base">
                  Enter your salary to see your home budget
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default HouseCalculatorMobile;

