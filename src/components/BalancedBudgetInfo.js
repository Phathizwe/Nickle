// src/components/BalancedBudgetInfo.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BalancedBudgetInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Balanced Budget</h1>
      <p>This budget is designed to maintain a healthy balance between different spending categories...</p>
      <button 
        onClick={() => navigate('/')} 
        className="mt-6 p-2 bg-blue-500 text-white rounded"
      >
        Back to Homepage
      </button>
    </div>
  );
};

export default BalancedBudgetInfo;
