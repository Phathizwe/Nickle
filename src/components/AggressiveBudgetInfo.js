// src/components/BalancedBudgetInfo.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AggressiveBudgetInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Aggressive Budget</h1>
      <p>This budget is designed to reward you the most right now...</p>
      <button 
        onClick={() => navigate('/')} 
        className="mt-6 p-2 bg-blue-500 text-white rounded"
      >
        Back to Homepage
      </button>
    </div>
  );
};

export default AggressiveBudgetInfo;
