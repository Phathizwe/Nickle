// src/components/pages/Start.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Home, Car, BarChart } from 'lucide-react';
import { cn } from '../../lib/utils';

const Start = () => {
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
    // Allow only numbers and empty string
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

    // Store the salary in localStorage
    localStorage.setItem('initialNetSalary', netSalary);

    // Navigate to the home page with state
    navigate('/home', { 
      state: { 
        netSalary: parseFloat(netSalary),
        fromStart: true,
        selection: selection,
        timestamp: Date.now() // Add timestamp to ensure state is seen as new
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {step === 1 ? (
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to Nickle,<br />what is your next big ambition?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select an option below to get started on your financial journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OptionButton 
              icon={Car} 
              title="Buy my first car" 
              onClick={() => handleSelection('car')}
              color="bg-blue-50 border-blue-200 hover:bg-blue-100"
              iconColor="text-blue-500"
            />
            <OptionButton 
              icon={Home} 
              title="Buy my first house" 
              onClick={() => handleSelection('house')}
              color="bg-green-50 border-green-200 hover:bg-green-100"
              iconColor="text-green-500"
            />
            <OptionButton 
              icon={BarChart} 
              title="Buy both" 
              onClick={() => handleSelection('both')}
              color="bg-purple-50 border-purple-200 hover:bg-purple-100"
              iconColor="text-purple-500"
            />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center space-y-10">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              A smarter approach to {getSelectionText()}
            </h2>
            
            <p className="text-lg text-gray-600">
              What makes Nickle different is our approach. Instead of looking for a {selection === 'both' ? 'house and car' : selection} and then trying to fit it into your budget, we start with <span className="font-semibold">your budget</span> and calculate what you can actually afford.
            </p>
            
            <p className="text-lg text-gray-600">
              This helps you make financially responsible decisions and avoid the stress of overextending yourself.
            </p>
          </div>

          <div className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Let's get started</h3>
            <p className="text-gray-600 mb-6">
              How much do you take home each month after tax and deductions?
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">R</span>
                </div>
                <Input
                  type="text"
                  placeholder="Your monthly take-home salary"
    className={cn(
                    "pl-8 text-lg py-6",
                    error && "border-red-500 focus:ring-red-500"
    )}
                  value={netSalary}
                  onChange={handleSalaryChange}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              
              <Button 
                onClick={handleContinue}
                className="w-full mt-6 py-6 text-lg bg-black hover:bg-gray-800"
  >
                Continue
              </Button>
              
              <button
                onClick={() => setStep(1)}
                className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Go back to options
  </button>
            </div>
          </div>
        </div>
      )}
    </div>
);
};

// Helper component for the option buttons
const OptionButton = ({ icon: Icon, title, onClick, color, iconColor }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all",
      "transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      color
    )}
  >
    <Icon className={cn("w-16 h-16 mb-4", iconColor)} />
    <span className="text-xl font-medium text-gray-900">{title}</span>
  </button>
);

export default Start;