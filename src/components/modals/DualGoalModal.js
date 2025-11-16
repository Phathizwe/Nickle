import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

const DualGoalModal = ({ isOpen, onClose, carBudget, houseBudget }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCreatePlan = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-2xl w-full relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Planning Big!
            </h2>
            <p className="text-gray-600 text-lg">
              We noticed you're planning for both a car AND a house.<br />
              Here's how we can help you achieve both goals:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Car Goal */}
            <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚗</span>
                <h3 className="font-bold text-lg text-gray-900">Car Goal</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(carBudget)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Estimated: 18 months away
              </p>
            </div>

            {/* House Goal */}
            <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏡</span>
                <h3 className="font-bold text-lg text-gray-900">House Goal</h3>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(houseBudget)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Estimated: 5 years away
              </p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-5 mb-6 border border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3 text-center">
              Your personalized budget will show:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>How much to save each month for each goal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Which goal to prioritize first</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Your complete financial timeline</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleCreatePlan}
            className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
          >
            Show Me My Timeline - Free
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            No credit card required • Takes less than 2 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DualGoalModal;
