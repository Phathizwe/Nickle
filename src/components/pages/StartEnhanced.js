import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Home, Car, BarChart, TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import Meta from '../SEO/Meta';

const StartEnhanced = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState(null);
  const [netSalary, setNetSalary] = useState('');
  const [error, setError] = useState('');

  const handleSelection = (option) => {
    setSelection(option);
    setStep(2);
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setNetSalary(value);
      setError('');
    }
  };

  const handleContinue = () => {
    if (!netSalary) {
      setError('Please enter your monthly take-home salary');
      return;
    }

    localStorage.setItem('initialNetSalary', netSalary);
    navigate('/home', { 
      state: { 
        netSalary: parseFloat(netSalary),
        fromStart: true,
        selection: selection,
        timestamp: Date.now()
      } 
    });
  };

  const getSelectionText = () => {
    switch (selection) {
      case 'car':
        return 'buying your first car';
      case 'house':
        return 'buying your first house';
      case 'both':
        return 'buying both a car and a house';
      default:
        return '';
    }
  };

  return (
    <>
      <Meta
        title="Nickle | Smart Budgets Meet Smart Ambitions"
        description="Free car and house affordability calculators for South Africa. Plan your budget, calculate what you can afford, and make smart financial decisions."
        keywords="car affordability calculator, house affordability calculator, budget planner, South Africa, financial planning, car budget, home budget"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {step === 1 ? (
          <>
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
              <div className="text-center space-y-8 mb-16">
                <div className="inline-block">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                    100% Free Forever
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Welcome to Nickle,<br />
                  <span className="text-blue-600">what is your next big ambition?</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                  Make smart financial decisions with our free calculators. 
                  Find out exactly what you can afford before you commit.
                </p>
              </div>

              {/* Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <OptionButton 
                  icon={Car} 
                  title="Buy my first car" 
                  description="Calculate your maximum car budget"
                  onClick={() => handleSelection('car')}
                  color="bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                  iconColor="text-blue-600"
                />
                <OptionButton 
                  icon={Home} 
                  title="Buy my first house" 
                  description="Find out what home you can afford"
                  onClick={() => handleSelection('house')}
                  color="bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
                  iconColor="text-green-600"
                />
                <OptionButton 
                  icon={BarChart} 
                  title="Buy both" 
                  description="Plan for car and house together"
                  onClick={() => handleSelection('both')}
                  color="bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                  iconColor="text-purple-600"
                />
              </div>

              {/* Features Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                  Why Choose Nickle?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard
                    icon={Shield}
                    title="100% Free"
                    description="Our calculators are completely free to use. No hidden fees, no credit card required."
                    color="text-blue-600"
                  />
                  <FeatureCard
                    icon={Clock}
                    title="Quick & Simple"
                    description="Get accurate results in minutes. No complicated forms or confusing jargon."
                    color="text-green-600"
                  />
                  <FeatureCard
                    icon={TrendingUp}
                    title="Smart Insights"
                    description="See exactly what you can afford and how to stay within your budget."
                    color="text-purple-600"
                  />
                </div>
              </div>

              {/* How It Works */}
              <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <StepCard
                    number="1"
                    title="Choose Your Goal"
                    description="Select whether you want to buy a car, house, or both"
                  />
                  <StepCard
                    number="2"
                    title="Enter Your Details"
                    description="Provide your salary and preferences - takes less than 2 minutes"
                  />
                  <StepCard
                    number="3"
                    title="Get Your Results"
                    description="See exactly what you can afford with detailed breakdowns"
                  />
                </div>
              </div>

              {/* Social Proof Section */}
              <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center border border-blue-200">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Join Thousands of South Africans Making Smarter Financial Decisions
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Our free calculators help you understand what you can truly afford, 
                    so you can make confident decisions about your biggest purchases.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>No registration required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>100% free forever</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Instant results</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
              >
                ← Back
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Great choice!
                  </h2>
                  <p className="text-gray-600">
                    Let's start planning for {getSelectionText()}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    What's your monthly take-home salary?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      R
                    </span>
                    <Input
                      type="text"
                      value={netSalary}
                      onChange={handleSalaryChange}
                      placeholder="15000"
                      className={cn(
                        "pl-8 text-lg",
                        error && "border-red-500"
                      )}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    This is your salary after tax and deductions
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
                >
                  Continue to Calculator
                </Button>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Your information is private and never stored
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Option Button Component
const OptionButton = ({ icon: Icon, title, description, onClick, color, iconColor }) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative p-8 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105",
      color
    )}
  >
    <div className="flex flex-col items-center text-center space-y-4">
      <div className={cn("p-4 rounded-full bg-white shadow-sm", iconColor)}>
        <Icon className="h-12 w-12" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </button>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="p-4 bg-gray-50 rounded-full">
        <Icon className={cn("h-8 w-8", color)} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ number, title, description }) => (
  <div className="relative">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default StartEnhanced;

