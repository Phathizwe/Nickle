import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Car, Home as HomeIcon, Sparkles, TrendingUp, Shield, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';

const HomePageEmotional = () => {
  const navigate = useNavigate();
  const [netSalary, setNetSalary] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [celebrateInput, setCelebrateInput] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSalaryChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNetSalary(value);
    
    if (value.length >= 4 && !celebrateInput) {
      setCelebrateInput(true);
      setTimeout(() => setCelebrateInput(false), 1000);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return 'R ' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const calculateQuickEstimates = () => {
    const salary = parseFloat(netSalary);
    if (!salary) return null;

    return {
      carBudget: Math.round(salary * 0.2 * 60 / 1.1), // 20% of salary, approximate
      houseBudget: Math.round(salary * 0.3 * 240 / 1.1),
      monthlyCarBudget: Math.round(salary * 0.3), // 30% for total vehicle costs
      monthlyHouseBudget: Math.round(salary * 0.3)
    };
  };

  const estimates = calculateQuickEstimates();

  const handleExploreCalculator = (type) => {
    localStorage.setItem('initialNetSalary', netSalary);
    if (type === 'car') {
      navigate('/vehicle-calculator', { state: { netSalary: parseFloat(netSalary) } });
    } else {
      navigate('/house-calculator', { state: { netSalary: parseFloat(netSalary) } });
    }
  };

  return (
    <>
      <Meta
        title="Nickle | Know What You Can Afford"
        description="Free car and house affordability calculators. Enter your salary and instantly see what you can afford."
        keywords="affordability calculator, car budget, house budget, South Africa"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className={cn(
          "max-w-4xl mx-auto px-4 py-12 md:py-20 transition-all duration-1000",
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              100% Free Forever
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 mb-6 leading-tight">
            Know What You Can <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Actually Afford
            </span>
          </h1>

          <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Enter your monthly salary and instantly see your car and house budgets.
          </p>

          <Card className={cn(
            "max-w-md mx-auto shadow-2xl border-2 transition-all duration-300",
            celebrateInput ? "border-green-400 scale-105" : "border-gray-200"
          )}>
            <CardContent className="p-8">
              <label className="block text-center text-lg font-semibold text-gray-900 mb-4">
                What's your monthly take-home salary?
              </label>
              
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                  R
                </div>
                <Input
                  type="text"
                  value={netSalary ? netSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ''}
                  onChange={handleSalaryChange}
                  placeholder="15 000"
                  className={cn(
                    "pl-10 pr-4 py-6 text-2xl font-bold text-center border-2 transition-all duration-300",
                    netSalary ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  )}
                  autoFocus
                />
              </div>

              {celebrateInput && (
                <div className="text-center mb-4 animate-bounce">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                </div>
              )}

              <p className="text-sm text-center text-gray-500 mb-4">
                This is your salary after tax
              </p>

              {estimates && (
                <div className="space-y-3 transition-all duration-500 opacity-100">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>
                  
                  <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      Your Instant Estimates
                    </p>
                  </div>

                  <QuickEstimateCard
                    icon={Car}
                    label="Car Budget"
                    amount={formatCurrency(estimates.carBudget)}
                    monthly={formatCurrency(estimates.monthlyCarBudget)}
                    monthlyLabel="total vehicle costs"
                    color="blue"
                    onClick={() => handleExploreCalculator('car')}
                    showApproximate={true}
                  />

                  <QuickEstimateCard
                    icon={HomeIcon}
                    label="House Budget"
                    amount={formatCurrency(estimates.houseBudget)}
                    monthly={formatCurrency(estimates.monthlyHouseBudget)}
                    color="green"
                    onClick={() => handleExploreCalculator('house')}
                  />

                  <div className="pt-4">
                    <p className="text-xs text-center text-gray-500">
                      Click any budget to see the full breakdown
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Expandable Section */}
          {estimates && (
            <Card className="mt-6 border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardContent className="p-0">
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className="w-full p-5 flex items-center justify-between hover:bg-blue-50/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💡</div>
                    <span className="font-semibold text-gray-900 text-left">
                      Want to know WHEN you can afford this?
                    </span>
                  </div>
                  {showTimeline ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {showTimeline && (() => {
                  // Calculate realistic savings goals
                  const carDeposit = estimates.carBudget * 0.2; // 20% deposit for car
                  const houseDeposit = estimates.houseBudget * 0.1; // 10% deposit for house
                  const monthlySavings = 3000;
                  
                  // Calculate months needed
                  const carMonths = Math.ceil(carDeposit / monthlySavings);
                  const houseMonths = Math.ceil(houseDeposit / monthlySavings);
                  
                  // Format time display
                  const formatTime = (months) => {
                    if (months > 36) {
                      const years = (months / 12).toFixed(1);
                      return `~${years} years`;
                    }
                    return `~${months} months`;
                  };
                  
                  return (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 animate-in slide-in-from-top duration-300">
                    <p className="text-gray-700 mb-4">
                      Based on your <span className="font-semibold">{formatCurrency(parseFloat(netSalary))}</span> salary, 
                      if you save <span className="font-semibold">R {monthlySavings.toLocaleString()}/month</span>:
                    </p>
                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                        <Car className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            Car deposit (20%): {formatCurrency(carDeposit)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Approximately <span className="font-semibold text-blue-600">{formatTime(carMonths)}</span> of saving
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                        <HomeIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            House deposit (10%): {formatCurrency(houseDeposit)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Approximately <span className="font-semibold text-green-600">{formatTime(houseMonths)}</span> of saving
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Create a detailed plan to track your progress →
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-3">
                      Get a personalized budget with exact timelines for both goals
                    </p>
                  </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Your data stays private</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>No registration required</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const QuickEstimateCard = ({ icon: Icon, label, amount, monthly, monthlyLabel, color, onClick, showApproximate }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-blue-200 hover:border-blue-400',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50 hover:bg-green-100',
      border: 'border-green-200 hover:border-green-400',
      text: 'text-green-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
        colors.bg,
        colors.border,
        isHovered && "scale-105 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className={cn("text-xl font-bold", colors.text)}>
              {showApproximate && '≈ '}{amount}
            </p>
            <p className="text-xs text-gray-500">
              {monthly}/month {monthlyLabel ? `(${monthlyLabel})` : ''}
            </p>
          </div>
        </div>
        <ArrowRight className={cn(
          "h-5 w-5 transition-transform duration-300",
          colors.text,
          isHovered && "translate-x-1"
        )} />
      </div>
    </button>
  );
};

export default HomePageEmotional;

