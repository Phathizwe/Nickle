import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Car, Sparkles, TrendingUp, AlertCircle, CheckCircle2, ArrowLeft, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';
import DualGoalModal from '../modals/DualGoalModal';
import { exportCarCalculatorToPDF } from '../../utils/pdfExportCalculators';

const VehicleCalculatorEmotional = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get initial salary from navigation state or localStorage
  const [netSalary, setNetSalary] = useState(() => {
    return location.state?.netSalary || localStorage.getItem('initialNetSalary') || '';
  });

  const [budgetPercentage, setBudgetPercentage] = useState(30); // Match homepage: 30% for total vehicle costs
  const [deposit, setDeposit] = useState(0);
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(11.5);
  const [insurance, setInsurance] = useState(1500);
  const [petrol, setPetrol] = useState(2000);
  
  const [showResults, setShowResults] = useState(false);
  const [celebrateResults, setCelebrateResults] = useState(false);
  const [showDualGoalModal, setShowDualGoalModal] = useState(false);

  // Calculate results in real-time
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
      setShowResults(true);
      if (!celebrateResults) {
        setCelebrateResults(true);
        setTimeout(() => setCelebrateResults(false), 1500);
      }
    }
  }, [results?.affordableCarPrice]);

  // Check if user has used both calculators and show modal
  useEffect(() => {
    if (results && results.affordableCarPrice > 0) {
      // Save full calculation for homepage
      localStorage.setItem('carCalculation', JSON.stringify(results));
      
      if (!user) {
        // Mark that vehicle calculator was used (for non-logged-in users)
        localStorage.setItem('usedVehicleCalculator', 'true');
        localStorage.setItem('lastCarBudget', results.affordableCarPrice);
        
        // Check if both calculators have been used
        const usedHouse = localStorage.getItem('usedHouseCalculator');
        const modalShown = sessionStorage.getItem('dualGoalModalShown');
        
        if (usedHouse && !modalShown) {
          // Small delay to let the results settle
          setTimeout(() => {
            setShowDualGoalModal(true);
            sessionStorage.setItem('dualGoalModalShown', 'true');
          }, 2000);
        }
      }
    }
  }, [results, user]);

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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Car className="h-4 w-4" />
              Car Affordability Calculator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Find Your Perfect Car Budget
            </h1>
            <p className="text-gray-600">
              Adjust the sliders below and watch your budget update in real-time
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Inputs */}
            <div className="space-y-6">
              {/* Salary Input */}
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
                      placeholder="15000"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Budget Percentage Slider */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      Budget for Car
                    </label>
                    <span className="text-lg font-bold text-blue-600">
                      {budgetPercentage}%
                    </span>
                  </div>
                  <Slider
                    value={[budgetPercentage]}
                    onValueChange={(value) => setBudgetPercentage(value[0])}
                    min={5}
                    max={30}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Recommended: 10-15% of your salary
                  </p>
                </CardContent>
              </Card>

              {/* Loan Details */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Loan Details</h3>
                  
                  {/* Deposit */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Deposit
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(deposit)}
                      </span>
                    </div>
                    <Slider
                      value={[deposit]}
                      onValueChange={(value) => setDeposit(value[0])}
                      min={0}
                      max={100000}
                      step={5000}
                    />
                  </div>

                  {/* Term */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Loan Term
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {term} months
                      </span>
                    </div>
                    <Slider
                      value={[term]}
                      onValueChange={(value) => setTerm(value[0])}
                      min={12}
                      max={72}
                      step={6}
                    />
                  </div>

                  {/* Interest Rate */}
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
                      min={7}
                      max={20}
                      step={0.5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Expenses */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Monthly Expenses</h3>
                  
                  {/* Insurance */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Insurance
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(insurance)}
                      </span>
                    </div>
                    <Slider
                      value={[insurance]}
                      onValueChange={(value) => setInsurance(value[0])}
                      min={500}
                      max={5000}
                      step={100}
                    />
                  </div>

                  {/* Petrol */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Petrol
                      </label>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(petrol)}
                      </span>
                    </div>
                    <Slider
                      value={[petrol]}
                      onValueChange={(value) => setPetrol(value[0])}
                      min={500}
                      max={5000}
                      step={100}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Results */}
            <div className="lg:sticky lg:top-8 h-fit">
              {results && results.affordableCarPrice > 0 ? (
                <Card className={cn(
                  "border-2 transition-all duration-500",
                  celebrateResults ? "border-green-400 scale-105 shadow-2xl" : "border-blue-200 shadow-xl"
                )}>
                  <CardContent className="p-8">
                    {celebrateResults && (
                      <div className="text-center mb-4">
                        <Sparkles className="h-12 w-12 text-yellow-500 mx-auto animate-bounce" />
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 mb-2">You can afford a car worth</p>
                      <p className="text-5xl font-bold text-blue-600 mb-4">
                        {formatCurrency(results.affordableCarPrice)}
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
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Monthly Repayment</p>
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
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(results.totalMonthlyCost)}
                          </span>
                        </div>
                      </div>
                      
                      {/* PDF Export Button */}
                      <Button
                        onClick={() => exportCarCalculatorToPDF(
                          netSalary,
                          results,
                          { budgetPercentage, interestRate, loanTerm: term, deposit, insuranceCost: insurance, petrolCost: petrol }
                        )}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter your salary to see your car budget
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Sign-up CTA */}
              {!user && results && results.affordableCarPrice > 0 && (
                <Card className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-lg">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          🎯 Ready to Make This Dream a Reality?
                        </h3>
                        <p className="text-base text-gray-700 mb-3">
                          You can afford a {formatCurrency(results.affordableCarPrice)} car. Now let's help you get it.
                        </p>
                        <div className="bg-white/60 rounded-lg p-4 mb-4">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Your personalized budget will show:</div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Track your savings progress month by month</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>See exactly when you can buy your dream car</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Manage your car AND house goals in one place</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Get a complete budget that keeps you on track</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={() => navigate('/pricing')}
                            className="bg-purple-600 hover:bg-purple-700 flex-1"
                          >
                            Create My Savings Plan - Free
                          </Button>
                          <Button
                            onClick={() => navigate('/about')}
                            variant="outline"
                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          >
                            See How It Works →
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          No credit card required • See your timeline in 2 minutes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dual Goal Modal */}
      <DualGoalModal
        isOpen={showDualGoalModal}
        onClose={() => setShowDualGoalModal(false)}
        carBudget={results?.affordableCarPrice || parseFloat(localStorage.getItem('lastCarBudget')) || 0}
        houseBudget={parseFloat(localStorage.getItem('lastHouseBudget')) || 0}
      />
    </>
  );
};

export default VehicleCalculatorEmotional;

