// src/App.js
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import VehicleCostCalculator from './components/VehicleCostCalculator';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [netSalary, setNetSalary] = useState('');

  const handleSelectCalculator = (calculator) => {
    setCurrentView(calculator);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'vehicle') {
    return (
      <div className="min-h-screen bg-gray-50">
        <button
          onClick={handleBackToHome}
          className="m-4 p-2 text-gray-600 hover:text-gray-900"
        >
          ← Back to Budget Planner
        </button>
        <VehicleCostCalculator />
      </div>
    );
  }

  return <HomePage onSelectCalculator={handleSelectCalculator} />;
};

export default App;