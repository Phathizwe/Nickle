import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ModernSlider } from '../ui/modern-slider';
import { 
  Car, Home as HomeIcon, Sparkles, Save, FolderOpen, 
  TrendingUp, Shield, CheckCircle, DollarSign, PieChart,
  ArrowRight, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';

const HomePageModern = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [netSalary, setNetSalary] = useState(() => {
    return localStorage.getItem('userSalary') || '';
  });
  
  const [celebrateInput, setCelebrateInput] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  
  // Budget allocations (from calculators)
  const [carBudget, setCarBudget] = useState(() => {
    const saved = localStorage.getItem('carCalculation');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [houseBudget, setHouseBudget] = useState(() => {
    const saved = localStorage.getItem('houseCalculation');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (netSalary) {
      localStorage.setItem('userSalary', netSalary);
    }
  }, [netSalary]);

  useEffect(() => {
    if (carBudget || houseBudget) {
      setShowBudget(true);
    }
  }, [carBudget, houseBudget]);

  const handleSalaryChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNetSalary(value);
    
    if (value.length >= 4 && !celebrateInput) {
      setCelebrateInput(true);
      setTimeout(() => setCelebrateInput(false), 1000);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R 0';
    return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const calculateTotalCommitted = () => {
    let total = 0;
    if (carBudget) total += carBudget.totalMonthlyCost || 0;
    if (houseBudget) total += houseBudget.totalMonthlyCost || 0;
    return total;
  };

  const calculateRemaining = () => {
    const salary = parseFloat(netSalary) || 0;
    const committed = calculateTotalCommitted();
    return salary - committed;
  };

  const totalCommitted = calculateTotalCommitted();
  const remaining = calculateRemaining();
  const percentageUsed = netSalary ? (totalCommitted / parseFloat(netSalary)) * 100 : 0;

  return (
    <>
      <Meta
        title="Nickle | Smart Budget Planning"
        description="Plan your car and house budgets together. See all your commitments in one place."
        keywords="budget planner, car budget, house budget, financial planning, South Africa"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-8">
            {user ? (
              <>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-5 py-2.5 rounded-full text-sm font-bold mb-4 border-2 border-green-200">
                  <CheckCircle className="h-5 w-5" />
                  Signed In
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                    Your Dreams Are
                  </span>
                  <br />
                  <span className="text-gray-900">Within Reach! 🎯</span>
                </h1>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                  {(carBudget || houseBudget) ? (
                    <span>You're on track to afford <span className="font-bold text-blue-600">{carBudget ? 'your dream car' : ''}</span>{carBudget && houseBudget ? ' and ' : ''}<span className="font-bold text-green-600">{houseBudget ? 'your dream home' : ''}</span></span>
                  ) : (
                    <span>Let's calculate what you can afford and make it happen</span>
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="h-4 w-4" />
                  Free Forever
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
                  Plan Your Financial Future
                </h1>
                <p className="text-lg text-gray-600">
                  See your car and house budgets together in one place
                </p>
              </>
            )}
          </div>

          {/* Salary Input */}
          <Card className={cn(
            "max-w-md mx-auto mb-8 shadow-xl border-2 transition-all duration-300",
            celebrateInput ? "border-green-400 scale-105" : "border-gray-200"
          )}>
            <CardContent className="p-6">
              <label className="block text-center text-base font-semibold text-gray-900 mb-4">
                Your Monthly Take-Home Salary
              </label>
              
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                  R
                </div>
                <Input
                  type="text"
                  value={netSalary ? netSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''}
                  onChange={handleSalaryChange}
                  placeholder="25 000"
                  className={cn(
                    "pl-10 pr-4 py-6 text-2xl font-bold text-center border-2 transition-all duration-300",
                    netSalary ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  )}
                />
              </div>

              {celebrateInput && (
                <div className="text-center mb-4 animate-bounce">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Overview - Show link to full cashflow budget */}
          {showBudget && netSalary && (
            <Card className="mb-8 shadow-xl border-2 border-purple-200">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <PieChart className="h-6 w-6 text-purple-600" />
                    Quick Overview
                  </h2>
                  <Button 
                    onClick={() => navigate('/budget')}
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  >
                    View Full Budget
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(netSalary)}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Committed</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(totalCommitted)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {percentageUsed.toFixed(0)}% of income
                    </p>
                  </div>

                  <div className={cn(
                    "rounded-xl p-4 border-2",
                    remaining >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  )}>
                    <p className="text-sm text-gray-600 mb-1">Remaining</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      remaining >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(remaining)}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  {carBudget && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Car</p>
                            <p className="text-xs text-gray-500">
                              Repayment + Insurance + Petrol
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(carBudget.totalMonthlyCost)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-blue-600 hover:text-blue-700"
                        onClick={() => navigate('/vehicle')}
                      >
                        View Details →
                      </Button>
                    </div>
                  )}

                  {houseBudget && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <HomeIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">House</p>
                            <p className="text-xs text-gray-500">
                              Bond + Rates + Insurance + Maintenance
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(houseBudget.totalMonthlyCost)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-green-600 hover:text-green-700"
                        onClick={() => navigate('/house')}
                      >
                        View Details →
                      </Button>
                    </div>
                  )}
                </div>

                {/* Sign-up CTA for non-users */}
                {!user && (
                  <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border-2 border-purple-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-lg">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">
                          Save Your Budget & Never Lose It
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Sign up to save your calculations, access them anywhere, and get a beautiful budget dashboard to track all your commitments.
                        </p>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => navigate('/pricing')}
                        >
                          Sign Up - It's Free
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Calculator Cards - Enhanced for logged-in users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Car Goal Card */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl cursor-pointer group"
              onClick={() => navigate('/vehicle-calculator', { state: { netSalary: parseFloat(netSalary) } })}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">Car Calculator</h3>
                    {carBudget ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                        <CheckCircle className="h-4 w-4" />
                        Calculation saved
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Not calculated yet</p>
                    )}
                  </div>
                </div>
                
                {carBudget ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">You can afford</p>
                      <p className="text-3xl font-extrabold text-blue-600">
                        {formatCurrency(carBudget.affordableCarPrice)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">car budget</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-gray-500 text-xs">Monthly</p>
                        <p className="font-bold text-gray-900">{formatCurrency(carBudget.totalMonthlyCost)}</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-gray-500 text-xs">Repayment</p>
                        <p className="font-bold text-gray-900">{formatCurrency(carBudget.monthlyRepayment)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">Find out how much car you can afford</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                      Calculate Now →
                    </Button>
                  </div>
                )}
                
                {carBudget && (
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Update Calculator →
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* House Goal Card */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl cursor-pointer group"
              onClick={() => navigate('/house-calculator', { state: { netSalary: parseFloat(netSalary) } })}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <HomeIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">House Calculator</h3>
                    {houseBudget ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                        <CheckCircle className="h-4 w-4" />
                        Calculation saved
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Not calculated yet</p>
                    )}
                  </div>
                </div>
                
                {houseBudget ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">You can afford</p>
                      <p className="text-3xl font-extrabold text-green-600">
                        {formatCurrency(houseBudget.affordableHousePrice)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">house budget</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-gray-500 text-xs">Monthly</p>
                        <p className="font-bold text-gray-900">{formatCurrency(houseBudget.totalMonthlyCost)}</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-gray-500 text-xs">Bond Payment</p>
                        <p className="font-bold text-gray-900">{formatCurrency(houseBudget.monthlyRepayment)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">Calculate your dream home budget</p>
                    <Button className="bg-green-600 hover:bg-green-700 w-full">
                      Calculate Now →
                    </Button>
                  </div>
                )}
                
                {houseBudget && (
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Update Calculator →
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Budget Dashboard CTA - Show for logged-in users with calculations */}
          {user && (carBudget || houseBudget) && (
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <PieChart className="h-10 w-10 text-purple-600" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Ready to Track Your Monthly Budget?
                  </h2>
                </div>
                <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                  See your <span className="font-bold text-blue-600">car</span>{carBudget && houseBudget ? ' and ' : ''}<span className="font-bold text-green-600">{houseBudget ? 'house' : ''}</span> budgets in a complete monthly cashflow statement. Track expenses, savings, and see exactly where your money goes.
                </p>
                <Button
                  onClick={() => navigate('/budget')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg"
                  size="lg"
                >
                  <PieChart className="h-5 w-5 mr-2" />
                  View Full Budget Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  ✅ Monthly breakdown • 📊 Visual charts • 💾 PDF export
                </p>
              </CardContent>
            </Card>
          )}

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Your data stays private</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>100% free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Real-time calculations</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CalculatorCard = ({ icon: Icon, title, description, color, onClick, hasCalculation }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      light: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 border-2",
        colors.border,
        isHovered && "scale-105 shadow-2xl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className={cn("p-4 rounded-xl mb-4 w-fit", colors.light)}>
          <Icon className={cn("h-8 w-8", colors.text)} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {hasCalculation && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-600 font-semibold">
            <CheckCircle className="h-4 w-4" />
            Calculation saved
          </div>
        )}

        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          {hasCalculation ? 'Update' : 'Start'} Calculator
          <ArrowRight className={cn(
            "h-4 w-4 transition-transform duration-300",
            isHovered && "translate-x-1"
          )} />
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePageModern;

